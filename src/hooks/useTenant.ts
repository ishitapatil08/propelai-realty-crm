"use client";

import { useContext, createContext, useCallback, useEffect, useState } from "react";

export type UserRole = "super_admin" | "tenant_admin" | "staff" | null;

export interface TenantInfo {
  tenantId: string | null;
  role: UserRole;
  userId: string | null;
  userName: string | null;
  isDemo: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const TenantContext = createContext<TenantInfo | null>(null);

// Standalone hook — resolves tenant info from the session API
// Use inside AuthProvider or call directly in a client component.
export function useTenant(): TenantInfo {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The /api/auth/logout route exists; we piggyback on the session via a
      // lightweight GET to /api/dashboard/stats to validate the session and
      // extract tenant. In a full app this would be /api/auth/me.
      // For now we read from the demo_user cookie if in demo mode.
      if (isDemo) {
        const cookieVal = document.cookie
          .split("; ")
          .find((r) => r.startsWith("demo_user="))
          ?.split("=")[1];

        if (!cookieVal) {
          setRole(null);
          setTenantId(null);
          return;
        }

        if (
          cookieVal === "super@propelai.com" ||
          cookieVal === "alex@propelai.com"
        ) {
          setRole("super_admin");
          setUserId("d1");
          setUserName("Alex Rao");
          setTenantId(null);
        } else if (
          cookieVal === "admin@tenant.com" ||
          cookieVal === "priya@skylinerealty.com"
        ) {
          setRole("tenant_admin");
          setUserId("d2");
          setUserName("Priya Shah");
          setTenantId("t1");
        } else {
          setRole("staff");
          setUserId("d3");
          setUserName("Rohan Verma");
          setTenantId("t1");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Session error");
    } finally {
      setIsLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    tenantId,
    role,
    userId,
    userName,
    isDemo,
    isLoading,
    error,
    refetch: fetchSession,
  };
}

export { TenantContext };
