"use client";

import { exitImpersonation } from "@/lib/api/super-admin";
import { ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImpersonationBanner({ tenantName }: { tenantName: string }) {
  return (
    <div className="bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 flex items-center justify-between text-sm font-medium">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>
          You are viewing this portal as <strong>{tenantName}</strong>. All actions are logged.
        </span>
      </div>
      <form action={exitImpersonation}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="text-white hover:bg-amber-600 dark:hover:bg-amber-700 h-7 gap-1"
        >
          <X className="w-3 h-3" />
          Exit
        </Button>
      </form>
    </div>
  );
}
