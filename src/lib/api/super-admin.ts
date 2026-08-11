"use server";

import { db } from "@/db";
import { tenants, profiles, staff, leads, aiCalls, activityLogs } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import * as mock from "./mock-data";

export async function getPlatformKPIs() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_PLATFORM_KPI;
  }

  const [
    totalTenantsRes,
    totalAdminsRes,
    totalStaffRes,
    totalLeadsRes,
    activeTenantsRes,
    aiCallsRes,
  ] = await Promise.all([
    db.select({ count: count() }).from(tenants),
    db.select({ count: count() }).from(profiles).where(eq(profiles.role, 'tenant_admin')),
    db.select({ count: count() }).from(staff),
    db.select({ count: count() }).from(leads),
    db.select({ count: count() }).from(tenants).where(eq(tenants.status, 'Active')),
    db.select({ count: count() }).from(aiCalls),
  ]);

  return {
    totalTenants: totalTenantsRes[0].count,
    activeTenants: activeTenantsRes[0].count,
    trialTenants: 0, 
    totalAdmins: totalAdminsRes[0].count,
    totalStaff: totalStaffRes[0].count,
    totalLeads: totalLeadsRes[0].count,
    aiCallsToday: aiCallsRes[0].count,
    monthlyRevenue: 0, 
    activeSubscriptions: 0,
    pendingPayments: 0,
  };
}

export async function getTenantsList() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_TENANTS_LIST;
  }

  const allTenants = await db.select({
    id: tenants.id,
    name: tenants.name,
    status: tenants.status,
    plan: tenants.plan,
    createdAt: tenants.createdAt,
  }).from(tenants);

  const adminsCounts = await db.select({
    tenantId: profiles.tenantId,
    count: count(),
  }).from(profiles).where(eq(profiles.role, 'tenant_admin')).groupBy(profiles.tenantId);

  return allTenants.map(t => {
    const adminCount = adminsCounts.find(a => a.tenantId === t.id)?.count || 0;
    return {
      ...t,
      admins: adminCount,
      mrr: 0, // Mock for now
    };
  });
}

export async function suspendTenant(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const t = mock.MOCK_TENANTS_LIST.find(ten => ten.id === tenantId);
    if (t) t.status = 'Suspended';
    revalidatePath('/super-admin/tenants');
    return;
  }

  await db.update(tenants).set({ status: 'Suspended' }).where(eq(tenants.id, tenantId));
  revalidatePath('/super-admin/tenants');
}

export async function activateTenant(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const t = mock.MOCK_TENANTS_LIST.find(ten => ten.id === tenantId);
    if (t) t.status = 'Active';
    revalidatePath('/super-admin/tenants');
    return;
  }

  await db.update(tenants).set({ status: 'Active' }).where(eq(tenants.id, tenantId));
  revalidatePath('/super-admin/tenants');
}

/** Sets a 1-hour cookie so Super Admin can browse the /admin portal as a given tenant. */
export async function impersonateTenant(tenantId: string) {
  const { user, role } = await getSession();
  if (!user || role !== 'super_admin') throw new Error('Unauthorized');

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const cookieStore = await cookies();
    cookieStore.set('impersonated_tenant_id', tenantId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    redirect('/admin/dashboard');
  }

  // Log impersonation start
  await db.insert(activityLogs).values({
    tenantId,
    userId: user.id,
    action: 'impersonation_start',
    metadata: { impersonatedTenantId: tenantId, superAdminId: user.id },
  });

  const cookieStore = await cookies();
  cookieStore.set('impersonated_tenant_id', tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  redirect('/admin/dashboard');
}

/** Clears the impersonation cookie and returns to Super Admin dashboard. */
export async function exitImpersonation() {
  const { user } = await getSession();
  const cookieStore = await cookies();
  const tenantId = cookieStore.get('impersonated_tenant_id')?.value;

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    cookieStore.delete('impersonated_tenant_id');
    redirect('/super-admin/tenants');
  }

  if (user && tenantId) {
    await db.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: 'impersonation_end',
      metadata: { impersonatedTenantId: tenantId, superAdminId: user.id },
    });
  }

  cookieStore.delete('impersonated_tenant_id');
  redirect('/super-admin/tenants');
}
