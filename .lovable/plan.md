

# Multi-Restaurant Staff Membership

## Current state
- Staff have a single `establishment_id` on their `profiles` row
- The `get_user_establishment_id()` DB function returns this single value and is used in **all RLS policies** across every table
- Dashboard checks `profile.establishment_id` to determine if staff has joined a team

## Approach

### Database changes

1. **New table: `staff_establishments`** -- maps staff to multiple restaurants
   - `id` (uuid, PK), `user_id` (uuid, NOT NULL), `establishment_id` (uuid, NOT NULL), `joined_at` (timestamptz, default now())
   - Unique constraint on `(user_id, establishment_id)`
   - RLS: staff can read own rows; managers can read rows in their establishment

2. **Keep `profiles.establishment_id`** as the "active/selected" establishment. This is critical because `get_user_establishment_id()` is used in dozens of RLS policies. Changing all those policies would be massive and risky. Instead, `profiles.establishment_id` becomes the **currently selected** restaurant, and we update it when the user switches.

3. **Update `get_user_establishment_id()`** -- no change needed since it still reads from `profiles.establishment_id`, which now represents the active selection.

### New page: `StaffSelectEstablishment.tsx`

- Route: `/staff/select-restaurant`
- Fetches all establishments the user belongs to via `staff_establishments` joined with `establishments`
- Shows each restaurant as a centered, clickable rectangle button (glass-card styled, stacked vertically)
- Also shows a "Join another restaurant" button that navigates to `/staff/setup`
- On click: updates `profiles.establishment_id` to the selected one, calls `refetch()`, navigates to `/staff/dashboard`

### Flow changes

- **`StaffDashboard.tsx`**: When staff has **no** entries in `staff_establishments` → show "No team yet" with invite code button (same as now)
- **`StaffDashboard.tsx`**: When staff has **1+** entries → redirect to `/staff/select-restaurant` if no active establishment is set, otherwise show dashboard as normal
- **`StaffSetup.tsx`** (invite code page): After claiming an invite code, also insert into `staff_establishments`. Still sets `profiles.establishment_id` to the new one.
- **`BottomNav.tsx`**: Add a small restaurant-switcher icon or make the restaurant name in the header tappable to go back to selection

### Files to create/modify

| File | Change |
|------|--------|
| `supabase/migrations/...` | Create `staff_establishments` table with RLS |
| `src/pages/staff/StaffSelectEstablishment.tsx` | New page -- restaurant picker |
| `src/pages/staff/StaffDashboard.tsx` | Check `staff_establishments` count; redirect if needed; add "Switch restaurant" option |
| `src/pages/staff/StaffSetup.tsx` | Also insert into `staff_establishments` on join |
| `src/App.tsx` | Add route for `/staff/select-restaurant` |
| `src/hooks/useAuth.tsx` | Profile type stays the same (still has `establishment_id` as active) |

### Technical details

- The `staff_establishments` table avoids changing any existing RLS policies. The `profiles.establishment_id` field acts as a "session pointer" to the active restaurant.
- When switching restaurants, a single `UPDATE profiles SET establishment_id = X` call is made, then `refetch()` refreshes the auth context, and the dashboard reloads data for the new establishment.
- Migration SQL will include INSERT RLS so staff can add themselves, and SELECT so they can list their own memberships.

