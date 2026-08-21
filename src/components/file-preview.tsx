"use client";

import { useEffect, useState } from "react";

import { Paperclip, X } from "@/icons/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

import { cn } from "@/lib/utils";

type FilePreviewProps = {
  file: File;
  isSingle: boolean;
  onRemove: () => void;
};

const isImageFile = (file: File) => file.type.startsWith("image/");

export function FilePreview({ file, isSingle, onRemove }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = isImageFile(file);

  useEffect(() => {
    if (!isImage) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };

    reader.readAsDataURL(file);

    return () => {
      reader.abort();
    };
  }, [file, isImage]);

  return (
    <div
      className={cn(
        "group relative shrink-0",
        "cursor-auto select-none rounded-lg border bg-muted",
      )}
    >
      {isImage && previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className={cn(
            "cursor-pointer object-cover",
            isSingle ? "size-24" : "size-12",
          )}
        />
      ) : (
        <div className="flex h-12 w-50 items-center gap-3 px-2">
          <Paperclip className="size-4 shrink-0 text-muted-foreground" />

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{file.name}</span>

            <span className="text-xs text-muted-foreground">
              {file.type || "File"}
            </span>
          </div>
        </div>
      )}

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${file.name}`}
              className={cn(
                "absolute -right-1.5 -top-1.5 z-50",
                "flex size-5 items-center justify-center",
                "rounded-full",
                "bg-white text-black shadow-sm",
                "opacity-0 transition-opacity duration-300",
                "group-hover:opacity-100",
                "hover:bg-white/90",
              )}
            />
          }
        >
          <X className="size-3.5" />
        </TooltipTrigger>

        <TooltipContent side="top">Remove file</TooltipContent>
      </Tooltip>
    </div>
  );
}
