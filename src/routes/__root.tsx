import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "../lib/auth";

function NotFoundComponent() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", padding: "0 16px" }}>
      <div style={{ maxWidth: 400, textAlign: "center" }}>
        <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0, color: "var(--ink)" }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 16, color: "var(--ink)" }}>Page not found</h2>
        <p style={{ color: "var(--slate)", marginTop: 8, fontSize: 14 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", padding: "10px 20px", borderRadius: 10, background: "var(--ink)", color: "var(--gold-soft)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error("[PropelAI] Root error boundary caught:", error);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", padding: "0 16px" }}>
      <div style={{ maxWidth: 400, textAlign: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>This page didn't load</h1>
        <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 20 }}>
          Something went wrong. Try refreshing or go back home.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => { router.invalidate(); reset(); }}
            style={{ padding: "10px 20px", borderRadius: 10, background: "var(--ink)", color: "var(--gold-soft)", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
          <a href="/" style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PropelAI Realty OS — Multi-tenant CRM MVP" },
      { name: "description", content: "Phase 1 multi-tenant real estate CRM with lead management, staff assignment, and role-based dashboards." },
      { name: "author", content: "PropelAI" },
      { property: "og:title", content: "PropelAI Realty OS" },
      { property: "og:description", content: "Phase 1 multi-tenant real estate CRM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}



function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
