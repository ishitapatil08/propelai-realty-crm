import Link from "next/link";
import { loginWithCredentials } from "@/lib/auth/actions";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowLeft, ShieldAlert, Lock } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default async function SuperAdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full p-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[400px] mb-8 text-center flex flex-col items-center">
          <div className="mb-4">
            <BrandLogo size="lg" subtitle="System Administration" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Restricted Portal
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Super Admin Access
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in with authorized system root credentials
          </p>
        </div>

        <div className="w-full max-w-[400px]">
          {resolvedSearchParams?.error && (
            <div className="mb-4 p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
              {resolvedSearchParams.error}
            </div>
          )}
          {resolvedSearchParams?.message && (
            <div className="mb-4 p-3 text-sm font-medium text-primary bg-primary/10 rounded-md border border-primary/20 text-center">
              {resolvedSearchParams.message}
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <form action={loginWithCredentials} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium">
                  Administrator Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium">
                  Password / Key
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                Authenticate Root Session
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
