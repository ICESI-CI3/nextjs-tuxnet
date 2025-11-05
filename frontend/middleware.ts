import { NextResponse, type NextRequest } from "next/server";

// Public routes that should always be accessible
const PUBLIC_ROUTES = new Set<string>(["/", "/login", "/register"]);

// Map of protected prefixes to required role
const ROLE_PREFIX: Array<{ prefix: string; role: string }> = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/client", role: "client" },
  { prefix: "/specialist", role: "stylist" },
];

const getDashboardForRoles = (roles: string[]): string | null => {
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("client")) return "/client";
  if (roles.includes("stylist")) return "/specialist";
  return null;
};

const parseRolesCookie = (value: string | undefined): string[] => {
  if (!value) return [];
  try {
    // Allow both JSON array and CSV formats for resilience
    if (value.trim().startsWith("[")) {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map((r) => String(r)) : [];
    }
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read auth cookies set by the client on login
  const token = req.cookies.get("token")?.value;
  const roles = parseRolesCookie(req.cookies.get("roles")?.value);

  // If authenticated, redirect away from auth pages to the dashboard
  if (token && PUBLIC_ROUTES.has(pathname)) {
    const target = getDashboardForRoles(roles) ?? "/";
    if (target !== pathname) {
      const url = req.nextUrl.clone();
      url.pathname = target;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If route is public, allow
  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // Protect role-based sections
  const match = ROLE_PREFIX.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (match) {
    // Require token
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Enforce role
    if (!roles.includes(match.role)) {
      const target = getDashboardForRoles(roles) ?? "/";
      const url = req.nextUrl.clone();
      url.pathname = target;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/admin/:path*",
    "/client/:path*",
    "/specialist/:path*",
  ],
};

