import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/lib/auth/session";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { PLAN_DETAILS } from "@/lib/api/plans";
import { PlanUpgradeButton } from "./PlanUpgradeButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Check, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { seedTenants } from "@/lib/mock-data";

export default async function SettingsPage() {
  const { tenantId } = await getSession();
  if (!tenantId) redirect("/login");

  let tenantRow: { name: string; plan: string; status: string } | null = null;

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const mockT = seedTenants.find((t) => t.id === tenantId);
    if (mockT) {
      tenantRow = {
        name: mockT.name,
        plan: mockT.plan,
        status: mockT.status === "active" ? "Active" : "Suspended",
      };
    }
  } else {
    const rows = await db
      .select({
        name: tenants.name,
        plan: tenants.plan,
        status: tenants.status,
      })
      .from(tenants)
      .where(eq(tenants.id, tenantId));
    if (rows.length > 0) {
      tenantRow = rows[0];
    }
  }

  const currentPlan = tenantRow?.plan ?? "Starter";

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Settings & Subscription"
        description="Manage your organization details, plan level, and billing."
      />

      {/* Current Organization Info */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{tenantRow?.name ?? "My Organization"}</h2>
            <StatusBadge status={tenantRow?.status ?? "Active"} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Current Tier: <span className="font-semibold text-foreground">{currentPlan}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Tenant Isolation Active</span>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(PLAN_DETAILS).map(([key, plan]) => {
            const isCurrent = currentPlan.toLowerCase() === key.toLowerCase();
            return (
              <div
                key={key}
                className={`rounded-xl border bg-card p-6 flex flex-col justify-between space-y-6 relative ${
                  plan.recommended
                    ? "border-primary shadow-md ring-1 ring-primary/20"
                    : "border-border"
                }`}
              >
                {plan.recommended && (
                  <Badge className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs">
                    Most Popular
                  </Badge>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold tabular-nums">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <PlanUpgradeButton planName={key} currentPlan={currentPlan} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
