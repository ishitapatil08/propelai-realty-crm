"use server";

import { withTenant } from "@/db";
import { db } from "@/db";
import { tenants, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import * as mock from "./mock-data";
import { seedTenants } from "@/lib/mock-data";
import { PLAN_DETAILS } from "./plans";
export type { PlanInfo } from "./plans";

// ─── Upgrade Plan Server Action ───────────────────────────────────────────────

export async function upgradeTenantPlan(targetPlan: string) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  if (!PLAN_DETAILS[targetPlan]) throw new Error("Invalid plan selected.");

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const t = mock.MOCK_TENANTS_LIST.find((ten) => ten.id === tenantId);
    if (t) {
      t.plan = targetPlan;
      t.status = "Active";
    }
    const st = seedTenants.find((ten) => ten.id === tenantId);
    if (st) {
      st.plan = targetPlan;
      st.status = "active";
    }
    revalidatePath("/admin/settings");
    revalidatePath("/admin/dashboard");
    revalidatePath("/super-admin/tenants");
    return;
  }

  await withTenant(tenantId, async (tx) => {
    // 1. Update Tenant plan and activate if it was suspended
    await tx
      .update(tenants)
      .set({
        plan: targetPlan,
        status: "Active",
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, tenantId));

    // 2. Log activity
    await tx.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: "plan_upgraded",
      entityType: "tenant",
      entityId: tenantId,
      metadata: { newPlan: targetPlan, price: PLAN_DETAILS[targetPlan].price },
    });
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin/dashboard");
  revalidatePath("/super-admin/tenants");
}

// ─── Process Webhook Event ───────────────────────────────────────────────────

export async function processStripeWebhookEvent(event: {
  type: string;
  data: {
    object: {
      client_reference_id?: string;
      tenant_id?: string;
      plan_name?: string;
    };
  };
}) {
  const tenantId = event.data.object.client_reference_id || event.data.object.tenant_id;
  const planName = event.data.object.plan_name || "Growth";

  if (!tenantId) return;

  if (event.type === "checkout.session.completed") {
    await db
      .update(tenants)
      .set({ plan: planName, status: "Active", updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));
  } else if (
    event.type === "invoice.payment_failed" ||
    event.type === "customer.subscription.deleted"
  ) {
    await db
      .update(tenants)
      .set({ status: "Suspended", updatedAt: new Date() })
      .where(eq(tenants.id, tenantId));
  }
}
