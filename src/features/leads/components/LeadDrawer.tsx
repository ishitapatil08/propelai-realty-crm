import React, { useState } from "react";
import { Lead, User, STATUSES, Status, STATUS_COLOR } from "../../../lib/types";
import { Phone, X } from "lucide-react";
import { PrimaryButton } from "../../../components/ui/CustomButton";
import { TextInput } from "../../../components/ui/CustomInput";

export function LeadDrawer({ lead, staff, onClose, onAddInteraction, onStatusChange }: {
  lead: Lead; staff: User[]; onClose: () => void;
  onAddInteraction: (note: string) => void; onStatusChange: (s: Status) => void;
}) {
  const [note, setNote] = useState("");
  const assignee = staff.find((s) => s.id === lead.assignedUserId);
  
  function fmtINR(n: number) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,25,40,0.55)", zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} className="propel-scroll" style={{
        width: "100%", maxWidth: 520, background: "var(--paper)", height: "100%", overflow: "auto", padding: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 className="propel-serif" style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{lead.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, color: "var(--slate)", fontSize: 13 }}>
              <Phone size={13} />{lead.phone}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)" }}><X size={20} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
          <div style={{ padding: 12, background: "var(--paper-2)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, textTransform: "uppercase" }}>Budget</div>
            <div className="propel-serif" style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{fmtINR(lead.budget)}</div>
          </div>
          <div style={{ padding: 12, background: "var(--paper-2)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, textTransform: "uppercase" }}>Source</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{lead.source}</div>
          </div>
          <div style={{ padding: 12, background: "var(--paper-2)", borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: "var(--slate)", fontWeight: 600, textTransform: "uppercase" }}>Assigned</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{assignee ? assignee.name : "Unassigned"}</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>Move stage</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {STATUSES.map((s) => (
              <button key={s} onClick={() => onStatusChange(s)} style={{
                padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
                background: s === lead.status ? STATUS_COLOR[s] : `${STATUS_COLOR[s]}18`,
                color: s === lead.status ? "#fff" : STATUS_COLOR[s],
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 10 }}>Unified timeline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {lead.interactions.length === 0 && <p style={{ fontSize: 13, color: "var(--slate)", margin: 0 }}>No interactions logged yet.</p>}
          {[...lead.interactions].reverse().map((i) => (
            <div key={i.id} style={{ padding: 12, background: "#fff", borderRadius: 10, border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--slate)", marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{staff.find((s) => s.id === i.byUserId)?.name || "System"}</span>
                <span>{i.createdAt}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13.5 }}>{i.note}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <TextInput value={note} onChange={(e) => setNote(e.target.value)} placeholder="Log a call, WhatsApp, or note…" />
          <PrimaryButton onClick={() => { if (!note.trim()) return; onAddInteraction(note.trim()); setNote(""); }}>Log</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
