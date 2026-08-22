import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollText, ShieldCheck, Download, Filter, User, Building } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

const MOCK_AUDIT_LOGS = [
  {
    id: "log-1099",
    action: "impersonation_start",
    actor: "superadmin@propelai.com",
    role: "Super Admin",
    tenant: "Skyline Realty",
    ipAddress: "103.21.244.18",
    status: "Success",
    timestamp: "2026-06-18 14:15:22",
    details: "Started tenant impersonation session (1h TTL)",
  },
  {
    id: "log-1098",
    action: "tenant_plan_upgrade",
    actor: "vikram@skylinerealty.in",
    role: "Tenant Admin",
    tenant: "Skyline Realty",
    ipAddress: "49.36.120.45",
    status: "Success",
    timestamp: "2026-06-18 11:30:10",
    details: "Upgraded subscription tier Starter -> Growth",
  },
  {
    id: "log-1097",
    action: "staff_member_created",
    actor: "rajesh@apexprop.com",
    role: "Tenant Admin",
    tenant: "Apex Properties",
    ipAddress: "115.98.20.101",
    status: "Success",
    timestamp: "2026-06-17 16:45:00",
    details: "Added staff profile: Amit Deshmukh (Consultant)",
  },
  {
    id: "log-1096",
    action: "security_mfa_enabled",
    actor: "superadmin@propelai.com",
    role: "Super Admin",
    tenant: "Platform",
    ipAddress: "103.21.244.18",
    status: "Success",
    timestamp: "2026-06-16 09:12:44",
    details: "Enforced global 2FA policy for Tenant Admins",
  },
  {
    id: "log-1095",
    action: "tenant_suspended",
    actor: "superadmin@propelai.com",
    role: "Super Admin",
    tenant: "Horizon Estates",
    ipAddress: "103.21.244.18",
    status: "Success",
    timestamp: "2026-06-15 18:00:19",
    details: "Suspended tenant due to repeated payment failures",
  },
];

export default function AuditLogsPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Security & Compliance Audit Logs"
        description="Immutable record of administrative operations, authentication events, and data mutation actions."
        action={
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Audit Trail (CSV)
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Logged Events (30d)"
          value="1,480"
          sub="Stored in PostgreSQL WAL"
          subTone="neutral"
          icon={ScrollText}
        />
        <KpiCard
          label="Security Anomalies"
          value="0"
          sub="Zero unauthorized attempts"
          subTone="positive"
          icon={ShieldCheck}
        />
        <KpiCard
          label="Impersonation Sessions"
          value="12"
          sub="All logged with session TTL"
          subTone="neutral"
          icon={User}
        />
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Event Trail</h3>
            <p className="text-sm text-muted-foreground">Chronological audit stream</p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            RLS & Event Sourced
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_AUDIT_LOGS.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{log.id}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-[11px]">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-xs text-foreground">{log.actor}</div>
                  <div className="text-[10px] text-muted-foreground">{log.role}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                    <Building className="w-3 h-3 text-muted-foreground" />
                    {log.tenant}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                  {log.details}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{log.ipAddress}</TableCell>
                <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                  {log.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
