import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/lib/auth/session";
import { getMyLeads } from "@/lib/api/staff-portal";
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
import Link from "next/link";

export default async function StaffLeadsPage() {
  const { tenantId, user } = await getSession();
  if (!tenantId || !user) redirect("/login");

  const leads = await getMyLeads(tenantId, user.id);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="My Leads"
        description={`You have ${leads.length} leads assigned to you.`}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Budget (₹)</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  No leads assigned to you.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <Link href={`/staff/leads/${lead.id}`} className="block w-full hover:underline">
                      {lead.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {lead.phone}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.source ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {lead.budget ? `₹${lead.budget.toLocaleString("en-IN")}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <ScoreRing score={lead.score ?? 0} />
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
    </div>
  );
}
