import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const resolvedParams = await searchParams;

  if (resolvedParams?.code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(
        resolvedParams.code
      );
      if (!error) {
        redirect("/admin/dashboard");
      }
    } catch {
      // Fall through to login redirect
    }
    redirect("/login?message=Email+confirmed+successfully.+Please+sign+in.");
  }

  // Directly redirect to the login page
  redirect("/login");
}
