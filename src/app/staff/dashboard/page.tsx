import { Calendar, Phone, TrendingUp, Briefcase, Bot } from "lucide-react";

export default function StaffDashboard() {
  return (
    <div className="space-y-8 fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s assigned to you today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">My Leads</h3>
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">42</div>
          <p className="text-xs text-muted-foreground mt-1">12 new this week</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Calls Today</h3>
            <Phone className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">14</div>
          <p className="text-xs text-muted-foreground mt-1 text-amber-600 font-medium">4 left to make</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Visits Scheduled</h3>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">8</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">3 happening today</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Won Deals</h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold">3</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">This quarter</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Upcoming Tasks</h3>
              <p className="text-sm text-muted-foreground">Your schedule for the next 24 hours.</p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/20">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Site Visit with Client {i}</div>
                  <div className="text-xs text-muted-foreground">Today at {10 + i}:00 AM &middot; Property {String.fromCharCode(64 + i)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Recent AI Summaries</h3>
            <p className="text-sm text-muted-foreground">Calls handled by your AI agent.</p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg border border-border bg-muted/20">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Lead +91 987654321{i}</span>
                    <span className="text-xs text-muted-foreground">2 hrs ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Client is interested in the 3BHK layout but wants to confirm parking availability. Scheduled a callback for tomorrow.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
