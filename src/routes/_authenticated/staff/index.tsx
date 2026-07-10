import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../../../lib/auth";
import { StatCard } from "../../../../components/ui/StatCard";
import { Funnel } from "../../../../components/ui/Funnel";
import { TrendingUp, Phone, Briefcase } from "lucide-react";

export const Route = createFileRoute("/_authenticated/staff/")({
  component: StaffDashboard,
});

function StaffDashboard() {
  const { currentUser, leads: allLeads } = useAuth();
  const leads = allLeads.filter(l => l.assignedUserId === currentUser?.id);

  const scheduled = leads.filter((l) => l.status === "Visit Scheduled").length;
  const won = leads.filter((l) => l.status === "Won").length;
  
  return (
    <div>
      <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Welcome back, {currentUser?.name.split(" ")[0]}</h1>
      <p style={{ color: "var(--slate)", marginTop: 4, marginBottom: 24 }}>Here's what's assigned to you today.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Assigned leads" value={leads.length} icon={Phone} />
        <StatCard label="Visits scheduled" value={scheduled} icon={Briefcase} />
        <StatCard label="Won" value={won} icon={TrendingUp} />
      </div>
      <Funnel leads={leads} />
    </div>
  );
}
