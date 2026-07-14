import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Bot, CheckCircle2, Shield, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image 
                src="/logo.png" 
                alt="PropelAI Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">PropelAI Realty OS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-24 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Phase 1: Multi-tenant CRM MVP is live
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mb-6 fade-in-up delay-100">
              The AI-Powered CRM for <br className="hidden md:inline" />
              <span className="propel-gradient-text">Modern Real Estate Teams</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 fade-in-up delay-200">
              Manage leads, schedule site visits, and close deals faster with our unified platform. Built for scale, designed for speed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto fade-in-up delay-300">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-colors focus-visible:outline-none bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 h-12 px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#features" 
                className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-colors focus-visible:outline-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8"
              >
                View Features
              </Link>
            </div>
            
            {/* Dashboard Preview Mockup */}
            <div className="mt-20 w-full max-w-5xl rounded-2xl border border-border bg-card shadow-2xl p-2 fade-in-up delay-500 overflow-hidden">
              <div className="rounded-xl overflow-hidden border border-border bg-background aspect-video relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Enterprise-Grade Security</h3>
                  <p className="text-sm text-muted-foreground mt-2">Row Level Security & Tenant Isolation Built-in</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to scale</h2>
              <p className="mt-4 text-lg text-muted-foreground">Purpose-built tools for real estate professionals.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Lead Management", desc: "Track leads from multiple sources in one unified pipeline.", icon: Users },
                { title: "AI Calling (Coming Soon)", desc: "Automate initial lead qualification with our AI voice agents.", icon: Bot },
                { title: "Advanced Analytics", desc: "Track conversion rates, team performance, and revenue.", icon: BarChart3 },
              ].map((feature, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 stat-glow transition-all">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-8 h-8">
                  <Image 
                    src="/logo.png" 
                    alt="PropelAI Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-xl tracking-tight">PropelAI Realty OS</span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                The next-generation CRM built specifically for the real estate industry. Powering modern teams with AI and automation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PropelAI Realty OS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
