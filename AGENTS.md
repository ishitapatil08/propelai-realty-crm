# PropelAI Realty OS — Agent Rules

## Stack
This project is a **Next.js 15 (App Router)** application.
- Runtime: Next.js 15 + React 19
- Auth: Supabase Auth + `@supabase/ssr`
- DB: Drizzle ORM + PostgreSQL (via Supabase)
- Styling: Tailwind CSS v4 + shadcn/ui
- State: TanStack Query (client-side)
- ORM: Drizzle Kit for migrations

## Folder Layout
```
src/
├── app/          ← Next.js App Router pages & layouts
├── components/   ← Shared React components
│   ├── ui/       ← shadcn/ui primitives
│   ├── layout/   ← Sidebar, Header, etc.
│   └── providers/← Context providers (Theme, Auth)
├── lib/
│   ├── supabase/ ← Supabase browser & server clients
│   ├── auth/     ← Session helpers & server actions
│   └── types.ts  ← Shared TypeScript types
├── db/
│   ├── schema.ts ← Drizzle ORM schema (all 14 tables)
│   └── index.ts  ← DB client
├── features/     ← Feature-scoped modules (leads, properties, etc.)
└── hooks/        ← Shared React hooks
middleware.ts     ← Auth + role-based route protection
supabase/migrations/ ← SQL migration files with RLS policies
```

## Rules
1. All new pages go in `src/app/` following Next.js App Router conventions.
2. Client components must have `"use client"` at the top.
3. Use `@/` path alias (maps to `src/`).
4. Auth is session-cookie-based (see `src/lib/auth/session.ts`).
5. Demo mode is controlled by `NEXT_PUBLIC_DEMO_MODE=true`.
6. Never import from `src/routes/` — those are legacy TanStack Router files.
7. Database mutations go in Server Actions (`"use server"` files).
8. Tenant isolation is enforced at both the application layer AND via PostgreSQL RLS.
