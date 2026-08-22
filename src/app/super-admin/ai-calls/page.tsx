import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  PhoneCall,
  Bot,
  Building,
  User,
  Clock,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { MOCK_AI_CALLS } from "@/lib/api/mock-data";

export default function AiCallsPage() {
  const allCalls = [
    ...MOCK_AI_CALLS.map((c) => ({ ...c, tenantName: "Skyline Realty" })),
    {
      id: "c4",
      transcript:
        "AI: Good afternoon Mr. Vikram. Following up on your inquiry for Apex Greens 2BHK.\nClient: Yes, what is the possession timeline?\nAI: Handover is expected by Dec 2026. Would you like a brochure sent over WhatsApp?\nClient: Please send it over.",
      summary: "Inquired about possession timeline for 2BHK. Requested brochure on WhatsApp.",
      duration: 54,
      createdAt: new Date(Date.now() - 3600000 * 8),
      leadId: "l99",
      leadName: "Vikram Singhania",
      leadPhone: "+91 99887 76655",
      tenantName: "Apex Properties",
    },
    {
      id: "c5",
      transcript:
        "AI: Hello, calling from Emerald Bay regarding villa plots.\nClient: Not interested at this time, please do not call again.\nAI: Thank you for letting us know, updated your preferences.",
      summary: "Lead opted out. Marked as DND.",
      duration: 28,
      createdAt: new Date(Date.now() - 3600000 * 20),
      leadId: "l98",
      leadName: "Sunil Nair",
      leadPhone: "+91 98712 34567",
      tenantName: "Emerald Bay Realty",
    },
  ];

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Cross-Tenant AI Call Logs"
        description="Inspect conversational transcripts, automated lead qualification, and agent responses across all tenants."
      />

      <div className="space-y-4">
        {allCalls.map((call) => (
          <div
            key={call.id}
            className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm hover:border-primary/50 transition-colors"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{call.leadName}</span>
                    <span className="text-xs text-muted-foreground">({call.leadPhone})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Building className="w-3 h-3" />
                    <span>{call.tenantName}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{call.duration}s duration</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  AI Automated Call
                </Badge>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {new Date(call.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* AI Summary */}
            <div className="rounded-lg bg-muted/40 p-3 text-sm">
              <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Executive AI Summary
              </p>
              <p className="text-foreground">{call.summary}</p>
            </div>

            {/* Transcript */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <MessageSquareText className="w-3.5 h-3.5" />
                Full Call Transcript
              </div>
              <div className="rounded-lg bg-background p-4 border border-border text-xs font-mono whitespace-pre-line leading-relaxed text-muted-foreground">
                {call.transcript}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
