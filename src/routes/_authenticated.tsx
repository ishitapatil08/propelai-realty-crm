import { createFileRoute, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { Sidebar } from "../components/layout/Sidebar";
import { TrendingUp, Building2, Phone, Users } from "lucide-react";
import { Role } from "../lib/types";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    // Note: in a real app context would have auth, but we'll use useAuth hook in component since it's localstorage
  },
  component: AuthenticatedLayout,
});

const tabsFor: Record<Role, { key: string; label: string; icon: any; path: string }[]> = {
  super_admin: [
    { key: "dashboard", label: "Platform overview", icon: TrendingUp, path: "/super-admin" },
    { key: "tenants", label: "Tenants", icon: Building2, path: "/super-admin/tenants" },
  ],
  tenant_admin: [
    { key: "dashboard", label: "Dashboard", icon: TrendingUp, path: "/tenant-admin" },
    { key: "leads", label: "Leads", icon: Phone, path: "/tenant-admin/leads" },
    { key: "staff", label: "Staff", icon: Users, path: "/tenant-admin/staff" },
  ],
  staff: [
    { key: "dashboard", label: "My dashboard", icon: TrendingUp, path: "/staff" },
    { key: "leads", label: "My leads", icon: Phone, path: "/staff/leads" },
  ],
};

function AuthenticatedLayout() {
  const { currentUser, logout, tenants } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    if (!currentUser) {
      navigate({ to: "/login" });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const tenant = currentUser.tenantId ? tenants.find((t) => t.id === currentUser.tenantId) || null : null;
  const tabs = tabsFor[currentUser.role];

  // Sync tab state with current route (naive approach for MVP)
  useEffect(() => {
    const currentPath = routerState.location.pathname;
    const activeTab = tabs.find(t => currentPath === t.path || currentPath.startsWith(t.path + "/"))?.key || "dashboard";
    setTab(activeTab);
  }, [routerState.location.pathname, tabs]);

  const handleTabChange = (key: string) => {
    const t = tabs.find(t => t.key === key);
    if (t) navigate({ to: t.path });
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="propel-root" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        user={currentUser}
        tenant={tenant}
        tab={tab}
        setTab={handleTabChange}
        onLogout={handleLogout}
        tabs={tabs}
      />
      <main className="propel-scroll" style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
