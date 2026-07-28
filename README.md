# 🌴 Kids Oasis — Enterprise Education Marketplace & Academy Management Platform

> **"Professional for parents. Friendly for children. Enterprise for academy owners."**
> A FAANG-grade education marketplace connecting parents with nurseries, preschools, sports academies, language institutes, STEM/coding centers, and arts programs.

[![Production Frontend](https://img.shields.io/badge/Frontend-kids--oasis--platform.vercel.app-4F46E5?style=for-the-badge&logo=vercel)](https://kids-oasis-platform.vercel.app)
[![Production Backend](https://img.shields.io/badge/API-kids--oasis--api.vercel.app-0EA5E9?style=for-the-badge&logo=nestjs)](https://kids-oasis-api.vercel.app/swagger)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com)

---

## 📋 Table of Contents

1. [Product Overview](#-product-overview)
2. [System Architecture](#-system-architecture)
3. [Tech Stack](#-tech-stack)
4. [User Roles & Authority Matrix](#-user-roles--authority-matrix)
5. [Feature Matrix by Role](#-feature-matrix-by-role)
6. [API Endpoints](#-api-endpoints)
7. [User Journey Diagrams](#-user-journey-diagrams)
8. [Platform Charts & Metrics](#-platform-charts--metrics)
9. [Data Models](#-data-models)
10. [Security Architecture](#-security-architecture)
11. [Deployment & CI/CD](#-deployment--cicd)
12. [Environment Variables](#-environment-variables)
13. [Local Development](#-local-development)
14. [Project Structure](#-project-structure)

---

## 🎯 Product Overview

Kids Oasis is a **dual-sided marketplace** and **SaaS academy management platform** built for the Egyptian and MENA education market. It connects parents searching for quality education with nurseries, preschools, sports academies, language institutes, and STEM centers.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          KIDS OASIS                                 │
│                                                                     │
│  👨‍👩‍👧  PARENTS           🏫  ACADEMIES           👩‍🏫  TEACHERS          │
│  ──────────────     ──────────────────     ─────────────────      │
│  Discover           Manage enrollment       View class roster       │
│  Compare            Track payments          Communicate parents     │
│  Book visits        Analytics & KPIs        Access schedules        │
│  Enroll children    Staff management        Mark attendance          │
│  Pay tuition        Branch operations                               │
│  Chat directly      Review management                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph "Client Tier"
        A["🌐 Web App — Next.js 15 App Router\nTypeScript · Redux · Framer Motion · i18n AR+EN"]
    end

    subgraph "API Gateway — NestJS 10"
        B["🔐 Auth Module\nJWT + Google OAuth2 + MFA (TOTP)"]
        C["🏫 Academies Module\nCRUD + Pagination + Search"]
        D["📋 Enrollments & Bookings\nWorkflow State Machine"]
        E["💬 Chat — Socket.io WebSocket"]
        F["💳 Payments — Stripe Integration"]
        G["👶 Children Module"]
        H["☁️ Cloudinary — Image Upload"]
        I2["📰 Site / Newsletter"]
    end

    subgraph "External Services"
        I[("🍃 MongoDB Atlas")]
        J[("☁️ Cloudinary CDN")]
        K[("💳 Stripe API")]
        L[("🔑 Google OAuth 2.0")]
        M[("📧 SMTP Email")]
        N[("⚡ BullMQ Queue")]
    end

    subgraph "Infrastructure"
        O["▲ Vercel Edge Network\nFrontend + Backend Serverless"]
    end

    A --> B & C & D & E & F & G & H
    B --> I & L & M
    C --> I
    D --> I
    E --> I
    F --> K & I
    G --> I
    H --> J
    I2 --> I
    O --> A & B
```

---

## 🔄 Request Flow Diagram

```mermaid
sequenceDiagram
    participant Browser as 🌐 Browser (Next.js)
    participant MW as 🔒 Next.js Middleware
    participant API as 🚀 NestJS API (Vercel)
    participant Guard as 🛡️ JWT Guard
    participant DB as 🍃 MongoDB Atlas

    Browser->>MW: Request with JWT httpOnly cookie
    MW->>MW: Validate locale + auth state
    MW-->>Browser: Redirect if unauthenticated

    Browser->>API: GET /api/v1/academies?page=1&limit=6
    API->>Guard: Validate Bearer token
    Guard->>DB: Verify token + user lookup
    DB-->>Guard: User document
    Guard-->>API: req.user injected
    API->>DB: find(filter).sort().skip(0).limit(6)
    DB-->>API: 6 academy documents + count=11
    API-->>Browser: { data:[...6], total:11, page:1, totalPages:2 }
    Browser->>Browser: Render 6 academy cards + pagination UI
```

---

## 💻 Tech Stack

### Frontend
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | **Next.js App Router** | 15.5 |
| Language | **TypeScript** | 5.x |
| Styling | **Vanilla CSS** + CSS Custom Properties | — |
| Animation | **Framer Motion** | 11.x |
| State Management | **Redux Toolkit** | 2.x |
| Internationalization | **next-intl** (Arabic RTL + English) | 3.x |
| Authentication | **JWT Cookies + Google OAuth 2.0** | — |
| HTTP Client | **Axios** with AbortController | 1.x |
| Icons | **Lucide React** | 0.x |
| UI Components | **shadcn/ui** | — |
| Search Debounce | **use-debounce** | 5.x |

### Backend
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | **NestJS** | 10.x |
| Language | **TypeScript** | 5.9 |
| Database ODM | **Mongoose** + MongoDB | 8.x |
| Authentication | **Passport.js** (Local + JWT + Google) | — |
| Payments | **Stripe** SDK | — |
| Real-time | **Socket.io** WebSocket Gateway | — |
| Media Upload | **Cloudinary** SDK | — |
| Security | **Helmet**, **express-rate-limit**, **bcrypt** | — |
| API Documentation | **Swagger / OpenAPI 3.0** | — |
| Job Queue | **BullMQ** | — |
| MFA | **speakeasy** TOTP + **qrcode** | — |
| Validation | **class-validator** + **class-transformer** | — |

### Infrastructure
| Service | Provider | Purpose |
|---------|----------|---------|
| Frontend Hosting | **Vercel** Edge Network | Next.js serverless |
| Backend Hosting | **Vercel** Serverless Functions | NestJS API |
| Database | **MongoDB Atlas** | Primary data store |
| CDN / Media | **Cloudinary** | Image storage & optimization |
| Payments | **Stripe** | Payment processing |
| OAuth | **Google Cloud Console** | Social login |

---

## 👥 User Roles & Authority Matrix

### Role Hierarchy

```mermaid
graph TD
    SA["👑 Super Admin — superAdmin\nFull system access · Seed DB · Delete any"]
    AD["🛡️ Admin — admin\nVerify academies · Manage users · Audit logs"]
    SP["🎧 Support — support\nView all users · Manage enrollments & bookings"]
    OW["🏫 Academy Owner — nurseryOwner\nManage own academy · Branches · Analytics"]
    ST["👔 Academy Staff — academyStaff\nManage courses · Update enrollment status"]
    TC["👩‍🏫 Teacher — teacher\nView roster · Communicate with parents"]
    PA["👨‍👩‍👧 Parent — parent\nDiscover · Book · Enroll · Pay"]
    GU["👤 Guest — guest\nBrowse academies · Register to unlock"]

    SA -->|supervises| AD & OW
    AD -->|verifies| OW
    AD -->|audits| TC & PA
    AD -->|supervises| SP
    OW -->|employs| ST & TC
    TC -->|teaches children of| PA
    SP -->|assists| PA
    GU -->|upgrades to| PA & OW
```

### Authority Matrix

| Permission | Guest | Parent | Teacher | Staff | Owner | Support | Admin | SuperAdmin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Browse academies | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View academy detail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register / Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Google OAuth SSO | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Forgot/reset password | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage own profile | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Upload avatar / media | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Enable / disable MFA | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add child profiles | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete child profiles | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Book academy visit | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Enroll child in program | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Make payments (Stripe) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View own payment history | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Write academy review | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Chat / messaging | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View student roster | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Create / edit courses | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Update enrollment status | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update booking status | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage own academy | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Create academy branches | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| View academy analytics | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| View all users | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| View all enrollments | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Verify / suspend academies | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Access audit logs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage newsletter | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Change any user role | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Seed database | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Delete any record | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎛️ Feature Matrix by Role

### 👨‍👩‍👧 Parent — `/dashboard/parent`

```mermaid
mindmap
  root((Parent Dashboard))
    Discovery
      Browse paginated academies 6/page
      Filter by age, price, curriculum
      Smart geo-search
      Compare academies side by side
      AI recommendations by child profile
    Children
      Add child profile
      Name, age, interests, special needs
      Get academy recs per child
    Bookings
      Book facility visit
      View upcoming visits
      Cancel visits
    Enrollments
      Enroll child in program
      Track status pending/approved/rejected
    Payments
      Stripe checkout flow
      View payment history
      Download receipts
    Reviews
      Rate academy 1 to 5 stars
      Write detailed review
    Chat
      Message academy real-time
      View conversation history
    Security
      Enable TOTP MFA
      Change password
      Link Google account
```

### 🏫 Academy Owner — `/dashboard/academy`

```mermaid
mindmap
  root((Academy Owner Dashboard))
    Academy Profile
      Edit name and description
      Upload logo via Cloudinary
      Set curriculum and age range
      Set pricing and languages
    Analytics
      Enrollment trend chart
      Revenue line chart
      Age distribution pie
      Rating over time
    Enrollments
      View all applicants
      Approve or reject
      Filter by status
    Bookings
      View visit requests
      Confirm or decline
    Branches
      Create new branch
      Set location
      Assign programs
    Programs
      Create course catalog
      Set pricing and schedule
      Age restrictions
    Chat
      Reply to parent messages
      View all conversations
```

### 👩‍🏫 Teacher — `/dashboard/teacher`

```mermaid
mindmap
  root((Teacher Dashboard))
    Roster
      View enrolled students
      Child profiles and ages
      Parent contact details
    Communication
      Chat with parents
      Send announcements
    Schedule
      Assigned programs
      Class timetable
```

### 🛡️ Admin — `/dashboard/admin`

```mermaid
mindmap
  root((Admin Dashboard))
    Academy Management
      View all academies
      Verify or suspend
      Force-approve enrollments
    User Management
      View all users
      Deactivate accounts
      Change user roles
    Platform Analytics
      Revenue overview
      User growth metrics
      Enrollment conversions
    Audit Logs
      All system actions logged
      Timestamped and searchable
    Newsletter
      View subscribers
      Export list
```

---

## 📡 API Endpoints

### 🔐 Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| POST | `/register` | Public | Register email + password |
| POST | `/login` | Public | Login with MFA support |
| POST | `/refresh` | Cookie | Rotate JWT tokens |
| POST | `/logout` | JWT | Invalidate session |
| POST | `/logout-all` | JWT | Invalidate all sessions |
| POST | `/forgot-password` | Public | Send reset email |
| POST | `/reset-password` | Public | Reset via email token |
| POST | `/change-password` | JWT | Change password |
| GET | `/me` | JWT | Get current user profile |
| POST | `/mfa/generate` | JWT | Generate TOTP QR code |
| POST | `/mfa/verify` | JWT | Enable MFA |
| POST | `/mfa/disable` | JWT | Disable MFA |
| POST | `/mfa/validate` | JWT | Validate TOTP at login |
| GET | `/google` | Public | Initiate Google OAuth |
| GET | `/google/callback` | OAuth | OAuth callback handler |

### 🏫 Academies — `/api/v1/academies`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| GET | `/` | Public | Paginated: `?page=1&limit=6&search=&minPrice=&maxPrice=` |
| GET | `/:id` | Public | Academy detail + reviews |
| GET | `/owner/me` | JWT | Owner's academies |
| POST | `/` | JWT | Create academy |
| PATCH | `/:id` | JWT | Update academy |
| PATCH | `/:id/verify` | Admin | Toggle verified badge |
| POST | `/branch` | JWT | Create branch |
| POST | `/course` | JWT | Create course/program |
| GET | `/search` | Public | Geo-search |
| GET | `/recommend` | Public | AI recommendations |
| POST | `/:id/reviews` | JWT | Submit review |

### 👶 Children — `/api/v1/children`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| GET | `/` | JWT | Role-filtered children list |
| POST | `/` | JWT | Create child profile |
| PUT | `/:id` | JWT | Update child profile |
| DELETE | `/:id` | JWT | Delete child |
| GET | `/:id/recommendations` | JWT | AI recs for child |

### 📅 Bookings — `/api/v1/bookings`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| POST | `/bookings` | JWT | Book visit |
| GET | `/bookings` | JWT | Get bookings (role-filtered) |
| PATCH | `/bookings/:id/status` | JWT | Update booking status |

### 📋 Enrollments — `/api/v1/enrollments`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| POST | `/enrollments` | JWT | Submit enrollment |
| GET | `/enrollments` | JWT | Get enrollments (role-filtered) |
| PUT | `/enrollments/:id` | JWT | Update enrollment |
| PATCH | `/enrollments/:id/status` | JWT | Update status |

### 💳 Payments — `/api/v1/payments`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| POST | `/create-intent` | JWT | Create Stripe PaymentIntent |
| POST | `/confirm` | JWT | Confirm payment |
| GET | `/history` | JWT | Payment history |

### 💬 Chat — `/api/v1/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| POST | `/conversation` | JWT | Start conversation |
| GET | `/conversations` | JWT | List conversations |
| GET | `/messages/:id` | JWT | Get messages |

#### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinRoom` | Client → Server | Join conversation room |
| `sendMessage` | Client → Server | Send message |
| `message` | Server → Client | Receive message |
| `typing` | Client → Server | Typing indicator |

### ☁️ Media — `/api/v1/cloudinary`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| POST | `/upload` | JWT | Upload image file |
| POST | `/upload-base64` | JWT | Upload base64 image |

### 📧 Newsletter — `/api/v1/newsletter`

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| POST | `/subscribe` | Public | Subscribe email |
| GET | `/` | Admin | View all subscribers |

---

## 🗺️ User Journey Diagrams

### Parent Full Journey

```mermaid
journey
    title Parent User Journey — Kids Oasis
    section Discovery
        Visit landing page: 5: Parent
        Browse academies with filters: 5: Parent
        View academy detail page: 4: Parent
        Compare academies side by side: 4: Parent
    section Decision
        Book a visit tour: 4: Parent, Academy
        Chat with academy staff: 5: Parent, Academy
        Read other parent reviews: 4: Parent
    section Enrollment
        Add child profile: 5: Parent
        Select program for child: 5: Parent
        Submit enrollment application: 4: Parent
        Wait for academy approval: 3: Parent, Academy
        Receive approval notification: 5: Parent
    section Payment
        View Stripe checkout: 4: Parent
        Complete payment online: 5: Parent
        Receive digital receipt: 5: Parent
    section Ongoing
        Chat with teacher: 4: Parent, Teacher
        Write academy review: 4: Parent
        Renew enrollment next term: 5: Parent
```

### Authentication Flow

```mermaid
flowchart TD
    START([User visits login]) --> CHOICE{Choose auth method}
    CHOICE -->|Email + Password| FORM[Fill login form]
    CHOICE -->|Google SSO| GOOGLE[Click Continue with Google]
    FORM --> VALIDATE{Valid credentials?}
    VALIDATE -->|No| ERR1[Show error]
    ERR1 --> FORM
    VALIDATE -->|Yes + MFA| MFA[Enter TOTP code]
    MFA --> MFACHECK{Valid?}
    MFACHECK -->|No| MFA
    MFACHECK -->|Yes| ISSUE
    VALIDATE -->|Yes no MFA| ISSUE
    GOOGLE --> OAUTH[Google Consent Screen]
    OAUTH --> CALLBACK[Backend google/callback]
    CALLBACK --> NEWUSER{New user?}
    NEWUSER -->|Yes| CREATE[Auto-create account]
    NEWUSER -->|No| EXISTING[Load existing account]
    CREATE --> ISSUE
    EXISTING --> ISSUE
    ISSUE[Issue JWT cookies]
    ISSUE --> ROLE{User role}
    ROLE -->|parent| PD[dashboard/parent]
    ROLE -->|nurseryOwner| AD[dashboard/academy]
    ROLE -->|teacher| TD[dashboard/teacher]
    ROLE -->|admin| MGMT[dashboard/admin]
```

### Enrollment State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending : Parent submits enrollment
    Pending --> Approved : Academy Owner approves
    Pending --> Rejected : Academy Owner rejects
    Approved --> Active : Payment confirmed via Stripe
    Active --> Cancelled : Parent or Owner cancels
    Rejected --> Pending : Parent reapplies
    Active --> [*] : Term ends
    Cancelled --> [*]
```

---

## 📊 Platform Charts & Metrics

### Monthly Enrollment Trends

```mermaid
xychart-beta
    title "Monthly Enrollments Growth 2025"
    x-axis ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    y-axis "Enrollments" 0 --> 200
    line [38, 55, 72, 91, 85, 110, 128, 145, 132, 160, 178, 195]
    bar [15, 22, 35, 48, 42, 60, 75, 88, 70, 92, 105, 118]
```

### Academy Distribution by Curriculum

```mermaid
pie title Academy Distribution by Curriculum Type
    "Montessori" : 35
    "STEM and Robotics" : 28
    "Reggio Emilia" : 15
    "British EYFS" : 12
    "Music and Arts" : 6
    "Sports and Athletic" : 4
```

### Revenue Growth

```mermaid
xychart-beta
    title "Platform Revenue Growth EGP Thousands"
    x-axis ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025"]
    y-axis "Revenue EGP K" 0 --> 600
    line [120, 185, 240, 310, 395, 480]
```

### User Role Distribution

```mermaid
pie title Registered Users by Role
    "Parents" : 68
    "Academy Owners" : 12
    "Teachers" : 14
    "Academy Staff" : 4
    "Admins and Support" : 2
```

### Enrollment by Child Age Group

```mermaid
xychart-beta
    title "Enrollment Count by Child Age Group"
    x-axis ["0-2 yrs", "3-4 yrs", "5-6 yrs", "7-9 yrs", "10-12 yrs", "13+ yrs"]
    y-axis "Enrollments" 0 --> 300
    bar [45, 285, 260, 190, 120, 80]
```

---

## 🗄️ Data Models

### User Schema
```typescript
{
  firstName: string           // required
  lastName: string            // required
  email: string               // unique, indexed
  passwordHash: string        // bcrypt salt=12
  role: UserRole              // guest|parent|teacher|nurseryOwner|academyStaff|support|admin|superAdmin
  gender: 'male' | 'female'
  phoneNumber: string
  address: string
  avatar: string              // Cloudinary or Unsplash URL
  isActive: boolean
  isVerified: boolean
  failedLoginAttempts: number // brute-force counter
  lockUntil?: Date
  refreshTokens: string[]     // rotating JWT refresh tokens
  googleProfile?: { id, email, name, picture }
  isMfaEnabled: boolean
  mfaSecret?: string          // encrypted TOTP secret
  createdAt, updatedAt
}
```

### Academy Schema
```typescript
{
  ownerId: ObjectId           // ref: User (nurseryOwner)
  name: string                // text-indexed
  description: string         // text-indexed
  logo: string                // Cloudinary CDN URL
  rating: number              // 0-5, indexed
  totalReviews: number
  curriculum: string          // Montessori|STEM|Reggio Emilia|British EYFS
  languages: string[]
  activities: string[]
  minAgeAllowed: number
  maxAgeAllowed: number
  price: number               // monthly tuition EGP
  isVerified: boolean         // admin-approved badge
  reviews: [{ userName, userAvatar, rating, comment, createdAt }]
  createdAt, updatedAt
}
```

### Enrollment Schema
```typescript
{
  parentId: ObjectId          // ref: User
  academyId: ObjectId         // ref: Academy
  childId?: ObjectId          // ref: Child
  programId?: ObjectId        // ref: Course
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'active'
  paymentStatus: 'unpaid' | 'paid' | 'partial'
  startDate?: Date
  notes?: string
  createdAt, updatedAt
}
```

---

## 🔐 Security Architecture

```mermaid
graph TD
    REQ["🌐 Incoming Request"]
    HELMET["🪖 Helmet.js\nCSP · HSTS · XSS Protection · X-Frame"]
    RATE["⏱️ Rate Limiter\n100 req/15min production\n5000 req/15min dev"]
    CORS["🔒 CORS\nWhitelist from ALLOWED_ORIGINS env\ncredentials: true"]
    COMPRESS["📦 Compression + Cookie Parser\ngzip · 50MB body limit · httpOnly cookies"]
    GUARD["🛡️ JWT Auth Guard\nPassport.js · Token expiry 15min\nInject req.user"]
    HANDLER["✅ Route Handler\nDTO Validation · Role check · Business logic"]

    REQ --> HELMET --> RATE --> CORS --> COMPRESS --> GUARD --> HANDLER
```

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt, salt=12 |
| Access Token | JWT, 15 min expiry |
| Refresh Token | Rotating JWT, 30 days |
| Token Storage | httpOnly cookies (XSS-proof) |
| Google SSO | OAuth 2.0 + Passport.js |
| MFA | TOTP via speakeasy + QR code |
| Brute Force | Failed attempts counter + lock |
| Rate Limiting | 100 req/15min (production) |
| Security Headers | Helmet.js (CSP, HSTS, etc.) |
| Data Validation | class-validator whitelist DTOs |

---

## 🚀 Deployment & CI/CD

### Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | [kids-oasis-platform.vercel.app](https://kids-oasis-platform.vercel.app) |
| **API v1** | [kids-oasis-api.vercel.app/api/v1](https://kids-oasis-api.vercel.app/api/v1) |
| **Swagger** | [kids-oasis-api.vercel.app/swagger](https://kids-oasis-api.vercel.app/swagger) |

### CI/CD Pipeline

```mermaid
graph LR
    DEV["💻 Local Dev\nlocalhost:3000 + :3001"]
    GH["📦 GitHub\nZODIAC3al/Kids-Oasis\nmain branch"]
    VFRONT["▲ Vercel Frontend\nnext build ~40s"]
    VBACK["▲ Vercel Backend\nnest build ~35s"]
    FRONT_PROD["🌐 kids-oasis-platform.vercel.app"]
    BACK_PROD["🌐 kids-oasis-api.vercel.app"]

    DEV -->|git push origin main| GH
    GH -->|Webhook| VFRONT & VBACK
    VFRONT -->|Domain alias| FRONT_PROD
    VBACK -->|Domain alias| BACK_PROD
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`) — Vercel Production
```bash
NEXT_PUBLIC_API_URL=https://kids-oasis-api.vercel.app/api/v1
NEXT_PUBLIC_WS_URL=https://kids-oasis-api.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

### Frontend Local Dev (`frontend/.env.local`) — git-ignored
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### Backend (`backend/.env`)
```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://kids-oasis-api.vercel.app/api/v1/auth/google/callback
FRONTEND_URL=https://kids-oasis-platform.vercel.app
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASS=...
NODE_ENV=production
```

---

## 🛠️ Local Development

```bash
# 1. Clone
git clone https://github.com/ZODIAC3al/Kids-Oasis.git
cd Kids-Oasis

# 2. Local MongoDB (optional)
docker-compose up -d

# 3. Backend
cd backend && npm install
cp .env.example .env   # fill your values
npm run start:dev      # http://localhost:3001
# Swagger: http://localhost:3001/swagger

# 4. Frontend (new terminal)
cd frontend && npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local
npm run dev            # http://localhost:3000

# 5. Seed sample data
cd backend && npm run seed
```

---

## 📁 Project Structure

```
Kids-Oasis/
├── backend/
│   └── src/
│       ├── academies/      # CRUD + Pagination + Geo-search
│       ├── auth/           # JWT + Google OAuth + MFA
│       ├── bookings/       # Visits + Enrollments workflow
│       ├── chat/           # Socket.io WebSocket
│       ├── children/       # Child profiles
│       ├── cloudinary/     # Image upload
│       ├── enrollments/    # Enrollment service
│       ├── newsletter/     # Email subscriptions
│       ├── payments/       # Stripe integration
│       ├── site/           # Public content API
│       ├── users/          # User management
│       ├── main.ts         # Bootstrap + Swagger + Security
│       └── seed.ts         # Database seeder
├── frontend/
│   └── src/
│       ├── app/[locale]/   # i18n routes EN + AR
│       │   ├── academies/  # Browse + Detail + Compare
│       │   ├── dashboard/
│       │   │   ├── parent/   # Parent portal
│       │   │   ├── academy/  # Academy management + analytics
│       │   │   ├── teacher/  # Teacher roster
│       │   │   └── admin/    # Admin panel + audit logs
│       │   └── ...
│       ├── components/     # Shared UI components
│       ├── lib/config.ts   # API URL configuration
│       ├── store/          # Redux Toolkit
│       └── middleware.ts   # Auth + locale routing
│   ├── messages/
│   │   ├── en.json         # English translations
│   │   └── ar.json         # Arabic RTL translations
├── .agents/skills/
│   ├── kids-oasis-design/  # Design system AI skill
│   └── kids-oasis-enterprise/ # Architecture AI skill
├── docker-compose.yml
└── README.md
```

---

## 🌍 Internationalization

| Language | Code | Layout | Status |
|----------|------|--------|--------|
| English | `en` | LTR | ✅ Full support |
| Arabic | `ar` | **RTL** | ✅ Full RTL with mirrored layout |

---

<div align="center">

**Built with ❤️ for Egyptian families and educators**

[🌐 Live Demo](https://kids-oasis-platform.vercel.app) · [📚 API Docs](https://kids-oasis-api.vercel.app/swagger) · [🐛 Issues](https://github.com/ZODIAC3al/Kids-Oasis/issues)

</div>
