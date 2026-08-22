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
import { MessageCircle, CheckCheck, Send, AlertTriangle, Building, Zap } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

const MOCK_WHATSAPP_USAGE = [
  {
    tenant: "Skyline Realty",
    plan: "Growth",
    sent: 1240,
    delivered: 1215,
    read: 1080,
    failed: 25,
    deliveryRate: "98.0%",
    templatesUsed: 6,
    status: "Healthy",
  },
  {
    tenant: "Apex Properties",
    plan: "Starter",
    sent: 680,
    delivered: 672,
    read: 590,
    failed: 8,
    deliveryRate: "98.8%",
    templatesUsed: 3,
    status: "Healthy",
  },
  {
    tenant: "Emerald Bay Realty",
    plan: "Growth",
    sent: 490,
    delivered: 475,
    read: 395,
    failed: 15,
    deliveryRate: "96.9%",
    templatesUsed: 4,
    status: "Healthy",
  },
  {
    tenant: "Horizon Estates",
    plan: "Enterprise",
    sent: 210,
    delivered: 195,
    read: 150,
    failed: 15,
    deliveryRate: "92.8%",
    templatesUsed: 2,
    status: "Rate Limited",
  },
];

export default function WhatsAppUsagePage() {
  const totalSent = MOCK_WHATSAPP_USAGE.reduce((acc, t) => acc + t.sent, 0);
  const totalDelivered = MOCK_WHATSAPP_USAGE.reduce((acc, t) => acc + t.delivered, 0);
  const totalRead = MOCK_WHATSAPP_USAGE.reduce((acc, t) => acc + t.read, 0);
  const avgReadRate = Math.round((totalRead / totalDelivered) * 100);

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="WhatsApp Business API Usage"
        description="Monitor automated brochure delivery, visit reminders, and messaging health across all tenants."
      />

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total Messages Sent"
          value={totalSent.toLocaleString("en-IN")}
          sub="Outbound brochures & alerts"
          subTone="neutral"
          icon={Send}
        />
        <KpiCard
          label="Delivery Rate"
          value="97.6%"
          sub="Delivered to WhatsApp"
          subTone="positive"
          icon={CheckCheck}
        />
        <KpiCard
          label="Read Rate"
          value={`${avgReadRate}%`}
          sub="Opened by prospects"
          subTone="positive"
          icon={MessageCircle}
        />
        <KpiCard
          label="Meta Cloud API Status"
          value="Operational"
          sub="Tier 2 (10k msgs/day)"
          subTone="positive"
          icon={Zap}
        />
      </div>

      {/* Tenant Breakdown */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Tenant Messaging Volume</h3>
            <p className="text-sm text-muted-foreground">Detailed metrics per connected WhatsApp Business Account (WABA)</p>
          </div>
          <Badge variant="outline" className="text-xs">
            Meta Graph API v20.0
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant Organization</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-center">Messages Sent</TableHead>
              <TableHead className="text-center">Delivered</TableHead>
              <TableHead className="text-center">Read</TableHead>
              <TableHead className="text-center">Delivery %</TableHead>
              <TableHead className="text-center">Active Templates</TableHead>
              <TableHead className="text-right">Account Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_WHATSAPP_USAGE.map((t) => (
              <TableRow key={t.tenant}>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Building className="w-3.5 h-3.5 text-muted-foreground" />
                    {t.tenant}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {t.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold tabular-nums">
                  {t.sent}
                </TableCell>
                <TableCell className="text-center tabular-nums text-muted-foreground">
                  {t.delivered}
                </TableCell>
                <TableCell className="text-center tabular-nums text-muted-foreground">
                  {t.read}
                </TableCell>
                <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {t.deliveryRate}
                </TableCell>
                <TableCell className="text-center font-medium tabular-nums">
                  {t.templatesUsed}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={t.status === "Healthy" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {t.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
