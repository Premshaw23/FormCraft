# FormCraft - Modern Form Platform

FormCraft is a full-featured, modern web application for creating, sharing, and analyzing forms. Built with **Next.js**, **React**, **Tailwind CSS**, and **Firebase**, FormCraft combines a sleek UI with powerful form-building and analytics features.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)

   * Landing Page & Auth System
   * Dashboard & Form Management
   * Form Builder
   * Response Analytics & Viewer
   * Settings & Profile
   * Form Fill Experience
   * Premium UI Features
   * Security & Auth Features
   * Export & Additional Features
3. [Tech Stack](#tech-stack)
4. [File Structure](#file-structure)
5. [Build Priority / MVP Phases](#build-priority--mvp-phases)
6. [Deployment](#deployment)
7. [Getting Started](#getting-started)
8. [License](#license)

---

## Project Overview

FormCraft is designed to empower users to build, share, and analyze forms with ease. It includes an intuitive drag-and-drop form builder, user authentication, real-time analytics, conditional logic, access controls, and a modern UI with glassmorphism and gradient animations.

---

## Features

### Landing Page & Auth System

**Landing Page (`/`)**

* Hero intro with animated gradient background and floating form icons
* Headline & subheadline with CTA buttons: "Get Started Free" & "View Demo"
* Features showcase (3 cards: Lightning-fast autosave, Secure user authentication, Real-time analytics)
* Top navigation bar with sticky blur effect on scroll
* Features grid with 6 feature cards, hover lift & glow effects
* Footer: Privacy, Terms, Contact, Social links

**Auth Pages (`/auth/signin` & `/auth/signup`)**

* Split screen design: animated testimonial carousel + auth form
* Email/password and Google OAuth login
* Password strength indicator
* Email verification and password reset flow
* Smooth loading states, error toasts, auto-redirect after signup
* Firebase Auth integration & protected routes

### Dashboard & Form Management

**Dashboard (`/dashboard`)**

* Top bar: logo, search, profile dropdown
* Stats cards: Total Forms, Published, Total Responses, Draft
* Filter tabs: All | Draft | Published | Archived
* Forms grid (3 columns) with "Create New Form" card
* Form cards: thumbnail preview, status badge, stats, last edited, action buttons (Edit, Preview, Responses, Share, Duplicate, Archive, Delete)
* Empty state illustration with CTA button
* Pagination: load more & infinite scroll
* Form List features: sortable columns, bulk actions, quick actions

### Form Builder (`/forms/[id]/edit`)

**Layout: 3-Column**

* **Left Sidebar**: Field palette with 15+ field types (text, choice, number, rating, date/time, file/media, layout elements)
* **Center Canvas**: Editable form preview with drag-and-drop, inline editing, duplicate/delete, required toggle, and settings panel per field
* **Right Sidebar**: Form settings & theme editor (pre-made themes, custom theme editor, live preview, responsive toggle)

**Form Settings & Share**

* General: Draft/Published toggle, custom submit button, confirmation message, redirect URL
* Access Control: public, specific users, password-protected, private testing
* Submission limits: total & per user, expiry date
* Notifications: email alerts, Slack webhook (future)
* Advanced: progress bar, shuffle questions, multi-page draft responses, CAPTCHA, metadata collection
* Share: unique link, QR code, embed options, social share, collaborators (future)

### Response Analytics & Viewer (`/forms/[id]/responses`)

**Summary Stats Cards**

* Total responses, response rate, average completion time, last response

**Filter Bar**

* Date range picker, search, status filter

**Visualization Tabs**

* Summary: charts per question type
* Individual: table view + modal per respondent
* Charts: interactive dashboards, export as PNG, cross-filtering, date range comparison

### Settings & Profile (`/settings`)

**Sidebar Tabs**

* Profile: avatar, display name, email (readonly), bio
* Account: email preferences, language, timezone, delete account
* Security: change password, 2FA, active sessions, login history
* Billing & API Keys (future)

### Form Fill Experience (`/f/[shortId]`)

**Before Auth**

* Redirect to signin with return URL
* Show message to sign in

**After Auth**

* Access checks (password, whitelist, expiry)
* Form UI: clean, focused, optional single-field mode
* Autosave drafts, validation, character count
* Submit section: custom button text, loading animation, disable multiple clicks
* After submit: success page with confetti, redirect, or view responses
* Error handling: network, validation, quota exceeded

### Premium UI Features

* Skeleton screens, shimmer effect for loading
* Buttons: default, hover (glow + scale), active, loading, disabled
* Page transitions, modal animations, drag & drop with spring physics
* Micro-interactions: hover lift, toggle switches, animated checkboxes, progress bars
* Glassmorphism, gradient borders, floating labels, contextual menus, dark mode toggle

### Security & Auth Features

* Firebase Auth (email/password, Google OAuth)
* Protected routes & role-based access
* Form-level security: owner-only edit/delete, server-side validation, rate limiting, XSS/CSRF protection
* Data privacy: GDPR compliance, encrypted uploads

### Export & Additional Features

* CSV export per form
* Sign out flow with confirmation modal
* Form templates, duplicate forms, form versioning (future), webhooks, email integration, team collaboration (future)

---

## Tech Stack

**Frontend**

* Next.js 15 (App Router)
* React 19
* Tailwind CSS 4
* Framer Motion
* React Hook Form + Zod
* TanStack Query
* Zustand
* @dnd-kit
* Recharts
* Lucide React Icons

**Backend & Services**

* Firebase Auth
* Firebase Firestore
* Firebase Storage
* Firebase Cloud Functions (optional)

**Deployment**

* Vercel (primary)
* Firebase Hosting (alternative)

**Developer Tools**

* ESLint + Prettier
* Husky (pre-commit hooks)
* TypeScript (optional)

---

## File Structure

```
formcraft/
├── app/
│   ├── (auth)/
│   │   ├── signin/page.js
│   │   └── signup/page.js
│   ├── (dashboard)/
│   │   ├── dashboard/page.js
│   │   └── settings/page.js
│   ├── forms/
│   │   ├── [id]/
│   │   │   ├── edit/page.js
│   │   │   ├── responses/page.js
│   │   │   └── preview/page.js
│   │   └── new/page.js
│   ├── f/[shortId]/page.js
│   ├── layout.js
│   └── page.js
├── components/
│   ├── ui/
│   ├── form-builder/
│   ├── auth/
│   └── dashboard/
├── lib/
│   ├── firebase.js
│   ├── hooks/
│   └── utils/
├── public/
└── styles/
```

---

## Build Priority / MVP Phases

**Phase 1 (Week 1-2)**

* Landing page + Auth
* Dashboard with form list
* Basic form builder (5 fields)
* Autosave system
* Publish + share link

**Phase 2 (Week 3-4)**

* All field types
* Form fill flow with auth
* Response viewer (table + individual)
* CSV export
* Settings page

**Phase 3 (Week 5-6)**

* Analytics charts
* Theme customization
* Access controls
* Loading states + animations
* Mobile responsive

**Phase 4 (Advanced)**

* Conditional logic
* File uploads
* Templates
* Collaboration
* Webhooks

---

## Deployment

* Vercel for Next.js deployment
* Firebase for backend services
* CI/CD with automatic builds on push

---

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/formcraft.git
cd formcraft
```

2. Install dependencies

```bash
npm install
```

3. Configure Firebase

* Create a Firebase project
* Add Firebase config in `lib/firebase.js`
* Enable Auth, Firestore, Storage

4. Run locally

```bash
npm run dev
```

5. Access:

* Landing: `http://localhost:3000`
* Auth: `/auth/signin` & `/auth/signup`
* Dashboard: `/dashboard`
* Form builder: `/forms/new`
* Form fill: `/f/[shortId]`

---

## License

MIT License
