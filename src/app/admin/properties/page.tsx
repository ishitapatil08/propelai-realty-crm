import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/lib/auth/session";
import { getTenantProperties, getTenantLeads } from "@/lib/api/tenant-admin";
import { redirect } from "next/navigation";
import { PropertyManager } from "./PropertyManager";

export default async function PropertiesPage() {
  const { tenantId } = await getSession();
  if (!tenantId) redirect("/login");

  const [props, leadsList] = await Promise.all([
    getTenantProperties(tenantId),
    getTenantLeads(tenantId),
  ]);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Property Inventory & Catalog"
        description="Manage active listings, real estate projects, unit pricing, and lead matching."
      />

      <PropertyManager
        initialProperties={props as any}
        totalLeadsCount={leadsList.length}
      />
    </div>
  );
}
