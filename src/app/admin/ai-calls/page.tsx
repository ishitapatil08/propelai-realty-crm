import { PageHeader } from "@/components/layout/PageHeader";
import { Bot, Clock, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "@/lib/auth/session";
import { getTenantAiCalls } from "@/lib/api/tenant-admin";
import { redirect } from "next/navigation";

function formatDuration(seconds: number | null) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default async function AiCallsPage() {
  const { tenantId } = await getSession();
  if (!tenantId) redirect("/login");

  const calls = await getTenantAiCalls(tenantId);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="AI Calls"
        description={`${calls.length} AI-assisted calls made by your team.`}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px] text-center">Transcript</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Bot className="w-10 h-10 text-muted-foreground/30" />
                    <div>
                      <p className="font-medium">No AI calls yet</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        AI calls will appear here once your team starts using the AI outreach feature.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium">
                    {call.leadName ?? (
                      <span className="italic text-muted-foreground/60">Unknown Lead</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                    {call.summary ?? "No summary available."}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                    <div className="flex items-center justify-end gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(call.duration)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(call.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    {call.transcript ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted/60 text-muted-foreground border border-border cursor-pointer hover:bg-muted transition-colors duration-150">
                        <FileText className="w-3 h-3" />
                        View
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40 text-xs">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
