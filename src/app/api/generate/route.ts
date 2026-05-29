import { NextResponse } from "next/server";
import { generateCopy } from "@/lib/claude";
import { CONTENT_TYPES, LENGTHS, TONES } from "@/lib/content-types";

export const runtime = "nodejs";

const validIds = new Set(CONTENT_TYPES.map((t) => t.id));

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { contentTypeId, brief, tone, length, variations } =
    (body ?? {}) as Record<string, unknown>;

  // ── Validation ────────────────────────────────────────────────
  if (typeof brief !== "string" || brief.trim().length < 3) {
    return NextResponse.json(
      { error: "Please describe your product or idea (min 3 characters)." },
      { status: 400 },
    );
  }
  if (brief.length > 2000) {
    return NextResponse.json(
      { error: "Brief is too long (max 2000 characters)." },
      { status: 400 },
    );
  }
  if (typeof contentTypeId !== "string" || !validIds.has(contentTypeId)) {
    return NextResponse.json(
      { error: "Unknown content type." },
      { status: 400 },
    );
  }
  if (typeof tone !== "string" || !TONES.includes(tone as never)) {
    return NextResponse.json({ error: "Invalid tone." }, { status: 400 });
  }
  if (typeof length !== "string" || !LENGTHS.includes(length as never)) {
    return NextResponse.json({ error: "Invalid length." }, { status: 400 });
  }
  const count = Math.min(3, Math.max(1, Number(variations) || 1));

  try {
    const result = await generateCopy({
      contentTypeId,
      brief: brief.trim(),
      tone: tone as never,
      length: length as never,
      variations: count,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[generate] failed:", err);
    return NextResponse.json(
      { error: "Generation failed. Please try again in a moment." },
      { status: 502 },
    );
  }
}
