import Anthropic from "@anthropic-ai/sdk";
import { getContentType, type Length, type Tone } from "./content-types";

export interface GenerateParams {
  contentTypeId: string;
  brief: string;
  tone: Tone;
  length: Length;
  variations: number;
}

const LENGTH_HINT: Record<Length, string> = {
  Short: "Keep it very concise — every word earns its place.",
  Medium: "Use a balanced, moderate length.",
  Long: "Be thorough and expansive while staying engaging.",
};

export function isClaudeConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function buildPrompt(p: GenerateParams) {
  const type = getContentType(p.contentTypeId);
  return [
    `You are an elite direct-response copywriter.`,
    `Task: ${type.guidance}`,
    `Tone: ${p.tone}.`,
    LENGTH_HINT[p.length],
    `Product / brief: """${p.brief}"""`,
    ``,
    `Produce exactly ${p.variations} distinct variation(s).`,
    `Return ONLY a JSON array of strings, no commentary, no markdown fences.`,
    `Each array item is one complete variation (may contain line breaks).`,
  ].join("\n");
}

/** Strip accidental code fences and parse the model's JSON array. */
function parseVariations(raw: string, fallbackCount: number): string[] {
  let text = raw.trim();
  text = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v).trim()).filter(Boolean);
    }
  } catch {
    // Fall back to treating the whole response as one variation.
  }
  return [text].slice(0, fallbackCount);
}

/**
 * Generate marketing copy. Falls back to high-quality mock output when
 * no API key is present so the app stays fully demoable.
 */
export async function generateCopy(p: GenerateParams): Promise<{
  variations: string[];
  demo: boolean;
}> {
  if (!isClaudeConfigured()) {
    return { variations: mockVariations(p), demo: true };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

  const msg = await client.messages.create({
    model,
    max_tokens: 1500,
    messages: [{ role: "user", content: buildPrompt(p) }],
  });

  const raw = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return { variations: parseVariations(raw, p.variations), demo: false };
}

/** Deterministic, realistic placeholder output for demo mode. */
function mockVariations(p: GenerateParams): string[] {
  const type = getContentType(p.contentTypeId);
  const subject = p.brief || type.placeholder;
  const base = [
    `Stop wrestling with ${subject.toLowerCase()}. There's a faster way — and it starts in under 60 seconds.`,
    `Meet the smarter approach to ${subject.toLowerCase()}. Built for teams who'd rather ship than struggle.`,
    `What if ${subject.toLowerCase()} just… worked? Thousands already made the switch. Your turn.`,
  ];
  return base.slice(0, Math.max(1, p.variations)).map(
    (line) =>
      `${line}\n\n[Demo mode — add your ANTHROPIC_API_KEY in .env.local for real ${p.tone.toLowerCase()} ${type.label.toLowerCase()}.]`,
  );
}
