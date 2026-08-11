import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/lib/auth/session";
import { getTenantDashboardKPIs } from "@/lib/api/tenant-admin";
import { getStaffLeaderboard } from "@/lib/api/staff-portal";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Funnel } from "@/components/ui/Funnel";

export default async function ReportsPage() {
  const { tenantId } = await getSession();
  if (!tenantId) redirect("/login");

  const [kpis, leaderboard] = await Promise.all([
    getTenantDashboardKPIs(tenantId),
    getStaffLeaderboard(tenantId),
  ]);

  // Convert status breakdown to funnel leads format
  const funnelLeads = kpis.statusBreakdown.flatMap((s) =>
    Array.from({ length: s.count }, () => ({ status: s.status }))
  ) as any;

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Reports & Analytics"
        description="Monitor lead conversion rates and team performance."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Funnel Chart Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-semibold text-lg">Lead Funnel</h3>
            <p className="text-sm text-muted-foreground">Conversion stages of all leads.</p>
          </div>
          <div className="flex items-center justify-center p-4">
            <Funnel leads={funnelLeads} />
          </div>
        </div>

        {/* Funnel Stats Table */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg">Funnel Efficiency</h3>
              <p className="text-sm text-muted-foreground">Conversion and drops per stage.</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">Total Leads</span>
                <span className="font-semibold tabular-nums">{kpis.totalLeads}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">Converted (Won)</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{kpis.wonLeads}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">Lost</span>
                <span className="font-semibold text-red-600 dark:text-red-400 tabular-nums">{kpis.lostLeads}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-muted-foreground">Average Conversion Rate</span>
                <span className="font-bold text-lg tabular-nums">{kpis.conversionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Leaderboard */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-lg">Team Leaderboard</h3>
          <p className="text-sm text-muted-foreground">Sales performance of staff members.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Name</TableHead>
              <TableHead className="text-right">Assigned Leads</TableHead>
              <TableHead className="text-right">Active/Contacted</TableHead>
              <TableHead className="text-right">Deals Won</TableHead>
              <TableHead className="text-right">Conversion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No staff activity recorded.
                </TableCell>
              </TableRow>
            ) : (
              leaderboard.map((row, index) => {
                const rate = row.total > 0 ? Math.round((row.won / row.total) * 100) : 0;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.total}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.contacted}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{row.won}</TableCell>
                    <TableCell className="text-right font-bold tabular-nums">{rate}%</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
