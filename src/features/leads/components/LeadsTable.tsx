import React, { useState } from "react";
import { Lead, User, STATUSES, Status } from "../../../lib/types";
import { UserAvatar } from "../../../components/ui/UserAvatar";
import { StatusPill } from "../../../components/ui/StatusPill";
import { ScoreRing } from "../../../components/ui/ScoreRing";
import { SelectInput } from "../../../components/ui/CustomInput";
import { Edit2, Trash2 } from "lucide-react";

export function LeadsTable({ leads, staff, canAssign, onOpen, onEdit, onDelete, onAssign }: {
  leads: Lead[]; staff: User[]; canAssign: boolean;
  onOpen: (l: Lead) => void; onEdit: (l: Lead) => void; onDelete: (id: string) => void; onAssign: (id: string, uid: string | null) => void;
}) {
  const headers = ["Lead", "Source", "Budget", "Status", "Score", canAssign ? "Assigned to" : null, ""].filter(Boolean) as string[];
  
  function fmtINR(n: number) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
  }

  return (
    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead style={{ background: "var(--paper-2)" }}>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => onOpen(l)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <UserAvatar name={l.name} size={34} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{l.name}</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }}>{l.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", color: "var(--slate)" }}>{l.source}</td>
                <td style={{ padding: "12px 14px", fontWeight: 600 }}>{fmtINR(l.budget)}</td>
                <td style={{ padding: "12px 14px" }}><StatusPill status={l.status} /></td>
                <td style={{ padding: "12px 14px" }}><ScoreRing score={l.score} /></td>
                {canAssign && (
                  <td style={{ padding: "12px 14px" }}>
                    <SelectInput value={l.assignedUserId || ""} onChange={(e) => onAssign(l.id, e.target.value || null)} style={{ fontSize: 12.5, padding: "6px 8px", width: 150 }}>
                      <option value="">Unassigned</option>
                      {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </SelectInput>
                  </td>
                )}
                <td style={{ padding: "12px 14px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 4 }}>
                    <button onClick={() => onEdit(l)} style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "var(--slate)", borderRadius: 6 }}><Edit2 size={14} /></button>
                    <button onClick={() => onDelete(l.id)} style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "var(--rust)", borderRadius: 6 }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={headers.length} style={{ padding: 40, textAlign: "center", color: "var(--slate)" }}>No leads match this view yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
