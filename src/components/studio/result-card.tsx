"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { wordCount } from "@/lib/utils";

export function ResultCard({
  text,
  index,
  onSave,
}: {
  text: string;
  index: number;
  onSave: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const save = () => {
    onSave(text);
    setSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="group rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Variation {index + 1}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button variant="ghost" size="sm" onClick={copy}>
            {copied ? <Check className="text-emerald-500" /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" onClick={save} disabled={saved}>
            {saved ? <Check className="text-emerald-500" /> : <Save />}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        {wordCount(text)} words
      </p>
    </motion.div>
  );
}

export function ResultSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 h-3 w-24 rounded bg-muted shimmer" />
      <div className="space-y-2.5">
        <div className="h-3 w-full rounded bg-muted shimmer" />
        <div className="h-3 w-[92%] rounded bg-muted shimmer" />
        <div className="h-3 w-[78%] rounded bg-muted shimmer" />
      </div>
    </div>
  );
}
