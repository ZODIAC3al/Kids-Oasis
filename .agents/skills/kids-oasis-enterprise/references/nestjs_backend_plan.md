# NestJS Backend Implementation Plan

This document details the modular layout, security setup, database repositories, real-time gateways, caching strategies, and DTO layouts of the Kids-Oasis NestJS server.

---

## 1. Directory Structure

The backend complies with NestJS standards for dependency injection, SOLID logic, and feature modules:

```
backend/
├── src/
│   ├── main.ts                       # Server boostrap (Helmet, Cors, Validation, Versioning)
│   ├── app.module.ts                 # Master Module importing sub-modules
│   ├── common/                       # Global assets
│   │   ├── filters/                  # Exception filter (ApiExceptionFilter)
│   │   ├── guards/                   # JwtAuthGuard, RolesGuard
│   │   ├── interceptors/             # LoggingInterceptor, TransformInterceptor
│   │   └── pipes/                    # Global validation pipes (class-validator)
│   ├── config/                       # TypeSafe configurations (dotenv, config service)
│   ├── database/                     # Mongoose connection and registration services
│   ├── auth/                         # Passport strategies, refresh-token controller
│   ├── users/                        # Core profiles management
│   ├── parents/                      # Parent metadata and dashboard counters
│   ├── children/                     # Child documents management
│   ├── academies/                    # Academies, branches, courses controllers
│   │   ├── services/                 # Recommendation and smart search logic
│   │   └── repositories/             # Custom DB access layer
│   ├── bookings/                     # Reservation records
│   ├── chat/                         # Socket.io gateways, read receipts
│   ├── email/                        # Nodemailer queue consumer
│   ├── redis/                        # Caching modules
│   └── bull/                         # BullMQ jobs configurations
└── test/                             # Unit & E2E integration specs
```

---

## 2. Authentication Flow & Role-Based Authorization

Custom authentication endpoints are set up within the `AuthModule`. Passport strategies secure these endpoints:

### 2.1 Access & Refresh Token Controller (`auth.controller.ts`)
```typescript
import { Controller, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return { accessToken: tokens.accessToken, user: req.user };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.cookies['refreshToken'];
    const tokens = await this.authService.rotateRefreshToken(oldRefreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    return { accessToken: tokens.accessToken };
  }
}
```

### 2.2 Roles Decorator & Security Guard
- **`Roles` Decorator**: Marks API points targeting explicit security levels.
- **`RolesGuard`**: Evaluates active JWT roles matching decorated access bounds.

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

---

## 3. Redis Cache & BullMQ Integration

- **Redis Cache Layer**: Intercepts active queries reading academies and ratings data. Key rotation is automated upon new review postings.
- **BullMQ Workers**: Decoupled processes run tasks outside client threads:
  - **Email Dispatching Queue**: Resolves verification letters, password tokens, and transaction success warnings.
  - **Audit Logging Queue**: Commits actions synchronously without holding database client requests.

```typescript
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email')
export class EmailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process('send-welcome')
  async sendWelcomeEmail(job: Job<{ email: string; name: string }>) {
    await this.mailerService.sendMail({
      to: job.data.email,
      subject: 'Welcome to Kids-Oasis!',
      template: './welcome',
      context: { name: job.data.name },
    });
  }
}
```

---

## 4. Smart Search & AI Recommendation Engine

### 4.1 Smart Search Implementation
The search queries filter the MongoDB branches collection using parameters:
- **Location Proximity**: Geolocation query utilizing `$nearSphere` on MongoDB coordinates index.
- **Curriculums & Price Caps**: Exact arrays checks and price boundary constraints.

```typescript
async smartSearch(searchDto: SearchAcademiesDto) {
  const query: any = {};
  if (searchDto.city) query.city = searchDto.city;
  if (searchDto.governorate) query.governorate = searchDto.governorate;

  if (searchDto.latitude && searchDto.longitude) {
    query.location = {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [searchDto.longitude, searchDto.latitude],
        },
        $maxDistance: searchDto.maxDistanceInMeters || 10000,
      },
    };
  }
  return this.branchModel.find(query).populate('academyId').exec();
}
```

### 4.2 Recommendation Algorithm
Weights metrics based on the child's parameters (e.g. age groups, parental location, budget ranges, and feedback rates):
1. **Age Compatibility**: Exclude academies where the student's age falls outside `minAgeAllowed` and `maxAgeAllowed`.
2. **Scoring Index**: Compute scores:
   $$\text{Score} = (W_{\text{rating}} \times \text{Rate}) + (W_{\text{price}} \times \text{PriceScore}) - (W_{\text{distance}} \times \text{DistanceScore})$$
3. Sort candidate branches in descending score order.

---

## 5. Socket.io Events & Messages Gateway (`chat.gateway.ts`)

Leverages Redis adapter configurations to scale Socket.io events across cluster instances:

- `connection`: Checks headers for valid JWT authorization, registers online state, and broadcasts status.
- `joinRoom`: Restricts workspace access strictly to parents and academy owners registered inside the target `Conversation`.
- `sendMessage`: Saves conversation document records to DB, sends immediate payload updates to listeners, and posts notifications for offline recipients.
- `typingStatus`: Real-time state toggling broadcast.
