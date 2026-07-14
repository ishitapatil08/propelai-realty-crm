import { BarChart3, Bot, Briefcase, Phone, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your tenant usage, leads, and AI performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Total Leads</h3>
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">12,450</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">+14% from last month</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Active Staff</h3>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">284</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">+5 new this week</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Conversion Rate</h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">4.2%</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">+1.1% from last month</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">AI Calls Made</h3>
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">4,209</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">1,240 hours saved</p>
        </div>
      </div>
      
      {/* Skeleton for future charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <div className="rounded-xl border border-border bg-card col-span-4 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Lead Growth</h3>
            <p className="text-sm text-muted-foreground">New leads acquired over time.</p>
          </div>
          <div className="h-[300px] w-full rounded-md bg-muted/30 shimmer"></div>
        </div>
        
        <div className="rounded-xl border border-border bg-card col-span-3 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Recent Activities</h3>
            <p className="text-sm text-muted-foreground">Latest actions across all tenants.</p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted/50 shimmer shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-muted/50 shimmer"></div>
                  <div className="h-2 w-1/2 rounded bg-muted/30 shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
