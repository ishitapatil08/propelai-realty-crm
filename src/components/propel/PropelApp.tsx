import React, { useState } from "react";
import {
  Building2, Users, UserPlus, Phone, LogOut, Plus, Search, X,
  TrendingUp, Shield, Briefcase, Trash2, Edit2,
  ArrowRight, Ban, PlayCircle, Home as HomeIcon,
} from "lucide-react";

/* ============================================================
   PropelAI Realty OS — Phase 1 MVP (single-file)
   Multi-tenant CRM: leads, staff, dashboards, mock auth.
   In-memory only — resets on reload.
============================================================ */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap');`;

const THEME_CSS = `
:root {
  --paper: #FBF8F1;
  --paper-2: #F3EEE2;
  --ink: #1B2130;
  --ink-2: #262E42;
  --ink-3: #323C55;
  --slate: #5B6472;
  --line: #E6DFCB;
  --gold: #C9A227;
  --gold-dark: #8A6D2F;
  --gold-soft: #E8C766;
  --forest: #2F6F4F;
  --rust: #B23A32;
  --sand: #EFE6D2;
}
.propel-root { font-family: 'Work Sans', system-ui, sans-serif; color: var(--ink); background: var(--paper); min-height: 100vh; }
.propel-serif { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
.propel-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.propel-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
`;

const PLAN_PRICE: Record<string, number> = { Starter: 2999, Growth: 8999, Enterprise: 24999 };
const STATUSES = ["New", "Contacted", "Qualified", "Visit Scheduled", "Won", "Lost"] as const;
type Status = typeof STATUSES[number];
const STATUS_COLOR: Record<Status, string> = {
  New: "#5B6472",
  Contacted: "#8A6D2F",
  Qualified: "#C9A227",
  "Visit Scheduled": "#2E5C8A",
  Won: "#2F6F4F",
  Lost: "#B23A32",
};
const SOURCES = ["Facebook Ads", "Google Ads", "99acres", "MagicBricks", "Housing.com", "Manual Entry", "Referral"];

let _id = 1000;
const nextId = (p: string) => `${p}${_id++}`;

type Tenant = { id: string; name: string; plan: string; status: "active" | "suspended"; createdAt: string };
type Role = "super_admin" | "tenant_admin" | "staff";
type User = { id: string; tenantId: string | null; role: Role; name: string; title: string };
type Interaction = { id: string; note: string; byUserId: string; createdAt: string };
type Lead = {
  id: string; tenantId: string; name: string; phone: string; source: string;
  budget: number; status: Status; assignedUserId: string | null; score: number;
  createdAt: string; interactions: Interaction[];
};

const seedTenants: Tenant[] = [
  { id: "t1", name: "Skyline Realty", plan: "Growth", status: "active", createdAt: "2026-03-02" },
  { id: "t2", name: "Horizon Builders", plan: "Enterprise", status: "active", createdAt: "2026-01-14" },
  { id: "t3", name: "CityNest Brokers", plan: "Starter", status: "suspended", createdAt: "2026-05-20" },
];

const seedUsers: User[] = [
  { id: "u0", tenantId: null, role: "super_admin", name: "Alex Rao", title: "Product Owner" },
  { id: "u1", tenantId: "t1", role: "tenant_admin", name: "Priya Shah", title: "Founder" },
  { id: "u2", tenantId: "t1", role: "staff", name: "Rohan Verma", title: "Sales Agent" },
  { id: "u3", tenantId: "t1", role: "staff", name: "Meera Iyer", title: "Sales Agent" },
  { id: "u4", tenantId: "t2", role: "tenant_admin", name: "Karan Mehta", title: "Sales Director" },
  { id: "u5", tenantId: "t2", role: "staff", name: "Ananya Bose", title: "Sales Agent" },
  { id: "u6", tenantId: "t3", role: "tenant_admin", name: "Devraj Nair", title: "Owner" },
];

