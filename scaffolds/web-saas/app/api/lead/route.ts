import { NextResponse } from "next/server";
import { getServerSupabase, type LeadInsert } from "../../../lib/supabase";
import { captureError } from "../../../lib/sentry";
import { sendServerEvent, anonymousClientId } from "../../../lib/analytics";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LEN = 1000;
const MAX_NAME_LEN = 120;

type Body = {
  email?: unknown;
  name?: unknown;
  message?: unknown;
  source?: unknown;
};

function validate(body: Body): LeadInsert | { error: string } {
  if (typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email)) {
    return { error: "Invalid email." };
  }

  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, MAX_NAME_LEN)
      : null;

  const message =
    typeof body.message === "string" && body.message.trim()
      ? body.message.trim().slice(0, MAX_MESSAGE_LEN)
      : null;

  const source =
    typeof body.source === "string" && body.source.trim()
      ? body.source.trim().slice(0, 64)
      : "site";

  return {
    email: body.email.trim().toLowerCase(),
    name,
    message,
    source,
  };
}

async function notifyTelegram(lead: LeadInsert): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    `New lead: ${lead.email}`,
    lead.name ? `Name: ${lead.name}` : null,
    lead.message ? `Note: ${lead.message}` : null,
    `Source: ${lead.source ?? "site"}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    captureError(err, { stage: "telegram_notify", email: lead.email });
  }
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validated = validate(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase.from("leads").insert(validated);

    if (error) {
      // Unique-constraint violation on email — treat as success so the user is
      // not told whether they already signed up. Other DB errors propagate.
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, deduped: true });
      }
      throw error;
    }

    // Fire-and-forget side-effects.
    await Promise.allSettled([
      notifyTelegram(validated),
      sendServerEvent({
        clientId: anonymousClientId(),
        events: [
          {
            name: "generate_lead",
            params: { source: validated.source ?? "site" },
          },
        ],
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    captureError(err, { stage: "lead_insert", email: validated.email });
    return NextResponse.json(
      { error: "Server error. Try again shortly." },
      { status: 500 },
    );
  }
}
