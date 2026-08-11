import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sub,
  subTone = "positive",
  icon: Icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  subTone?: "positive" | "negative" | "neutral" | "warning";
  icon?: LucideIcon;
  className?: string;
}) {
  const toneClass = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    neutral: "text-muted-foreground",
  }[subTone];

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 stat-glow transition-shadow duration-150",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm text-muted-foreground">{label}</h3>
        {Icon && <Icon className="w-4 h-4 text-primary" />}
      </div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      {sub && <p className={cn("text-xs mt-1 font-medium", toneClass)}>{sub}</p>}
    </div>
  );
}
