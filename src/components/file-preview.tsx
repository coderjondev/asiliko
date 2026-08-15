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
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, isImage]);

  return (
    <div
      className={cn(
        "group relative shrink-0 overflow-hidden",
        "rounded-xl border bg-muted",
      )}
    >
      {isImage && previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className={cn("object-cover", isSingle ? "size-36" : "size-14")}
        />
      ) : (
        <div className={cn("flex h-14 w-60 items-center gap-3 px-2")}>
          <Paperclip className="size-4.5 shrink-0 text-muted-foreground" />

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
                "absolute right-1.5 top-1.5",
                "flex size-5 items-center justify-center",
                "rounded-full",
                "bg-white text-black shadow-sm",
                "opacity-0 transition-opacity",
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
