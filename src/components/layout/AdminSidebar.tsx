import Link from "next/link";
import Image from "next/image";
import { LogOut, Home, Users, Phone, Calendar, BarChart3, Settings, Bot } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuth } from "@/components/providers/AuthProvider";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/leads", label: "Leads", icon: Phone },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/ai-calls", label: "AI Calls", icon: Bot },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const { user, role } = useAuth();
  
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full sticky top-0">
      <div className="p-6 pb-2">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          {/* Logo implementation from user request */}
          <div className="relative w-8 h-8 rounded-md overflow-hidden bg-white/10 p-0.5">
            <Image 
              src="/logo.png" 
              alt="PropelAI Realty OS Logo" 
              fill 
              className="object-contain" 
            />
          </div>
          <span className="font-semibold tracking-tight text-lg">PropelAI</span>
        </Link>
        
        <div className="mt-4 px-3 py-2 rounded-lg bg-sidebar-accent/50 text-sidebar-accent-foreground">
          <p className="text-xs font-semibold uppercase tracking-wider">
            {role === "super_admin" ? "Platform Admin" : "Tenant Admin"}
          </p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto propel-scroll">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className="nav-item nav-item-inactive"
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <UserAvatar name={user?.email || "Admin"} />
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
