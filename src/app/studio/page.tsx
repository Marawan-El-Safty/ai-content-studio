"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Wand2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CONTENT_TYPES,
  LENGTHS,
  TONES,
  getContentType,
  type Length,
  type Tone,
} from "@/lib/content-types";
import { useLibrary } from "@/hooks/use-library";
import { ResultCard, ResultSkeleton } from "@/components/studio/result-card";

export default function StudioPage() {
  const { save } = useLibrary();

  const [typeId, setTypeId] = useState(CONTENT_TYPES[0].id);
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [variations, setVariations] = useState(2);

  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeType = getContentType(typeId);

  async function handleGenerate() {
    if (brief.trim().length < 3) {
      setError("Describe your product or idea first.");
      return;
    }
    setError(null);
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentTypeId: typeId,
          brief,
          tone,
          length,
          variations,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setResults(data.variations);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSave(text: string) {
    save({
      title: brief.slice(0, 60) || activeType.label,
      body: text,
      contentTypeId: typeId,
      tone,
      brief,
    });
    toast.success("Saved to library");
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container grid gap-8 py-10 lg:grid-cols-[380px_1fr]">
        {/* ── Controls ──────────────────────────────────────── */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Studio</h1>
            <p className="text-sm text-muted-foreground">
              Describe it once. Generate on-brand copy instantly.
            </p>
          </div>

          {/* Content type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map((t) => {
                const active = t.id === typeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTypeId(t.id)}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg border p-3 text-left transition-all",
                      active
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border hover:border-foreground/20 hover:bg-accent/50",
                    )}
                  >
                    <t.icon
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {t.label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {t.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brief */}
          <div className="space-y-2">
            <label htmlFor="brief" className="text-sm font-medium">
              What are you promoting?
            </label>
            <Textarea
              id="brief"
              value={brief}
              maxLength={2000}
              onChange={(e) => setBrief(e.target.value)}
              placeholder={activeType.placeholder}
              className="min-h-[110px]"
            />
            <p className="text-right text-xs text-muted-foreground">
              {brief.length}/2000
            </p>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tone</label>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    tone === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Length + variations */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Length</label>
              <div className="flex rounded-lg border border-border p-0.5">
                {LENGTHS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                      length === l
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Variations</label>
              <div className="flex rounded-lg border border-border p-0.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setVariations(n)}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
                      variations === n
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            <Wand2 className={cn(loading && "animate-pulse")} />
            {loading ? "Generating…" : "Generate copy"}
          </Button>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="size-4" />
              {error}
            </p>
          )}
        </div>

        {/* ── Results ───────────────────────────────────────── */}
        <div className="space-y-4">
          {loading &&
            Array.from({ length: variations }).map((_, i) => (
              <ResultSkeleton key={i} />
            ))}

          {!loading && results.length === 0 && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
              <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <Sparkles className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">Your copy appears here</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Pick a format, describe your offer, and hit generate to see
                variations.
              </p>
            </div>
          )}

          {!loading &&
            results.map((text, i) => (
              <ResultCard
                key={i}
                text={text}
                index={i}
                onSave={handleSave}
              />
            ))}

          {!loading && results.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <Badge>{activeType.label}</Badge>
              <Badge>{tone}</Badge>
              <Badge>{length}</Badge>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
