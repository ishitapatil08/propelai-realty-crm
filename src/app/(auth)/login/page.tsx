import Image from "next/image";
import Link from "next/link";
import { loginWithCredentials, loginWithDemo } from "@/lib/auth/actions";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowLeft, Shield, Building2, UserCircle2 } from "lucide-react";
import { demoAccounts } from "@/lib/auth/mock-users";

export default function LoginPage() {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[400px] mb-8 text-center flex flex-col items-center">
          <div className="relative w-12 h-12 mb-6">
            <Image 
              src="/logo.png" 
              alt="PropelAI Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to PropelAI</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your CRM dashboard
          </p>
        </div>

        {isDemoMode ? (
          <div className="w-full max-w-[800px] grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Shield className="w-5 h-5" />
                <h2 className="font-semibold text-sm uppercase tracking-wider">Platform Admin</h2>
              </div>
              <div className="space-y-3">
                {demoAccounts.filter(a => a.role === "super_admin").map(account => (
                  <form key={account.email} action={loginWithDemo}>
                    <input type="hidden" name="email" value={account.email} />
                    <button 
                      type="submit"
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                    >
                      <UserCircle2 className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{account.name}</div>
                        <div className="text-xs text-muted-foreground">{account.email}</div>
                      </div>
                    </button>
                  </form>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Building2 className="w-5 h-5" />
                <h2 className="font-semibold text-sm uppercase tracking-wider">Tenant Demo</h2>
              </div>
              <div className="space-y-3">
                {demoAccounts.filter(a => a.role !== "super_admin").map(account => (
                  <form key={account.email} action={loginWithDemo}>
                    <input type="hidden" name="email" value={account.email} />
                    <button 
                      type="submit"
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                    >
                      <UserCircle2 className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{account.name}</div>
                        <div className="text-xs text-muted-foreground">{account.role === "tenant_admin" ? "Admin" : "Staff"} &middot; {account.tenantName}</div>
                      </div>
                    </button>
                  </form>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[400px] rounded-xl border border-border bg-card p-6 shadow-sm">
            <form action={loginWithCredentials} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input 
                  id="password"
                  name="password"
                  type="password" 
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <button 
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2"
              >
                Sign In
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
