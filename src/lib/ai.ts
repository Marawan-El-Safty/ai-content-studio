import { getContentType, type Length, type Tone } from "./content-types";

export interface GenerateParams {
  contentTypeId: string;
  brief: string;
  tone: Tone;
  length: Length;
  variations: number;
}

/**
 * Local copywriting engine — no external API, no keys, no billing.
 *
 * Generates varied, tone- and format-aware marketing copy entirely
 * in-process. This keeps the app free to run and deploy anywhere
 * (including static/free hosting) with zero configuration.
 *
 * The module deliberately mirrors the shape an LLM integration would
 * use (async `generateCopy` returning variations), so swapping in a
 * hosted model later is a contained change in this one file.
 */

// ── Tone vocabularies ────────────────────────────────────────────
const TONE_PROFILE: Record<
  Tone,
  {
    hooks: string[];
    connectors: string[];
    ctas: string[];
    adjectives: string[];
  }
> = {
  Professional: {
    hooks: [
      "Streamline how your team handles",
      "A smarter, more reliable approach to",
      "Bring clarity and control to",
    ],
    connectors: [
      "Built for teams that value precision",
      "Designed to scale with your workflow",
      "Trusted where results matter",
    ],
    ctas: ["Request a demo", "Get started today", "See how it works"],
    adjectives: ["efficient", "reliable", "scalable", "proven"],
  },
  Friendly: {
    hooks: [
      "Say hello to an easier way to handle",
      "We made",
      "Good news for anyone tired of",
    ],
    connectors: [
      "It just works — no headaches, no learning curve",
      "Thousands of happy users already made the switch",
      "Simple enough for day one, powerful enough for year three",
    ],
    ctas: ["Try it free", "Join us today", "Give it a go"],
    adjectives: ["simple", "delightful", "effortless", "friendly"],
  },
  Bold: {
    hooks: [
      "Stop wasting time on",
      "Forget everything you know about",
      "It's time to dominate",
    ],
    connectors: [
      "No fluff. No friction. Just results",
      "The competition won't see it coming",
      "This is how winners handle it",
    ],
    ctas: ["Start now", "Claim your edge", "Take control"],
    adjectives: ["unstoppable", "game-changing", "relentless", "powerful"],
  },
  Playful: {
    hooks: [
      "Plot twist: handling",
      "Warning — you might actually enjoy",
      "Who said",
    ],
    connectors: [
      "It's almost unfair how easy this is",
      "Less grind, more high-fives",
      "Your future self is already thanking you",
    ],
    ctas: ["Let's go", "Jump in", "Try the magic"],
    adjectives: ["ridiculously easy", "fun", "clever", "addictive"],
  },
  Luxury: {
    hooks: [
      "Experience a refined approach to",
      "Elevate the way you handle",
      "For those who expect more from",
    ],
    connectors: [
      "Crafted for those who appreciate the details",
      "Quietly powerful, beautifully simple",
      "Where performance meets elegance",
    ],
    ctas: ["Discover more", "Begin your experience", "Request access"],
    adjectives: ["refined", "premium", "elegant", "exceptional"],
  },
  Technical: {
    hooks: [
      "Automate and optimize",
      "Ship faster with a robust approach to",
      "Cut overhead from",
    ],
    connectors: [
      "Fully typed, well-documented, and battle-tested",
      "Integrates cleanly with your existing stack",
      "Observable, secure, and built to scale",
    ],
    ctas: ["Read the docs", "Start building", "View the API"],
    adjectives: ["robust", "performant", "secure", "extensible"],
  },
};

// ── Deterministic-but-varied pseudo random ───────────────────────
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]) {
  return arr[Math.floor(rng() * arr.length)];
}

/** Tidy the brief into a lowercase subject phrase. */
function subjectOf(brief: string, fallback: string) {
  const s = brief.trim().replace(/[.!?]+$/, "");
  return (s || fallback).toLowerCase();
}

/** Capitalize first letter. */
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildVariation(p: GenerateParams, seedIndex: number): string {
  const type = getContentType(p.contentTypeId);
  const profile = TONE_PROFILE[p.tone];
  const subject = subjectOf(p.brief, type.placeholder);
  const rng = seeded(`${p.brief}|${p.tone}|${p.length}|${type.id}|${seedIndex}`);

  const hook = pick(rng, profile.hooks);
  const connector = pick(rng, profile.connectors);
  const cta = pick(rng, profile.ctas);
  const adj = pick(rng, profile.adjectives);
  const adj2 = pick(rng, profile.adjectives);

  const longTail =
    p.length === "Long"
      ? ` ${connector}. Whether you're just getting started or scaling fast, it adapts to you — not the other way around.`
      : p.length === "Medium"
        ? ` ${connector}.`
        : "";

  switch (type.id) {
    case "ad":
      return `${hook} ${subject}.\n\n${cap(adj)} by design and ${adj2} where it counts.${longTail}\n\n👉 ${cta}`;

    case "email": {
      const subjectLine = `${cap(adj)} ${subject} — without the busywork`;
      return `Subject: ${subjectLine}\n\nHi there,\n\n${cap(hook)} ${subject}. ${cap(connector)}.${longTail}\n\n${cta} →\n\nCheers,\nThe Team`;
    }

    case "landing":
      return `${cap(adj)} ${subject}, finally simple.\n\n${cap(connector)}.${longTail}\n\n• ${cap(adj)} from day one\n• ${cap(adj2)} at any scale\n• Set up in minutes, not weeks\n\n[ ${cta} ]`;

    case "social":
      return `${cap(hook)} ${subject}. 🚀\n\n${cap(connector)}.\n\nThe best part? It's ${adj}.${longTail}\n\n${cta} 👇`;

    case "blog":
      return `${cap(hook)} ${subject}? You're not alone.\n\nMost people settle for clunky, time-consuming workarounds — and quietly accept the cost. But it doesn't have to be that way.\n\nIn this post, we'll break down a ${adj}, ${adj2} approach that changes the game.${longTail}`;

    case "pitch":
      return `${cap(subject)} is broken — it's slow, manual, and expensive.\n\nWe fix that with a ${adj}, ${adj2} solution that ${connector.toLowerCase()}. ${longTail}\n\nThe timing has never been better. ${cta}.`;

    default:
      return `${cap(hook)} ${subject}. ${cap(connector)}. ${cta}.`;
  }
}

/**
 * Generate marketing copy locally. Always succeeds — no network, no key.
 */
export async function generateCopy(p: GenerateParams): Promise<{
  variations: string[];
  demo: boolean;
}> {
  const count = Math.min(3, Math.max(1, p.variations));
  // Small artificial delay so the UI's loading state is perceptible.
  await new Promise((r) => setTimeout(r, 350));
  const variations = Array.from({ length: count }, (_, i) =>
    buildVariation(p, i),
  );
  return { variations, demo: false };
}
