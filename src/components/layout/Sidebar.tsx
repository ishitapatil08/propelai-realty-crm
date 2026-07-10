import { LogOut, Home as HomeIcon } from "lucide-react";
import { UserAvatar } from "../ui/UserAvatar";
import { User, Tenant } from "../../lib/types";

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

export function Sidebar({ user, tenant, tab, setTab, onLogout, tabs }: {
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
          <UserAvatar name={user.name} />
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
