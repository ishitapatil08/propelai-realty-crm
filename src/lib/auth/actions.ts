"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isAuthorizedSuperAdminEmail } from "./constants";
import { db } from "@/db";
import { profiles, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const emailLower = email?.trim().toLowerCase();

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const demoEmails = [
      "super@propelai.com", "alex@propelai.com",
      "ishitapatil088@gmail.com", "rujutpatil8975@gmail.com",
      "admin@tenant.com", "priya@skylinerealty.com",
      "staff@tenant.com", "rohan@skylinerealty.com"
    ];
    if (demoEmails.includes(emailLower)) {
      const cookieStore = await cookies();
      cookieStore.set("demo_user", emailLower, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      if (isAuthorizedSuperAdminEmail(emailLower)) {
        return redirect("/super-admin/dashboard");
      } else if (emailLower === "admin@tenant.com" || emailLower === "priya@skylinerealty.com") {
        return redirect("/admin/dashboard");
      } else if (emailLower === "staff@tenant.com" || emailLower === "rohan@skylinerealty.com") {
        return redirect("/staff/dashboard");
      }
    }
  }

  const supabase = await createClient();

  let error = null;
  let authData = null;
  try {
    const res = await supabase.auth.signInWithPassword({
      email: emailLower,
      password,
    });
    error = res.error;
    authData = res.data;
  } catch (e: any) {
    error = { message: e.message || "Failed to connect to authentication server" };
  }

  if (error || !authData?.user) {
    return redirect(`/login?error=${encodeURIComponent(error?.message || "Invalid credentials")}`);
  }

  // Look up user profile to direct to correct dashboard
  try {
    const userProfile = await db
      .select({ role: profiles.role, tenantId: profiles.tenantId })
      .from(profiles)
      .where(eq(profiles.id, authData.user.id));

    const role = userProfile[0]?.role;

    if (role === "super_admin" && isAuthorizedSuperAdminEmail(emailLower)) {
      return redirect("/super-admin/dashboard");
    } else if (role === "tenant_admin") {
      return redirect("/admin/dashboard");
    } else if (role === "staff") {
      return redirect("/staff/dashboard");
    }
  } catch {
    // If DB check fails, fallback to standard redirect
  }

  redirect("/login");
}

export async function signupWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string) || email?.split("@")[0] || "User";
  const emailLower = email?.trim().toLowerCase();

  const supabase = await createClient();

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: emailLower,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Security Gate: Determine role strictly
  // Only the 2 designated emails receive super_admin role; all others receive tenant_admin
  const assignedRole = isAuthorizedSuperAdminEmail(emailLower) ? "super_admin" : "tenant_admin";

  if (signUpData?.user) {
    try {
      // Check if profile exists; if not, create it
      const existingProfile = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.id, signUpData.user.id));

      if (existingProfile.length === 0) {
        let tenantId = null;

        // If tenant_admin, create a default tenant organization for them
        if (assignedRole === "tenant_admin") {
          const [newTenant] = await db
            .insert(tenants)
            .values({
              name: `${name}'s Realty`,
              plan: "Starter",
              status: "Active",
            })
            .returning({ id: tenants.id });
          tenantId = newTenant.id;
        }

        await db.insert(profiles).values({
          id: signUpData.user.id,
          name,
          role: assignedRole,
          tenantId,
        });
      }
    } catch {
      // Ignore if DB trigger already created profile
    }
  }

  return redirect("/login?message=Account+created+successfully.+Please+sign+in.");
}
