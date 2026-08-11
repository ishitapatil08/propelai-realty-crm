"use server";

import { withTenant } from "@/db";
import { properties } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import * as mock from "./mock-data";

export async function createPropertyAction(data: {
  name: string;
  location: string;
  price: number;
  type?: string;
  bhk?: string;
}) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  if (!data.name?.trim()) throw new Error("Property name is required.");
  if (!data.price || data.price <= 0) throw new Error("Valid price is required.");

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const newProperty = {
      id: "p" + (mock.MOCK_PROPERTIES.length + 1),
      tenantId: tenantId,
      name: data.name.trim(),
      location: data.location.trim() || "Prime Location",
      price: Number(data.price),
      type: data.type || "Apartment",
      bhk: data.bhk || "3BHK",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mock.MOCK_PROPERTIES.unshift(newProperty as any);
    revalidatePath("/admin/properties");
    revalidatePath("/admin/dashboard");
    return { success: true, property: newProperty };
  }

  const [inserted] = await withTenant(tenantId, async (tx) => {
    return await tx
      .insert(properties)
      .values({
        tenantId,
        name: data.name.trim(),
        location: data.location.trim(),
        price: Number(data.price),
      })
      .returning();
  });

  revalidatePath("/admin/properties");
  revalidatePath("/admin/dashboard");
  return { success: true, property: inserted };
}
