import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("demo_user");
  cookieStore.delete("impersonated_tenant_id");

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (e) {
    // Ignore offline errors
  }

  // Redirect to login page
  const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  return NextResponse.redirect(loginUrl, {
    status: 303, // 303 See Other is recommended when redirecting after POST
  });
}
