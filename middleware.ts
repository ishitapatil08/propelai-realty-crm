import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // 1. Refresh session
  const supabaseResponse = await updateSession(request);
  
  // 2. Check auth state
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Handled by updateSession
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute = path === "/login" || path === "/select-role";
  const isPublicRoute = path === "/";

  if (!user && !isAuthRoute && !isPublicRoute && !path.startsWith("/_next") && !path.startsWith("/api") && !path.match(/\.(.*)$/)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    // If user is logged in and tries to access login page, redirect to dashboard
    if (isAuthRoute) {
      // Need to find role to route correctly
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      const role = profile?.role;
      if (role === "super_admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (role === "tenant_admin" || role === "staff") {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/select-role", request.url));
      }
    }

    // Role-based route guards
    if (path.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (profile?.role !== "super_admin" && profile?.role !== "tenant_admin") {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      }
    }

    if (path.startsWith("/staff")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (profile?.role === "super_admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
