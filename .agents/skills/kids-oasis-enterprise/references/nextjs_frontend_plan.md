# Next.js Frontend Architecture Plan

This document details the folder structure, Redux state management, localized routing (`next-intl`), React Hook Form validation with Zod, and UI components migration for the Kids-Oasis Next.js 15 (React 19) client.

---

## 1. Directory Structure

The frontend matches Next.js 15 layout architectures:

```
frontend/
├── src/
│   ├── app/                          # localized routing directories
│   │   └── [locale]/
│   │       ├── layout.tsx            # Global HTML wrapper (Next-Intl + RTK + TanStack)
│   │       ├── page.tsx              # Preserved Home Page
│   │       ├── login/page.tsx        # Preserved Login Page
│   │       ├── signup/page.tsx       # Preserved SignUp Page
│   │       └── academies/page.tsx    # Preserved Search & Filters Page
│   ├── components/                   # Reusable global design UI components
│   │   ├── ui/                       # Shadcn/UI components (dialog, button, select)
│   │   ├── NavBar.tsx                # Preserved header
│   │   └── Footer.tsx                # Preserved footer
│   ├── features/                     # Component bundles grouped by domains
│   │   ├── auth/                     # login forms, registration logic
│   │   ├── academy/                  # filtering drawers, ratings
│   │   └── chat/                     # websockets panels, typing events
│   ├── store/                        # Redux toolkit configurations
│   │   ├── authSlice.ts              # Authentication state (token, lock rules)
│   │   ├── academySlice.ts           # Cached nurseries list
│   │   └── store.ts                  # Root configuration with Redux Persist
│   ├── hooks/                        # Custom React hooks (useSocket, useRecommend)
│   ├── services/                     # Axios API query hooks wrapper
│   ├── utils/                        # Formatting logic, local coordinate checks
│   └── types/                        # TypeScript typings
├── messages/                         # Translation dictionaries
│   ├── en.json                       # English strings
│   └── ar.json                       # Arabic strings
├── tailwind.config.ts                # Preservation palette definitions
└── next.config.ts                    # Routing headers & localized configuration
```

---

## 2. Localization Configuration (`next-intl`)

Next-Intl supports seamless localized routing (English `/en` and Arabic `/ar`).

### 2.1 Middleware Configuration (`src/middleware.ts`)
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  // Match translation routes
  matcher: ['/', '/(de|en)/:path*', '/((?!_next|api|.*\\..*).*)']
};
```

---

## 3. Redux Toolkit Configuration (`src/store/store.ts`)

Manages client-side persistent state using Redux Persist to store authentication status:

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import academyReducer from './academySlice';

const persistConfig = {
  key: 'kids-oasis-root',
  storage,
  whitelist: ['auth']
};

const rootReducer = combineReducers({
  auth: authReducer,
  academy: academyReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 4. Porting Preserved Pages & Custom CSS

To maintain the layout, styles, background assets, and animation flows:

### 4.1 Home Page & Hero Animating Elements (`src/app/[locale]/page.tsx`)
Port the exact Framer Motion animations defined in the old React app (specifically standard items triggers and entry springs):

```typescript
'use client';

import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="home-container h-screen flex flex-col bg-[#faf3ee]"
    >
      <NavBar />
      <main className="flex-1 mt-16 md:mt-24">
        <Hero />
      </main>
      <Footer />
    </motion.div>
  );
}
```

### 4.2 Login / SignUp Form Validation with React Hook Form & Zod
Port the original styles (such as background files and layouts) while upgrading the validation engine with Zod:

```typescript
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address format" }),
  password: z.string().min(6, { message: "Password must exceed 6 characters" }),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
```

Integration template within `login/page.tsx`:
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormValues } from '@/features/auth/schemas';
import '@/styles/Login.css'; // Direct import of the preserved stylesheet

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema)
  });

  const onSubmit = (data: LoginFormValues) => {
    // Dispatch auth state to store, update local HTTP cookies
  };

  return (
    <div className="login-container">
      <div className="image-container"></div>
      <div className="form container pl-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <p className="text-xl font-bold text-[#053b47]">Welcome Back!</p>
          
          <div className="grid w-full input">
            <label>Email</label>
            <input {...register('email')} className="w-3/5" placeholder="Enter your email" />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          <div className="grid pb-16 input">
            <label>Password</label>
            <input type="password" {...register('password')} className="w-3/5" placeholder="Enter your password" />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn-forward rounded-tl-full bg-[#053b47] text-white">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 5. UI Animations & Interaction Performance
- Ensure transitions between locales are pre-rendered statically.
- Maintain responsive, fluid CSS properties matching media rules in `Login.css` and `SignUp.css`.
- Ensure Framer Motion layouts leverage layout IDs to avoid layout shifts.
- Optimize images using the NextJS `next/image` component to boost core web vitals performance.
