import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Plus, Mail, Phone, Building, UserCheck, ShieldAlert } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

const MOCK_TENANT_ADMINS = [
  {
    id: "ta1",
    name: "Vikram Malhotra",
    email: "vikram@skylinerealty.in",
    phone: "+91 98201 12345",
    tenantName: "Skyline Realty",
    plan: "Growth",
    status: "Active",
    twoFactor: true,
    lastActive: "10 mins ago",
    createdAt: "2026-01-05",
  },
  {
    id: "ta2",
    name: "Rajesh Kothari",
    email: "rajesh@apexprop.com",
    phone: "+91 97654 22334",
    tenantName: "Apex Properties",
    plan: "Starter",
    status: "Active",
    twoFactor: true,
    lastActive: "2 hours ago",
    createdAt: "2026-03-10",
  },
  {
    id: "ta3",
    name: "Meera Sen",
    email: "meera.sen@horizongroup.com",
    phone: "+91 99300 44556",
    tenantName: "Horizon Estates",
    plan: "Enterprise",
    status: "Suspended",
    twoFactor: false,
    lastActive: "5 days ago",
    createdAt: "2025-11-20",
  },
  {
    id: "ta4",
    name: "Arun Vasudevan",
    email: "arun@emeraldrealty.com",
    phone: "+91 94440 99887",
    tenantName: "Emerald Bay Realty",
    plan: "Growth",
    status: "Active",
    twoFactor: true,
    lastActive: "Just now",
    createdAt: "2026-02-14",
  },
];

export default function TenantAdminsPage() {
  const totalAdmins = MOCK_TENANT_ADMINS.length;
  const activeAdmins = MOCK_TENANT_ADMINS.filter((a) => a.status === "Active").length;
  const secured2FA = MOCK_TENANT_ADMINS.filter((a) => a.twoFactor).length;

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Tenant Administrators"
        description="Oversee primary administrators managing each tenant organization."
        action={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Invite Tenant Admin
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Tenant Admins"
          value={totalAdmins.toString()}
          sub="Across all registered tenants"
          subTone="neutral"
          icon={ShieldCheck}
        />
        <KpiCard
          label="Active Accounts"
          value={activeAdmins.toString()}
          sub={`${Math.round((activeAdmins / totalAdmins) * 100)}% operational`}
          subTone="positive"
          icon={UserCheck}
        />
        <KpiCard
          label="2FA Enforced"
          value={`${secured2FA}/${totalAdmins}`}
          sub="Security compliance"
          subTone={secured2FA === totalAdmins ? "positive" : "warning"}
          icon={ShieldAlert}
        />
      </div>

      {/* Admins Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Registered Administrators</h3>
            <p className="text-sm text-muted-foreground">Admins with tenant management permissions</p>
          </div>
          <Badge variant="outline" className="font-normal text-xs">
            {totalAdmins} Admins
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Administrator</TableHead>
              <TableHead>Organization / Tenant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>2FA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TENANT_ADMINS.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{admin.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {admin.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-muted-foreground" />
                    {admin.tenantName}
                  </div>
                  <div className="text-xs text-muted-foreground">{admin.plan} Plan</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm flex items-center gap-1 text-muted-foreground">
                    <Phone className="w-3 h-3" /> {admin.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={admin.twoFactor ? "secondary" : "destructive"} className="text-xs">
                    {admin.twoFactor ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={admin.status === "Active" ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {admin.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{admin.lastActive}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  {admin.createdAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
