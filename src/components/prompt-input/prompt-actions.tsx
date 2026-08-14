"use client";

import { memo } from "react";
import { ArrowUp, Mic } from "@/icons/icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PromptModelSelector } from "./prompt-model-selector";
import type { PromptModel } from "./index";

interface PromptActionsProps {
  models: PromptModel[];
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  canSend: boolean;
  onSend: () => void;
}

export const PromptActions = memo(function PromptActions({
  models,
  selectedModelId,
  onModelSelect,
  isRecording,
  onToggleRecording,
  canSend,
  onSend,
}: PromptActionsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <PromptModelSelector
        models={models}
        selectedModelId={selectedModelId}
        onSelect={onModelSelect}
      />

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleRecording}
              aria-label={isRecording ? "Stop recording" : "Start voice input"}
              aria-pressed={isRecording}
              className={cn(
                "rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
                isRecording && "text-red-500 hover:text-red-500",
              )}
            >
              <Mic
                className={cn("h-4.5 w-4.5", isRecording && "animate-pulse")}
              />
            </Button>
          }
        />
        <TooltipContent>
          {isRecording ? "Recording..." : "Voice input"}
        </TooltipContent>
      </Tooltip>

      <Button
        type="button"
        size="icon"
        disabled={!canSend}
        variant={"outline"}
        onClick={onSend}
        aria-label="Send message"
        className={cn(
          "rounded-full transition-all duration-150",
          canSend
            ? "scale-100 bg-foreground text-background hover:scale-105 hover:opacity-90"
            : "scale-95 cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
});
