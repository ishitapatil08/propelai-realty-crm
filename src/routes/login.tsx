import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { UserAvatar } from "../components/ui/UserAvatar";
import { ArrowRight, Shield, Building2 } from "lucide-react";
import { Home as HomeIcon } from "lucide-react";
import { User, Tenant } from "../lib/types";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: LoginScreen,
});

function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
      display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
    }}>
      <HomeIcon size={size * 0.55} strokeWidth={2.4} />
    </div>
  );
}

function LoginScreen() {
  const { tenants, users, login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate({ to: "/" });
    }
  }, [currentUser, navigate]);

  const byTenant = (tid: string) => users.filter((u) => u.tenantId === tid);

  const onLogin = (u: User) => {
    login(u);
    navigate({ to: "/" });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(160deg, var(--ink) 0%, var(--ink-2) 100%)",
      color: "#fff", padding: "48px 20px", display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 36 }}>
        <BrandMark size={48} />
        <h1 className="propel-serif" style={{ fontSize: 34, fontWeight: 600, margin: 0 }}>PropelAI Realty OS</h1>
        <p style={{ color: "#9AA6BE", fontSize: 14, margin: 0, textAlign: "center", maxWidth: 460 }}>
          Phase 1 — Multi-tenant CRM MVP · pick a demo account to sign in
        </p>
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", width: "100%", maxWidth: 1100 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Shield size={16} style={{ color: "var(--gold-soft)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--gold-soft)" }}>Platform</span>
          </div>
          {users.filter((u) => u.role === "super_admin").map((u) => (
            <button key={u.id} onClick={() => onLogin(u)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
              background: "transparent", border: "none", cursor: "pointer", color: "#fff", textAlign: "left",
            }}>
              <UserAvatar name={u.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: "#9AA6BE" }}>Super Admin · {u.title}</div>
              </div>
              <ArrowRight size={16} style={{ color: "#9AA6BE" }} />
            </button>
          ))}
        </div>

        {tenants.map((t) => (
          <div key={t.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Building2 size={16} style={{ color: "var(--gold-soft)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gold-soft)" }}>{t.name}</span>
              </div>
              {t.status === "suspended" && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(178,58,50,0.2)", color: "#F0938D" }}>SUSPENDED</span>
              )}
            </div>
            {byTenant(t.id).map((u) => (
              <button key={u.id} disabled={t.status === "suspended"} onClick={() => onLogin(u)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
                background: "transparent", border: "none", cursor: t.status === "suspended" ? "not-allowed" : "pointer",
                color: "#fff", textAlign: "left", opacity: t.status === "suspended" ? 0.45 : 1,
              }}>
                <UserAvatar name={u.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: "#9AA6BE" }}>{u.role === "tenant_admin" ? "Tenant Admin" : "Staff"} · {u.title}</div>
                </div>
                {t.status !== "suspended" && <ArrowRight size={16} style={{ color: "#9AA6BE" }} />}
              </button>
            ))}
          </div>
        ))}
      </div>

      <p style={{ marginTop: 40, fontSize: 12, color: "#6B7690" }}>
        Mock authentication for demo purposes — Phase 1 has no real password layer yet.
      </p>
    </div>
  );
}
