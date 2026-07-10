import React from "react";
import { STATUS_COLOR, Status } from "../../lib/types";

export function StatusPill({ status }: { status: Status }) {
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
