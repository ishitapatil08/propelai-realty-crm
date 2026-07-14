"use client";

import * as React from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthContextType = {
  user: User | null;
  role: "super_admin" | "tenant_admin" | "staff" | null;
  tenantId: string | null;
  isLoading: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  role: null,
  tenantId: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<AuthContextType["role"]>(null);
  const [tenantId, setTenantId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const supabase = createClient();

  React.useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        // We will fetch the profile to get role and tenantId
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, tenant_id")
          .eq("id", session.user.id)
          .single();
          
        if (profile) {
          setRole(profile.role as any);
          setTenantId(profile.tenant_id);
        }
      }
      setIsLoading(false);
    }
    
    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, tenant_id")
          .eq("id", session.user.id)
          .single();
          
        if (profile) {
          setRole(profile.role as any);
          setTenantId(profile.tenant_id);
        }
      } else {
        setUser(null);
        setRole(null);
        setTenantId(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, role, tenantId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
