"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AnnouncementsPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Announcements"
        description="View and manage announcements."
      />
      
      <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px]">
        <p className="text-lg font-medium">Announcements functionality coming soon.</p>
        <p className="text-sm mt-2 max-w-md">This page is a placeholder and will be populated with data and components in a future update.</p>
      </div>
    </div>
  );
}
