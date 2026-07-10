import React from "react";

const inputStyle: React.CSSProperties = {
  fontFamily: "'Work Sans',sans-serif", fontSize: 14, padding: "9px 12px",
  borderRadius: 8, border: "1px solid var(--line)", background: "#fff", color: "var(--ink)", outline: "none", width: "100%",
};

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }}
    onFocus={(e) => (e.target.style.borderColor = "var(--gold-dark)")}
    onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
      {children}
    </label>
  );
}
