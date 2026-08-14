"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import {
  CHARACTER_LIMIT,
  CHARACTER_WARNING_THRESHOLD,
} from "@/utils/constants";

interface PromptFileLimitProps {
  currentLength: number;
}

export const PromptFileLimit = memo(function PromptFileLimit({
  currentLength,
}: PromptFileLimitProps) {
  const ratio = currentLength / CHARACTER_LIMIT;
  const isDanger = currentLength >= CHARACTER_LIMIT;
  const isWarning = !isDanger && ratio >= CHARACTER_WARNING_THRESHOLD;

  if (ratio < 0.5) return null;

  return (
    <span
      aria-live="polite"
      className={cn(
        "select-none text-[11px] tabular-nums transition-colors",
        isDanger && "font-semibold text-destructive",
        isWarning &&
          !isDanger &&
          "font-medium text-amber-600 dark:text-amber-500",
        !isDanger && !isWarning && "text-muted-foreground",
      )}
    >
      {currentLength.toLocaleString()} / {CHARACTER_LIMIT.toLocaleString()}
    </span>
  );
});
