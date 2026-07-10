import React from "react";
import { STATUSES, Status, STATUS_COLOR, Lead } from "../../lib/types";

export function Funnel({ leads }: { leads: Lead[] }) {
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
