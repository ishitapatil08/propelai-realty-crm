export interface MockLead {
  id: string;
  name: string;
  phone: string;
  source: string | null;
  budget: number | null;
  status: "New" | "Contacted" | "Qualified" | "Visit Scheduled" | "Won" | "Lost";
  score: number | null;
  createdAt: Date;
  updatedAt: Date;
  assignedUserId: string | null;
  assignedName: string | null;
}

export interface MockVisit {
  id: string;
  scheduledAt: Date;
  status: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  propertyId: string | null;
  propertyName: string | null;
  propertyLocation: string | null;
}

export const MOCK_LEADS: MockLead[] = [
  {
    id: "l1",
    name: "Aarav Sharma",
    phone: "+91 98765 43210",
    source: "Google Ads",
    budget: 15000000,
    status: "New" as const,
    score: 85,
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 2),
    assignedUserId: "d2",
    assignedName: "Priya Shah",
  },
  {
    id: "l2",
    name: "Ananya Iyer",
    phone: "+91 87654 32109",
    source: "Facebook Page",
    budget: 28000000,
    status: "Visit Scheduled" as const,
    score: 92,
    createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 4),
    assignedUserId: "d3",
    assignedName: "Rohan Verma",
  },
  {
    id: "l3",
    name: "Kabir Mehta",
    phone: "+91 76543 21098",
    source: "Direct Walk-in",
    budget: 45000000,
    status: "Qualified" as const,
    score: 78,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3), // 3 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1),
    assignedUserId: "d3",
    assignedName: "Rohan Verma",
  },
  {
    id: "l4",
    name: "Diya Patel",
    phone: "+91 65432 10987",
    source: "Property Portal",
    budget: 9500000,
    status: "Contacted" as const,
    score: 64,
    createdAt: new Date(Date.now() - 3600000 * 24 * 5),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 4),
    assignedUserId: "d2",
    assignedName: "Priya Shah",
  },
  {
    id: "l5",
    name: "Reyansh Gupta",
    phone: "+91 54321 09876",
    source: "Referral",
    budget: 62000000,
    status: "Won" as const,
    score: 98,
    createdAt: new Date(Date.now() - 3600000 * 24 * 10),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2),
    assignedUserId: "d2",
    assignedName: "Priya Shah",
  },
  {
    id: "l6",
    name: "Ishaan Malhotra",
    phone: "+91 43210 98765",
    source: "Google Ads",
    budget: 12000000,
    status: "Lost" as const,
    score: 35,
    createdAt: new Date(Date.now() - 3600000 * 24 * 12),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 10),
    assignedUserId: "d3",
    assignedName: "Rohan Verma",
  }
];

export const MOCK_STAFF = [
  {
    id: "s1",
    phone: "+91 99999 11111",
    createdAt: new Date("2026-01-15"),
    profileId: "d2",
    name: "Priya Shah",
    title: "Sales Director",
    role: "tenant_admin",
  },
  {
    id: "s2",
    phone: "+91 99999 22222",
    createdAt: new Date("2026-02-10"),
    profileId: "d3",
    name: "Rohan Verma",
    title: "Senior Consultant",
    role: "staff",
  }
];

