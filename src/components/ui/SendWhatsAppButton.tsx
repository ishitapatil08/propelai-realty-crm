"use client";

import { useState, useTransition } from "react";
import { sendWhatsAppMessage } from "@/lib/api/whatsapp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SendWhatsAppButton({
  leadId,
  leadName,
}: {
  leadId: string;
  leadName: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(
    `Hi ${leadName}, thank you for reaching out to PropelAI Realty. Here are the property details you requested!`
  );

  function handleSend() {
    if (!message.trim()) return;

    startTransition(async () => {
      try {
        await sendWhatsAppMessage(leadId, message);
        toast.success("WhatsApp message sent!");
        setOpen(false);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to send message.");
      }
    });
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full gap-2 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
      >
        <MessageSquare className="w-4 h-4" />
        Send WhatsApp
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send WhatsApp Message to {leadName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Type your WhatsApp message…"
              disabled={isPending}
            />
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSend}
              disabled={isPending || !message.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
