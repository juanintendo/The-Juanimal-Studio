import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-5";

const AUDIT_SYSTEM_PROMPT = `You are a senior UX/UI auditor for The Juanimal Studio. You are given a
webpage's HTML source and a screenshot of the rendered page. Produce a short,
punchy UX audit a business owner can act on immediately.

Respond ONLY with JSON, no markdown fences, no preamble, matching exactly:
{
  "overallScore": number (0-100),
  "summary": "one sentence, plain language",
  "findings": [
    {
      "title": "short finding name",
      "severity": "high" | "medium" | "low",
      "issue": "1-2 sentences describing the problem",
      "fix": "1-2 sentences describing the concrete fix"
    }
  ]
}

Give 4-6 findings. Cover a mix of: visual hierarchy, contrast/legibility, CTA
clarity, mobile-friendliness signals, load-weight signals, and copy clarity.
Be specific to what you actually see — never generic filler.`;

function isValidHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  let body: { url?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { url, email } = body;

  if (!url || !isValidHttpUrl(url)) {
    return NextResponse.json({ error: "Please provide a valid URL." }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  // 1. Fetch the page HTML (trimmed — we only need enough for structural signal).
  let html = "";
  try {
    const pageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; JuanimalAuditBot/1.0)" },
      signal: AbortSignal.timeout(15000),
    });
    html = (await pageRes.text()).slice(0, 60000);
  } catch {
    return NextResponse.json(
      { error: "Couldn't fetch that URL. Check it's public and reachable." },
      { status: 422 }
    );
  }

  // 2. Screenshot via thum.io (no API key required on their free tier).
  const screenshotUrl = `https://image.thum.io/get/width/1200/crop/1600/${encodeURIComponent(url)}`;
  let screenshotBase64: string | null = null;
  try {
    const shotRes = await fetch(screenshotUrl, { signal: AbortSignal.timeout(20000) });
    if (shotRes.ok) {
      const buf = await shotRes.arrayBuffer();
      screenshotBase64 = Buffer.from(buf).toString("base64");
    }
  } catch {
    // Screenshot is best-effort — the audit still runs on HTML alone if it fails.
  }

  // 3. Ask Claude for the audit.
  const contentBlocks: unknown[] = [
    {
      type: "text",
      text: `Page URL: ${url}\n\nHTML (truncated):\n${html}`,
    },
  ];
  if (screenshotBase64) {
    contentBlocks.push({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/png",
        data: screenshotBase64,
      },
    });
  }

  let report: unknown;
  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        system: AUDIT_SYSTEM_PROMPT,
        messages: [{ role: "user", content: contentBlocks }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      throw new Error(errText);
    }

    const data = await claudeRes.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    const raw = (textBlock?.text ?? "{}").replace(/```json|```/g, "").trim();
    report = JSON.parse(raw);
  } catch (err) {
    return NextResponse.json(
      { error: "The audit engine failed to respond. Try again in a moment." },
      { status: 502 }
    );
  }

  // 4. Store the lead + audit in Supabase (best-effort — don't block the response on it).
  try {
    const supabase = getSupabaseServerClient();
    const { data: lead } = await supabase
      .from("leads")
      .insert({ email, source: "ux-audit" })
      .select()
      .single();

    await supabase.from("audits").insert({
      lead_id: lead?.id,
      url,
      screenshot_url: screenshotBase64 ? screenshotUrl : null,
      report,
    });
  } catch {
    // Storage failure shouldn't block the user from seeing their report.
  }

  return NextResponse.json({ report, screenshotUrl: screenshotBase64 ? screenshotUrl : null });
}
