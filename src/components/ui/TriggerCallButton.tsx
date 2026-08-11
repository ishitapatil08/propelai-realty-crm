"use client";

import { useTransition } from "react";
import { triggerAiCall } from "@/lib/api/ai-calling";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TriggerCallButton({ leadId }: { leadId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await triggerAiCall(leadId);
        toast.success("AI Outreach Call completed successfully!");
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to trigger AI call.");
      }
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="w-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-sm transition-all"
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Running AI Call…
        </>
      ) : (
        <>
          <Bot className="w-4 h-4" />
          Trigger AI Call
        </>
      )}
    </Button>
  );
}
