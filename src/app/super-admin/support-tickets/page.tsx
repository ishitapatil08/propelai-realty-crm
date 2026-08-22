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
import { LifeBuoy, CheckCircle2, Clock, AlertCircle, Building, MessageSquare } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

const MOCK_TICKETS = [
  {
    id: "TICK-801",
    tenant: "Skyline Realty",
    submittedBy: "Vikram Malhotra",
    subject: "Request custom WhatsApp message template approval for Luxury Penthouses",
    priority: "High",
    category: "Integrations",
    status: "In Progress",
    created: "2 hours ago",
    assignedTo: "Support Team",
  },
  {
    id: "TICK-800",
    tenant: "Apex Properties",
    submittedBy: "Rajesh Kothari",
    subject: "How to export lead conversion report as customized CSV with custom date range?",
    priority: "Medium",
    category: "Usage & Reports",
    status: "Open",
    created: "5 hours ago",
    assignedTo: "Unassigned",
  },
  {
    id: "TICK-799",
    tenant: "Emerald Bay Realty",
    submittedBy: "Arun Vasudevan",
    subject: "Voice bot latency slightly elevated during peak 6 PM outbound calling slot",
    priority: "High",
    category: "AI Calling",
    status: "Open",
    created: "1 day ago",
    assignedTo: "Engineering",
  },
  {
    id: "TICK-798",
    tenant: "Horizon Estates",
    submittedBy: "Meera Sen",
    subject: "Update billing credit card on file for recurring Enterprise renewal",
    priority: "Urgent",
    category: "Billing",
    status: "Resolved",
    created: "3 days ago",
    assignedTo: "Finance Support",
  },
];

export default function SupportTicketsPage() {
  const openCount = MOCK_TICKETS.filter((t) => t.status === "Open").length;
  const inProgressCount = MOCK_TICKETS.filter((t) => t.status === "In Progress").length;
  const resolvedCount = MOCK_TICKETS.filter((t) => t.status === "Resolved").length;

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Tenant Support Desk"
        description="Review customer inquiries, technical troubleshooting, and feature requests submitted by tenants."
      />

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Open Tickets"
          value={openCount.toString()}
          sub="Awaiting first reply"
          subTone="warning"
          icon={AlertCircle}
        />
        <KpiCard
          label="In Progress"
          value={inProgressCount.toString()}
          sub="Assigned to engineers"
          subTone="neutral"
          icon={Clock}
        />
        <KpiCard
          label="Resolved (This Week)"
          value={resolvedCount.toString()}
          sub="Avg. 1.8h resolution"
          subTone="positive"
          icon={CheckCircle2}
        />
        <KpiCard
          label="CSAT Satisfaction"
          value="98.5%"
          sub="Based on 42 reviews"
          subTone="positive"
          icon={LifeBuoy}
        />
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">All Support Inquiries</h3>
            <p className="text-sm text-muted-foreground">Manage active ticket requests</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {MOCK_TICKETS.length} Total Tickets
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead className="w-[350px]">Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TICKETS.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono text-xs font-semibold">{ticket.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Building className="w-3.5 h-3.5 text-muted-foreground" />
                    {ticket.tenant}
                  </div>
                  <div className="text-xs text-muted-foreground">{ticket.submittedBy}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground text-sm line-clamp-1">{ticket.subject}</div>
                  <div className="text-xs text-muted-foreground">{ticket.created}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.priority === "Urgent" || ticket.priority === "High"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{ticket.category}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.status === "Resolved"
                        ? "default"
                        : ticket.status === "In Progress"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-medium">
                  {ticket.assignedTo}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
