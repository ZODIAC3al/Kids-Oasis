---
name: kids-oasis-design
description: Product design, UX, and information-architecture reference for "Kids Oasis," an education marketplace and academy management platform connecting parents with nurseries, schools, and activity providers. Use this skill whenever building, styling, or reasoning about ANY Kids Oasis screen, component, dashboard, flow, or navigation — landing page, academy discovery/search, academy detail pages, parent/academy/teacher/admin dashboards, booking or enrollment flows, chat, notifications, maps, auth, or profile/settings. Also use it whenever the user asks for a "FAANG-level," "startup-grade," or "not-a-typical-nursery-site" look for Kids Oasis, references any of Airbnb/Stripe/Linear/Vercel/Notion/Booking.com/Apple as inspiration for this product, or asks about which role (parent, academy, teacher, admin) sees what. Trigger even if the user only names a screen ("build the academy card") or a role ("what does the teacher dashboard show") without saying "Kids Oasis" explicitly, as long as the surrounding context is this app.
---

# Kids Oasis — Design & UX Skill

Kids Oasis is an education marketplace + academy management platform (nurseries, preschools, sports academies, language institutes, STEM/coding centers, arts programs). It has four roles — Parent, Academy Management, Teacher, System Administrator — sharing one ecosystem. This skill is the single source of truth for its visual language and information architecture so every screen you build feels like it belongs to the same product.

## 1. Core design mandate

**Do not build a typical colorful/cartoonish nursery site.** The target look is a real startup product a FAANG recruiter would recognize:

- **Professional for parents. Friendly for children. Enterprise for academy owners.**
- Blend five references, each mapped to a specific job:
  - **Airbnb** → discovery, search, listing cards, booking flow
  - **Stripe** → parent/academy dashboards, tables, settings
  - **Apple** → whitespace, restraint, typography-led hierarchy
  - **Google Maps** → location/nearby discovery, pins, clusters
  - **Notion** → clean content layout, generous spacing
  - **Linear** → subtle, purposeful motion
  - **Duolingo** → *only* as a light, child-friendly accent (icons/illustration tone), never as the dominant palette
  - **Booking.com** → filter/reservation UX
  - **Vercel** (academy dashboard) / **Supabase** (admin dashboard) → enterprise dashboard patterns

Before styling anything, ask: *which of these six references owns this screen?* Discovery screens borrow Airbnb/Google Maps/Booking.com; dashboards borrow Stripe/Vercel/Supabase; everything borrows Apple's whitespace discipline.

## 2. Design tokens

Use these as CSS variables / Tailwind theme extensions — never hardcode hex values inline.

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#4F46E5` (Indigo) | primary actions, active nav, brand |
| `--color-secondary` | `#0EA5E9` (Sky Blue) | secondary actions, links, info accents |
| `--color-accent` | `#10B981` (Emerald) | success states, positive KPIs, "available" badges |
| `--color-warning` | `#F59E0B` (Amber) | pending states, low-seats warnings |
| `--color-error` | `#EF4444` (Red) | errors, rejected status, destructive actions |
| `--color-bg` | `#FAFAFC` | app background |
| `--color-card` | `#FFFFFF` | card surfaces |
| `--radius-card` | `18px` | card/button corner radius |
| `--shadow-card` | very soft, low-opacity, large blur | elevation — never a hard drop shadow |
| `--spacing` | generous | prefer more whitespace over denser packing |
| `--font` | Geist or Inter | headers bold + large, body regular |

**Dark mode** (professional, never pure black):
- Background `#0F172A`
- Cards `#1E293B`
- Same accent tokens, adjusted for contrast

## 3. UI library stack

Default to this stack unless the user already has one:
- **shadcn/ui** — primary component library (buttons, inputs, dialogs, tables)
- **Magic UI** — polished animated components
- **Aceternity UI** — premium landing-page sections (hero, testimonials)
- **Origin UI** — enterprise dashboard patterns
- **React Bits** — micro-interactions
- **Framer Motion** — page transitions, hover/lift effects, stepper animations

Illustration rule: modern flat/vector illustrations of parents-with-children, teachers, classrooms, sports, music, STEM, robotics, reading, creative arts — **never** childish clip-art, and keep the illustration style visually consistent across every screen it appears on (hero, auth split-screen, empty states).

## 4. The four roles at a glance

| Role | Primary job | Dashboard inspiration |
|---|---|---|
| 👨👩👧 Parent | Discover, book, enroll, track their child(ren) | Stripe Dashboard |
| 🏫 Academy Management | Run one or more academies: programs, teachers, students, revenue | Vercel Dashboard |
| 👨🏫 Teacher | Manage assigned classes: attendance, reports, homework | Lightweight Stripe-style |
| 👑 System Administrator | Platform-wide moderation, approvals, analytics | Supabase (dark sidebar + white content) |

