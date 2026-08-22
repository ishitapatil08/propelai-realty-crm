import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, Calendar, Users, Eye, Sparkles, CheckCircle2 } from "lucide-react";

const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "AI Voice Bot V2.4 Released: Automatic Multi-Lingual Hindi & English Support",
    category: "Product Update",
    audience: "All Tenants",
    status: "Published",
    publishedAt: "2026-06-15",
    viewsCount: 318,
    excerpt:
      "Voice bot now dynamically switches languages based on caller preference, ensuring natural lead qualification in both English and Hindi.",
  },
  {
    id: "ann-2",
    title: "Scheduled Maintenance: Core Database Optimization on Sunday 2:00 AM IST",
    category: "Maintenance",
    audience: "All Tenants",
    status: "Published",
    publishedAt: "2026-06-10",
    viewsCount: 412,
    excerpt:
      "Expected 15 minutes of read-only mode while PostgreSQL read replicas and connection pools undergo planned version upgrades.",
  },
  {
    id: "ann-3",
    title: "New WhatsApp Business Catalog Sync Feature for Enterprise Tier",
    category: "Feature Highlight",
    audience: "Enterprise & Growth",
    status: "Draft",
    publishedAt: "Scheduled for July 1",
    viewsCount: 0,
    excerpt:
      "Directly attach multi-unit floorplans and pricing sheets into WhatsApp message templates with one-click brochure downloads.",
  },
];

export default function AnnouncementsPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Platform Announcements"
        description="Broadcast system updates, feature releases, and scheduled maintenance banners to all tenant dashboards."
        action={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Announcement
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">3 Active</p>
            <p className="text-xs text-muted-foreground">Broadcasts in circulation</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">730 Views</p>
            <p className="text-xs text-muted-foreground">Seen across admin portals</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">99.4%</p>
            <p className="text-xs text-muted-foreground">Tenant banner open rate</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_ANNOUNCEMENTS.map((ann) => (
          <div
            key={ann.id}
            className="rounded-xl border border-border bg-card p-6 space-y-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-semibold">
                  {ann.category}
                </Badge>
                <h3 className="font-semibold text-lg text-foreground">{ann.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={ann.status === "Published" ? "default" : "outline"}
                  className="text-xs"
                >
                  {ann.status}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{ann.excerpt}</p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Audience: {ann.audience}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {ann.publishedAt}
                </span>
                {ann.viewsCount > 0 && (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Eye className="w-3.5 h-3.5 text-primary" /> {ann.viewsCount} impressions
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
