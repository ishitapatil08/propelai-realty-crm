import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../../../lib/auth";
import { StatCard } from "../../../../components/ui/StatCard";
import { Funnel } from "../../../../components/ui/Funnel";
import { TrendingUp, Phone, Briefcase, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/tenant-admin/")({
  component: TenantAdminDashboard,
});

function TenantAdminDashboard() {
  const { currentUser, tenants, leads: allLeads, users: allUsers } = useAuth();
  const tenant = currentUser?.tenantId ? tenants.find((t) => t.id === currentUser.tenantId) || null : null;
  const leads = allLeads.filter(l => l.tenantId === tenant?.id);
  const staff = allUsers.filter(u => u.tenantId === tenant?.id);

  const won = leads.filter((l) => l.status === "Won").length;
  const conv = leads.length ? Math.round((won / leads.length) * 100) : 0;
  
  return (
    <div>
      <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>{tenant?.name} — Dashboard</h1>
      <p style={{ color: "var(--slate)", marginTop: 4, marginBottom: 24 }}>{tenant?.plan} plan · team-wide view</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Total leads" value={leads.length} icon={Phone} />
        <StatCard label="Won deals" value={won} icon={Briefcase} />
        <StatCard label="Conversion" value={`${conv}%`} icon={TrendingUp} />
        <StatCard label="Staff" value={staff.length} icon={Users} />
      </div>
      <Funnel leads={leads} />
    </div>
  );
}
