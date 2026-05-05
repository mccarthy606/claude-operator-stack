import { NextResponse } from "next/server";
import { getServerSupabase, type LeadInsert } from "../../../lib/supabase";
import { captureError } from "../../../lib/sentry";
import { sendServerEvent, anonymousClientId } from "../../../lib/analytics";
import { checkRateLimit } from "../../../lib/rate-limit";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LEN = 1000;
const MAX_NAME_LEN = 120;

type Body = Record<string, unknown>;

type ValidationResult =
  | { ok: true; data: LeadInsert }
  | { ok: false; error: string };

function validate(body: Body): ValidationResult {
  if (typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email)) {
    return { ok: false, error: "Invalid email." };
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
    ok: true,
    data: {
      email: body.email.trim().toLowerCase(),
      name,
      message,
      source,
    },
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
      signal: AbortSignal.timeout(2000),
    });
  } catch (err) {
    captureError(err, { stage: "telegram_notify", email: lead.email });
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`lead:${ip}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const lead = result.data;

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase.from("leads").insert(lead);

    if (error) {
      // Unique-constraint violation on email — treat as success so the user is
      // not told whether they already signed up. Other DB errors propagate.
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, deduped: true });
      }
      throw error;
    }

    // Fire-and-forget side-effects. We don't await failure but we do forward
    // any rejections to Sentry — otherwise allSettled silently swallows them.
    const sideEffects = await Promise.allSettled([
      notifyTelegram(lead),
      sendServerEvent({
        clientId: anonymousClientId(),
        events: [
          {
            name: "generate_lead",
            params: { source: lead.source ?? "site" },
          },
        ],
      }),
    ]);

    const stages = ["telegram_notify", "ga4_server_event"] as const;
    sideEffects.forEach((outcome, index) => {
      if (outcome.status === "rejected") {
        captureError(outcome.reason, {
          stage: stages[index] ?? "lead_side_effect",
          email: lead.email,
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    captureError(err, { stage: "lead_insert", email: lead.email });
    return NextResponse.json(
      { error: "Server error. Try again shortly." },
      { status: 500 },
    );
  }
}
