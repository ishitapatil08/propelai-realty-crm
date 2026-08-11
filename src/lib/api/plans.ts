// ─── Plan Constants ─────────────────────────────────────────────────────────
// NOT a "use server" file — safe to import in both Server Components and actions.

export interface PlanInfo {
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export const PLAN_DETAILS: Record<string, PlanInfo> = {
  Starter: {
    name: 'Starter',
    price: 2999,
    features: [
      'Up to 3 Staff Members',
      '500 Leads / month',
      'Basic AI Outreach Calls',
      'Email Support',
    ],
  },
  Growth: {
    name: 'Growth',
    price: 8999,
    features: [
      'Up to 15 Staff Members',
      '5,000 Leads / month',
      'Advanced AI Outbound Calls',
      'Priority Support',
      'Custom Analytics',
    ],
    recommended: true,
  },
  Enterprise: {
    name: 'Enterprise',
    price: 24999,
    features: [
      'Unlimited Staff Members',
      'Unlimited Leads',
      'Dedicated AI Phone Agent',
      '24/7 Account Manager',
      'Custom Integrations',
    ],
  },
};
