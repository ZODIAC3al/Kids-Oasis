# Kids Oasis — Complete User Flow & Navigation

## 🌟 Platform Overview
Kids Oasis is a comprehensive Education Marketplace and Academy Management Platform that connects parents with trusted nurseries, schools, educational centers, sports academies, language institutes, STEM centers, and extracurricular activity providers.

The platform is designed around four primary roles:
1. **Parent** (👨👩👧)
2. **Academy Management** (🏫)
3. **Teacher** (👨🏫)
4. **System Administrator** (👑)

---

## 🏠 Landing Experience (Public)
Anyone can access the platform without authentication.

### Navigation Bar
- Logo: **Kids Oasis**
- Links: Home, Academies, Programs, Events, Blog, About Us, Contact, Pricing, Login, Register
- Actions: Language Switch (EN/AR), Dark Mode Toggle, Profile/User Dashboard quick link

### Home Page Sections
1. **Hero**: Large search bar featuring inputs for Academy Name, Location, Child Age range, and a dynamic Search CTA.
2. **Popular Categories**: Quick links to categories (Nurseries, Preschools, Sports, Swim, Music, STEM).
3. **Featured Academies**: Directory cards showing Rating, Price, Programs, Favorite trigger.
4. **Why Choose Kids Oasis**: Highlighting Verified Academies, Secure Payments, AI Recommendations.
5. **Interactive Map**: Location-based discovery showing nearby academies.
6. **Testimonials**: Reviews from verified parents.
7. **Upcoming Events / Blog / FAQ / Footer**

---

## 🔍 Academy Discovery & Details Flow
- **Discovery Grid**: Advanced search panels with filter chips (Age, Price, Distance, Transportation, Meals, Curriculums, STEM/Coding details).
- **Academy Details Page**: 
  - Gallery (Images, Videos, Virtual 360 Tour).
  - About/Branches map markers.
  - Curriculums & Programs list (Remaining seats, schedules, price info).
  - List of teachers & parent reviews.
  - Sticky booking drawer (Price, available seats, Book visit, Enroll Child).

---

## 👨👩👧 Parent Journey
1. **Registration**: Email/Password or Google authentication (Email verification required).
2. **Onboarding Wizard**:
   - Step 1: Parent Profile details.
   - Step 2: Add Children (Name, birthday, allergies, medical logs, interests).
   - Step 3: Specify preferences (Budget, distance, transportation, preferred curriculum) to train recommendation feeds.
3. **Parent Dashboard Modules**:
   - Overview KPI widgets (Children count, upcoming visits, pending applications).
   - Booking Stepper (Academy -> Program -> Branch -> Date & Time -> Payment & Confirmation).
   - Enrollment Pipeline: File uploader (Birth Certificate, Child Photo, Parent ID, Vaccination cards) mapping to review status stages.
   - Payments & Messages (Invoices, online receipts downloads, live chat with Academy and Teachers).

---

## 🏫 Academy Owner Flow
1. **Approval Process**: Academy accounts require admin validation.
2. **Owner Dashboard Modules**:
   - KPIs: Monthly revenue, enrollments, occupancy rates, visitors.
   - Profile & Branches configuration settings.
   - Programs setup & Pricing configurations.
   - Student tracker: logs, attendance rates, medical records.
   - Applications processing panels.

---

## 👨🏫 Teacher Flow
- **Teacher Dashboard**: Daily schedule calendar, lesson reports, attendance rates, reporting logs.
- **Actions**: Input attendance records, report child progress, upload class activity pictures, send messages.

---

## 👑 System Administrator Flow
- **Admin Dashboard**: Active sessions, user growth curves, moderation queues.
- **Actions**: Approve academies, edit categories, suspend profiles, manage blogs, monitor analytics.

---

## 💬 Core Services Flows
- **Notification Flow**: In-app notifications, dynamic templates, e-mails, and push updates.
- **Chat Flow**: Socket.io real-time chat with typing states, read receipts, and attachments.
- **Global Search & Settings**: Profile pictures, connected Google accounts, theme selector.
