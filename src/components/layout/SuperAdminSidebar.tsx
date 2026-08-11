"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users,
  BarChart3,
  DollarSign,
  Layers,
  CreditCard,
  Bot,
  PhoneCall,
  MessageCircle,
  HardDrive,
  LifeBuoy,
  Megaphone,
  Bell,
  ScrollText,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/BrandLogo";

const NAV_GROUPS: {
  label: string;
  items: { href: string; label: string; icon: typeof LayoutDashboard }[];
}[] = [
  {
    label: "Overview",
    items: [{ href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Tenants",
    items: [
      { href: "/super-admin/tenants", label: "Tenants", icon: Building2 },
      { href: "/super-admin/tenant-admins", label: "Tenant Admins", icon: ShieldCheck },
      { href: "/super-admin/staff-overview", label: "Staff Overview", icon: Users },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/super-admin/analytics", label: "Platform Analytics", icon: BarChart3 },
      { href: "/super-admin/revenue", label: "Revenue", icon: DollarSign },
      { href: "/super-admin/plans", label: "Subscription Plans", icon: Layers },
      { href: "/super-admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    label: "Usage",
    items: [
      { href: "/super-admin/ai-usage", label: "AI Usage", icon: Bot },
      { href: "/super-admin/ai-calls", label: "AI Calls", icon: PhoneCall },
      { href: "/super-admin/whatsapp-usage", label: "WhatsApp Usage", icon: MessageCircle },
      { href: "/super-admin/storage", label: "Storage", icon: HardDrive },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/super-admin/support-tickets", label: "Support Tickets", icon: LifeBuoy },
      { href: "/super-admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/super-admin/notifications", label: "Notifications", icon: Bell },
      { href: "/super-admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/super-admin/platform-settings", label: "Platform Settings", icon: Settings },
      { href: "/super-admin/profile", label: "Profile", icon: UserCircle },
    ],
  },
];

export function SuperAdminSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full sticky top-0">
      <div className="p-6 pb-2">
        <Link href="/super-admin/dashboard">
          <BrandLogo size="md" subtitle="Super Admin" />
        </Link>

        <div className="mt-4 px-3 py-2 rounded-lg bg-sidebar-accent/50 text-sidebar-accent-foreground">
          <p className="text-xs font-semibold uppercase tracking-wider">Super Admin</p>
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
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground shrink-0">
              {(user?.email || "SA").slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{user?.email || "Platform Owner"}</p>
              <p className="text-xs text-muted-foreground truncate">Super Admin</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-sidebar-border text-sm font-medium hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
