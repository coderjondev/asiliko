"use client";

import { memo } from "react";
import { Code2 } from "@/icons/icon";
import type { DetectedCodeBlock } from "./index";

interface PromptCodePreviewProps {
  block: DetectedCodeBlock;
}

export const PromptCodePreview = memo(function PromptCodePreview({
  block,
}: PromptCodePreviewProps) {
  return (
    <div className="mx-3 mb-1 overflow-hidden rounded-lg border border-border bg-zinc-950 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200 sm:mx-4">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3 py-1.5">
        <Code2 className="h-3.5 w-3.5 text-zinc-400" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          {block.language}
        </span>
      </div>
      <pre className="max-h-48 overflow-auto px-3 py-2.5">
        <code className="font-mono text-[12.5px] leading-relaxed text-zinc-100">
          {block.code}
        </code>
      </pre>
    </div>
  );
});