export const MOCK_PROPERTIES = [
  {
    id: "p1",
    tenantId: "t1",
    name: "Skyline Height Penthouse",
    location: "Worli, Mumbai",
    price: 85000000,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
  {
    id: "p2",
    tenantId: "t1",
    name: "Greenwood Meadow Villa",
    location: "Whitefield, Bangalore",
    price: 32000000,
    createdAt: new Date("2026-04-12"),
    updatedAt: new Date("2026-04-12"),
  },
  {
    id: "p3",
    tenantId: "t1",
    name: "Emerald Bay Residence",
    location: "ECR, Chennai",
    price: 18000000,
    createdAt: new Date("2026-05-20"),
    updatedAt: new Date("2026-05-20"),
  }
];

export const MOCK_AI_CALLS = [
  {
    id: "c1",
    transcript: "AI: Hello Mr. Aarav. I am calling from Skyline Realty. I noticed you are interested in the Greenwood Meadow Villa.\nClient: Yes, I would like to schedule a visit.\nAI: Great! I can schedule it for this Saturday at 11 AM.",
    summary: "Lead confirmed interest in Greenwood Meadow Villa. Scheduled site visit for Saturday, 11:00 AM.",
    duration: 72,
    createdAt: new Date(Date.now() - 3600000 * 1),
    leadId: "l1",
    leadName: "Aarav Sharma",
    leadPhone: "+91 98765 43210",
  },
  {
    id: "c2",
    transcript: "AI: Hello Ms. Ananya. Calling from Skyline Realty.\nClient: Hi, yes I was looking for a 3BHK in Worli.\nAI: We have a luxury penthouse in Skyline Height. Budget is 8.5 Crore.\nClient: That fits my budget. Let's arrange a call.",
    summary: "Luxury penthouse in Worli discussed. Budget of 8.5Cr confirmed. Qualified lead.",
    duration: 110,
    createdAt: new Date(Date.now() - 3600000 * 5),
    leadId: "l2",
    leadName: "Ananya Iyer",
    leadPhone: "+91 87654 32109",
  },
  {
    id: "c3",
    transcript: "AI: Hello Diya. Calling about property options.\nClient: Hi, I'm just browsing, budget is around 90 Lakhs.\nAI: Alright, we will keep you updated.",
    summary: "Initial budget discussion. Lead is cold/browsing.",
    duration: 45,
    createdAt: new Date(Date.now() - 3600000 * 24 * 4),
    leadId: "l4",
    leadName: "Diya Patel",
    leadPhone: "+91 65432 10987",
  }
];

export const MOCK_VISITS: MockVisit[] = [
  {
    id: "v1",
    scheduledAt: new Date(Date.now() + 3600000 * 24), // tomorrow
    status: "Scheduled",
    leadId: "l2",
    leadName: "Ananya Iyer",
    leadPhone: "+91 87654 32109",
    propertyId: "p1",
    propertyName: "Skyline Height Penthouse",
    propertyLocation: "Worli, Mumbai",
  },
  {
    id: "v2",
    scheduledAt: new Date(Date.now() - 3600000 * 48), // 2 days ago
    status: "Completed",
    leadId: "l5",
    leadName: "Reyansh Gupta",
    leadPhone: "+91 54321 09876",
    propertyId: "p3",
    propertyName: "Emerald Bay Residence",
    propertyLocation: "ECR, Chennai",
  }
];

export const MOCK_INTERACTIONS = [
  {
    id: "int1",
    note: "AI outreach triggered. Aarav confirmed interest. Need to finalize location parameters.",
    createdAt: new Date(Date.now() - 3600000 * 1),
    byUserId: "d2",
    byUserName: "Priya Shah",
  },
  {
    id: "int2",
    note: "Added to portal pipeline after Google Ads inquiry.",
    createdAt: new Date(Date.now() - 3600000 * 2),
    byUserId: "d2",
    byUserName: "Priya Shah",
  }
];

export const MOCK_TENANTS_LIST = [
  {
    id: "t1",
    name: "Skyline Realty",
    status: "Active",
    plan: "Growth",
    createdAt: new Date("2026-01-01"),
    admins: 1,
    mrr: 149,
  },
  {
    id: "t2",
    name: "Apex Properties",
    status: "Active",
    plan: "Starter",
    createdAt: new Date("2026-03-10"),
    admins: 1,
    mrr: 49,
  },
  {
    id: "t3",
    name: "Horizon Estates",
    status: "Suspended",
    plan: "Enterprise",
    createdAt: new Date("2025-11-20"),
    admins: 2,
    mrr: 499,
  }
];

export const MOCK_PLATFORM_KPI = {
  totalTenants: 3,
  activeTenants: 2,
  trialTenants: 1,
  totalAdmins: 4,
  totalStaff: 12,
  totalLeads: 258,
  aiCallsToday: 42,
  monthlyRevenue: 697,
  activeSubscriptions: 3,
  pendingPayments: 0,
};

export const MOCK_TENANT_KPI = {
  totalLeads: 6,
  activeStaff: 2,
  scheduledVisits: 1,
  totalAiCalls: 3,
  wonLeads: 1,
  lostLeads: 1,
  conversionRate: 17,
  statusBreakdown: [
    { status: "New", count: 1 },
    { status: "Contacted", count: 1 },
    { status: "Qualified", count: 1 },
    { status: "Visit Scheduled", count: 1 },
    { status: "Won", count: 1 },
    { status: "Lost", count: 1 },
  ],
};

export const MOCK_STAFF_LEADERBOARD = [
  { name: "Priya Shah", total: 3, won: 1, contacted: 2 },
  { name: "Rohan Verma", total: 3, won: 0, contacted: 2 },
];
