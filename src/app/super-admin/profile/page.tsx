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
} from "lucide-react";
import { getSession } from "@/lib/auth/session";

export default async function ProfilePage() {
  const session = await getSession();
  const email = session.user?.email || "superadmin@propelai.com";

  return (
    <div className="space-y-8 fade-in-up">
      <PageHeader
        title="Super Admin Profile"
        description="Manage your platform root credentials, security authentication methods, and administrative session history."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold border-2 border-primary/20">
            {email.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Platform Owner</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin Role
            </Badge>
          </div>
          <div className="w-full pt-4 border-t border-border text-left space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Account Status:</span>
              <span className="font-semibold text-emerald-500">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Tenant Scope:</span>
              <span className="font-semibold text-foreground">Global (All Tenants)</span>
            </div>
            <div className="flex justify-between">
              <span>Member Since:</span>
              <span className="font-semibold text-foreground">Jan 2026</span>
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6 md:col-span-2 shadow-sm">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Authentication & Security
            </h3>
            <p className="text-sm text-muted-foreground">
              Protect your administrative access with multi-factor authentication and strong credentials.
            </p>
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
                    Last changed 45 days ago • Strength: Very Strong
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
                    Current Device (Chrome on Windows) • IP: 103.21.244.18
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
