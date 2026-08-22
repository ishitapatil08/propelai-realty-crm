import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import {
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Flame,
  PieChart,
} from "lucide-react";

export default function AnalyticsPage() {
  const channelBreakdown = [
    { source: "Google Search Ads", leads: 420, percent: 38, color: "bg-blue-500" },
    { source: "Meta / Instagram Ads", leads: 310, percent: 28, color: "bg-indigo-500" },
    { source: "Direct Walk-in / Inbound", leads: 185, percent: 17, color: "bg-emerald-500" },
    { source: "Property Portals (99acres/MagicBricks)", leads: 120, percent: 11, color: "bg-amber-500" },
    { source: "Referrals & Agents", leads: 65, percent: 6, color: "bg-purple-500" },
  ];

  const monthlyLeadGrowth = [
    { month: "Jan", count: 180, growth: "+12%" },
    { month: "Feb", count: 240, growth: "+33%" },
    { month: "Mar", count: 320, growth: "+33%" },
    { month: "Apr", count: 480, growth: "+50%" },
    { month: "May", count: 650, growth: "+35%" },
    { month: "Jun", count: 820, growth: "+26%" },
  ];

  const maxGrowth = Math.max(...monthlyLeadGrowth.map((m) => m.count));

  const tenantActivity = [
    { tenant: "Skyline Realty", leads: 412, visits: 86, convRate: "20.8%", aiCalls: 340 },
    { tenant: "Apex Properties", leads: 265, visits: 48, convRate: "18.1%", aiCalls: 195 },
    { tenant: "Emerald Bay Realty", leads: 190, visits: 39, convRate: "20.5%", aiCalls: 140 },
    { tenant: "Horizon Estates", leads: 145, visits: 18, convRate: "12.4%", aiCalls: 80 },
  ];

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Platform Analytics"
        description="Comprehensive insights on pipeline performance, lead acquisition channels, and tenant volume."
      />

      {/* KPI Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total Leads Managed"
          value="1,100"
          sub="+28% this month"
          subTone="positive"
          icon={Users}
        />
        <KpiCard
          label="Platform Conversion Rate"
          value="18.6%"
          sub="Lead to closed deal"
          subTone="positive"
          icon={TrendingUp}
        />
        <KpiCard
          label="Site Visits Booked"
          value="191"
          sub="32 scheduled this week"
          subTone="positive"
          icon={Target}
        />
        <KpiCard
          label="AI Qualification Rate"
          value="74.2%"
          sub="Leads scored > 60"
          subTone="positive"
          icon={Flame}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Lead Ingestion */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Monthly Ingested Leads
              </h3>
              <span className="text-xs font-semibold text-emerald-500">+355% H1 Growth</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Total volume of leads captured across all tenant instances.
            </p>
          </div>

          <div className="flex items-end gap-3 h-48 pt-4">
            {monthlyLeadGrowth.map((item) => {
              const heightPct = Math.round((item.count / maxGrowth) * 100);
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold tabular-nums">{item.count}</span>
                  <div
                    className="w-full rounded-t-md bg-primary hover:bg-primary/90 transition-all duration-500"
                    style={{ height: `${heightPct}%` }}
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground">{item.month}</p>
                    <p className="text-[10px] text-emerald-500 font-semibold">{item.growth}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Source Acquisition */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Acquisition Channels
            </h3>
            <span className="text-xs text-muted-foreground">Top Channels</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Where prospective home buyers are discovering tenant listings.
          </p>

          <div className="space-y-4">
            {channelBreakdown.map((channel) => (
              <div key={channel.source}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-foreground">{channel.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs">{channel.leads} leads</span>
                    <span className="font-semibold tabular-nums">{channel.percent}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={`h-full ${channel.color} rounded-full transition-all duration-500`}
                    style={{ width: `${channel.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tenant Conversion Efficiency Table */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-1">Tenant Acquisition & Conversion Efficiency</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Comparative performance across primary operating real estate companies.
        </p>

        <div className="grid gap-4 md:grid-cols-4">
          {tenantActivity.map((t) => (
            <div key={t.tenant} className="p-4 rounded-lg border border-border bg-background/50 space-y-3">
              <p className="font-semibold text-foreground">{t.tenant}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Leads:</span>
                  <span className="font-medium text-foreground">{t.leads}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Site Visits:</span>
                  <span className="font-medium text-foreground">{t.visits}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>AI Calls:</span>
                  <span className="font-medium text-foreground">{t.aiCalls}</span>
                </div>
                <div className="flex justify-between text-muted-foreground pt-1 border-t border-border">
                  <span>Win Rate:</span>
                  <span className="font-bold text-emerald-500">{t.convRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
