import { Calendar, Phone, TrendingUp, Briefcase, Bot } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getStaffDashboardData, getMyAiCalls } from "@/lib/api/staff-portal";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";

export default async function StaffDashboard() {
  const { tenantId, user } = await getSession();
  if (!tenantId || !user) redirect("/login");

  const [dashboardData, allCalls] = await Promise.all([
    getStaffDashboardData(tenantId, user.id),
    getMyAiCalls(tenantId),
  ]);

  const recentCalls = allCalls.slice(0, 3);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Welcome back"
        description="Here's what's assigned to you today."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="My Leads"
          value={dashboardData.myLeadsCount.toString()}
          sub="Assigned leads"
          subTone="neutral"
          icon={Phone}
        />
        <KpiCard
          label="AI Calls"
          value={dashboardData.myAiCallsCount.toString()}
          sub="Automated outreach"
          subTone="neutral"
          icon={Bot}
        />
        <KpiCard
          label="Visits Scheduled"
          value={dashboardData.myScheduledVisits.length.toString()}
          sub={`${dashboardData.todayVisitCount} happening today`}
          subTone="positive"
          icon={Calendar}
        />
        <KpiCard
          label="Won Deals"
          value={dashboardData.myWonLeadsCount.toString()}
          sub="Converted leads"
          subTone="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Upcoming Visits</h3>
              <p className="text-sm text-muted-foreground">Your scheduled site visits.</p>
            </div>
          </div>
          <div className="space-y-3">
            {dashboardData.upcomingVisits.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No upcoming visits scheduled.
              </p>
            ) : (
              dashboardData.upcomingVisits.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/20"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      Site Visit: {v.leadName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {new Date(v.scheduledAt).toLocaleString()} &middot;{" "}
                      {v.propertyName ?? "No Property Selected"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Recent AI Summaries</h3>
            <p className="text-sm text-muted-foreground">Calls handled by your AI agent.</p>
          </div>
          <div className="space-y-3">
            {recentCalls.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No recent AI calls.
              </p>
            ) : (
              recentCalls.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border bg-muted/20"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">
                        Lead: {c.leadName}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {c.summary ?? "No summary available."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
