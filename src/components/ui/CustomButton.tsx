import React from "react";

export function PrimaryButton({ children, onClick, icon: Icon, type = "button", full, disabled }: { children: React.ReactNode; onClick?: () => void; icon?: any; type?: "button" | "submit"; full?: boolean; disabled?: boolean }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "10px 16px", borderRadius: 10, background: "var(--ink)", color: "var(--gold-soft)",
      border: "1px solid var(--ink)", fontFamily: "'Work Sans',sans-serif", fontSize: 13.5, fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer", width: full ? "100%" : undefined, opacity: disabled ? 0.7 : 1,
    }}>
      {Icon && <Icon size={15} />}{children}
    </button>
  );
}

export function GhostButton({ children, onClick, icon: Icon, danger, disabled }: { children: React.ReactNode; onClick?: () => void; icon?: any; danger?: boolean; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px",
      borderRadius: 10, background: "transparent", color: danger ? "var(--rust)" : "var(--ink)",
      border: "1px solid var(--line)", fontFamily: "'Work Sans',sans-serif", fontSize: 13.5, fontWeight: 500, 
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    }}>
      {Icon && <Icon size={15} />}{children}
    </button>
  );
}
