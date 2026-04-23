# TrainFlow

TrainFlow is a hospitality training platform for onboarding and upskilling staff through short, structured learning modules. It supports separate staff and manager experiences, role-based access, quizzes, progress tracking, and training group assignment.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Supabase
- Vitest

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- A Supabase project with the required environment variables configured

### Install dependencies

```sh
npm install
```

### Configure environment variables

Create a `.env` file in the project root and add the required Supabase values:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If you are using Supabase Edge Functions or storage features, make sure the linked Supabase project is set up with the expected schema, buckets, and policies.

### Run locally

```sh
npm run dev
```

The app runs through Vite's development server.

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run build:dev` creates a development-mode build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint
- `npm run test` runs the test suite once
- `npm run test:watch` runs tests in watch mode

## Project Structure

```text
src/
  assets/         Static images and template media
  components/     Shared UI, manager tools, and microlearning components
  contexts/       React context providers such as authentication
  data/           Seeded template data and static configuration
  hooks/          Reusable React hooks
  integrations/   External service clients and generated types
  lib/            Shared utilities
  pages/          Route-level pages for public, staff, and manager flows
  test/           Test setup and example tests
supabase/
  functions/      Edge Functions
  migrations/     Database schema and policy migrations
```

## Application Architecture

TrainFlow is a client-side React application with Supabase as the backend platform.

- Routing is defined in `src/App.tsx` using `react-router-dom`
- Authentication state is managed through `AuthProvider` in `src/contexts/AuthContext.tsx`
- Access control is enforced in the UI using route guards such as `RoleGuard`
- Manager and staff experiences are separated into dedicated route groups under `src/pages/manager` and `src/pages/staff`
- Shared presentational and interaction patterns live in `src/components`
- Supabase client setup and generated database types live under `src/integrations/supabase`

## Backend and Data Layer

The app relies on Supabase for:

- Authentication
- Database reads and writes
- Storage uploads for module assets
- Edge Functions for server-side actions

Current Edge Functions include:

- `condense-text` for shortening training copy
- `remove-staff` for manager-side staff removal workflows

Database schema and policies are tracked in the `supabase/migrations` directory.

## Testing

Run the test suite with:

```sh
npm run test
```

Vitest configuration lives in `vitest.config.ts`, and test setup files live in `src/test`.

## Notes for Development

- Path aliases use `@` to reference `src`
- Styling is handled with Tailwind CSS and shared UI primitives
- The app uses role-based routing, so testing both manager and staff flows is important
- Supabase policies and storage permissions should be validated alongside UI changes

## Deployment

Build the project for production with:

```sh
npm run build
```

You can then deploy the generated output using any hosting platform that supports static frontends, provided the required environment variables are available at build time.
