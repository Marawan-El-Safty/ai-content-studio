"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Copy, Heart, Library as LibIcon, Trash2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { getContentType } from "@/lib/content-types";
import { useLibrary } from "@/hooks/use-library";
import type { Draft } from "@/lib/types";

export default function LibraryPage() {
  const { drafts, ready, remove, toggleFavorite } = useLibrary();
  const [filter, setFilter] = useState<"all" | "favorites">("all");

  const visible = useMemo(
    () => (filter === "favorites" ? drafts.filter((d) => d.favorite) : drafts),
    [drafts, filter],
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Library</h1>
            <p className="text-sm text-muted-foreground">
              {drafts.length} saved {drafts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
          {drafts.length > 0 && (
            <div className="flex rounded-lg border border-border p-0.5">
              {(["all", "favorites"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                    filter === f
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {ready && drafts.length === 0 && <EmptyState />}

        {ready && drafts.length > 0 && visible.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            No favorites yet — tap the heart on any saved piece.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => (
            <DraftCard
              key={d.id}
              draft={d}
              onRemove={remove}
              onFavorite={toggleFavorite}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function DraftCard({
  draft,
  onRemove,
  onFavorite,
}: {
  draft: Draft;
  onRemove: (id: string) => void;
  onFavorite: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const type = getContentType(draft.contentTypeId);

  const copy = async () => {
    await navigator.clipboard.writeText(draft.body);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <Badge className="gap-1.5">
          <type.icon className="size-3" />
          {type.label}
        </Badge>
        <button
          onClick={() => onFavorite(draft.id)}
          aria-label="Toggle favorite"
          className="text-muted-foreground transition-colors hover:text-red-500"
        >
          <Heart
            className={cn(
              "size-4",
              draft.favorite && "fill-red-500 text-red-500",
            )}
          />
        </button>
      </div>

      <p className="line-clamp-[8] flex-1 whitespace-pre-wrap text-sm leading-relaxed">
        {draft.body}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">
          {draft.tone} · {formatDate(draft.createdAt)}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={copy} aria-label="Copy">
            {copied ? <Check className="text-emerald-500" /> : <Copy />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(draft.id)}
            aria-label="Delete"
            className="hover:text-red-500"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <LibIcon className="size-6" />
      </div>
      <h3 className="text-lg font-semibold">Nothing saved yet</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Generate copy in the Studio and save your favorites to build your
        library.
      </p>
      <Link
        href="/studio"
        className={cn(buttonVariants(), "mt-5")}
      >
        Go to Studio
      </Link>
    </div>
  );
}
