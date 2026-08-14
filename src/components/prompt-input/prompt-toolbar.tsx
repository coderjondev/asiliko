"use client";

import { memo, useRef, type ChangeEvent } from "react";
import { Globe, Plus } from "@/icons/icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ACCEPTED_FILE_INPUT_ACCEPT } from "@/utils/constants";
import type { PromptMode } from "../../types/prompt-input.type";
import { Input } from "../ui/input";

interface PromptToolbarProps {
  mode: PromptMode;
  onModeChange: (mode: PromptMode) => void;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const PromptToolbar = memo(function PromptToolbar({
  mode,
  onModeChange,
  onFilesSelected,
  disabled,
}: PromptToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSearch = mode === "search";

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
    }
    event.target.value = "";
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_FILE_INPUT_ACCEPT}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Add file"
              className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Plus className="h-4.5 w-4.5" />
            </Button>
          }
        />
        <TooltipContent>
          Add file (image, PDF, TXT, MD, JSON, DOCX, CSV)
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onModeChange(isSearch ? "normal" : "search")}
              aria-pressed={isSearch}
              aria-label="Toggle web search"
              className={cn(
                "gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors",
                isSearch
                  ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 dark:text-blue-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Globe className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          }
        />

        <TooltipContent>
          {isSearch ? "Search mode on" : "Search the web"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
});
