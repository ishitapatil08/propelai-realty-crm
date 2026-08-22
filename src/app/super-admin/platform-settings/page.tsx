import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Bot,
  MessageSquare,
  Shield,
  Database,
  Lock,
  Save,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export default function PlatformSettingsPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Platform & Global Configuration"
        description="Configure multi-tenant isolation, AI model defaults, WhatsApp Business API endpoints, and global platform security."
        action={
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Platform Settings
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI & Voice Engine Configuration */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Bot className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold">AI Voice & LLM Engine</h3>
              <p className="text-xs text-muted-foreground">Default models for outbound voice qualification</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Primary Conversational Model
              </label>
              <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between font-mono text-xs">
                <span>gpt-4o-realtime-preview (Voice API)</span>
                <Badge variant="secondary" className="text-[10px]">Active</Badge>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Fallback Qualification Model
              </label>
              <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between font-mono text-xs">
                <span>claude-3-5-sonnet-20241022</span>
                <Badge variant="outline" className="text-[10px]">Configured</Badge>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Voice Synthesis & STT Engine
              </label>
              <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between font-mono text-xs">
                <span>ElevenLabs Realtime STT/TTS (Hindi + Indian English)</span>
                <Badge variant="secondary" className="text-[10px]">Lat: 180ms</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp & Integrations */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="font-semibold">Meta WhatsApp Cloud API</h3>
              <p className="text-xs text-muted-foreground">Global gateway & webhook configuration</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Meta Business Account ID
              </label>
              <div className="p-3 rounded-lg border border-border bg-background font-mono text-xs text-muted-foreground">
                waba_act_892109384729102
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Webhook Verification URL
              </label>
              <div className="p-3 rounded-lg border border-border bg-background font-mono text-xs text-muted-foreground truncate">
                https://propelai.realty/api/webhooks/whatsapp
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Rate Limit Tier
              </label>
              <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between text-xs">
                <span>Tier 2 (10,000 conversations / 24 hrs)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Tenant Security & Isolation */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold">Security & RLS Isolation</h3>
              <p className="text-xs text-muted-foreground">PostgreSQL Row-Level Security enforcement</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium">PostgreSQL Row-Level Security (RLS)</p>
                <p className="text-xs text-muted-foreground">Enforced on all 14 database schema tables</p>
              </div>
              <Badge variant="default" className="text-xs">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium">Mandatory 2FA for Tenant Admins</p>
                <p className="text-xs text-muted-foreground">Require TOTP authentication on login</p>
              </div>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium">Super Admin Impersonation TTL</p>
                <p className="text-xs text-muted-foreground">Automatic session expiry after 60 minutes</p>
              </div>
              <Badge variant="outline" className="text-xs">60 min</Badge>
            </div>
          </div>
        </div>

        {/* Database & Infrastructure */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Database className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold">Database & Infrastructure</h3>
              <p className="text-xs text-muted-foreground">Supabase PostgreSQL & Connection Pool</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium">Database Cluster</p>
                <p className="text-xs text-muted-foreground">Supabase Postgres 15 (ap-south-1 Mumbai)</p>
              </div>
              <Badge variant="secondary" className="text-xs">Healthy</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium">PgBouncer Connection Pool</p>
                <p className="text-xs text-muted-foreground">Max 250 concurrent tenant client connections</p>
              </div>
              <Badge variant="outline" className="text-xs">18/250 Used</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div>
                <p className="text-sm font-medium">Daily Encrypted Snapshots</p>
                <p className="text-xs text-muted-foreground">Automated 30-day retention schedule</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
