import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Phone,
  Users,
  CalendarCheck,
  Bot,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getTenantDashboardKPIs, getTenantLeads } from "@/lib/api/tenant-admin";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreRing } from "@/components/ui/ScoreRing";

export default async function DashboardPage() {
  const { tenantId } = await getSession();
  if (!tenantId) redirect("/login");

  const [kpis, recentLeads] = await Promise.all([
    getTenantDashboardKPIs(tenantId),
    getTenantLeads(tenantId),
  ]);

  const latestLeads = recentLeads.slice(0, 5);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Dashboard"
        description="Your tenant's performance at a glance."
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Leads"
          value={kpis.totalLeads.toString()}
          sub={`${kpis.wonLeads} won · ${kpis.lostLeads} lost`}
          subTone="neutral"
          icon={Phone}
        />
        <KpiCard
          label="Active Staff"
          value={kpis.activeStaff.toString()}
          sub="Team members"
          subTone="neutral"
          icon={Users}
        />
        <KpiCard
          label="Visits Scheduled"
          value={kpis.scheduledVisits.toString()}
          sub="Upcoming site visits"
          subTone="positive"
          icon={CalendarCheck}
        />
        <KpiCard
          label="AI Calls Made"
          value={kpis.totalAiCalls.toString()}
          sub="Automated outreach"
          subTone="neutral"
          icon={Bot}
        />
      </div>

      {/* Conversion + Funnel Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Conversion Rate"
          value={`${kpis.conversionRate}%`}
          sub="Leads → Won"
          subTone={kpis.conversionRate > 20 ? "positive" : "warning"}
          icon={TrendingUp}
        />
        <KpiCard
          label="Deals Won"
          value={kpis.wonLeads.toString()}
          sub="All time"
          subTone="positive"
          icon={Trophy}
        />
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Lead Funnel
          </h3>
          <div className="space-y-2">
            {kpis.statusBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              kpis.statusBreakdown.map((s) => (
                <div key={s.status} className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <span className="ml-auto font-semibold tabular-nums text-sm">
                    {s.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold">Recent Leads</h3>
          <p className="text-sm text-muted-foreground">Latest 5 leads added.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No leads yet. Add your first lead!
                </TableCell>
              </TableRow>
            ) : (
              latestLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.source ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ScoreRing score={lead.score ?? 0} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.assignedName ?? "Unassigned"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