const seedLeads: Lead[] = [
  { id: "l1", tenantId: "t1", name: "Neha Kulkarni", phone: "+91 98200 11223", source: "Facebook Ads", budget: 8500000, status: "New", assignedUserId: "u2", score: 62, createdAt: "2026-07-08", interactions: [] },
  { id: "l2", tenantId: "t1", name: "Arjun Malhotra", phone: "+91 99870 44521", source: "99acres", budget: 12000000, status: "Contacted", assignedUserId: "u2", score: 74, createdAt: "2026-07-07", interactions: [{ id: nextId("i"), note: "Called, interested in 3BHK, wants pricing sheet.", byUserId: "u2", createdAt: "2026-07-08" }] },
  { id: "l3", tenantId: "t1", name: "Sana Sheikh", phone: "+91 90210 88712", source: "Google Ads", budget: 6000000, status: "Qualified", assignedUserId: "u3", score: 81, createdAt: "2026-07-05", interactions: [] },
  { id: "l4", tenantId: "t1", name: "Vikram Desai", phone: "+91 98765 43210", source: "MagicBricks", budget: 15000000, status: "Visit Scheduled", assignedUserId: "u3", score: 88, createdAt: "2026-07-01", interactions: [] },
  { id: "l5", tenantId: "t1", name: "Ritu Choudhary", phone: "+91 97654 32109", source: "Referral", budget: 9500000, status: "Won", assignedUserId: "u2", score: 95, createdAt: "2026-06-20", interactions: [] },
  { id: "l6", tenantId: "t1", name: "Faisal Ahmed", phone: "+91 96543 21098", source: "Housing.com", budget: 4500000, status: "Lost", assignedUserId: "u3", score: 30, createdAt: "2026-06-18", interactions: [] },
  { id: "l7", tenantId: "t1", name: "Ishaan Kapoor", phone: "+91 95432 10987", source: "Facebook Ads", budget: 7200000, status: "New", assignedUserId: null, score: 55, createdAt: "2026-07-09", interactions: [] },
  { id: "l8", tenantId: "t2", name: "Ayesha Khan", phone: "+91 89123 45678", source: "99acres", budget: 22000000, status: "New", assignedUserId: "u5", score: 70, createdAt: "2026-07-09", interactions: [] },
  { id: "l9", tenantId: "t2", name: "Rahul Bansal", phone: "+91 88234 56789", source: "Google Ads", budget: 30000000, status: "Contacted", assignedUserId: "u5", score: 77, createdAt: "2026-07-06", interactions: [] },
  { id: "l10", tenantId: "t2", name: "Divya Menon", phone: "+91 87345 67890", source: "Referral", budget: 18000000, status: "Visit Scheduled", assignedUserId: "u5", score: 90, createdAt: "2026-07-02", interactions: [] },
  { id: "l11", tenantId: "t2", name: "Yusuf Ali", phone: "+91 86456 78901", source: "MagicBricks", budget: 12500000, status: "Won", assignedUserId: "u5", score: 92, createdAt: "2026-06-25", interactions: [] },
  { id: "l12", tenantId: "t2", name: "Kavya Reddy", phone: "+91 85567 89012", source: "Housing.com", budget: 9000000, status: "New", assignedUserId: null, score: 48, createdAt: "2026-07-10", interactions: [] },
];

function fmtINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--ink-2), var(--ink))",
      color: "var(--gold-soft)", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Work Sans',sans-serif", fontWeight: 600, fontSize: size * 0.38, flexShrink: 0,
    }}>{initials(name)}</div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "var(--forest)" : score >= 50 ? "var(--gold-dark)" : "var(--rust)";
  const deg = Math.round((score / 100) * 360);
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "50%",
      background: `conic-gradient(${color} ${deg}deg, var(--sand) 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", background: "var(--paper)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 12, color,
      }}>{score}</div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const c = STATUS_COLOR[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: `${c}18`, color: c,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: React.ReactNode; sub?: string; icon?: any }) {
  return (
    <div style={{
      background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14,
      padding: 18, display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--slate)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        {Icon && <Icon size={16} style={{ color: "var(--gold-dark)" }} />}
      </div>
      <div className="propel-serif" style={{ fontSize: 28, fontWeight: 600 }}>{value}</div>
      {sub && <span style={{ fontSize: 12, color: "var(--slate)" }}>{sub}</span>}
    </div>
  );
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(20,25,40,0.55)", zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--paper)", maxWidth: wide ? 640 : 460, width: "100%",
        borderRadius: 16, border: "1px solid var(--line)", display: "flex", flexDirection: "column", maxHeight: "88vh",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
          <h3 className="propel-serif" style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <div className="propel-scroll" style={{ padding: 20, overflow: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: "'Work Sans',sans-serif", fontSize: 14, padding: "9px 12px",
  borderRadius: 8, border: "1px solid var(--line)", background: "#fff", color: "var(--ink)", outline: "none", width: "100%",
};

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }}
    onFocus={(e) => (e.target.style.borderColor = "var(--gold-dark)")}
    onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />;
}
function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}

function PrimaryButton({ children, onClick, icon: Icon, type = "button", full }: { children: React.ReactNode; onClick?: () => void; icon?: any; type?: "button" | "submit"; full?: boolean }) {
  return (
    <button type={type} onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "10px 16px", borderRadius: 10, background: "var(--ink)", color: "var(--gold-soft)",
      border: "1px solid var(--ink)", fontFamily: "'Work Sans',sans-serif", fontSize: 13.5, fontWeight: 600,
      cursor: "pointer", width: full ? "100%" : undefined,
    }}>
      {Icon && <Icon size={15} />}{children}
    </button>
  );
}
function GhostButton({ children, onClick, icon: Icon, danger }: { children: React.ReactNode; onClick?: () => void; icon?: any; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px",
      borderRadius: 10, background: "transparent", color: danger ? "var(--rust)" : "var(--ink)",
      border: "1px solid var(--line)", fontFamily: "'Work Sans',sans-serif", fontSize: 13.5, fontWeight: 500, cursor: "pointer",
    }}>
      {Icon && <Icon size={15} />}{children}
    </button>
  );
}

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

/* ----------------------------- Login ----------------------------- */
function LoginScreen({ tenants, users, onLogin }: { tenants: Tenant[]; users: User[]; onLogin: (u: User) => void }) {
  const byTenant = (tid: string) => users.filter((u) => u.tenantId === tid);
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
              <Avatar name={u.name} />
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
                <Avatar name={u.name} />
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

/* ------------------------------ Sidebar ------------------------------ */
function Sidebar({ user, tenant, tab, setTab, onLogout, tabs }: {
  user: User; tenant: Tenant | null; tab: string; setTab: (k: string) => void; onLogout: () => void;
  tabs: { key: string; label: string; icon: any }[];
}) {
  return (
    <aside style={{
      width: 260, background: "var(--ink)", color: "#fff", padding: 20,
      display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0,
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <BrandMark size={32} />
          <span className="propel-serif" style={{ fontSize: 18, fontWeight: 600 }}>PropelAI</span>
        </div>
        <div style={{ padding: "10px 12px", background: "var(--ink-2)", borderRadius: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gold-soft)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {user.role === "super_admin" ? "Platform" : tenant?.name}
          </span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8,
                background: active ? "var(--ink-2)" : "transparent",
                color: active ? "var(--gold-soft)" : "#9AA6BE",
                fontFamily: "'Work Sans',sans-serif", fontSize: 13.5, fontWeight: active ? 600 : 500,
                border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <Icon size={16} />{t.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 6px" }}>
          <Avatar name={user.name} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#9AA6BE" }}>{user.title}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          marginTop: 8, width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: "9px 12px", borderRadius: 8, background: "transparent",
          color: "#9AA6BE", border: "1px solid rgba(255,255,255,0.08)",
          fontFamily: "'Work Sans',sans-serif", fontSize: 12.5, cursor: "pointer",
        }}>
          <LogOut size={14} /> Switch account
        </button>
      </div>
    </aside>
  );
}

/* --------------------------- Lead Modal --------------------------- */
function LeadModal({ initial, staff, onSave, onClose }: { initial: Lead | null; staff: User[]; onSave: (l: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>(initial || { name: "", phone: "", source: SOURCES[0], budget: "", status: "New", assignedUserId: "", score: 50 });
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  return (
    <Modal title={initial ? "Edit lead" : "Add lead"} onClose={onClose}>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!form.name || !form.phone) return;
        onSave({ ...form, budget: Number(form.budget) || 0, score: Number(form.score) || 0, assignedUserId: form.assignedUserId || null });
      }}>
        <Field label="Name"><TextInput value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Neha Kulkarni" /></Field>
        <Field label="Phone"><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98XXX XXXXX" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Source">
            <SelectInput value={form.source} onChange={(e) => set("source", e.target.value)}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </SelectInput>
          </Field>
          <Field label="Budget (INR)"><TextInput type="number" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="8500000" /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Status">
            <SelectInput value={form.status} onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </SelectInput>
          </Field>
          <Field label="Assigned to">
            <SelectInput value={form.assignedUserId || ""} onChange={(e) => set("assignedUserId", e.target.value)}>
              <option value="">Unassigned</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </SelectInput>
          </Field>
        </div>
        <Field label={`Score: ${form.score}`}>
          <input type="range" min={0} max={100} value={form.score} onChange={(e) => set("score", e.target.value)} style={{ width: "100%" }} />
        </Field>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <PrimaryButton type="submit">{initial ? "Save changes" : "Add lead"}</PrimaryButton>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------- Lead Drawer -------------------------- */
function LeadDrawer({ lead, staff, onClose, onAddInteraction, onStatusChange }: {
  lead: Lead; staff: User[]; onClose: () => void;
  onAddInteraction: (note: string) => void; onStatusChange: (s: Status) => void;
}) {
  const [note, setNote] = useState("");
  const assignee = staff.find((s) => s.id === lead.assignedUserId);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,25,40,0.55)", zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} className="propel-scroll" style={{
        width: "100%", maxWidth: 520, background: "var(--paper)", height: "100%", overflow: "auto", padding: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 className="propel-serif" style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{lead.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, color: "var(--slate)", fontSize: 13 }}>
              <Phone size={13} />{lead.phone}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)" }}><X size={20} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
          <div style={{ padding: 12, background: "var(--paper-2)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, textTransform: "uppercase" }}>Budget</div>
            <div className="propel-serif" style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{fmtINR(lead.budget)}</div>
          </div>
          <div style={{ padding: 12, background: "var(--paper-2)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, textTransform: "uppercase" }}>Source</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{lead.source}</div>
          </div>
          <div style={{ padding: 12, background: "var(--paper-2)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, textTransform: "uppercase" }}>Assigned</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{assignee ? assignee.name : "Unassigned"}</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>Move stage</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {STATUSES.map((s) => (
              <button key={s} onClick={() => onStatusChange(s)} style={{
                padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                background: s === lead.status ? STATUS_COLOR[s] : `${STATUS_COLOR[s]}18`,
                color: s === lead.status ? "#fff" : STATUS_COLOR[s],
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>Unified timeline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {lead.interactions.length === 0 && <p style={{ fontSize: 13, color: "var(--slate)", margin: 0 }}>No interactions logged yet.</p>}
          {[...lead.interactions].reverse().map((i) => (
            <div key={i.id} style={{ padding: 12, background: "#fff", borderRadius: 10, border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate)", marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{staff.find((s) => s.id === i.byUserId)?.name || "System"}</span>
                <span>{i.createdAt}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13.5 }}>{i.note}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <TextInput value={note} onChange={(e) => setNote(e.target.value)} placeholder="Log a call, WhatsApp, or note…" />
          <PrimaryButton onClick={() => { if (!note.trim()) return; onAddInteraction(note.trim()); setNote(""); }}>Log</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Leads Table --------------------------- */
function LeadsTable({ leads, staff, canAssign, onOpen, onEdit, onDelete, onAssign }: {
  leads: Lead[]; staff: User[]; canAssign: boolean;
  onOpen: (l: Lead) => void; onEdit: (l: Lead) => void; onDelete: (id: string) => void; onAssign: (id: string, uid: string | null) => void;
}) {
  const headers = ["Lead", "Source", "Budget", "Status", "Score", canAssign ? "Assigned to" : null, ""].filter(Boolean) as string[];
  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead style={{ background: "var(--paper-2)" }}>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => onOpen(l)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={l.name} size={34} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{l.name}</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }}>{l.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", color: "var(--slate)" }}>{l.source}</td>
                <td style={{ padding: "12px 14px", fontWeight: 600 }}>{fmtINR(l.budget)}</td>
                <td style={{ padding: "12px 14px" }}><StatusPill status={l.status} /></td>
                <td style={{ padding: "12px 14px" }}><ScoreRing score={l.score} /></td>
                {canAssign && (
                  <td style={{ padding: "12px 14px" }}>
                    <SelectInput value={l.assignedUserId || ""} onChange={(e) => onAssign(l.id, e.target.value || null)} style={{ fontSize: 12.5, padding: "6px 8px", width: 150 }}>
                      <option value="">Unassigned</option>
                      {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </SelectInput>
                  </td>
                )}
                <td style={{ padding: "12px 14px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 4 }}>
                    <button onClick={() => onEdit(l)} style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "var(--slate)", borderRadius: 6 }}><Edit2 size={14} /></button>
                    <button onClick={() => onDelete(l.id)} style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "var(--rust)", borderRadius: 6 }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={headers.length} style={{ padding: 40, textAlign: "center", color: "var(--slate)" }}>No leads match this view yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------- Funnel ----------------------------- */
function Funnel({ leads }: { leads: Lead[] }) {
  const max = Math.max(1, ...STATUSES.map((s) => leads.filter((l) => l.status === s).length));
  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: 20 }}>
      <h3 className="propel-serif" style={{ fontSize: 16, fontWeight: 600, margin: 0, marginBottom: 16 }}>Pipeline by stage</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STATUSES.map((s) => {
          const count = leads.filter((l) => l.status === s).length;
          return (
            <div key={s} style={{ display: "grid", gridTemplateColumns: "130px 1fr 40px", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{s}</span>
              <div style={{ height: 10, background: "var(--paper-2)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / max) * 100}%`, background: STATUS_COLOR[s], borderRadius: 999, transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------ Role dashboards ------------------------ */
