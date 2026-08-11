import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTenantLeads } from "@/lib/api/tenant-admin";
import { createLead } from "@/lib/api/lead-actions";

// GET /api/leads  — list all leads for the calling tenant
export async function GET(_req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const leads = await getTenantLeads(tenantId);
    return NextResponse.json({ leads }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/leads  — create a new lead (JSON body)
export async function POST(req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const form = new FormData();
    Object.entries(body).forEach(([k, v]) => {
      if (v !== null && v !== undefined) form.set(k, String(v));
    });
    await createLead(form);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
