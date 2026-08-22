import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ShieldAlert,
  CreditCard,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "security",
    title: "New Super Admin login from unfamiliar IP address (103.21.244.18)",
    description: "Session authenticated with 2-Factor authentication token.",
    time: "15 minutes ago",
    read: false,
    icon: ShieldAlert,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "notif-2",
    type: "billing",
    title: "Payment Received: Skyline Realty renewed Growth Plan (₹14,999)",
    description: "Invoice INV-2026-0012 automatically settled via Stripe webhook.",
    time: "2 hours ago",
    read: false,
    icon: CreditCard,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "notif-3",
    type: "ai",
    title: "Voice Bot daily milestone: 50 automated qualifications reached",
    description: "Peak outbound conversion rate at 78% for weekend site visit scheduling.",
    time: "4 hours ago",
    read: true,
    icon: Bot,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "notif-4",
    type: "system",
    title: "Database Backup Completed: 0 errors detected across 14 tables",
    description: "Automated snapshot saved to encrypted offsite bucket.",
    time: "12 hours ago",
    read: true,
    icon: CheckCircle2,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    id: "notif-5",
    type: "billing",
    title: "Payment Failed: Horizon Estates Enterprise Plan renewal",
    description: "Card charge declined by issuing bank. Dunning retry scheduled in 24 hours.",
    time: "1 day ago",
    read: true,
    icon: AlertTriangle,
    color: "text-rose-500 bg-rose-500/10",
  },
];

export default function NotificationsPage() {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Platform Notifications & Alerts"
        description="Live operational telemetry, billing event webhooks, and critical system notifications."
        action={
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Mark All as Read
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs">
            All Alerts ({MOCK_NOTIFICATIONS.length})
          </Badge>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} Unread
            </Badge>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 sm:p-5 flex items-start gap-4 transition-all ${
                item.read
                  ? "border-border bg-card/60 opacity-80"
                  : "border-primary/40 bg-card shadow-sm ring-1 ring-primary/10"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">{item.time}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
