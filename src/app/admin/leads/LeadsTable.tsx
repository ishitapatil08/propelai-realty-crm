"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { updateLeadStatus, reassignLead } from "@/lib/api/lead-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATUSES = ["New", "Contacted", "Qualified", "Visit Scheduled", "Won", "Lost"] as const;
type LeadStatus = (typeof STATUSES)[number];

type Lead = {
  id: string;
  name: string;
  phone: string;
  source: string | null;
  budget: number | null;
  status: LeadStatus;
  score: number | null;
  createdAt: Date;
  assignedUserId: string | null;
  assignedName: string | null;
};

type StaffOption = { id: string; name: string | null };

export function LeadsTable({
  leads,
  staff,
}: {
  leads: Lead[];
  staff: StaffOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(leadId: string, status: LeadStatus) {
    startTransition(() => updateLeadStatus(leadId, status));
  }

  function handleReassign(leadId: string, userId: string) {
    const resolved = userId === "__none__" ? null : userId;
    startTransition(() => reassignLead(leadId, resolved));
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden transition-opacity",
        isPending && "opacity-60 pointer-events-none"
      )}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Budget (₹)</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground py-12"
              >
                No leads yet — add your first lead above!
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer hover:bg-muted/30 transition-colors group"
                onClick={() => router.push(`/admin/leads/${lead.id}`)}
              >
                <TableCell className="font-medium group-hover:text-primary transition-colors">
                  {lead.name}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {lead.phone}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {lead.source ?? "—"}
                </TableCell>

                {/* Inline Status Select — stop click propagation so row click doesn't fire */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={lead.status}
                    onValueChange={(v) =>
                      handleStatusChange(lead.id, v as LeadStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs border-0 bg-transparent p-0 focus:ring-0">
                      <StatusBadge status={lead.status} />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="text-sm">
                          <StatusBadge status={s} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {lead.budget
                    ? `₹${lead.budget.toLocaleString("en-IN")}`
                    : "—"}
                </TableCell>

                <TableCell className="text-right">
                  <ScoreRing score={lead.score ?? 0} />
                </TableCell>

                {/* Inline Reassign Select */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={lead.assignedUserId ?? "__none__"}
                    onValueChange={(v) => handleReassign(lead.id, v)}
                  >
                    <SelectTrigger className="h-8 w-[150px] text-xs">
                      <SelectValue>
                        {lead.assignedName ?? (
                          <span className="italic text-muted-foreground/60">
                            Unassigned
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">
                        <span className="italic text-muted-foreground">
                          Unassigned
                        </span>
                      </SelectItem>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name ?? s.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
