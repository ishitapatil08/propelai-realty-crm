export type Role = "super_admin" | "tenant_admin" | "staff";

export type Tenant = {
  id: string;
  name: string;
  plan: string;
  status: "active" | "suspended";
  createdAt: string;
};

export type User = {
  id: string;
  tenantId: string | null;
  role: Role;
  name: string;
  title: string;
};

export type Interaction = {
  id: string;
  note: string;
  byUserId: string;
  createdAt: string;
};

export const STATUSES = ["New", "Contacted", "Qualified", "Visit Scheduled", "Won", "Lost"] as const;
export type Status = typeof STATUSES[number];

export const STATUS_COLOR: Record<Status, string> = {
  New: "#5B6472",
  Contacted: "#8A6D2F",
  Qualified: "#C9A227",
  "Visit Scheduled": "#2E5C8A",
  Won: "#2F6F4F",
  Lost: "#B23A32",
};

export const SOURCES = ["Facebook Ads", "Google Ads", "99acres", "MagicBricks", "Housing.com", "Manual Entry", "Referral"];

export type Lead = {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  source: string;
  budget: number;
  status: Status;
  assignedUserId: string | null;
  score: number;
  createdAt: string;
  interactions: Interaction[];
};

export const PLAN_PRICE: Record<string, number> = { Starter: 2999, Growth: 8999, Enterprise: 24999 };
