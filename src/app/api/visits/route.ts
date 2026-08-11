import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as mock from "@/lib/api/mock-data";
import { withTenant } from "@/db";
import { visits, leads, properties } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/visits  — list site visits for the calling tenant
export async function GET(_req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Demo mode — return mock data
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return NextResponse.json({ visits: mock.MOCK_VISITS }, { status: 200 });
  }

  try {
    const rows = await withTenant(tenantId, async (tx) =>
      tx
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
        .orderBy(desc(visits.scheduledAt))
    );
    return NextResponse.json({ visits: rows }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/visits  — schedule a new site visit
export async function POST(req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    leadId: string;
    propertyId?: string;
    scheduledAt: string;
  };

  if (!body.leadId || !body.scheduledAt)
    return NextResponse.json({ error: "leadId and scheduledAt are required" }, { status: 400 });

  // Demo mode
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const lead = mock.MOCK_LEADS.find((l) => l.id === body.leadId);
    const property = mock.MOCK_PROPERTIES.find((p) => p.id === body.propertyId);
    const newVisit: mock.MockVisit = {
      id: "v" + (mock.MOCK_VISITS.length + 1),
      scheduledAt: new Date(body.scheduledAt),
      status: "Scheduled",
      leadId: body.leadId,
      leadName: lead?.name ?? "Unknown",
      leadPhone: lead?.phone ?? "",
      propertyId: body.propertyId ?? null,
      propertyName: property?.name ?? null,
      propertyLocation: property?.location ?? null,
    };
    mock.MOCK_VISITS.push(newVisit);
    return NextResponse.json({ success: true, visit: newVisit }, { status: 201 });
  }

  try {
    const [inserted] = await withTenant(tenantId, async (tx) =>
      tx
        .insert(visits)
        .values({
          tenantId,
          leadId: body.leadId,
          propertyId: body.propertyId ?? null,
          scheduledAt: new Date(body.scheduledAt),
          status: "Scheduled",
        })
        .returning()
    );
    return NextResponse.json({ success: true, visit: inserted }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
