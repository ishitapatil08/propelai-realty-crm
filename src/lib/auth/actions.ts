"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { demoAccounts } from "./mock-users";

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const demoEmails = [
      "super@propelai.com", "alex@propelai.com",
      "admin@tenant.com", "priya@skylinerealty.com",
      "staff@tenant.com", "rohan@skylinerealty.com"
    ];
    const emailLower = email?.toLowerCase();
    if (demoEmails.includes(emailLower)) {
      const cookieStore = await cookies();
      cookieStore.set("demo_user", emailLower, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      if (emailLower === "super@propelai.com" || emailLower === "alex@propelai.com") {
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
  try {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    error = res.error;
  } catch (e: any) {
    error = { message: e.message || "Failed to connect to authentication server" };
  }

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Determine routing based on role
  // This will be handled by middleware on redirect to /login
  redirect("/login");
}

export async function signupWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // By default, Supabase requires email verification.
  return redirect("/login?message=Check your email to verify your account");
}
