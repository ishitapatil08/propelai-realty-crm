"use server";

import { withTenant } from "@/db";
import { leads, aiCalls, interactions, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import * as mock from "./mock-data";

interface Scenario {
  transcript: string;
  summary: string;
  newScore: number;
  newStatus: "New" | "Contacted" | "Qualified" | "Visit Scheduled" | "Won" | "Lost";
  duration: number; // in seconds
  note: string;
}

const CALL_SCENARIOS: Scenario[] = [
  {
    transcript: `AI Agent: Hello, speaking with Arjun?
Lead: Yes, this is Arjun. Who is this?
AI Agent: Hi Arjun, I am calling from PropelAI Realty. You recently inquired about the premium 3BHK listings in Gachibowli. I wanted to see if you are actively searching and if you have any questions?
Lead: Ah yes. I am looking for a 3BHK. Is parking included, and do you have ready-to-move-in options?
AI Agent: Yes, parking is included with all 3BHK units, and we do have two ready-to-move-in properties in that sector. Would you be interested in scheduling a site visit this Saturday?
Lead: Saturday morning works. Can you send me the brochure and the location pin?
AI Agent: Absolutely. I will text you the details right away and lock in Saturday morning. Have a great day!`,
    summary: "Client confirmed active search for 3BHK in Gachibowli. Inquired about parking and ready-to-move-in status. Scheduled site visit for Saturday morning; brochure sent.",
    newScore: 88,
    newStatus: "Visit Scheduled",
    duration: 112,
    note: "AI Outreach Call: Scheduled site visit for Saturday. Client highly interested in Gachibowli 3BHK.",
  },
  {
    transcript: `AI Agent: Hello, am I speaking with Priya?
Lead: Yes, but I am in a meeting right now.
AI Agent: I apologize. This is PropelAI Realty regarding your inquiry on the Horizon Estates. Would it be better if I call you back tomorrow afternoon?
Lead: Yes, please. Tomorrow at 3 PM would be fine.
AI Agent: Perfect. I will set a reminder and call you tomorrow. Thank you!`,
    summary: "Client busy in a meeting. Requested callback tomorrow afternoon at 3:00 PM.",
    newScore: 55,
    newStatus: "Contacted",
    duration: 32,
    note: "AI Outreach Call: Client was busy, requested callback tomorrow at 3 PM.",
  },
  {
    transcript: `AI Agent: Hello, is this Rohan?
Lead: Yes.
AI Agent: Hi Rohan, calling from PropelAI Realty about your property inquiry. I wanted to check your budget requirements.
Lead: Well, my budget is around 60 lakhs max. Your listings seem way above that.
AI Agent: We do have some starter units in nearby upcoming sectors starting at 55 lakhs. Can I send you those options via WhatsApp?
Lead: Sure, send them over and I will take a look. If they match my budget, we can talk.
AI Agent: Sounds great. I will compile those listings and send them to you shortly.`,
    summary: "Client looking for properties under 60 lakhs. Listings sent via WhatsApp for review.",
    newScore: 68,
    newStatus: "Contacted",
    duration: 75,
    note: "AI Outreach Call: Client budget is 60L. Sent alternative upcoming sector listings.",
  },
  {
    transcript: `AI Agent: Hello, speaking with Dev?
Lead: Yes, speaking.
AI Agent: Hi Dev, calling from PropelAI Realty. You inquired about the commercial spaces. Are you looking to buy or lease?
Lead: Neither, I actually clicked by mistake and I am not looking for any real estate right now.
AI Agent: No problem at all. Thanks for clarifying! Have a nice day.`,
    summary: "Client clicked the ad by mistake. No real estate requirements at this time.",
    newScore: 15,
    newStatus: "Lost",
    duration: 25,
    note: "AI Outreach Call: Invalid lead. Lead clicked by mistake and has no current requirements.",
  }
];

export async function triggerAiCall(leadId: string) {
  const { user, tenantId } = await getSession();
  if (!user || !tenantId) throw new Error("Unauthorized");

  // Select a random scenario
  const scenario = CALL_SCENARIOS[Math.floor(Math.random() * CALL_SCENARIOS.length)];

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const lead = mock.MOCK_LEADS.find(l => l.id === leadId);
    if (lead) {
      lead.status = scenario.newStatus;
      lead.score = scenario.newScore;
      lead.updatedAt = new Date();
    }
    const newInt = {
      id: "int" + (mock.MOCK_INTERACTIONS.length + 1),
      note: scenario.note,
      createdAt: new Date(),
      byUserId: user.id,
      byUserName: user.user_metadata?.name || "User",
    };
    mock.MOCK_INTERACTIONS.unshift(newInt);

    const newCall = {
      id: "c" + (mock.MOCK_AI_CALLS.length + 1),
      transcript: scenario.transcript,
      summary: scenario.summary,
      duration: scenario.duration,
      createdAt: new Date(),
      leadId,
      leadName: lead?.name || "Unknown",
      leadPhone: lead?.phone || "",
    };
    mock.MOCK_AI_CALLS.unshift(newCall);

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/staff/leads");
    revalidatePath(`/staff/leads/${leadId}`);
    revalidatePath("/staff/calls");
    revalidatePath("/staff/dashboard");
    revalidatePath("/admin/dashboard");
    return;
  }

  await withTenant(tenantId, async (tx) => {
    // 1. Save call transcript and summary
    const [call] = await tx
      .insert(aiCalls)
      .values({
        tenantId,
        leadId,
        transcript: scenario.transcript,
        summary: scenario.summary,
        duration: scenario.duration,
      })
      .returning({ id: aiCalls.id });

    // 2. Update Lead status and score
    await tx
      .update(leads)
      .set({
        status: scenario.newStatus,
        score: scenario.newScore,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));

    // 3. Log as an interaction note
    await tx.insert(interactions).values({
      tenantId,
      leadId,
      note: scenario.note,
      byUserId: user.id, // Logged as being triggered by the authenticated staff/admin
    });

    // 4. Log to activity logs
    await tx.insert(activityLogs).values({
      tenantId,
      userId: user.id,
      action: "ai_outreach_call",
      entityType: "lead",
      entityId: leadId,
      metadata: { aiCallId: call.id, outcome: scenario.newStatus, score: scenario.newScore },
    });
  });

  // Revalidate views
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/staff/leads");
  revalidatePath(`/staff/leads/${leadId}`);
  revalidatePath("/staff/calls");
  revalidatePath("/staff/dashboard");
  revalidatePath("/admin/dashboard");
}
