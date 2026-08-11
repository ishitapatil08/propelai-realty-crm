import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ImpersonationBanner } from "@/components/layout/ImpersonationBanner";
import { cookies } from "next/headers";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedTenants } from "@/lib/mock-data";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const impersonatedTenantId = cookieStore.get("impersonated_tenant_id")?.value;

  let impersonatedTenantName: string | null = null;
  if (impersonatedTenantId) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      const mockTenant = seedTenants.find(t => t.id === impersonatedTenantId);
      impersonatedTenantName = mockTenant?.name ?? null;
    } else {
      const result = await db.select({ name: tenants.name }).from(tenants).where(eq(tenants.id, impersonatedTenantId));
      impersonatedTenantName = result[0]?.name ?? null;
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {impersonatedTenantName && (
        <ImpersonationBanner tenantName={impersonatedTenantName} />
      )}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8 propel-scroll">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
