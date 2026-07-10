import { Tenant, User, Lead } from "./types";

let _id = 1000;
export const nextId = (p: string) => `${p}${_id++}`;

export const seedTenants: Tenant[] = [
  { id: "t1", name: "Skyline Realty", plan: "Growth", status: "active", createdAt: "2026-03-02" },
  { id: "t2", name: "Horizon Builders", plan: "Enterprise", status: "active", createdAt: "2026-01-14" },
  { id: "t3", name: "CityNest Brokers", plan: "Starter", status: "suspended", createdAt: "2026-05-20" },
];

export const seedUsers: User[] = [
  { id: "u0", tenantId: null, role: "super_admin", name: "Alex Rao", title: "Product Owner" },
  { id: "u1", tenantId: "t1", role: "tenant_admin", name: "Priya Shah", title: "Founder" },
  { id: "u2", tenantId: "t1", role: "staff", name: "Rohan Verma", title: "Sales Agent" },
  { id: "u3", tenantId: "t1", role: "staff", name: "Meera Iyer", title: "Sales Agent" },
  { id: "u4", tenantId: "t2", role: "tenant_admin", name: "Karan Mehta", title: "Sales Director" },
  { id: "u5", tenantId: "t2", role: "staff", name: "Ananya Bose", title: "Sales Agent" },
  { id: "u6", tenantId: "t3", role: "tenant_admin", name: "Devraj Nair", title: "Owner" },
];

export const seedLeads: Lead[] = [
  { id: "l1", tenantId: "t1", name: "Neha Kulkarni", phone: "+91 98200 11223", source: "Facebook Ads", budget: 8500000, status: "New", assignedUserId: "u2", score: 62, createdAt: "2026-07-08", interactions: [] },
  { id: "l2", tenantId: "t1", name: "Arjun Malhotra", phone: "+91 99870 44521", source: "99acres", budget: 12000000, status: "Contacted", assignedUserId: "u2", score: 74, createdAt: "2026-07-07", interactions: [{ id: nextId("i"), note: "Called, interested in 3BHK, wants pricing sheet.", byUserId: "u2", createdAt: "2026-07-08" }] },
  { id: "l3", tenantId: "t1", name: "Sana Sheikh", phone: "+91 90210 88712", source: "Google Ads", budget: 6000000, status: "Qualified", assignedUserId: "u3", score: 81, createdAt: "2026-07-05", interactions: [] },
  { id: "l4", tenantId: "t1", name: "Vikram Desai", phone: "+91 98765 43210", source: "MagicBricks", budget: 15000000, status: "Visit Scheduled", assignedUserId: "u3", score: 88, createdAt: "2026-07-01", interactions: [] },
  { id: "l5", tenantId: "t1", name: "Ritu Choudhary", phone: "+91 97654 32109", source: "Referral", budget: 9500000, status: "Won", assignedUserId: "u2", score: 95, createdAt: "2026-06-20", interactions: [] },
  { id: "l6", tenantId: "t1", name: "Faisal Ahmed", phone: "+91 96543 21098", source: "Housing.com", budget: 4500000, status: "Lost", assignedUserId: "u3", score: 30, createdAt: "2026-06-18", interactions: [] },
  { id: "l7", tenantId: "t1", name: "Ishaan Kapoor", phone: "+91 95432 10987", source: "Facebook Ads", budget: 7200000, status: "New", assignedUserId: null, score: 55, createdAt: "2026-07-09", interactions: [] },
  { id: "l8", tenantId: "t2", name: "Ayesha Khan", phone: "+91 89123 45678", source: "99acres", budget: 22000000, status: "New", assignedUserId: "u5", score: 70, createdAt: "2026-07-09", interactions: [] },
  { id: "l9", tenantId: "t2", name: "Rahul Bansal", phone: "+91 88234 56789", source: "Google Ads", budget: 30000000, status: "Contacted", assignedUserId: "u5", score: 77, createdAt: "2026-07-06", interactions: [] },
  { id: "l10", tenantId: "t2", name: "Divya Menon", phone: "+91 87345 67890", source: "Referral", budget: 18000000, status: "Visit Scheduled", assignedUserId: "u5", score: 90, createdAt: "2026-07-02", interactions: [] },
  { id: "l11", tenantId: "t2", name: "Yusuf Ali", phone: "+91 86456 78901", source: "MagicBricks", budget: 12500000, status: "Won", assignedUserId: "u5", score: 92, createdAt: "2026-06-25", interactions: [] },
  { id: "l12", tenantId: "t2", name: "Kavya Reddy", phone: "+91 85567 89012", source: "Housing.com", budget: 9000000, status: "New", assignedUserId: null, score: 48, createdAt: "2026-07-10", interactions: [] },
];
