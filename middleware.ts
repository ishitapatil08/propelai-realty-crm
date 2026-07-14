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

  // IMPORTANT: Do not add logic between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as string | null;

    // Redirect authenticated users away from auth pages
    if (isAuthRoute) {
      if (role === "super_admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      if (role === "tenant_admin" || role === "staff") {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      }
    }

    // Guard /admin routes — only admins allowed
    if (
      path.startsWith("/admin") &&
      role !== "super_admin" &&
      role !== "tenant_admin"
    ) {
      return NextResponse.redirect(new URL("/staff/dashboard", request.url));
    }

    // Guard /staff routes — super_admins go to admin dashboard
    if (path.startsWith("/staff") && role === "super_admin") {
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
