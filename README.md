# CampusConnect – Cloud-Based College Event Management System

CampusConnect is a comprehensive, responsive, full-stack college event management web application tailored for higher education academic institutions. Built using a modern **Bento grid architecture**, it empowers students to discover events, register with concurrency-safe capacity locks, receive QR-code check-in passes, and earn verified downloadable certificates. It also equips event organizers, faculty mentors, and academic administrators with complete tools to propose, review, manage, and audit collegiate events.

---

## 🌟 Key Features by User Role

### 1. Student
- **Event Discovery**: Search and multi-filter events by keyword, category, department, availability, and date.
- **Concurrency-Safe Registration**: Guaranteed prevention of overbooking, duplicate registration, or registration past deadline.
- **Digital Event Pass**: Instant unique ticket code (e.g. `CC-TECH-4829`) and scannable visual badge.
- **Pass Cancellation**: Allows freeing up seat capacity for other students according to college rules.
- **Official Verified Certificates**: Instant preview and high-resolution downloadable/printable certificate upon verified check-in.
- **In-App Notifications**: Real-time alerts for registrations, announcements, approvals, and reminders.

### 2. Event Organizer
- **Proposal Creation Workflow**: Comprehensive proposal submission with venue, capacity limits, deadlines, poster presets, agendas, and rules.
- **Event Lifecycle Tracking**: Track status (`draft`, `pending_approval`, `approved`, `published`, `completed`, `cancelled`).
- **Participant Roster & CSV Export**: Real-time attendee roster with 1-click CSV download.
- **Optical / QR Check-in Terminal**: Live camera viewfinder simulation or registration code verification tool.
- **Announcement Broadcaster**: Send immediate in-app broadcast updates to all enrolled students.

### 3. Faculty Reviewer
- **Departmental Review Queue**: Review student-proposed symposiums, workshops, and hackathons.
- **Approve or Reject**: Submit formal approval notes or feedback directives before public publishing.
- **Department Activity Monitoring**: Track student engagement across academic departments.

### 4. System Administrator
- **Platform Analytics**: Interactive Recharts graphs showing event volume by category and registrations across departments.
- **User Role Governance**: Real-time assignment and modification of user roles (Student, Organizer, Faculty, Admin).
- **Central Approval Queue**: Platform-wide oversight of all departmental events.
- **Security Audit Logs**: Immutable chronological record of actions, actors, entity IDs, and timestamps.
- **Cloud Database Configuration**: Integrated Supabase PostgreSQL connector and SQL schema inspector.

---

## 🛠 Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4.
- **Routing & State**: React Router v7, Reactive Unified Campus Store with localStorage persistence.
- **Icons & Visuals**: Lucide React, Plus Jakarta Sans, Canvas Confetti.
- **Analytics & Visualizations**: Recharts (Bar Charts, Responsive Containers).
- **Backend & Cloud Database**:
  - Supabase PostgreSQL with Row Level Security (RLS).
  - Concurrency-safe PostgreSQL transactional function `register_for_event(...)` with `FOR UPDATE` row locks.
  - Full relational schema in `/supabase/schema.sql`.

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The app will run on `http://localhost:3000`.

### 3. Test Demo Roles Instantly
CampusConnect includes a built-in **1-Click Demo Role Switcher** in the top navigation bar:
- **Student**: Priya Sharma (`priya.sharma@campus.edu`)
- **Organizer**: Alex Chen (`alex.chen@campus.edu`)
- **Faculty**: Dr. Sarah Mitchell (`dr.mitchell@campus.edu`)
- **Admin**: Dean Robert Taylor (`admin.taylor@campus.edu`)

---

## 🗄 Database Setup & Supabase Migration

To connect your own live Supabase project:
1. Open the **Cloud Status** button in the navigation bar.
2. Enter your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Open your Supabase SQL Editor and run the complete migration script located at `/supabase/schema.sql`.

The schema automatically provisions:
- All 12 relational tables (`profiles`, `departments`, `clubs`, `event_categories`, `events`, `registrations`, `attendance`, `certificates`, `announcements`, `notifications`, `event_approvals`, `audit_logs`).
- Foreign key constraints, unique checks, and timestamp triggers.
- Concurrency-safe atomic registration function.
- Row Level Security (RLS) policies.
