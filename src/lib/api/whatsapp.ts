"use server";

import { withTenant } from "@/db";
import { leads, interactions, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import * as mock from "./mock-data";

export async function sendWhatsAppMessage(leadId: string, message: string) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  if (!message?.trim()) throw new Error("Message text cannot be empty.");

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const lead = mock.MOCK_LEADS.find((l) => l.id === leadId);
    const phone = lead?.phone ?? "";
    mock.MOCK_INTERACTIONS.unshift({
      id: "int" + (mock.MOCK_INTERACTIONS.length + 1),
      note: `WhatsApp Sent to ${phone}: "${message.trim()}"`,
      createdAt: new Date(),
      byUserId: user.id,
      byUserName: user.user_metadata?.name || "User",
    });
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath(`/staff/leads/${leadId}`);
    return;
  }

  await withTenant(tenantId, async (tx) => {
    // 1. Fetch lead details
    const [lead] = await tx.select({ name: leads.name, phone: leads.phone }).from(leads).where(eq(leads.id, leadId));
    if (!lead) throw new Error("Lead not found.");

    // 2. Log interaction note
    await tx.insert(interactions).values({
      tenantId,
      leadId,
      note: `WhatsApp Sent to ${lead.phone}: "${message.trim()}"`,
      byUserId: user.id,
    });

    // 3. Log to activity logs
    await tx.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: "whatsapp_sent",
      entityType: "lead",
      entityId: leadId,
      metadata: { phone: lead.phone, textSnippet: message.substring(0, 80) },
    });
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(`/staff/leads/${leadId}`);
}

export async function sendVisitReminderWhatsApp(leadId: string, scheduledAt: Date, propertyName?: string) {
  const formattedDate = new Date(scheduledAt).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const message = `Hi! This is a reminder for your upcoming site visit scheduled on ${formattedDate}${
    propertyName ? ` at ${propertyName}` : ""
  }. Please reply YES to confirm.`;

  return await sendWhatsAppMessage(leadId, message);
}
