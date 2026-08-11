import { PageHeader } from "@/components/layout/PageHeader";
import { getSession } from "@/lib/auth/session";
import { getMyVisits, getMyLeads } from "@/lib/api/staff-portal";
import { getTenantProperties } from "@/lib/api/tenant-admin";
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
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { ScheduleVisitDialog } from "./ScheduleVisitDialog";

export default async function StaffCalendarPage() {
  const { tenantId, user } = await getSession();
  if (!tenantId || !user) redirect("/login");

  const [visits, leads, properties] = await Promise.all([
    getMyVisits(tenantId),
    getMyLeads(tenantId, user.id),
    getTenantProperties(tenantId),
  ]);

  const leadOptions = leads.map((l: any) => ({ id: l.id, name: l.name }));
  const propOptions = properties.map((p: any) => ({ id: p.id, name: p.name }));

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Calendar & Visits"
        description={`${visits.length} scheduled site visits.`}
        action={<ScheduleVisitDialog leads={leadOptions} properties={propOptions} />}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client / Lead</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Scheduled Date & Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                  No site visits scheduled.
                </TableCell>
              </TableRow>
            ) : (
              visits.map((v: any) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{v.leadName}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">{v.leadPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {v.propertyName ? (
                      <div>
                        <div className="font-medium text-sm">{v.propertyName}</div>
                        {v.propertyLocation && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {v.propertyLocation}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">No property assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-sm">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      {new Date(v.scheduledAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={v.status} />
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
