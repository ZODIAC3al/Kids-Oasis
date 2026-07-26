---
name: kids-oasis-enterprise
description: Architectural blueprint, product requirements, and step-by-step implementation files to convert Kids-Oasis into an enterprise-grade NestJS and Next.js 15 App Router solution.
---

# Kids-Oasis Enterprise Blueprint

This skill serves as the comprehensive architectural blueprint and implementation specification to upgrade the current Kids-Oasis project into an enterprise-grade monorepo containing a **Next.js 15 (React 19)** frontend and a **NestJS** backend.

## Architectural Guidelines

To maintain complete consistency and security, the system is designed around the following core standards:
1. **Frontend**: Next.js 15 App Router, TypeScript, Redux Toolkit for UI state, TanStack Query for server cache, Framer Motion for high-fidelity interactive animations, and Next-Intl for English/Arabic localization.
2. **Backend**: NestJS, MongoDB (Mongoose), Redis (BullMQ queues), Socket.io for bidirectional communication, and Passport.js (JWT Access/Refresh token rotation and Google OAuth 2.0).
3. **Preservation**: The original layout, color scheme, media assets, and responsive styles of the Home page, Login forms, SignUp panels, and search filtering parameters are preserved and ported.

## Document Index

The details of this architecture are split into distinct modular reference guides to maintain clarity and readability under the skill constraints:

1. **[Product Requirements & Architecture](file:///c:/Projects/Kids-Oasis/.agents/skills/kids-oasis-enterprise/references/prd_and_architecture.md)**
   - Complete PRD, system architecture diagrams, state diagrams, and detailed security configurations (Helmet, rate limits, CSRF, cookie settings).
2. **[Database Schema & Models](file:///c:/Projects/Kids-Oasis/.agents/skills/kids-oasis-enterprise/references/database_schemas.md)**
   - Mongoose schemas, TypeScript interfaces, and index specifications for all 26 collections.
3. **[NestJS Backend Module Plan](file:///c:/Projects/Kids-Oasis/.agents/skills/kids-oasis-enterprise/references/nestjs_backend_plan.md)**
   - Modular backend structures, repository patterns, custom pipes, global exception filters, guards, and DTOs.
4. **[Next.js Frontend Architecture](file:///c:/Projects/Kids-Oasis/.agents/skills/kids-oasis-enterprise/references/nextjs_frontend_plan.md)**
   - App Router file hierarchy, Next-Intl configuration, Redux store slices, React Hook Form validation with Zod, and preserved components integration.
5. **[DevOps, CI/CD & Deployments](file:///c:/Projects/Kids-Oasis/.agents/skills/kids-oasis-enterprise/references/deployment_and_devops.md)**
   - Docker Multi-stage files, GitHub actions workflow pipeline, environmental variable listings (`.env`), and deployment targets (Vercel/Railway).

---

## Workspace Setup Instructions

Run these commands to set up the directories and workspace:
```bash
# Create monorepo folders
mkdir frontend
mkdir backend
```
Please read each reference document linked above to understand step-by-step how to construct and wire the enterprise features.
