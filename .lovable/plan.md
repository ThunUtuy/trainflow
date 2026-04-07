

# Add "About Us" Section for Establishments

## Overview
Add an editable "About Us" section (description + optional image) to each establishment. Staff see it on their dashboard above the progress circle. Managers can edit it from a new settings page.

## Database Changes

Add two columns to the `establishments` table:
- `description` (text, nullable, default null) — brief restaurant description
- `image_url` (text, nullable, default null) — URL to a small photo (stored in a new `establishment-images` storage bucket)

## Staff Dashboard (`StaffDashboard.tsx`)
- Fetch `description` and `image_url` alongside the existing `name` query on the `establishments` table
- Display a card between the header and the circular progress bar:
  - Optional small rounded image on the left
  - Restaurant description text on the right
  - Only shown if description or image exists
  - Subtle glass-card styling consistent with the rest of the UI

## Manager Side — New Settings Page

**New file: `src/pages/manager/ManagerSettings.tsx`**
- Route: `/manager/settings`
- Fetches current establishment `name`, `description`, `image_url`
- Form with:
  - Establishment name (text input, pre-filled)
  - Description (textarea, placeholder "Tell your staff about your restaurant...")
  - Image upload (using the `establishment-images` storage bucket) with preview
- Save button updates the `establishments` row

**New route** added to `App.tsx`.

**Bottom nav**: Add a settings/gear icon to the manager's `BottomNav` linking to `/manager/settings`.

## Storage
- Create an `establishment-images` bucket (public read) via migration
- RLS: managers can upload/delete files scoped to their establishment ID

## Files to Create/Modify

| File | Change |
|------|--------|
| Migration SQL | Add `description` and `image_url` columns to `establishments`; create `establishment-images` bucket with RLS |
| `src/pages/manager/ManagerSettings.tsx` | New settings page with about-us editor |
| `src/pages/staff/StaffDashboard.tsx` | Display about-us card above progress circle |
| `src/App.tsx` | Add `/manager/settings` route |
| `src/components/BottomNav.tsx` | Add settings link for managers |

