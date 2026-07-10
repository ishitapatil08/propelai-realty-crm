import React from "react";
import { X } from "lucide-react";

export function CustomModal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
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
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <div className="propel-scroll" style={{ padding: 20, overflow: "auto" }}>{children}</div>
      </div>
    </div>
  );
}
