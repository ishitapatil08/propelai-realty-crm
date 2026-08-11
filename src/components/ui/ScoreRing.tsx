import React from "react";

const sizeMap = {
  sm: { outer: 36, inner: 28, font: 10 },
  md: { outer: 44, inner: 34, font: 12 },
  lg: { outer: 60, inner: 48, font: 15 },
};

export function ScoreRing({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const color = score >= 75 ? "var(--forest)" : score >= 50 ? "var(--gold-dark)" : "var(--rust)";
  const deg = Math.round((score / 100) * 360);
  const { outer, inner, font } = sizeMap[size];

  return (
    <div
      style={{
        width: outer,
        height: outer,
        borderRadius: "50%",
        background: `conic-gradient(${color} ${deg}deg, var(--sand) 0deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: "50%",
          background: "var(--paper)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: font,
          color,
        }}
      >
        {score}
      </div>
    </div>
  );
}
