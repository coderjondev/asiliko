"use client";

import { memo } from "react";
import { ChevronDown, Sparkles } from "@/icons/icon";
import { Button } from "@/components/ui/button";
import type { PromptModel } from "@/types/prompt-input.type";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";

interface PromptModelSelectorProps {
  models: PromptModel[];
  selectedModelId: string;
  onSelect: (modelId: string) => void;
}
export const PromptModelSelector = memo(function PromptModelSelector({
  models,
  selectedModelId,
  onSelect,
}: PromptModelSelectorProps) {
  const selected =
    models.find((model) => model.id === selectedModelId) ?? models[0];

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Selected model: ${selected?.label}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="max-w-24 truncate sm:max-w-none">
              {selected?.label}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        }
      />
      <PopoverContent className="w-56">
        {models.map((model) => (
          <PopoverHeader
            key={model.id}
            onSelect={() => onSelect(model.id)}
            className="flex flex-col items-start gap-0.5"
          >
            <PopoverTitle className="text-sm font-medium">
              {model.label}
            </PopoverTitle>
            {model.description && (
              <PopoverDescription className="text-xs text-muted-foreground">
                {model.description}
              </PopoverDescription>
            )}
          </PopoverHeader>
        ))}
      </PopoverContent>
    </Popover>
  );
});
