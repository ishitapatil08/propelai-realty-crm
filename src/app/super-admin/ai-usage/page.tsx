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
import { Bot, Zap, Cpu, PhoneCall, Sparkles, Building } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

const MOCK_AI_TENANT_USAGE = [
  {
    tenant: "Skyline Realty",
    plan: "Growth",
    callsCount: 340,
    voiceMinutes: "842 mins",
    llmTokens: "1.82M",
    estimatedCost: "₹6,420",
    quotaUsed: 68,
  },
  {
    tenant: "Apex Properties",
    plan: "Starter",
    callsCount: 195,
    voiceMinutes: "410 mins",
    llmTokens: "890K",
    estimatedCost: "₹3,150",
    quotaUsed: 82,
  },
  {
    tenant: "Emerald Bay Realty",
    plan: "Growth",
    callsCount: 140,
    voiceMinutes: "318 mins",
    llmTokens: "650K",
    estimatedCost: "₹2,280",
    quotaUsed: 35,
  },
  {
    tenant: "Horizon Estates",
    plan: "Enterprise",
    callsCount: 80,
    voiceMinutes: "175 mins",
    llmTokens: "420K",
    estimatedCost: "₹1,450",
    quotaUsed: 12,
  },
];

export default function AiUsagePage() {
  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="AI Compute & Voice Usage"
        description="Monitor automated voice outreach agents, speech models, and LLM token consumption across all tenants."
      />

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total AI Calls Executed"
          value="755"
          sub="32 calls active today"
          subTone="positive"
          icon={PhoneCall}
        />
        <KpiCard
          label="Voice Stream Minutes"
          value="1,745"
          sub="Telephony & STT runtime"
          subTone="neutral"
          icon={Cpu}
        />
        <KpiCard
          label="LLM Tokens Processed"
          value="3.78M"
          sub="Prompt + Completion"
          subTone="neutral"
          icon={Zap}
        />
        <KpiCard
          label="Estimated AI Cost"
          value="₹13,300"
          sub="Within platform margin"
          subTone="positive"
          icon={Sparkles}
        />
      </div>

      {/* Tenant AI Allocation Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Tenant AI Compute Consumption</h3>
            <p className="text-sm text-muted-foreground">Detailed breakdown of monthly AI resources per tenant</p>
          </div>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Bot className="w-3.5 h-3.5" />
            AI Engines Active
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant Organization</TableHead>
              <TableHead>Subscription Tier</TableHead>
              <TableHead className="text-center">Total Calls</TableHead>
              <TableHead className="text-center">Voice Minutes</TableHead>
              <TableHead className="text-center">LLM Tokens</TableHead>
              <TableHead className="text-right">Estimated Cost</TableHead>
              <TableHead className="w-[200px]">Quota Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_AI_TENANT_USAGE.map((row) => (
              <TableRow key={row.tenant}>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Building className="w-3.5 h-3.5 text-muted-foreground" />
                    {row.tenant}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {row.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold tabular-nums">
                  {row.callsCount}
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                  {row.voiceMinutes}
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                  {row.llmTokens}
                </TableCell>
                <TableCell className="text-right font-bold text-foreground tabular-nums">
                  {row.estimatedCost}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{row.quotaUsed}%</span>
                      <span className="text-muted-foreground">of monthly plan</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          row.quotaUsed > 80 ? "bg-amber-500" : "bg-primary"
                        }`}
                        style={{ width: `${row.quotaUsed}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
