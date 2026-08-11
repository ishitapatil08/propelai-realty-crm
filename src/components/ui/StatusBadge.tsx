import React from "react";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  // tenant / subscription states
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  trial: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  suspended: "bg-red-500/15 text-red-700 dark:text-red-400",
  invited: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  // payments
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  failed: "bg-red-500/15 text-red-700 dark:text-red-400",
  // tickets
  open: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  in_progress: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  resolved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  // priority
  low: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  high: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  urgent: "bg-red-500/15 text-red-700 dark:text-red-400",
  // announcements
  draft: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
  scheduled: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  published: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  // plans
  Starter: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
  Growth: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Enterprise: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  // lead statuses
  New: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
  Contacted: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Qualified: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  "Visit Scheduled": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Won: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Lost: "bg-red-500/15 text-red-700 dark:text-red-400",
  // visit statuses
  Scheduled: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

const LABEL: Record<string, string> = {
  in_progress: "In Progress",
  "Visit Scheduled": "Visit Scheduled",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = TONE[status] ?? "bg-muted text-muted-foreground";
  const label = LABEL[status] ?? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        tone,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
