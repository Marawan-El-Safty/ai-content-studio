import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  Mail,
  Sparkles,
  Twitter,
  Zap,
  Library,
  Wand2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

const FEATURES = [
  {
    icon: Wand2,
    title: "Six copy formats",
    body: "Ad copy, emails, landing heroes, social posts, blog intros and pitches — each tuned with format-specific prompting.",
  },
  {
    icon: Zap,
    title: "Tone & length control",
    body: "Dial in Professional, Bold, Playful or Luxury voices and generate multiple variations in one click.",
  },
  {
    icon: Library,
    title: "Your content library",
    body: "Save the winners, favorite the best, and copy them anywhere. Persists locally — Supabase-ready out of the box.",
  },
];

const FORMATS = [
  { icon: Megaphone, label: "Ad Copy" },
  { icon: Mail, label: "Email" },
  { icon: Sparkles, label: "Landing Page" },
  { icon: Twitter, label: "Social Post" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-aurora relative overflow-hidden">
        <div className="container flex flex-col items-center gap-8 py-24 text-center sm:py-32">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <Sparkles className="size-3.5 text-primary" />
              Powered by Claude
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Premium marketing copy,
              <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                {" "}
                generated in seconds
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-xl text-pretty text-lg text-muted-foreground">
              An AI content studio for founders, marketers and freelancers.
              Describe your product, pick a tone, and ship high-converting copy
              across every format.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/studio"
                className={cn(buttonVariants({ size: "lg" }), "group")}
              >
                Start creating
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/library"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                View library
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {FORMATS.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
                >
                  <f.icon className="size-3.5" />
                  {f.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-5 grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <Reveal>
          <div className="bg-aurora relative overflow-hidden rounded-3xl border border-border p-10 text-center sm:p-16">
            <h2 className="mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Stop staring at a blank page.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Generate your first batch of copy in under a minute.
            </p>
            <Link
              href="/studio"
              className={cn(buttonVariants({ size: "lg" }), "mt-7 group")}
            >
              Open the Studio
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-8 text-sm text-muted-foreground sm:flex-row">
          <p>Built with Next.js, Tailwind & Claude.</p>
          <p>© {new Date().getFullYear()} AI Content Studio</p>
        </div>
      </footer>
    </div>
  );
}