function SuperAdminDashboard({ tenants, users, leads }: { tenants: Tenant[]; users: User[]; leads: Lead[] }) {
  const activeT = tenants.filter((t) => t.status === "active");
  const mrr = activeT.reduce((sum, t) => sum + (PLAN_PRICE[t.plan] || 0), 0);
  return (
    <div>
      <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Platform overview</h1>
      <p style={{ color: "var(--slate)", marginTop: 4, marginBottom: 24 }}>Across every tenant workspace on PropelAI Realty OS.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Active tenants" value={activeT.length} sub={`${tenants.length} total`} icon={Building2} />
        <StatCard label="MRR" value={`₹${(mrr / 1000).toFixed(1)}K`} sub="from active plans" icon={TrendingUp} />
        <StatCard label="Users" value={users.filter((u) => u.role !== "super_admin").length} icon={Users} />
        <StatCard label="Leads in system" value={leads.length} icon={Phone} />
      </div>
      <Funnel leads={leads} />
    </div>
  );
}

function TenantsPanel({ tenants, users, leads, onToggleStatus, onCreate }: {
  tenants: Tenant[]; users: User[]; leads: Lead[]; onToggleStatus: (id: string) => void; onCreate: () => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Tenants</h1>
          <p style={{ color: "var(--slate)", marginTop: 4, margin: 0 }}>Create, suspend, and monitor licensed workspaces.</p>
        </div>
        <PrimaryButton icon={Plus} onClick={onCreate}>New tenant</PrimaryButton>
      </div>
      <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead style={{ background: "var(--paper-2)" }}>
            <tr>
              {["Tenant", "Plan", "Staff", "Leads", "Status", ""].map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => {
              const staffCount = users.filter((u) => u.tenantId === t.id).length;
              const leadCount = leads.filter((l) => l.tenantId === t.id).length;
              return (
                <tr key={t.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>since {t.createdAt}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>{t.plan} · ₹{PLAN_PRICE[t.plan].toLocaleString("en-IN")}/mo</td>
                  <td style={{ padding: "12px 14px" }}>{staffCount}</td>
                  <td style={{ padding: "12px 14px" }}>{leadCount}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                      background: t.status === "active" ? "rgba(47,111,79,0.14)" : "rgba(178,58,50,0.14)",
                      color: t.status === "active" ? "var(--forest)" : "var(--rust)",
                      textTransform: "uppercase",
                    }}>{t.status}</span>
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <button onClick={() => onToggleStatus(t.id)} style={{
                      display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
                      fontSize: 12, fontWeight: 600, color: t.status === "active" ? "var(--rust)" : "var(--forest)",
                    }}>
                      {t.status === "active" ? <><Ban size={13} /> Suspend</> : <><PlayCircle size={13} /> Activate</>}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TenantAdminDashboard({ tenant, leads, staff }: { tenant: Tenant | null; leads: Lead[]; staff: User[] }) {
  const won = leads.filter((l) => l.status === "Won").length;
  const conv = leads.length ? Math.round((won / leads.length) * 100) : 0;
  return (
    <div>
      <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>{tenant?.name} — Dashboard</h1>
      <p style={{ color: "var(--slate)", marginTop: 4, marginBottom: 24 }}>{tenant?.plan} plan · team-wide view</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Total leads" value={leads.length} icon={Phone} />
        <StatCard label="Won deals" value={won} icon={Briefcase} />
        <StatCard label="Conversion" value={`${conv}%`} icon={TrendingUp} />
        <StatCard label="Staff" value={staff.length} icon={Users} />
      </div>
      <Funnel leads={leads} />
    </div>
  );
}

function StaffDashboard({ leads, user }: { leads: Lead[]; user: User }) {
  const scheduled = leads.filter((l) => l.status === "Visit Scheduled").length;
  const won = leads.filter((l) => l.status === "Won").length;
  return (
    <div>
      <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Welcome back, {user.name.split(" ")[0]}</h1>
      <p style={{ color: "var(--slate)", marginTop: 4, marginBottom: 24 }}>Here's what's assigned to you today.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard label="Assigned leads" value={leads.length} icon={Phone} />
        <StatCard label="Visits scheduled" value={scheduled} icon={Briefcase} />
        <StatCard label="Won" value={won} icon={TrendingUp} />
      </div>
      <Funnel leads={leads} />
    </div>
  );
}

function StaffPanel({ staff, leads, onInvite }: { staff: User[]; leads: Lead[]; onInvite: () => void }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
        <div>
          <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Staff</h1>
          <p style={{ color: "var(--slate)", marginTop: 4, margin: 0 }}>Invite agents and see their assigned load.</p>
        </div>
        <PrimaryButton icon={UserPlus} onClick={onInvite}>Invite staff</PrimaryButton>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {staff.map((s) => {
          const assigned = leads.filter((l) => l.assignedUserId === s.id);
          return (
            <div key={s.id} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <Avatar name={s.name} size={42} />
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>{s.title}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--slate)" }}>
                <Phone size={13} /> {assigned.length} leads assigned
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------- Modals ---------------------------- */
function NewTenantModal({ onClose, onCreate }: { onClose: () => void; onCreate: (t: { name: string; plan: string }) => void }) {
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("Starter");
  return (
    <Modal title="Create new tenant" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; onCreate({ name: name.trim(), plan }); }}>
        <Field label="Workspace name"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Coastal Estates" /></Field>
        <Field label="Plan">
          <SelectInput value={plan} onChange={(e) => setPlan(e.target.value)}>
            {Object.keys(PLAN_PRICE).map((p) => <option key={p}>{p}</option>)}
          </SelectInput>
        </Field>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <PrimaryButton type="submit">Create tenant</PrimaryButton>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
        </div>
      </form>
    </Modal>
  );
}

function InviteStaffModal({ onClose, onInvite }: { onClose: () => void; onInvite: (name: string, title: string) => void }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("Sales Agent");
  return (
    <Modal title="Invite staff member" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; onInvite(name.trim(), title); }}>
        <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sameer Joshi" /></Field>
        <Field label="Title"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <PrimaryButton type="submit">Send invite</PrimaryButton>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------ App ------------------------------ */
export default function PropelApp() {
  const [tenants, setTenants] = useState<Tenant[]>(seedTenants);
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tab, setTab] = useState("dashboard");
  const [leadModal, setLeadModal] = useState<{ mode: "new" | "edit"; lead?: Lead } | null>(null);
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [newTenantOpen, setNewTenantOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const tenant = currentUser?.tenantId ? tenants.find((t) => t.id === currentUser.tenantId) || null : null;

  const tabsFor: Record<Role, { key: string; label: string; icon: any }[]> = {
    super_admin: [
      { key: "dashboard", label: "Platform overview", icon: TrendingUp },
      { key: "tenants", label: "Tenants", icon: Building2 },
    ],
    tenant_admin: [
      { key: "dashboard", label: "Dashboard", icon: TrendingUp },
      { key: "leads", label: "Leads", icon: Phone },
      { key: "staff", label: "Staff", icon: Users },
    ],
    staff: [
      { key: "dashboard", label: "My dashboard", icon: TrendingUp },
      { key: "leads", label: "My leads", icon: Phone },
    ],
  };

  if (!currentUser) {
    return (
      <>
        <style>{FONT_IMPORT}{THEME_CSS}</style>
        <div className="propel-root">
          <LoginScreen tenants={tenants} users={users} onLogin={(u) => { setCurrentUser(u); setTab("dashboard"); }} />
        </div>
      </>
    );
  }

  const tenantLeads = leads.filter((l) => l.tenantId === currentUser.tenantId);
  const tenantStaff = users.filter((u) => u.tenantId === currentUser.tenantId && u.role === "staff");
  const myLeads = tenantLeads.filter((l) => l.assignedUserId === currentUser.id);
  const scopedLeads = currentUser.role === "staff" ? myLeads : tenantLeads;

  const visibleLeads = scopedLeads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateLead = (id: string, patch: Partial<Lead>) => setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const saveLead = (data: any) => {
    if (leadModal?.mode === "edit" && leadModal.lead) {
      updateLead(leadModal.lead.id, data);
    } else {
      setLeads((ls) => [...ls, {
        id: nextId("l"), tenantId: currentUser.tenantId!, createdAt: new Date().toISOString().slice(0, 10),
        interactions: [], ...data,
      }]);
    }
    setLeadModal(null);
  };

  const deleteLead = (id: string) => setLeads((ls) => ls.filter((l) => l.id !== id));

  const addInteraction = (leadId: string, note: string) => {
    const interaction: Interaction = { id: nextId("i"), note, byUserId: currentUser.id, createdAt: new Date().toISOString().slice(0, 10) };
    setLeads((ls) => ls.map((l) => l.id === leadId ? { ...l, interactions: [...l.interactions, interaction] } : l));
  };

  const liveOpenLead = openLead ? leads.find((l) => l.id === openLead.id) || openLead : null;

  return (
    <>
      <style>{FONT_IMPORT}{THEME_CSS}</style>
      <div className="propel-root" style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar user={currentUser} tenant={tenant} tab={tab} setTab={setTab} onLogout={() => setCurrentUser(null)} tabs={tabsFor[currentUser.role]} />

        <main className="propel-scroll" style={{ flex: 1, padding: 32, overflow: "auto" }}>
          {currentUser.role === "super_admin" && tab === "dashboard" && (
            <SuperAdminDashboard tenants={tenants} users={users} leads={leads} />
          )}
          {currentUser.role === "super_admin" && tab === "tenants" && (
            <TenantsPanel tenants={tenants} users={users} leads={leads}
              onToggleStatus={(id) => setTenants((ts) => ts.map((t) => t.id === id ? { ...t, status: t.status === "active" ? "suspended" : "active" } : t))}
              onCreate={() => setNewTenantOpen(true)} />
          )}

          {currentUser.role === "tenant_admin" && tab === "dashboard" && (
            <TenantAdminDashboard tenant={tenant} leads={tenantLeads} staff={tenantStaff} />
          )}
          {currentUser.role === "tenant_admin" && tab === "staff" && (
            <StaffPanel staff={tenantStaff} leads={tenantLeads} onInvite={() => setInviteOpen(true)} />
          )}

          {currentUser.role === "staff" && tab === "dashboard" && (
            <StaffDashboard leads={myLeads} user={currentUser} />
          )}

          {tab === "leads" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                <div>
                  <h1 className="propel-serif" style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>
                    {currentUser.role === "staff" ? "My leads" : "Leads"}
                  </h1>
                  <p style={{ color: "var(--slate)", marginTop: 4, margin: 0 }}>{visibleLeads.length} of {scopedLeads.length} shown</p>
                </div>
                {currentUser.role === "tenant_admin" && (
                  <PrimaryButton icon={Plus} onClick={() => setLeadModal({ mode: "new" })}>Add lead</PrimaryButton>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--paper)", border: "1px solid var(--line)", padding: "8px 12px", borderRadius: 10, flex: "1 1 260px" }}>
                  <Search size={15} style={{ color: "var(--slate)" }} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or phone…"
                    style={{ border: "none", outline: "none", fontSize: 13.5, flex: 1, fontFamily: "'Work Sans',sans-serif", background: "transparent" }} />
                </div>
                <SelectInput value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 180 }}>
                  <option>All</option>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </SelectInput>
              </div>

              <LeadsTable
                leads={visibleLeads} staff={tenantStaff}
                canAssign={currentUser.role === "tenant_admin"}
                onOpen={(l) => setOpenLead(l)}
                onEdit={(l) => setLeadModal({ mode: "edit", lead: l })}
                onDelete={deleteLead}
                onAssign={(id, uid) => updateLead(id, { assignedUserId: uid })}
              />
            </div>
          )}
        </main>
      </div>

      {leadModal && (
        <LeadModal initial={leadModal.mode === "edit" ? leadModal.lead! : null} staff={tenantStaff} onSave={saveLead} onClose={() => setLeadModal(null)} />
      )}
      {liveOpenLead && (
        <LeadDrawer
          lead={liveOpenLead}
          staff={users.filter((u) => u.tenantId === liveOpenLead.tenantId)}
          onClose={() => setOpenLead(null)}
          onAddInteraction={(note) => addInteraction(liveOpenLead.id, note)}
          onStatusChange={(s) => updateLead(liveOpenLead.id, { status: s })}
        />
      )}
      {newTenantOpen && (
        <NewTenantModal onClose={() => setNewTenantOpen(false)}
          onCreate={(t) => { setTenants((ts) => [...ts, { id: nextId("t"), status: "active", createdAt: new Date().toISOString().slice(0, 10), ...t }]); setNewTenantOpen(false); }} />
      )}
      {inviteOpen && (
        <InviteStaffModal onClose={() => setInviteOpen(false)}
          onInvite={(name, title) => { setUsers((us) => [...us, { id: nextId("u"), tenantId: currentUser.tenantId, role: "staff", name, title }]); setInviteOpen(false); }} />
      )}
    </>
  );
}