import React from "react";

export function StatCard({ label, value, sub, icon: Icon }: { label: string; value: React.ReactNode; sub?: string; icon?: any }) {
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
