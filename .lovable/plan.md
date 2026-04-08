

# Training Role Labels (Auto-derived from Assigned Groups)

## Overview
Display Training Role names (from playlists) as badge/tag labels on staff members. These are fully automatic — derived from `staff_playlist_assignments` joined with `playlists`. No new database tables or columns needed.

## Changes

### 1. Manager Team Page (`ManagerTeam.tsx`)
- Already fetching `playlistIds` per staff member during the data loop
- Additionally fetch playlist names for those IDs
- Add a `roles: string[]` field to the `StaffMember` interface
- Display role names as small `<Badge>` tags below the staff member's name (e.g., "FOH", "Kitchen")

### 2. Manager Staff Detail Page (`ManagerStaffDetail.tsx`)
- Already has `groups` state with assigned playlist names
- Display the assigned group names as editable badge tags near the top, under the staff name
- "Editable" means tapping a badge navigates to the Groups tab (or highlights it), since group assignment is already managed there — no extra editing UI needed

### 3. Staff Dashboard (`StaffDashboard.tsx`)
- Already fetching `groupAssignRes` (playlist IDs) for the current user
- Additionally fetch the playlist names for assigned IDs
- Display a "Your Role" section below the About Us card showing the role badges
- Only shown if the staff has at least one assigned Training Role

## Technical Details

- **No database changes** — roles are derived from existing `staff_playlist_assignments` + `playlists` tables
- Playlist names are fetched with a simple `.in("id", playlistIds)` query
- Uses the existing `<Badge>` component from `src/components/ui/badge.tsx`
- Labels update automatically when groups are assigned/unassigned since data is fetched fresh on each page load

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/manager/ManagerTeam.tsx` | Add `roles` to `StaffMember`, fetch playlist names, show badges on cards |
| `src/pages/manager/ManagerStaffDetail.tsx` | Show assigned group names as badges under staff name |
| `src/pages/staff/StaffDashboard.tsx` | Add "Your Role" section with badges below About Us |

