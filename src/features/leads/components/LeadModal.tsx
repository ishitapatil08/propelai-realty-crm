import React, { useState } from "react";
import { Lead, User, STATUSES, Status, SOURCES } from "../../../lib/types";
import { CustomModal } from "../../../components/ui/CustomModal";
import { Field, TextInput, SelectInput } from "../../../components/ui/CustomInput";
import { PrimaryButton, GhostButton } from "../../../components/ui/CustomButton";

export function LeadModal({ initial, staff, onSave, onClose }: { initial: Lead | null; staff: User[]; onSave: (l: any) => void; onClose: () => void }) {
  const [form, setForm] = useState<any>(initial || { name: "", phone: "", source: SOURCES[0], budget: "", status: "New", assignedUserId: "", score: 50 });
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  
  return (
    <CustomModal title={initial ? "Edit lead" : "Add lead"} onClose={onClose}>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!form.name || !form.phone) return;
        onSave({ ...form, budget: Number(form.budget) || 0, score: Number(form.score) || 0, assignedUserId: form.assignedUserId || null });
      }}>
        <Field label="Name"><TextInput value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Neha Kulkarni" /></Field>
        <Field label="Phone"><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98XXX XXXXX" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Source">
            <SelectInput value={form.source} onChange={(e) => set("source", e.target.value)}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </SelectInput>
          </Field>
          <Field label="Budget (INR)"><TextInput type="number" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="8500000" /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Status">
            <SelectInput value={form.status} onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </SelectInput>
          </Field>
          <Field label="Assigned to">
            <SelectInput value={form.assignedUserId || ""} onChange={(e) => set("assignedUserId", e.target.value)}>
              <option value="">Unassigned</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </SelectInput>
          </Field>
        </div>
        <Field label={`Score: ${form.score}`}>
          <input type="range" min={0} max={100} value={form.score} onChange={(e) => set("score", e.target.value)} style={{ width: "100%" }} />
        </Field>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <PrimaryButton type="submit">{initial ? "Save changes" : "Add lead"}</PrimaryButton>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
        </div>
      </form>
    </CustomModal>
  );
}
