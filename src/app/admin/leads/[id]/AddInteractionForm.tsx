"use client";

import { useTransition, useRef, useState } from "react";
import { addInteraction } from "@/lib/api/lead-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquarePlus } from "lucide-react";

export function AddInteractionForm({ leadId }: { leadId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const note = ref.current?.value?.trim();
    if (!note) return;
    setError(null);

    startTransition(async () => {
      try {
        await addInteraction(leadId, note);
        if (ref.current) ref.current.value = "";
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to save note.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        ref={ref}
        placeholder="Log a call, note, or update…"
        rows={3}
        disabled={isPending}
        className="resize-none"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} size="sm" className="gap-2">
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageSquarePlus className="w-4 h-4" />
          )}
          {isPending ? "Saving…" : "Add Note"}
        </Button>
      </div>
    </form>
  );
}
