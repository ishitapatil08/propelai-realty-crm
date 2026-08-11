import { PageHeader } from "@/components/layout/PageHeader";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { PLAN_DETAILS } from "@/lib/api/plans";
import { TrendingUp, Building, DollarSign, Activity } from "lucide-react";
import { MOCK_TENANTS_LIST } from "@/lib/api/mock-data";

export default async function RevenuePage() {
  let allTenants;
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    allTenants = MOCK_TENANTS_LIST;
  } else {
    allTenants = await db
      .select({ id: tenants.id, name: tenants.name, plan: tenants.plan, status: tenants.status, createdAt: tenants.createdAt })
      .from(tenants);
  }

  const activeTenants = allTenants.filter((t) => t.status === "Active");
  const mrr = activeTenants.reduce((sum, t) => sum + (PLAN_DETAILS[t.plan ?? "Starter"]?.price ?? 0), 0);
  const arr = mrr * 12;

  const planBreakdown = Object.entries(PLAN_DETAILS).map(([key, plan]) => {
    const count = activeTenants.filter((t) => (t.plan ?? "Starter") === key).length;
    return { name: key, count, revenue: count * plan.price };
  });

  // Simulate last 6 months of MRR growth based on tenant join dates
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleString("en-IN", { month: "short", year: "2-digit" }),
      tenantCount: allTenants.filter((t) => new Date(t.createdAt) <= d).length,
    };
  });

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Revenue & Growth"
        description="Monthly recurring revenue, ARR, and subscription performance."
      />

      {/* KPI Strip */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">MRR</p>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold tabular-nums">₹{mrr.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted-foreground mt-1">Monthly Recurring Revenue</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">ARR</p>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold tabular-nums">₹{(arr / 100000).toFixed(1)}L</p>
          <p className="text-xs text-muted-foreground mt-1">Annual Run Rate</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Active Tenants</p>
            <Building className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold tabular-nums">{activeTenants.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Paying accounts</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 stat-glow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">ARPU</p>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold tabular-nums">
            ₹{activeTenants.length > 0 ? Math.round(mrr / activeTenants.length).toLocaleString("en-IN") : "0"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Avg. Revenue Per User</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue by Plan */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            {planBreakdown.map((p) => {
              const pct = mrr > 0 ? Math.round((p.revenue / mrr) * 100) : 0;
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{p.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{p.count} tenants</span>
                      <span className="font-semibold tabular-nums">₹{p.revenue.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tenant Growth Timeline */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Tenant Growth (Last 6 Months)</h3>
          <div className="flex items-end gap-2 h-32">
            {months.map((m, i) => {
              const maxCount = Math.max(1, ...months.map((x) => x.tenantCount));
              const height = Math.round((m.tenantCount / maxCount) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium tabular-nums">{m.tenantCount}</span>
                  <div className="w-full rounded-t-sm bg-primary/80 transition-all duration-500" style={{ height: `${height}%` }} />
                  <span className="text-[10px] text-muted-foreground">{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
