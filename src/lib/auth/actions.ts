"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { demoAccounts } from "./mock-users";

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?error=Invalid login credentials");
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