For the full navigation tree and step-by-step flows per role, see `references/roles-and-flows.md`.

## 5. Public / landing experience

Accessible with no auth. Navbar: Logo · Home · Academies · Programs · Events · Blog · About · Contact · Pricing · Login · Register · Language switch · Dark mode toggle.

Landing page section order (do not reorder without reason — this order mirrors Airbnb's discovery-first pattern):
1. Hero — split layout: left = headline + search bar (Search / Location / Age / Start Date), right = flat modern illustration
2. Popular categories (nursery, preschool, sports, swimming, football, martial arts, music, robotics, coding, STEM, languages, arts)
3. Featured academies (Airbnb-style listing cards)
4. Why Kids Oasis (verified academies, secure payments, reviews, AI recommendations, easy booking)
5. How it works
6. Interactive map (nearby academies)
7. Parent testimonials
8. Upcoming events (camps, open days, workshops)
9. Blog & parenting tips
10. Mobile app preview ("coming soon")
11. FAQ
12. CTA
13. Footer (About, Privacy, Terms, Careers, Contact, Social)

**Sticky search behavior**: on scroll, the hero search bar collapses into a slim sticky bar; filters become dismissible chips (Age, Price, Distance, Language, Rating, Transportation, Swimming, Coding, STEM, Music, Montessori, curriculum type).

## 6. Academy card & detail page

**Card** (Airbnb listing pattern): large image → rating (★) → favorite heart (top-right of image) → name → location pin → age range → transportation/meals/pool quick-feature icons → price → discount badge if any. Hover = lift + soften shadow, no color change.

**Detail page** (Airbnb property-page pattern), top to bottom: gallery (cover + 4 images + video + 360 tour) → about (story/vision/mission) → branches (map) → programs (age, duration, teacher, schedule, capacity, remaining seats, price) → facilities → teacher profiles → verified reviews (overall rating + star distribution + photo uploads) → FAQ → location → contact. A **sticky sidebar** persists price, seats available, "Book Tour," and "Enroll Now" throughout scroll.

## 7. Core cross-role flows

**Booking flow (stepper, Framer Motion transitions):**
Select Academy → Select Program → Choose Branch → Select Date → Select Time → Confirm Booking → Confirmation

**Enrollment/application flow:**
Parent uploads (birth certificate, child photo, parent ID, vaccination record, medical report) → status progresses: Pending → Under Review → Interview → Accepted/Rejected → Enrolled

**Parent onboarding wizard (first login):**
1. Personal information
2. Add children (name, birthday, gender, medical info, allergies, blood type, languages, interests)
3. Preferences (budget, distance, transportation, curriculum, activities) — these power recommendations

**Auth**: split-screen — illustration left, card right ("Welcome Back," email, password, continue, OR divider, Google/Facebook). Keep it minimal, no extra chrome.

**Notifications**: LinkedIn-style dropdown, grouped by day, unread badges. Delivered in-app + email + push. Triggers: new message, booking confirmed, enrollment status change, payment success, upcoming event, attendance update, security alert.

**Chat**: WhatsApp-style two-pane (conversations left, thread right) with typing indicator, read receipts, image/file attachments, conversation search. Pairs: Parent↔Academy, Parent↔Teacher, Academy↔Admin.

**Maps**: Google Maps pattern — pins, clustering, nearby academies, travel time, directions, inline reviews.

**Mobile**: bottom nav (Home / Search / Favorites / Chat / Profile) + floating "Book Visit" FAB.

## 8. Component library checklist

When scaffolding, plan for: Button, Input, Search, Card, Avatar, Modal, Drawer, Dropdown, Table, Calendar, Carousel, Tabs, Badge, Alert, Toast, Chart, Pagination, Breadcrumb, Rating, Map, Timeline, Skeleton, Empty State, Loading, Dialog, Command Menu. Build each once as a shared primitive (shadcn/ui base + Kids Oasis tokens) rather than per-screen one-offs.

## 9. Anti-patterns — avoid these

- Rainbow/pastel palettes, bevels, or hard drop shadows — breaks the "enterprise for owners" mandate.
- Cartoon-style clip-art illustrations — use modern flat vector art only.
- Dense, low-whitespace layouts — Kids Oasis reads as premium specifically because of generous spacing.
- Reordering the landing page away from the discovery-first sequence in §5 without a stated reason.
- Skipping the sticky booking sidebar / sticky search-to-chip collapse — these are signature interactions, not optional polish.
- Pure black dark mode — always `#0F172A`/`#1E293B`, never `#000`.

## 10. Where to go next

- Full per-role sidebar navigation, dashboard KPI cards, and detailed responsibilities for Parent, Academy, Teacher, and Admin → `references/roles-and-flows.md`
- If asked to scaffold actual components/pages, also consult the `frontend-design` skill for general layout/typography execution guidance, then apply the tokens and patterns above on top of it.
