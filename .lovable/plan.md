# Hospitality Onboarding & Training App — MVP Plan

## Overview

A mobile-first training app for small hospitality businesses with two roles: **Manager** (creates content, manages team) and **Staff** (completes modules and quizzes). Built with Supabase for auth, database, and role management.

---

## 1. Page Map

### Shared

- `**/**` — Welcome screen (logo + "Get Started" button)
- `**/select-role**` — Choose Manager or Staff
- `**/login**` — Login form (email/password), role-aware
- `**/signup**` — Signup form (name, email, password, confirm)
- `**/forgot-password**` — Email input + back button
- `**/reset-password**` — New password form (from email link)

### Staff Flow

- `**/staff/dashboard**` — If no establishment: shows "Enter code" setup card. If linked: shows module list with progress
- `**/staff/setup**` — Enter establishment code to join
- `**/staff/modules/:id**` — Module detail with pages (text, images, video, checklist)
- `**/staff/modules/:id/quiz**` — Quiz screen (multiple choice, true/false)

### Manager Flow

- `/manager/team` — If no establishment: shows setup prompt. If has one:  shows team list with staff names + task completion (e.g., 4/6)

- `**/manager/setup**` — Create establishment (name, details) → generates invite code
- `**/manager/team/:staffId**` — Individual staff page showing module-by-module status (✓, 4/5, ✗)
- `**/manager/modules**` — Module list with create/delete options
- `**/manager/modules/create**` — Select from recommended templates or blank
- `**/manager/modules/:id/edit**` — Add/edit pages within module (text, media, quiz, checklist)
- `**/manager/invite**` — Generate & display one-time invite code for new staff

---

## 2. Data Model (Supabase)

- **profiles** — id, user_id (FK auth.users), name, establishment_id
- **user_roles** — id, user_id, role (enum: manager, staff)
- **establishments** — id, name, created_by (manager user_id), invite_code
- **modules** — id, establishment_id, title, description, template_source, created_at, sort_order
- **module_pages** — id, module_id, type (text/image/video/checklist), title, content (JSON), sort_order
- **quizzes** — id, module_id, title
- **quiz_questions** — id, quiz_id, question_text, type (single_choice/multi_choice/true_false), options (JSON), correct_answers (JSON), sort_order
- **staff_module_progress** — id, user_id, module_id, status (not_started/in_progress/completed)
- **staff_quiz_attempts** — id, user_id, quiz_id, score, total, answers (JSON), completed_at
- **invite_codes** — id, establishment_id, code, used_by, used_at, created_at

---

## 3. Main Components

- **RoleGuard** — Protects routes based on user role (manager/staff)
- **EstablishmentGuard** — Redirects to setup if user has no establishment linked
- **ModuleCard** — Displays module title + progress indicator
- **ModulePageEditor** — Manager's rich page editor (add text blocks, image URLs, video embeds, checklists)
- **ModulePageViewer** — Staff's read-only page viewer
- **QuizPlayer** — Renders questions one-by-one with answer selection and scoring
- **QuizEditor** — Manager creates questions with answer options
- **TeamTable** — List of staff with completion stats
- **StaffDetailView** — Per-module status for one staff member
- **InviteCodeGenerator** — Creates and displays a shareable code
- **ConfirmDeleteDialog** — Reusable confirmation dialog for destructive actions (delete module, page, quiz)
- **BottomNav** — Mobile navigation bar for dashboard, modules, profile

---

## 4. Key Flows & Edge Cases

- **Invite code**: Manager generates a unique code → Staff enters it on setup → code is consumed (one-time use) → staff is linked to establishment
- **Forgot password**: Back button returns to login; email link goes to `/reset-password`
- **Confirm deletes**: Deleting a module, page, or quiz always shows a confirmation dialog
- **Quiz scoring**: Score is saved; staff can see pass/fail; manager sees score on staff detail page
- **Empty states**: Dashboard shows friendly prompts when no establishment, no modules, or no team members exist
- **Template modules**: Pre-built "Health & Safety", "Dress Code", and "Workflow" templates with sample pages and quiz questions that managers can customize

---

## 5. MVP Scope (Phase 1)

**Included now:**

- Full auth flow (signup, login, forgot/reset password, role selection)
- Establishment creation (manager) and joining via code (staff)
- Module CRUD for managers (create from template or blank, add pages with text/images/video/checklists, delete with confirmation)
- Module viewing and progress tracking for staff
- Quiz creation (manager) and quiz taking (staff) — single choice, multi choice, true/false
- Team overview and individual staff progress pages
- Invite code generation

**Phase 2 (later):**

- Push notifications for new modules
- PDF/certificate export on completion
- Advanced analytics and reporting
- Multi-establishment support for managers