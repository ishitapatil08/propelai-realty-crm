import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTenantProperties } from "@/lib/api/tenant-admin";
import { createPropertyAction } from "@/lib/api/property-actions";

// GET /api/properties  — list all properties for the calling tenant
export async function GET(_req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const properties = await getTenantProperties(tenantId);
    return NextResponse.json({ properties }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/properties  — create a new property listing
export async function POST(req: NextRequest) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json() as {
      name: string;
      location: string;
      price: number;
      type?: string;
      bhk?: string;
    };
    const result = await createPropertyAction(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
