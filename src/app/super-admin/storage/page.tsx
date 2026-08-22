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
import { HardDrive, FileText, Image as ImageIcon, Mic, Database, Building } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

const MOCK_STORAGE_DATA = [
  {
    tenant: "Skyline Realty",
    plan: "Growth (50 GB)",
    imagesSize: "14.2 GB",
    docsSize: "3.8 GB",
    audioSize: "6.5 GB",
    totalUsed: "24.5 GB",
    percentUsed: 49,
    filesCount: 1420,
  },
  {
    tenant: "Apex Properties",
    plan: "Starter (10 GB)",
    imagesSize: "4.8 GB",
    docsSize: "1.2 GB",
    audioSize: "1.9 GB",
    totalUsed: "7.9 GB",
    percentUsed: 79,
    filesCount: 610,
  },
  {
    tenant: "Emerald Bay Realty",
    plan: "Growth (50 GB)",
    imagesSize: "8.4 GB",
    docsSize: "2.1 GB",
    audioSize: "3.2 GB",
    totalUsed: "13.7 GB",
    percentUsed: 27,
    filesCount: 890,
  },
  {
    tenant: "Horizon Estates",
    plan: "Enterprise (250 GB)",
    imagesSize: "18.5 GB",
    docsSize: "5.4 GB",
    audioSize: "8.1 GB",
    totalUsed: "32.0 GB",
    percentUsed: 13,
    filesCount: 1950,
  },
];

export default function StoragePage() {
  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Asset Storage & Media"
        description="Monitor property photos, floor plans, brochure PDFs, and call audio recordings stored on S3 & Supabase Storage."
      />

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total Storage Used"
          value="78.1 GB"
          sub="Across all S3 Buckets"
          subTone="neutral"
          icon={HardDrive}
        />
        <KpiCard
          label="Property Images"
          value="45.9 GB"
          sub="3,200 High-Res Photos"
          subTone="neutral"
          icon={ImageIcon}
        />
        <KpiCard
          label="Brochures & Floorplans"
          value="12.5 GB"
          sub="840 PDF Documents"
          subTone="neutral"
          icon={FileText}
        />
        <KpiCard
          label="Voice Audio Streams"
          value="19.7 GB"
          sub="Call recordings archived"
          subTone="neutral"
          icon={Mic}
        />
      </div>

      {/* Tenant Storage Allocation Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Tenant Storage Quotas</h3>
            <p className="text-sm text-muted-foreground">Disk space utilized by uploaded files and media</p>
          </div>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Database className="w-3.5 h-3.5" />
            Object Storage Healthy
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant Organization</TableHead>
              <TableHead>Storage Plan</TableHead>
              <TableHead className="text-center">Files Uploaded</TableHead>
              <TableHead className="text-center">Photos</TableHead>
              <TableHead className="text-center">PDFs</TableHead>
              <TableHead className="text-center">Audio</TableHead>
              <TableHead className="text-right">Total Used</TableHead>
              <TableHead className="w-[180px]">Capacity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_STORAGE_DATA.map((row) => (
              <TableRow key={row.tenant}>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Building className="w-3.5 h-3.5 text-muted-foreground" />
                    {row.tenant}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{row.plan}</TableCell>
                <TableCell className="text-center font-medium tabular-nums">
                  {row.filesCount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                  {row.imagesSize}
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                  {row.docsSize}
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                  {row.audioSize}
                </TableCell>
                <TableCell className="text-right font-bold text-foreground tabular-nums">
                  {row.totalUsed}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{row.percentUsed}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          row.percentUsed > 75 ? "bg-amber-500" : "bg-primary"
                        }`}
                        style={{ width: `${row.percentUsed}%` }}
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
