import React from "react";

const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export function UserAvatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--ink-2), var(--ink))",
      color: "var(--gold-soft)", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Work Sans',sans-serif", fontWeight: 600, fontSize: size * 0.38, flexShrink: 0,
    }}>{initials(name)}</div>
  );
}
