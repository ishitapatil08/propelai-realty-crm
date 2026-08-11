"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Phone,
  PhoneCall,
  Calendar,
  CheckSquare,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/BrandLogo";

const NAV_GROUPS: {
  label: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard }[];
}[] = [
  {
    label: "Overview",
    items: [{ href: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Pipeline",
    items: [
      { href: "/staff/leads", label: "My Leads", icon: Phone },
      { href: "/staff/calls", label: "My Calls", icon: PhoneCall },
    ],
  },
  {
    label: "Schedule",
    items: [{ href: "/staff/calendar", label: "Calendar", icon: Calendar }],
  },
  {
    label: "Actions",
    items: [{ href: "/staff/tasks", label: "Tasks", icon: CheckSquare }],
  },
];

export function StaffSidebar() {
  const { user, role } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full sticky top-0">
      <div className="p-6 pb-2">
        <Link href="/staff/dashboard">
          <BrandLogo size="md" subtitle="Staff Portal" />
        </Link>

        <div className="mt-4 px-3 py-2 rounded-lg bg-sidebar-accent/50 text-sidebar-accent-foreground">
          <p className="text-xs font-semibold uppercase tracking-wider">Staff Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-5 overflow-y-auto propel-scroll">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-accent-foreground/60">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((link) => {
                const Icon = link.icon;
                const isActive = pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn("nav-item", isActive ? "nav-item-active" : "nav-item-inactive")}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <UserAvatar name={user?.email || "Staff"} />
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">{role}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-sidebar-border text-sm font-medium hover:bg-sidebar-accent/50 transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
