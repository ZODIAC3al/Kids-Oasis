# Kids Oasis — Roles, Navigation & Detailed Flows

Read this file when scaffolding a specific role's dashboard, sidebar, or multi-step flow. See `SKILL.md` for design tokens and cross-role patterns first.

---

## 👨👩👧 Parent

**Sidebar:** Dashboard · My Children · Academies · Bookings · Applications · Payments · Favorites · Messages · Notifications · Events · Profile · Settings

**Dashboard overview cards:** Children · Upcoming Visits · Pending Applications · Notifications · Payments · Recommendations

**My Children:** Add Child · Edit Child · Upload Photo · Track Progress · View Attendance · View Certificates. Child profile shows a timeline: photo, age, school, allergies, attendance, progress, achievements, certificates.

**Search Academies:** advanced filters (see SKILL.md §5) → Compare · Favorite · Book Visit · Enroll.

**Booking flow:** Select Academy → Select Program → Choose Branch → Select Date → Select Time → Confirm Booking → Confirmation (Framer Motion stepper).

**Enrollment flow:** upload birth certificate, child photo, parent ID, vaccination record, medical report. Status: Pending → Under Review → Interview → Accepted/Rejected → Enrolled.

**Payments:** view invoices, pay online, download receipts, view payment history.

**Favorites:** saved academies with side-by-side compare.

**Messages:** real-time chat with Academy and/or Teacher.

**Events:** register children for trips, summer camps, competitions, workshops.

---

## 🏫 Academy Management

Gains access only after Admin approval.

**Sidebar:** Dashboard · Academy Profile · Branches · Programs · Teachers · Students · Bookings · Applications · Events · Reviews · Payments · Analytics · Messages · Settings

**Dashboard KPIs:** Revenue · Students · Applications · Bookings · Occupancy · Reviews
**Dashboard charts:** Monthly Revenue · Enrollments · Visitors · Popular Programs

**Academy Profile:** logo, cover, gallery, description, contact, social media.

**Branches:** manage multiple branches, each with address, working hours, capacity, facilities.

**Programs:** create/manage nursery, coding, robotics, swimming, football, etc. — pricing, seats, teachers, schedule per program.

**Teachers:** add teachers, assign to programs.

**Students:** manage attendance, progress, medical notes, parent contacts.

**Applications:** review enrollment requests, approve or reject.

**Bookings:** manage campus visits — approve, reschedule, cancel.

**Reviews:** reply to parents, report abuse.

**Analytics:** performance metrics (revenue, enrollments, visitors, applications trends).

---

## 👨🏫 Teacher

**Sidebar:** Dashboard · My Classes · Students · Attendance · Reports · Assignments · Messages · Events · Profile

**Dashboard shows:** Today's Classes · Upcoming Lessons · Attendance Rate · Pending Reports

**Core actions:** take attendance, write child progress reports, upload photos, share homework/assignments, message parents.

---

## 👑 System Administrator

**Sidebar (dark sidebar, white content — Supabase pattern):** Dashboard · Users (Parents/Academies/Teachers) · Programs · Categories · Bookings · Enrollments · Payments · Reviews · Events · Blogs · Support Tickets · Notifications · Analytics · Reports · Roles · Permissions · Audit Logs · Settings

**Dashboard cards:** Total Users · Parents · Academies · Teachers · Students · Revenue · Active Sessions · New Registrations

**Dashboard charts:** User Growth · Revenue · Applications · Bookings · Daily Traffic

**Responsibilities:** approve academies, suspend users, moderate reviews, manage blogs, create categories, send platform-wide notifications, monitor analytics, resolve support tickets, manage roles/permissions, review audit logs.

---

## End-to-end user journey (for onboarding docs / marketing walkthroughs)

```
Visitor
  → Home Page
  → Browse Academies
  → View Academy Details
  → Register / Login
  → Create Parent Profile
  → Add Child
  → Receive Personalized Recommendations
  → Search & Compare Academies
  → Book a Visit
  → Visit Academy
  → Submit Enrollment Application
  → Academy Reviews Application
  → Acceptance & Online Payment
  → Child Enrolled
  → Track Attendance & Progress
  → Receive Reports, Messages & Notifications
  → Continue Discovering New Programs, Camps & Events
```

## Shared cross-role systems

**Notifications:** in-app + email + push. Triggers: new message, booking confirmed, enrollment status change, payment success, upcoming event, attendance update, security alert.

**Chat pairs:** Parent↔Academy, Parent↔Teacher, Academy↔Admin. Features: typing indicator, read receipts, image/file attachments, conversation search, (future) voice notes.

**Global search** (navbar + dashboards, all roles): Academies, Programs, Teachers, Events, Blog Articles, FAQs.

**Profile & Settings** (every authenticated role): Personal Information, Profile Picture, Password & Security, Connected Accounts (Google), Notification Preferences, Language, Appearance (Light/Dark), Privacy Settings, Active Sessions, Delete Account.
