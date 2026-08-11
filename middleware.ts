import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Explicit cookie type matching @supabase/ssr's CookieMethodsServer interface
type CookieToSet = {
  name: string;
  value: string;
  options?: {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | "lax" | "strict" | "none";
    secure?: boolean;
  };
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user: any = null;
  let role: string | null = null;

  const demoUserCookie = request.cookies.get("demo_user")?.value;
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && demoUserCookie) {
    if (demoUserCookie === "super@propelai.com" || demoUserCookie === "alex@propelai.com") {
      user = { id: "d1", email: demoUserCookie };
      role = "super_admin";
    } else if (demoUserCookie === "admin@tenant.com" || demoUserCookie === "priya@skylinerealty.com") {
      user = { id: "d2", email: demoUserCookie };
      role = "tenant_admin";
    } else if (demoUserCookie === "staff@tenant.com" || demoUserCookie === "rohan@skylinerealty.com") {
      user = { id: "d3", email: demoUserCookie };
      role = "staff";
    }
  }

  if (!user) {
    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      user = supabaseUser;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        role = profile?.role as string | null;
      }
    } catch (e) {
      // Ignore connection/fetch errors in dev mode
    }
  }

  const path = request.nextUrl.pathname;
  const isAuthRoute = path === "/login" || path === "/select-role";
  const isPublicRoute = path === "/";
  const isStaticAsset =
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    /\.(.+)$/.test(path);

  // Redirect unauthenticated users to login
  if (!user && !isAuthRoute && !isPublicRoute && !isStaticAsset) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    // Redirect authenticated users away from auth pages
    if (isAuthRoute) {
      if (role === "super_admin") return NextResponse.redirect(new URL("/super-admin/dashboard", request.url));
      if (role === "tenant_admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      if (role === "staff") return NextResponse.redirect(new URL("/staff/dashboard", request.url));
    }

    // Strict Route Isolation Guards
    if (path.startsWith("/super-admin") && role !== "super_admin") {
      if (role === "tenant_admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      return NextResponse.redirect(new URL("/staff/dashboard", request.url));
    }

    if (path.startsWith("/admin") && role !== "tenant_admin") {
      // Allow super_admin to access /admin when impersonating a tenant
      const impersonatedTenantId = request.cookies.get("impersonated_tenant_id")?.value;
      if (role === "super_admin" && impersonatedTenantId) {
        // Allow through — they are impersonating
      } else if (role === "super_admin") {
        return NextResponse.redirect(new URL("/super-admin/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      }
    }

    if (path.startsWith("/staff") && role !== "staff") {
      if (role === "super_admin") return NextResponse.redirect(new URL("/super-admin/dashboard", request.url));
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
