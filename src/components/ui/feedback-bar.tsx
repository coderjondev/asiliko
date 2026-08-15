import type React from "react";
import { cn } from "@/lib/utils";
import { ThumbsDown, ThumbsUp, X } from "@/icons/icon";

type FeedbackBarProps = {
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  selected?: "helpful" | "not-helpful" | null;
  onHelpful?: () => void;
  onNotHelpful?: () => void;
  onClose?: () => void;
};

export function FeedbackBar({
  className,
  title,
  icon,
  selected = null,
  onHelpful,
  onNotHelpful,
  onClose,
}: FeedbackBarProps) {
  const hasSelection = selected != null;

  return (
    <div
      className={cn(
        "bg-background border-border inline-flex rounded-[12px] border text-sm",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-1 items-center justify-start gap-4 py-3 pl-4">
          {icon}
          {title && (
            <span className="text-foreground font-medium">{title}</span>
          )}
        </div>
        <div className="flex items-center justify-center gap-0.5 px-3 py-0">
          <button
            type="button"
            disabled={hasSelection}
            aria-pressed={selected === "helpful"}
            className={cn(
              "text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors",
              selected === "helpful" && "text-foreground",
              hasSelection && "cursor-not-allowed opacity-50",
            )}
            aria-label="Helpful"
            onClick={onHelpful}
          >
            <ThumbsUp className="size-4" />
          </button>
          <button
            type="button"
            disabled={hasSelection}
            aria-pressed={selected === "not-helpful"}
            className={cn(
              "text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors",
              selected === "not-helpful" && "text-foreground",
              hasSelection && "cursor-not-allowed opacity-50",
            )}
            aria-label="Not helpful"
            onClick={onNotHelpful}
          >
            <ThumbsDown className="size-4" />
          </button>
        </div>
        <span className="sr-only" role="status" aria-live="polite">
          {selected === "helpful" && "Marked as helpful"}
          {selected === "not-helpful" && "Marked as not helpful"}
        </span>
        <div className="border-border flex items-center justify-center border-l">
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground flex items-center justify-center rounded-md p-3"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
