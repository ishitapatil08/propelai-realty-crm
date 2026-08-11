import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/lib/auth/session";
import { getTenantLeads, getTenantStaff } from "@/lib/api/tenant-admin";
import { redirect } from "next/navigation";
import { LeadsTable } from "./LeadsTable";
import { AddLeadDialog } from "./AddLeadDialog";

export default async function LeadsPage() {
  const { tenantId } = await getSession();
  if (!tenantId) redirect("/login");

  const [leads, staffMembers] = await Promise.all([
    getTenantLeads(tenantId),
    getTenantStaff(tenantId),
  ]);

  const staffOptions = staffMembers.map((s) => ({ id: s.profileId, name: s.name }));

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Leads"
        description={`${leads.length} lead${leads.length !== 1 ? "s" : ""} in your pipeline.`}
        action={<AddLeadDialog staff={staffOptions} />}
      />
      <LeadsTable leads={leads} staff={staffOptions} />
    </div>
  );
}
