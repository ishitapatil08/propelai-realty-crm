"use client";

import { useTransition } from "react";
import { upgradeTenantPlan } from "@/lib/api/stripe";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export function PlanUpgradeButton({
  planName,
  currentPlan,
}: {
  planName: string;
  currentPlan: string;
}) {
  const [isPending, startTransition] = useTransition();
  const isCurrent = currentPlan.toLowerCase() === planName.toLowerCase();

  function handleUpgrade() {
    startTransition(async () => {
      try {
        await upgradeTenantPlan(planName);
        toast.success(`Plan successfully updated to ${planName}!`);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to update plan.");
      }
    });
  }

  if (isCurrent) {
    return (
      <Button disabled variant="outline" className="w-full gap-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
        <Check className="w-4 h-4" />
        Current Plan
      </Button>
    );
  }

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isPending}
      className="w-full gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Updating…
        </>
      ) : (
        `Switch to ${planName}`
      )}
    </Button>
  );
}
