import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Building, Phone, Trophy, Award, CheckCircle2 } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

const MOCK_PLATFORM_STAFF = [
  {
    id: "st1",
    name: "Priya Shah",
    email: "priya@skylinerealty.in",
    phone: "+91 99999 11111",
    tenant: "Skyline Realty",
    role: "Sales Director",
    activeLeads: 14,
    closedDeals: 8,
    rating: "4.9/5",
    status: "Active",
    joinedDate: "2026-01-15",
  },
  {
    id: "st2",
    name: "Rohan Verma",
    email: "rohan@skylinerealty.in",
    phone: "+91 99999 22222",
    tenant: "Skyline Realty",
    role: "Senior Consultant",
    activeLeads: 22,
    closedDeals: 5,
    rating: "4.8/5",
    status: "Active",
    joinedDate: "2026-02-10",
  },
  {
    id: "st3",
    name: "Amit Deshmukh",
    email: "amit@apexprop.com",
    phone: "+91 98888 33333",
    tenant: "Apex Properties",
    role: "Property Consultant",
    activeLeads: 18,
    closedDeals: 3,
    rating: "4.7/5",
    status: "Active",
    joinedDate: "2026-03-12",
  },
  {
    id: "st4",
    name: "Neha Sundaram",
    email: "neha@emeraldrealty.com",
    phone: "+91 97777 44444",
    tenant: "Emerald Bay Realty",
    role: "Site Visit Specialist",
    activeLeads: 9,
    closedDeals: 6,
    rating: "4.95/5",
    status: "Active",
    joinedDate: "2026-02-20",
  },
  {
    id: "st5",
    name: "Karan Johal",
    email: "karan@horizongroup.com",
    phone: "+91 96666 55555",
    tenant: "Horizon Estates",
    role: "Sales Agent",
    activeLeads: 0,
    closedDeals: 2,
    rating: "4.2/5",
    status: "Inactive",
    joinedDate: "2025-12-01",
  },
];

export default function StaffOverviewPage() {
  const totalStaff = MOCK_PLATFORM_STAFF.length;
  const activeStaff = MOCK_PLATFORM_STAFF.filter((s) => s.status === "Active").length;
  const totalClosed = MOCK_PLATFORM_STAFF.reduce((sum, s) => sum + s.closedDeals, 0);
  const avgLeadsPerAgent = Math.round(
    MOCK_PLATFORM_STAFF.reduce((sum, s) => sum + s.activeLeads, 0) / activeStaff
  );

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Cross-Tenant Staff Overview"
        description="Monitor staff member engagement, lead allocation, and performance metrics across all tenants."
      />

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total Real Estate Staff"
          value={totalStaff.toString()}
          sub="Across all tenants"
          subTone="neutral"
          icon={Users}
        />
        <KpiCard
          label="Active Field Agents"
          value={activeStaff.toString()}
          sub="Engaged in last 24h"
          subTone="positive"
          icon={CheckCircle2}
        />
        <KpiCard
          label="Avg Leads / Agent"
          value={avgLeadsPerAgent.toString()}
          sub="Balanced workload"
          subTone="neutral"
          icon={Award}
        />
        <KpiCard
          label="Total Closed Deals"
          value={totalClosed.toString()}
          sub="Platform-wide conversions"
          subTone="positive"
          icon={Trophy}
        />
      </div>

      {/* Staff Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">All Tenant Staff Members</h3>
            <p className="text-sm text-muted-foreground">List of active and inactive sales agents</p>
          </div>
          <Badge variant="outline" className="font-normal text-xs">
            {totalStaff} Staff
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Tenant Organization</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Active Leads</TableHead>
              <TableHead className="text-center">Deals Won</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PLATFORM_STAFF.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{member.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {member.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-muted-foreground" />
                    {member.tenant}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{member.role}</TableCell>
                <TableCell className="text-center tabular-nums font-semibold">
                  {member.activeLeads}
                </TableCell>
                <TableCell className="text-center tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">
                  {member.closedDeals}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    ★ {member.rating}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={member.status === "Active" ? "default" : "destructive"}
                    className="capitalize text-xs"
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  {member.joinedDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
