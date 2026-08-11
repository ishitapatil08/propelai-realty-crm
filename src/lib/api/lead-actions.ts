"use server";

import { withTenant } from "@/db";
import { leads, interactions, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import * as mock from "./mock-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Visit Scheduled"
  | "Won"
  | "Lost";

// ─── Create Lead ──────────────────────────────────────────────────────────────

export async function createLead(formData: FormData) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const source = (formData.get("source") as string) || null;
  const budgetRaw = formData.get("budget") as string;
  const budget = budgetRaw ? parseInt(budgetRaw, 10) : null;
  const assignedUserId = (formData.get("assignedUserId") as string) || null;

  if (!name?.trim() || !phone?.trim()) {
    throw new Error("Name and phone are required.");
  }

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const newLead = {
      id: "l" + (mock.MOCK_LEADS.length + 1),
      name: name.trim(),
      phone: phone.trim(),
      source,
      budget,
      status: "New" as const,
      score: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedUserId,
      assignedName: mock.MOCK_STAFF.find(s => s.profileId === assignedUserId)?.name || "Unassigned"
    };
    mock.MOCK_LEADS.unshift(newLead);
    revalidatePath("/admin/leads");
    return;
  }

  await withTenant(tenantId, async (tx) => {
    const [inserted] = await tx
      .insert(leads)
      .values({
        tenantId,
        name: name.trim(),
        phone: phone.trim(),
        source,
        budget,
        assignedUserId,
        status: "New",
        score: 50,
      })
      .returning({ id: leads.id });

    await tx.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: "lead_created",
      entityType: "lead",
      entityId: inserted.id,
      metadata: { name, phone },
    });
  });

  revalidatePath("/admin/leads");
}

// ─── Update Status ────────────────────────────────────────────────────────────

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const lead = mock.MOCK_LEADS.find(l => l.id === leadId);
    if (lead) {
      lead.status = status;
      lead.updatedAt = new Date();
    }
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);
    return;
  }

  await withTenant(tenantId, async (tx) => {
    await tx
      .update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.id, leadId));

    await tx.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: "lead_status_updated",
      entityType: "lead",
      entityId: leadId,
      metadata: { newStatus: status },
    });
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

// ─── Reassign Lead ────────────────────────────────────────────────────────────

export async function reassignLead(leadId: string, assignedUserId: string | null) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const lead = mock.MOCK_LEADS.find(l => l.id === leadId);
    if (lead) {
      lead.assignedUserId = assignedUserId;
      lead.assignedName = mock.MOCK_STAFF.find(s => s.profileId === assignedUserId)?.name || null;
      lead.updatedAt = new Date();
    }
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);
    return;
  }

  await withTenant(tenantId, async (tx) => {
    await tx
      .update(leads)
      .set({ assignedUserId, updatedAt: new Date() })
      .where(eq(leads.id, leadId));

    await tx.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: "lead_reassigned",
      entityType: "lead",
      entityId: leadId,
      metadata: { assignedUserId },
    });
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

// ─── Add Interaction ──────────────────────────────────────────────────────────

export async function addInteraction(leadId: string, note: string) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");
  if (!note?.trim()) throw new Error("Note cannot be empty.");

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const newInt = {
      id: "int" + (mock.MOCK_INTERACTIONS.length + 1),
      note: note.trim(),
      createdAt: new Date(),
      byUserId: user.id,
      byUserName: user.user_metadata?.name || "User",
    };
    mock.MOCK_INTERACTIONS.unshift(newInt);
    revalidatePath(`/admin/leads/${leadId}`);
    return;
  }

  await withTenant(tenantId, async (tx) => {
    await tx.insert(interactions).values({
      tenantId,
      leadId,
      note: note.trim(),
      byUserId: user.id,
    });

    await tx.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: "interaction_added",
      entityType: "lead",
      entityId: leadId,
      metadata: { note: note.substring(0, 100) },
    });
  });

  revalidatePath(`/admin/leads/${leadId}`);
}

// ─── Update Lead Score ────────────────────────────────────────────────────────

export async function updateLeadScore(leadId: string, score: number) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  const clamped = Math.min(100, Math.max(0, score));

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const lead = mock.MOCK_LEADS.find(l => l.id === leadId);
    if (lead) {
      lead.score = clamped;
      lead.updatedAt = new Date();
    }
    revalidatePath(`/admin/leads/${leadId}`);
    return;
  }

  await withTenant(tenantId, async (tx) => {
    await tx
      .update(leads)
      .set({ score: clamped, updatedAt: new Date() })
      .where(eq(leads.id, leadId));
  });

  revalidatePath(`/admin/leads/${leadId}`);
}
