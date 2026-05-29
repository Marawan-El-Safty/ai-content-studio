import {
  Megaphone,
  Mail,
  Sparkles,
  Twitter,
  FileText,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export type Tone =
  | "Professional"
  | "Friendly"
  | "Bold"
  | "Playful"
  | "Luxury"
  | "Technical";

export const TONES: Tone[] = [
  "Professional",
  "Friendly",
  "Bold",
  "Playful",
  "Luxury",
  "Technical",
];

export type Length = "Short" | "Medium" | "Long";
export const LENGTHS: Length[] = ["Short", "Medium", "Long"];

export interface ContentType {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  placeholder: string;
  /** System guidance injected into the prompt for this format. */
  guidance: string;
}

export const CONTENT_TYPES: ContentType[] = [
  {
    id: "ad",
    label: "Ad Copy",
    description: "High-converting paid ads",
    icon: Megaphone,
    placeholder: "A productivity app that turns meeting notes into tasks",
    guidance:
      "Write punchy, benefit-led ad copy with a strong hook and a single clear call to action. Lead with the outcome, not the feature.",
  },
  {
    id: "email",
    label: "Email",
    description: "Outreach & campaigns",
    icon: Mail,
    placeholder: "Re-engage trial users who never upgraded",
    guidance:
      "Write a concise marketing email with a compelling subject line, a personable opening, scannable body, and one clear CTA.",
  },
  {
    id: "landing",
    label: "Landing Page",
    description: "Hero + value props",
    icon: Sparkles,
    placeholder: "A no-code tool for building internal dashboards",
    guidance:
      "Write landing page hero copy: a headline, a supporting subheadline, and 3 benefit-driven bullet points.",
  },
  {
    id: "social",
    label: "Social Post",
    description: "Twitter / LinkedIn",
    icon: Twitter,
    placeholder: "Announce our new AI search feature",
    guidance:
      "Write an engaging social media post with a scroll-stopping first line, value in the middle, and a light CTA. Use line breaks for readability.",
  },
  {
    id: "blog",
    label: "Blog Intro",
    description: "Article openers",
    icon: FileText,
    placeholder: "Why most onboarding flows lose users in week one",
    guidance:
      "Write an engaging blog introduction (2-3 short paragraphs) that hooks the reader with a relatable problem and previews the value of the article.",
  },
  {
    id: "pitch",
    label: "Pitch",
    description: "Elevator & sales",
    icon: Briefcase,
    placeholder: "B2B platform that automates SOC 2 compliance",
    guidance:
      "Write a crisp elevator pitch: the problem, the solution, and why now — in under 80 words, confident but not hyperbolic.",
  },
];

export function getContentType(id: string) {
  return CONTENT_TYPES.find((t) => t.id === id) ?? CONTENT_TYPES[0];
}
