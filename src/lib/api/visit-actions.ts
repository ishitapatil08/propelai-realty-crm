"use server";

import { withTenant } from "@/db";
import { visits, activityLogs } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import * as mock from "./mock-data";

export async function scheduleVisit(formData: FormData) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  const leadId = formData.get("leadId") as string;
  const propertyId = (formData.get("propertyId") as string) || null;
  const scheduledAtStr = formData.get("scheduledAt") as string;

  if (!leadId || !scheduledAtStr) {
    throw new Error("Lead and Scheduled Date/Time are required.");
  }

  const scheduledAt = new Date(scheduledAtStr);

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const lead = mock.MOCK_LEADS.find(l => l.id === leadId) || mock.MOCK_LEADS[0];
    const property = mock.MOCK_PROPERTIES.find(p => p.id === propertyId);
    
    const newVisit = {
      id: "v" + (mock.MOCK_VISITS.length + 1),
      scheduledAt,
      status: "Scheduled",
      leadId,
      leadName: lead.name,
      leadPhone: lead.phone,
      propertyId,
      propertyName: property?.name || null,
      propertyLocation: property?.location || null,
    };
    mock.MOCK_VISITS.push(newVisit);
    revalidatePath("/staff/calendar");
    revalidatePath("/admin/dashboard");
    return;
  }

  await withTenant(tenantId, async (tx) => {
    const [inserted] = await tx
      .insert(visits)
      .values({
        tenantId,
        leadId,
        propertyId,
        scheduledAt,
        status: "Scheduled",
      })
      .returning({ id: visits.id });

    await tx.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: "visit_scheduled",
      entityType: "visit",
      entityId: inserted.id,
      metadata: { leadId, propertyId, scheduledAt: scheduledAtStr },
    });
  });

  revalidatePath("/staff/calendar");
  revalidatePath("/admin/dashboard");
}
