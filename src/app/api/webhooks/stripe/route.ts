import { NextResponse } from "next/server";
import { processStripeWebhookEvent } from "@/lib/api/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    await processStripeWebhookEvent(body);

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook handler failed" },
      { status: 400 }
    );
  }
}
