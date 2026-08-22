import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAuthorizedSuperAdminEmail } from "./constants";

export async function getSession() {
  const cookieStore = await cookies();

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const demoUser = cookieStore.get('demo_user')?.value;
    if (demoUser) {
      let role: "super_admin" | "tenant_admin" | "staff" | null = null;
      let tenantId: string | null = null;
      let name = "";

      if (isAuthorizedSuperAdminEmail(demoUser)) {
        role = "super_admin";
        tenantId = null;
        name = demoUser.includes("ishita") ? "Ishita Patil" : demoUser.includes("rujut") ? "Rujut Patil" : "Super Admin";
      } else if (demoUser === "admin@tenant.com" || demoUser === "priya@skylinerealty.com") {
        role = "tenant_admin";
        tenantId = "t1";
        name = "Priya Shah";
      } else if (demoUser === "staff@tenant.com" || demoUser === "rohan@skylinerealty.com") {
        role = "staff";
        tenantId = "t1";
        name = "Rohan Verma";
      }

      if (role) {
        // Handle Impersonation
        if (role === 'super_admin') {
          const impersonatedTenantId = cookieStore.get('impersonated_tenant_id')?.value;
          if (impersonatedTenantId) {
            tenantId = impersonatedTenantId;
          }
        }

        return {
          user: {
            id: isAuthorizedSuperAdminEmail(demoUser) ? "d1" : demoUser === "admin@tenant.com" || demoUser === "priya@skylinerealty.com" ? "d2" : "d3",
            email: demoUser,
            user_metadata: { name },
          } as any,
          role,
          tenantId,
        };
      }
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  let user = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const { data } = await supabase.auth.getUser();
    clearTimeout(timeout);
    user = data.user;
  } catch {
    // Ignore fetch error (network timeout, offline Supabase, etc.)
  }

  if (!user) {
    return { user: null, role: null, tenantId: null };
  }

  const profile = await db.select({
    role: profiles.role,
    tenantId: profiles.tenantId,
  }).from(profiles).where(eq(profiles.id, user.id));

  let role = profile[0]?.role;
  let tenantId = profile[0]?.tenantId;

  // Security Lock: If role is super_admin, verify email is strictly authorized
  if (role === "super_admin") {
    if (!isAuthorizedSuperAdminEmail(user.email)) {
      // Demote unauthorized super_admin attempt
      role = "tenant_admin";
    }
  }

  // Handle Impersonation
  if (role === 'super_admin') {
    const impersonatedTenantId = cookieStore.get('impersonated_tenant_id')?.value;
    if (impersonatedTenantId) {
      tenantId = impersonatedTenantId;
    }
  }

  return { user, role, tenantId };
}
