import { withTenant } from "@/db";
import {
  leads,
  profiles,
  staff,
  properties,
  aiCalls,
  visits,
  interactions,
} from "@/db/schema";
import { eq, count, desc, and } from "drizzle-orm";
import * as mock from "./mock-data";

/** All queries here run inside `withTenant()` so RLS is enforced automatically. */

export async function getTenantDashboardKPIs(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_TENANT_KPI;
  }

  return await withTenant(tenantId, async (tx) => {
    const [totalLeads, activeStaff, scheduledVisits, totalAiCalls] =
      await Promise.all([
        tx.select({ count: count() }).from(leads).where(eq(leads.tenantId, tenantId)),
        tx.select({ count: count() }).from(staff).where(eq(staff.tenantId, tenantId)),
        tx
          .select({ count: count() })
          .from(visits)
          .where(and(eq(visits.tenantId, tenantId), eq(visits.status, "Scheduled"))),
        tx.select({ count: count() }).from(aiCalls).where(eq(aiCalls.tenantId, tenantId)),
      ]);

    // Lead funnel breakdown
    const statusCounts = await tx
      .select({ status: leads.status, count: count() })
      .from(leads)
      .where(eq(leads.tenantId, tenantId))
      .groupBy(leads.status);

    const won = statusCounts.find((s) => s.status === "Won")?.count ?? 0;
    const lost = statusCounts.find((s) => s.status === "Lost")?.count ?? 0;
    const total = totalLeads[0].count;
    const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;

    return {
      totalLeads: total,
      activeStaff: activeStaff[0].count,
      scheduledVisits: scheduledVisits[0].count,
      totalAiCalls: totalAiCalls[0].count,
      wonLeads: won,
      lostLeads: lost,
      conversionRate,
      statusBreakdown: statusCounts,
    };
  });
}

export async function getTenantLeads(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_LEADS;
  }

  return await withTenant(tenantId, async (tx) => {
    const rows = await tx
      .select({
        id: leads.id,
        name: leads.name,
        phone: leads.phone,
        source: leads.source,
        budget: leads.budget,
        status: leads.status,
        score: leads.score,
        createdAt: leads.createdAt,
        assignedUserId: leads.assignedUserId,
        assignedName: profiles.name,
      })
      .from(leads)
      .leftJoin(profiles, eq(leads.assignedUserId, profiles.id))
      .where(eq(leads.tenantId, tenantId))
      .orderBy(desc(leads.createdAt));

    return rows;
  });
}

export async function getTenantStaff(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_STAFF;
  }

  return await withTenant(tenantId, async (tx) => {
    return await tx
      .select({
        id: staff.id,
        phone: staff.phone,
        createdAt: staff.createdAt,
        profileId: staff.profileId,
        name: profiles.name,
        title: profiles.title,
        role: profiles.role,
      })
      .from(staff)
      .leftJoin(profiles, eq(staff.profileId, profiles.id))
      .where(eq(staff.tenantId, tenantId))
      .orderBy(profiles.name);
  });
}

export async function getTenantProperties(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_PROPERTIES;
  }

  return await withTenant(tenantId, async (tx) => {
    return await tx
      .select()
      .from(properties)
      .where(eq(properties.tenantId, tenantId))
      .orderBy(desc(properties.createdAt));
  });
}

export async function getTenantAiCalls(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_AI_CALLS;
  }

  return await withTenant(tenantId, async (tx) => {
    return await tx
      .select({
        id: aiCalls.id,
        transcript: aiCalls.transcript,
        summary: aiCalls.summary,
        duration: aiCalls.duration,
        createdAt: aiCalls.createdAt,
        leadId: aiCalls.leadId,
        leadName: leads.name,
      })
      .from(aiCalls)
      .leftJoin(leads, eq(aiCalls.leadId, leads.id))
      .where(eq(aiCalls.tenantId, tenantId))
      .orderBy(desc(aiCalls.createdAt));
  });
}

export async function getLeadDetail(tenantId: string, leadId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const lead = mock.MOCK_LEADS.find(l => l.id === leadId) || mock.MOCK_LEADS[0];
    return {
      lead: {
        ...lead,
        updatedAt: lead.createdAt
      },
      interactions: mock.MOCK_INTERACTIONS
    };
  }

  return await withTenant(tenantId, async (tx) => {
    const [leadRow] = await tx
      .select({
        id: leads.id,
        name: leads.name,
        phone: leads.phone,
        source: leads.source,
        budget: leads.budget,
        status: leads.status,
        score: leads.score,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
        assignedUserId: leads.assignedUserId,
        assignedName: profiles.name,
      })
      .from(leads)
      .leftJoin(profiles, eq(leads.assignedUserId, profiles.id))
      .where(eq(leads.id, leadId));

    if (!leadRow) return null;

    // Alias profiles table for byUser join
    const interactionRows = await tx
      .select({
        id: interactions.id,
        note: interactions.note,
        createdAt: interactions.createdAt,
        byUserId: interactions.byUserId,
        byUserName: profiles.name,
      })
      .from(interactions)
      .leftJoin(profiles, eq(interactions.byUserId, profiles.id))
      .where(eq(interactions.leadId, leadId))
      .orderBy(desc(interactions.createdAt));

    return { lead: leadRow, interactions: interactionRows };
  });
}
