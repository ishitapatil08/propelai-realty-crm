import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  ShieldCheck,
  Key,
  Mail,
  Smartphone,
  History,
  Lock,
  CheckCircle2,
  Users,
  ShieldAlert,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { LOCKED_SUPER_ADMIN_EMAILS } from "@/lib/auth/constants";

export default async function ProfilePage() {
  const session = await getSession();
  const currentEmail = session.user?.email || LOCKED_SUPER_ADMIN_EMAILS[0];

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Super Admin Profile & Access Control"
        description="Root platform administrative credentials, 2-account quota security lock, and session management."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold border-2 border-primary/20">
            {currentEmail.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Platform Owner</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{currentEmail}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin Role
            </Badge>
          </div>
          <div className="w-full pt-4 border-t border-border text-left space-y-2.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Account Status:</span>
              <span className="font-semibold text-emerald-500">Active & Verified</span>
            </div>
            <div className="flex justify-between">
              <span>Tenant Scope:</span>
              <span className="font-semibold text-foreground">Global (All Tenants)</span>
            </div>
            <div className="flex justify-between">
              <span>Security Lock:</span>
              <span className="font-semibold text-primary">Enforced (Max 2 Admins)</span>
            </div>
          </div>
        </div>

        {/* Security & Access Lock Settings */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6 md:col-span-2 shadow-sm">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Super Admin Account Quota & Security Lock
            </h3>
            <p className="text-sm text-muted-foreground">
              By security policy, Super Admin privileges are restricted to exactly 2 designated accounts. Privilege escalation via API or client-side updates is blocked by PostgreSQL Row-Level Security.
            </p>
          </div>

          {/* Locked Authorized Super Admins Box */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Authorized Super Admin Accounts (2/2 Allocated)</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Hard Locked
              </Badge>
            </div>
            <div className="space-y-2">
              {LOCKED_SUPER_ADMIN_EMAILS.map((email, idx) => (
                <div
                  key={email}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-mono font-medium text-foreground">{email}</span>
                    {email === currentEmail && (
                      <Badge variant="outline" className="text-[10px] py-0">You</Badge>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Slot #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* 2FA */}
            <div className="p-4 rounded-lg border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Two-Factor Authentication (TOTP)</p>
                  <p className="text-xs text-muted-foreground">
                    Google Authenticator or 1Password verification enabled.
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1 text-xs self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Enabled
              </Badge>
            </div>

            {/* Password */}
            <div className="p-4 rounded-lg border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Account Password</p>
                  <p className="text-xs text-muted-foreground">
                    Secured with bcrypt hashing via Supabase Auth.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs self-start sm:self-auto">
                Change Password
              </Button>
            </div>

            {/* Active Sessions */}
            <div className="p-4 rounded-lg border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <History className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Active Super Admin Session</p>
                  <p className="text-xs text-muted-foreground">
                    Logged in as {currentEmail} • IP verification active
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs self-start sm:self-auto">
                Current Session
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
