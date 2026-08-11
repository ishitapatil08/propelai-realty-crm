import Image from "next/image";
import Link from "next/link";
import { loginWithCredentials, signupWithCredentials } from "@/lib/auth/actions";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const resolvedSearchParams = await searchParams;

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
          <div className="mb-4">
            <BrandLogo size="lg" subtitle="Autonomous Real Estate OS" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome to PropelAI</h1>
          <p className="text-sm text-muted-foreground">
            Sign in or create your tenant account
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

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <form action={loginWithCredentials} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2"
                  >
                    Sign In
                  </button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <form action={signupWithCredentials} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium">Email Address</label>
                    <input 
                      id="register-email"
                      name="email"
                      type="email" 
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium">Password</label>
                    <input 
                      id="register-password"
                      name="password"
                      type="password" 
                      required
                      minLength={6}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2"
                  >
                    Create Account
                  </button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          {/* Demo Login Buttons */}
          {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Quick Demo Login</h3>
              <div className="space-y-3">
                <form action={loginWithCredentials}>
                  <input type="hidden" name="email" value="super@propelai.com" />
                  <input type="hidden" name="password" value="password123" />
                  <button type="submit" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Login as Super Admin (Platform)
                  </button>
                </form>
                <form action={loginWithCredentials}>
                  <input type="hidden" name="email" value="admin@tenant.com" />
                  <input type="hidden" name="password" value="password123" />
                  <button type="submit" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Login as Tenant Admin (Company)
                  </button>
                </form>
                <form action={loginWithCredentials}>
                  <input type="hidden" name="email" value="staff@tenant.com" />
                  <input type="hidden" name="password" value="password123" />
                  <button type="submit" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-border bg-card hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Login as Staff (Member)
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
