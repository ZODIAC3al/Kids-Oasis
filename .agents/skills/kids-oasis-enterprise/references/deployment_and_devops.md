# DevOps, CI/CD & Deployments

This document outlines the environment setups, multi-stage Docker container configs, CI/CD automation logic via GitHub actions, and deployment pipelines.

---

## 1. Environment Configurations

Below are the `.env.example` configurations for both frontend and backend.

### 1.1 Backend Environment (`backend/.env.example`)
```ini
# Environment settings
NODE_ENV=development
PORT=3001
API_PREFIX=api
API_VERSION=v1

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kids-oasis

# Redis Configuration (Session caching / BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_phrase_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_phrase_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback

# Cloudinary Storage credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Nodemailer SMTP configuration
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
EMAIL_FROM="Kids-Oasis <noreply@kidsoasis.com>"
```

### 1.2 Frontend Environment (`frontend/.env.example`)
```ini
# API Client Base URL (Internal or External proxy address)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# WebSocket base path
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

---

## 2. Docker Multi-Stage Configurations

### 2.1 Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

### 2.2 Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### 2.3 Docker Compose File (`docker-compose.yml`)
Spins up local database, cache, and application workers:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: kids-oasis-db
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7.0-alpine
    container_name: kids-oasis-cache
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/kids-oasis
      - REDIS_HOST=redis
    depends_on:
      - mongodb
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001/api/v1
    depends_on:
      - backend

volumes:
  mongo-data:
```

---

## 3. GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`)

Runs automated testing, lint validation, and pushes images:

```yaml
name: Kids-Oasis CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  validate-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Test & Build Backend
        run: |
          cd backend
          npm ci
          npm run lint
          npm run test
          npm run build

      - name: Test & Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
```

---

## 4. Deployment Guides
- **Vercel Deployment (Frontend)**: Connect Next.js application root directory `frontend/`, map env parameters like `NEXT_PUBLIC_API_URL`, and deploy.
- **Railway Deployment (Backend)**: Add NestJS, MongoDB, and Redis instances. Link the database URI strings to the backend service. Set `PORT=3001` and verify standard connection channels.
- **Security Checklists**: Configure Helmet security policies, specify allowed CORS request origins, enable rate limit blocks, and mandate TLS/SSL transport protocols.
