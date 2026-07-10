import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../../lib/auth";
import { StatCard } from "../../../components/ui/StatCard";
import { Funnel } from "../../../components/ui/Funnel";
import { TrendingUp, Building2, Users, Phone } from "lucide-react";
import { PLAN_PRICE } from "../../../lib/types";

export const Route = createFileRoute("/_authenticated/super-admin/")({
  component: SuperAdminDashboard,
});

function SuperAdminDashboard() {
  const { tenants, users, leads } = useAuth();
  
  const activeT = tenants.filter((t) => t.status === "active");
  const mrr = activeT.reduce((sum, t) => sum + (PLAN_PRICE[t.plan] || 0), 0);
  
  return (
    <div>
      <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Platform overview</h1>
      <p style={{ color: "var(--slate)", marginTop: 4, marginBottom: 24 }}>Across every tenant workspace on PropelAI Realty OS.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Active tenants" value={activeT.length} sub={`${tenants.length} total`} icon={Building2} />
        <StatCard label="MRR" value={`₹${(mrr / 1000).toFixed(1)}K`} sub="from active plans" icon={TrendingUp} />
        <StatCard label="Users" value={users.filter((u) => u.role !== "super_admin").length} icon={Users} />
        <StatCard label="Leads in system" value={leads.length} icon={Phone} />
      </div>
      <Funnel leads={leads} />
    </div>
  );
}
