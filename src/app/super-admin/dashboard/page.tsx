import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { 
  Building2, CheckCircle2, Clock, ShieldCheck, Users, 
  Phone, Bot, DollarSign, CreditCard, Activity, Server
} from "lucide-react";
import { getPlatformKPIs } from "@/lib/api/super-admin";

export default async function AdminDashboard() {
  const kpis = await getPlatformKPIs();

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Platform Overview"
        description="Monitor your tenant usage, leads, and AI performance."
      />

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-4">Tenants & Users</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Tenants" value={kpis.totalTenants.toString()} sub="All time" subTone="neutral" icon={Building2} />
            <KpiCard label="Active Tenants" value={kpis.activeTenants.toString()} sub="Currently active" subTone="positive" icon={CheckCircle2} />
            <KpiCard label="Trial Accounts" value={kpis.trialTenants.toString()} sub="Ending soon" subTone="warning" icon={Clock} />
            <KpiCard label="Total Admins" value={kpis.totalAdmins.toString()} sub="Across all tenants" subTone="neutral" icon={ShieldCheck} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-4">Usage & Revenue</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Staff" value={kpis.totalStaff.toString()} sub="System wide" subTone="neutral" icon={Users} />
            <KpiCard label="Total Leads" value={kpis.totalLeads.toString()} sub="System wide" subTone="neutral" icon={Phone} />
            <KpiCard label="AI Calls Today" value={kpis.aiCallsToday.toString()} sub="Total AI calls" subTone="neutral" icon={Bot} />
            <KpiCard label="Monthly Rev (MRR)" value={`$${kpis.monthlyRevenue}`} sub="From active plans" subTone="positive" icon={DollarSign} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-4">Health & System</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Active Subscriptions" value={kpis.activeSubscriptions.toString()} sub="Subscribed tenants" subTone="positive" icon={CreditCard} />
            <KpiCard label="Pending Payments" value={kpis.pendingPayments.toString()} sub="Outstanding" subTone="negative" icon={Clock} />
            <KpiCard label="API Usage" value="0" sub="Under limit" subTone="positive" icon={Activity} />
            <KpiCard label="System Health" value="100%" sub="All systems operational" subTone="positive" icon={Server} />
          </div>
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
