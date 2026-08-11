import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/lib/auth/session";
import { getFollowUpLeads } from "@/lib/api/staff-portal";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function StaffTasksPage() {
  const { tenantId, user } = await getSession();
  if (!tenantId || !user) redirect("/login");

  const tasks = await getFollowUpLeads(tenantId, user.id);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Pending Tasks"
        description="Leads in your pipeline that are still 'New' or 'Contacted' and need action."
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Lead Score</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  No pending follow-ups. You are all caught up!
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">
                    <Link href={`/staff/leads/${t.id}`} className="hover:underline">
                      {t.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{t.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{t.source ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ScoreRing score={t.score ?? 0} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(t.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    <Link href={`/staff/leads/${t.id}`}>
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium cursor-pointer hover:underline">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Follow Up
                      </span>
                    </Link>
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
