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
import {
  CreditCard,
  CheckCircle2,
  DollarSign,
  Download,
  Building,
  ArrowUpRight,
  Receipt,
} from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

const MOCK_TRANSACTIONS = [
  {
    id: "tx_109283",
    invoiceNo: "INV-2026-0012",
    tenant: "Skyline Realty",
    plan: "Growth Plan",
    amount: "₹14,999",
    currency: "INR",
    gateway: "Stripe",
    status: "Succeeded",
    date: "2026-06-01",
  },
  {
    id: "tx_109282",
    invoiceNo: "INV-2026-0011",
    tenant: "Apex Properties",
    plan: "Starter Plan",
    amount: "₹4,999",
    currency: "INR",
    gateway: "Razorpay",
    status: "Succeeded",
    date: "2026-06-01",
  },
  {
    id: "tx_109281",
    invoiceNo: "INV-2026-0010",
    tenant: "Emerald Bay Realty",
    plan: "Growth Plan",
    amount: "₹14,999",
    currency: "INR",
    gateway: "Stripe",
    status: "Succeeded",
    date: "2026-05-15",
  },
  {
    id: "tx_109280",
    invoiceNo: "INV-2026-0009",
    tenant: "Horizon Estates",
    plan: "Enterprise Plan",
    amount: "₹49,999",
    currency: "INR",
    gateway: "Razorpay",
    status: "Failed",
    date: "2026-05-01",
  },
  {
    id: "tx_109279",
    invoiceNo: "INV-2026-0008",
    tenant: "Skyline Realty",
    plan: "Growth Plan",
    amount: "₹14,999",
    currency: "INR",
    gateway: "Stripe",
    status: "Succeeded",
    date: "2026-05-01",
  },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Subscription Billing & Payments"
        description="Monitor automated recurring subscription payments, gateways, and invoicing history."
        action={
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Invoices CSV
          </Button>
        }
      />

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total Collected (YTD)"
          value="₹3,48,970"
          sub="Processed automatically"
          subTone="positive"
          icon={DollarSign}
        />
        <KpiCard
          label="Successful Charges"
          value="98.4%"
          sub="Low churn & chargebacks"
          subTone="positive"
          icon={CheckCircle2}
        />
        <KpiCard
          label="Active Subscriptions"
          value="3"
          sub="Auto-renew active"
          subTone="neutral"
          icon={CreditCard}
        />
        <KpiCard
          label="Pending Invoices"
          value="1"
          sub="Retrying payment"
          subTone="negative"
          icon={Receipt}
        />
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Recent Platform Invoices</h3>
            <p className="text-sm text-muted-foreground">Detailed history of tenant subscription charges</p>
          </div>
          <Badge variant="outline" className="font-normal text-xs">
            Live Gateway Sync
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Subscription Plan</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TRANSACTIONS.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono text-xs font-semibold">{tx.invoiceNo}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-muted-foreground" />
                    {tx.tenant}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{tx.plan}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {tx.gateway}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold tabular-nums text-foreground">
                  {tx.amount}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={tx.status === "Succeeded" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                  {tx.date}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                    View
                    <ArrowUpRight className="w-3 h-3" />
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
