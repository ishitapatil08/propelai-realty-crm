import { PageHeader } from "@/components/layout/PageHeader";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { PLAN_DETAILS } from "@/lib/api/plans";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Users } from "lucide-react";
import { MOCK_TENANTS_LIST } from "@/lib/api/mock-data";

export default async function PlansPage() {
  let allTenants;
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    allTenants = MOCK_TENANTS_LIST;
  } else {
    allTenants = await db
      .select({ id: tenants.id, name: tenants.name, plan: tenants.plan, status: tenants.status })
      .from(tenants);
  }

  // Aggregate tenants per plan
  const planCounts: Record<string, number> = {};
  for (const t of allTenants) {
    const p = t.plan ?? "Starter";
    planCounts[p] = (planCounts[p] ?? 0) + 1;
  }

  const totalMRR = allTenants.reduce((sum, t) => {
    const plan = t.plan ?? "Starter";
    return sum + (PLAN_DETAILS[plan]?.price ?? 0);
  }, 0);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Plans & Pricing"
        description="Overview of subscription tiers and tenant distribution."
      />

      {/* MRR Summary */}
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Monthly Recurring Revenue (MRR)</p>
          <p className="text-3xl font-bold tabular-nums mt-1">
            ₹{totalMRR.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{allTenants.length} active tenants</span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(PLAN_DETAILS).map(([key, plan]) => {
          const count = planCounts[key] ?? 0;
          const revenue = count * plan.price;
          return (
            <div
              key={key}
              className={`rounded-xl border bg-card p-6 space-y-4 relative ${
                plan.recommended
                  ? "border-primary ring-1 ring-primary/20 shadow-md"
                  : "border-border"
              }`}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs">
                  Most Popular
                </Badge>
              )}
              <div>
                <h4 className="text-lg font-bold">{plan.name}</h4>
                <p className="text-2xl font-bold tabular-nums mt-1">
                  ₹{plan.price.toLocaleString("en-IN")}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active tenants</span>
                <span className="font-semibold">{count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan revenue</span>
                <span className="font-semibold tabular-nums">₹{revenue.toLocaleString("en-IN")}</span>
              </div>

              <ul className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Tenant list by plan */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold">All Tenants by Subscription</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Monthly Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTenants.map((t) => {
              const planInfo = PLAN_DETAILS[t.plan ?? "Starter"];
              return (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>
                    <Badge variant={t.plan === "Enterprise" ? "default" : "secondary"}>
                      {t.plan ?? "Starter"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.status === "Active" ? "default" : "destructive"}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    ₹{(planInfo?.price ?? 0).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
