import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getTenantsList } from "@/lib/api/super-admin";
import { TenantsTable } from "./TenantsTable";

export default async function TenantsPage() {
  const tenants = await getTenantsList();
  
  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Tenants"
        description="Manage all real estate companies using the platform."
        action={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Tenant
          </Button>
        }
      />
      <TenantsTable initialTenants={tenants} />
    </div>
  );
}
