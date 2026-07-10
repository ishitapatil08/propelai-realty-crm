import React from "react";

export function ScoreRing({ score }: { score: number }) {
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
