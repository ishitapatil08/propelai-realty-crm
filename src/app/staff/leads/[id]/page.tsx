import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getLeadDetail } from "@/lib/api/tenant-admin";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AddInteractionForm } from "../../../admin/leads/[id]/AddInteractionForm";
import { TriggerCallButton } from "@/components/ui/TriggerCallButton";
import { SendWhatsAppButton } from "@/components/ui/SendWhatsAppButton";
import {
  ArrowLeft,
  Phone,
  MapPin,
  IndianRupee,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function StaffLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { tenantId } = await getSession();
  if (!tenantId) redirect("/login");

  const detail = await getLeadDetail(tenantId, id);

  if (!detail) notFound();

  const { lead, interactions } = detail;

  return (
    <div className="space-y-8 fade-in-up">
      <div>
        <Link href="/staff/leads">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to My Leads
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{lead.name}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Added{" "}
                  {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <ScoreRing score={lead.score ?? 0} size="lg" />
            </div>

            <StatusBadge status={lead.status} />

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                <span className="tabular-nums">{lead.phone}</span>
              </div>

              {lead.source && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{lead.source}</span>
                </div>
              )}

              {lead.budget && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <IndianRupee className="w-4 h-4 shrink-0" />
                  <span className="tabular-nums">
                    {lead.budget.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="w-4 h-4 shrink-0" />
                <span>
                  {lead.assignedName ?? (
                    <span className="italic text-muted-foreground/60">
                      Unassigned
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>
                  Last updated{" "}
                  {new Date(lead.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <TriggerCallButton leadId={lead.id} />
              <SendWhatsAppButton leadId={lead.id} leadName={lead.name} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Activity & Notes</h3>
              <Badge variant="secondary" className="ml-auto">
                {interactions.length}
              </Badge>
            </div>

            <AddInteractionForm leadId={lead.id} />

            <Separator />

            {interactions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm">No notes yet. Log your first interaction above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {interactions.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(item.byUserName ?? "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {item.byUserName ?? "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {timeAgo(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/40 rounded-lg px-3 py-2">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
