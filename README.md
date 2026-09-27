# Daily Capsule

A mobile-first PWA for keeping one memory from each day.

## Start locally

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run build
npm run preview
```

## Current foundation

- React, TypeScript, and Vite
- React Router routes for Today, Memories, Calendar, Capsule detail, and Settings
- Tailwind CSS theme tokens based on `DESIGN.md`
- Dexie/IndexedDB local-first capsule storage
- PWA manifest, offline app-shell precache, and standalone display mode
- Motion, forms, validation, image compression, and date utilities installed for the creation flow

The visible pages are intentionally lightweight placeholders. Their structure can be replaced with the approved screen design without changing routing or the data layer.

## Source map

```text
src/
├── app/                  app entry and routes
├── components/
│   ├── layout/           persistent mobile shell
│   └── ui/               shared presentational components
├── features/
│   └── capsules/         capsule model, IndexedDB, and service layer
├── lib/                  framework-independent helpers
├── pages/                route-level screens
├── main.tsx
└── styles.css            theme tokens and temporary shell styling
```

## Data strategy

IndexedDB remains available for offline use. When a user signs in with Supabase Magic Link, capsules are uploaded to the private `capsule-images` Storage bucket and synchronized with the `capsules` table.

To enable cloud sync, copy `.env.example` to `.env.local`, add the Project URL and anon/publishable key, then run [the migration](supabase/migrations/20260927_create_capsules.sql) in the Supabase SQL Editor. Do not put a service-role key in the frontend.
