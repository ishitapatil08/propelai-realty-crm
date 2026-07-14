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

export async function loginWithDemo(formData: FormData) {
  // In demo mode, we simulate a login by using Supabase anonymous sessions or 
  // bypass Supabase if it's not configured and use a simple cookie.
  // Since we require Supabase for this stack, we will assume demo mode
  // signs in with pre-configured passwords if the users exist in Supabase, 
  // OR we just set a mock cookie if we want to bypass Supabase completely for demo.
  
  // For the sake of this phase 1 build where Supabase might not be fully seeded:
  const email = formData.get("email") as string;
  const account = demoAccounts.find(a => a.email === email);
  
  if (account) {
    // We can't actually bypass Supabase SSR middleware easily if we use real Supabase.
    // If NEXT_PUBLIC_DEMO_MODE is true, we should probably still require Supabase to be setup,
    // and the demo accounts must exist in auth.users with password "password123".
    
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: "password123", // Assume all demo accounts have this password in Supabase
    });

    if (error) {
       console.error("Demo login error. Are the demo users seeded in Supabase?", error);
       return redirect("/login?error=Demo users not found in Supabase");
    }
  }

  redirect("/login");
}
