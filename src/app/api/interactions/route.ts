import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { addInteraction } from "@/lib/api/lead-actions";
import * as mock from "@/lib/api/mock-data";
import { withTenant } from "@/db";
import { interactions, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/interactions?leadId=xxx  — list interactions for a lead
export async function GET(req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leadId = req.nextUrl.searchParams.get("leadId");
  if (!leadId)
    return NextResponse.json({ error: "leadId query param is required" }, { status: 400 });

  // Demo mode
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return NextResponse.json({ interactions: mock.MOCK_INTERACTIONS }, { status: 200 });
  }

  try {
    const rows = await withTenant(tenantId, async (tx) =>
      tx
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
        .orderBy(desc(interactions.createdAt))
    );
    return NextResponse.json({ interactions: rows }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/interactions  — log a new interaction note for a lead
export async function POST(req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { leadId: string; note: string };

  if (!body.leadId || !body.note?.trim())
    return NextResponse.json({ error: "leadId and note are required" }, { status: 400 });

  try {
    const form = new FormData();
    form.set("leadId", body.leadId);
    form.set("note", body.note.trim());
    await addInteraction(form);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
