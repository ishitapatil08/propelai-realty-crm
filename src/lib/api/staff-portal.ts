import { withTenant } from "@/db";
import {
  leads,
  profiles,
  visits,
  properties,
  aiCalls,
} from "@/db/schema";
import { eq, and, desc, asc, or } from "drizzle-orm";
import * as mock from "./mock-data";

/**
 * All queries receive (tenantId, staffProfileId) and run inside withTenant()
 * so RLS is enforced AND results are filtered to the logged-in staff member.
 */

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────

export async function getStaffDashboardData(tenantId: string, profileId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const myLeads = mock.MOCK_LEADS.filter(l => l.assignedUserId === profileId);
    const myWonLeads = myLeads.filter(l => l.status === "Won");
    const myScheduledVisits = mock.MOCK_VISITS.filter(v => v.status === "Scheduled");

    return {
      myLeadsCount: myLeads.length,
      myScheduledVisits,
      todayVisitCount: 1, // Mock
      myAiCallsCount: mock.MOCK_AI_CALLS.length,
      myWonLeadsCount: myWonLeads.length,
      upcomingVisits: myScheduledVisits.slice(0, 3),
      recentAiCalls: mock.MOCK_AI_CALLS.slice(0, 3),
    };
  }

  return await withTenant(tenantId, async (tx) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 86400000);

    const [myLeads, myScheduledVisits, myAiCalls, myWonLeads] = await Promise.all([
      tx.select({ count: leads.id }).from(leads).where(eq(leads.assignedUserId, profileId)),
      tx
        .select({
          id: visits.id,
          scheduledAt: visits.scheduledAt,
          status: visits.status,
          leadName: leads.name,
          propertyName: properties.name,
        })
        .from(visits)
        .leftJoin(leads, eq(visits.leadId, leads.id))
        .leftJoin(properties, eq(visits.propertyId, properties.id))
        .where(and(eq(visits.tenantId, tenantId), eq(visits.status, "Scheduled")))
        .orderBy(asc(visits.scheduledAt)),
      tx.select({ count: aiCalls.id }).from(aiCalls).where(eq(aiCalls.tenantId, tenantId)),
      tx
        .select({ count: leads.id })
        .from(leads)
        .where(and(eq(leads.assignedUserId, profileId), eq(leads.status, "Won"))),
    ]);

    const todayVisits = myScheduledVisits.filter((v) => {
      const d = new Date(v.scheduledAt);
      return d >= startOfToday && d < endOfToday;
    });

    return {
      myLeadsCount: myLeads.length,
      myScheduledVisits,
      todayVisitCount: todayVisits.length,
      myAiCallsCount: myAiCalls.length,
      myWonLeadsCount: myWonLeads.length,
      upcomingVisits: myScheduledVisits.slice(0, 3),
      recentAiCalls: [] as typeof myAiCalls,
    };
  });
}

// ─── My Assigned Leads ────────────────────────────────────────────────────────

export async function getMyLeads(tenantId: string, profileId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_LEADS.filter(l => l.assignedUserId === profileId);
  }

  return await withTenant(tenantId, async (tx) => {
    return await tx
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
      })
      .from(leads)
      .where(eq(leads.assignedUserId, profileId))
      .orderBy(desc(leads.updatedAt));
  });
}

// ─── My Visits (Calendar) ─────────────────────────────────────────────────────

export async function getMyVisits(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_VISITS;
  }

  return await withTenant(tenantId, async (tx) => {
    return await tx
      .select({
        id: visits.id,
        scheduledAt: visits.scheduledAt,
        status: visits.status,
        leadId: visits.leadId,
        leadName: leads.name,
        leadPhone: leads.phone,
        propertyId: visits.propertyId,
        propertyName: properties.name,
        propertyLocation: properties.location,
      })
      .from(visits)
      .leftJoin(leads, eq(visits.leadId, leads.id))
      .leftJoin(properties, eq(visits.propertyId, properties.id))
      .where(eq(visits.tenantId, tenantId))
      .orderBy(asc(visits.scheduledAt));
  });
}

// ─── My AI Calls ──────────────────────────────────────────────────────────────

export async function getMyAiCalls(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_AI_CALLS;
  }

  return await withTenant(tenantId, async (tx) => {
    return await tx
      .select({
        id: aiCalls.id,
        summary: aiCalls.summary,
        transcript: aiCalls.transcript,
        duration: aiCalls.duration,
        createdAt: aiCalls.createdAt,
        leadName: leads.name,
        leadPhone: leads.phone,
      })
      .from(aiCalls)
      .leftJoin(leads, eq(aiCalls.leadId, leads.id))
      .where(eq(aiCalls.tenantId, tenantId))
      .orderBy(desc(aiCalls.createdAt));
  });
}

// ─── Leads Needing Follow-up (Tasks) ─────────────────────────────────────────

export async function getFollowUpLeads(tenantId: string, profileId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_LEADS.filter(
      l => l.assignedUserId === profileId && (l.status === "New" || l.status === "Contacted")
    );
  }

  return await withTenant(tenantId, async (tx) => {
    // Leads assigned to me that are in New or Contacted state
    return await tx
      .select({
        id: leads.id,
        name: leads.name,
        phone: leads.phone,
        status: leads.status,
        score: leads.score,
        source: leads.source,
        updatedAt: leads.updatedAt,
      })
      .from(leads)
      .where(
        and(
          eq(leads.assignedUserId, profileId),
          or(eq(leads.status, "New"), eq(leads.status, "Contacted"))
        )
      )
      .orderBy(desc(leads.score));
  });
}

// ─── Staff Leaderboard (for Reports) ─────────────────────────────────────────

export async function getStaffLeaderboard(tenantId: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mock.MOCK_STAFF_LEADERBOARD;
  }

  return await withTenant(tenantId, async (tx) => {
    const allStaffLeads = await tx
      .select({
        profileId: leads.assignedUserId,
        staffName: profiles.name,
        status: leads.status,
      })
      .from(leads)
      .leftJoin(profiles, eq(leads.assignedUserId, profiles.id))
      .where(and(eq(leads.tenantId, tenantId)));

    // Aggregate in JS
    const map: Record<string, { name: string; total: number; won: number; contacted: number }> = {};
    for (const row of allStaffLeads) {
      if (!row.profileId) continue;
      if (!map[row.profileId]) {
        map[row.profileId] = { name: row.staffName ?? "Unknown", total: 0, won: 0, contacted: 0 };
      }
      map[row.profileId].total++;
      if (row.status === "Won") map[row.profileId].won++;
      if (row.status === "Contacted" || row.status === "Qualified") map[row.profileId].contacted++;
    }

    return Object.values(map).sort((a, b) => b.won - a.won);
  });
}
