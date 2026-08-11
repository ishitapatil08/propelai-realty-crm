import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTenantDashboardKPIs } from "@/lib/api/tenant-admin";
import { getStaffLeaderboard } from "@/lib/api/staff-portal";

// GET /api/dashboard/stats
// Returns KPI metrics and team leaderboard in a single call for the dashboard.
export async function GET(_req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [kpis, leaderboard] = await Promise.all([
      getTenantDashboardKPIs(tenantId),
      getStaffLeaderboard(tenantId),
    ]);

    return NextResponse.json(
      {
        kpis: {
          totalLeads: kpis.totalLeads,
          activeStaff: kpis.activeStaff,
          scheduledVisits: kpis.scheduledVisits,
          totalAiCalls: kpis.totalAiCalls,
          wonLeads: kpis.wonLeads,
          lostLeads: kpis.lostLeads,
          conversionRate: kpis.conversionRate,
          statusBreakdown: kpis.statusBreakdown,
        },
        leaderboard,
        fetchedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
