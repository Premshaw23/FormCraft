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

// ...existing code...

# FormCraft

FormCraft is a modern form platform for building, sharing, and analyzing forms. Built with Next.js + React, Tailwind CSS and Firebase, it focuses on fast UX, privacy-first defaults, and an extensible form builder & analytics experience.

---

## Quick Links

- App layout: [app/layout.js](app/layout.js)  
- Firebase config: [lib/firebase.js](lib/firebase.js)  
- Auth provider: [`AuthProvider`](context/AuthContext.js)  
- Form builder layout: [components/form-builder/FormBuilderLayout.js](components/form-builder/FormBuilderLayout.js)  
- Field types list: [lib/constants/fieldTypes.js](lib/constants/fieldTypes.js)  
- Form fill page: [app/f/[id]/page.js](app/f/[id]/page.js)  
- Success flow (confetti / redirect): [components/form-fill/SuccessScreen.js](components/form-fill/SuccessScreen.js)  
- CSV export helper: [`exportResponsesToCSV`](lib/services/responseService.js)

---

## Features (high level)

- Intuitive drag-and-drop form builder (3-column layout: palette, canvas, settings)
- Rich field types (text, email, number, rating, scale, date/time, file uploads, choice fields)
- Per-form settings (confirmation message, redirect URL, submission limits, access control)
- Response viewer with individual response modal and CSV export
- Firebase-based auth, storage, and Firestore backend
- Theme customization & responsive UI with Tailwind CSS
- GDPR/Privacy focused defaults and legal pages

Key UI components live under `components/` (see [components](components/) folder).

---

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- Lucide icons, Recharts (analytics)
- Optional: Framer Motion, @dnd-kit for drag & drop

---

## Project structure (important files)


# FormCraft

A modern, privacy-conscious form builder and analytics platform built with Next.js, React and Firebase. This README gives a quick setup guide, explains the project layout, and includes pointers for development and contribution.

---

## Quick links

- App entry / providers: `app/layout.js`
- Dashboard (protected): `app/(dashboard)`
- Public form route: `app/f/[id]/page.js`
- Firebase init: `lib/firebase.js`
- Auth provider & hooks: `context/AuthContext.js`
- Form builder UI: `components/form-builder/`

---

## Features (high level)

- Visual form builder (drag & drop)
- Publishable forms with share links and embed options
- Response viewer, CSV export and basic analytics
- Firebase Auth (email + Google), Firestore-backed data
- Responsive UI with Tailwind CSS, skeletons and smooth micro-interactions

---

## Requirements

- Node.js 18+ recommended
- npm, yarn, or pnpm
- A Firebase project (Auth, Firestore, Storage) for local testing

---

## Environment

Create a .env.local or populate `lib/firebase.js` with your Firebase configuration. Common env variables used in this project:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

---

## Quick start (local)

1. Clone and install

```bash
git clone https://github.com/yourusername/formcraft.git
cd formcraft
npm install
```

2. Add Firebase credentials to `.env.local` or update `lib/firebase.js`.

3. Start dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Useful NPM scripts

- `npm run dev` — start Next dev server
- `npm run build` — production build
- `npm run start` — run production build locally
- `npm run lint` — run linters (if configured)

---

## Project layout (high level)

```
.
├── app/                     # Next.js App Router routes & route groups
├── components/              # UI components (form-builder, dashboard, responses)
├── context/                 # Auth provider and other React context
├── lib/                     # firebase init, services, hooks, constants
├── public/                  # static assets
└── README.md
```

---

## Development notes

- Protect dashboard routes with `AuthContext` (see `context/AuthContext.js`). The `components/ProtectedRoute.js` helper is used in the dashboard route group.
- Field types and defaults are defined in `lib/constants/fieldTypes.js`.
- Services (form and response logic) live in `lib/services/`.

Small, low-risk suggestions you might consider adding:

- Add a minimal `.env.example` with required env var names.
- Add an `init:firebase` script or instructions to set up Firestore indexes if needed.

---

## Contributing

1. Fork or branch from `master` with `feat/<name>` or `fix/<name>`.
2. Open a PR with a concise description and include screenshots for UI changes.
3. Add tests for new business logic where applicable.

---

## License

MIT

---

If you'd like, I can also:

- Add a `.env.example` file to the repo with the common Firebase keys shown above.
- Wire a simple GitHub Actions workflow for linting and preview deployments.

Tell me which you'd like next and I will add it.
