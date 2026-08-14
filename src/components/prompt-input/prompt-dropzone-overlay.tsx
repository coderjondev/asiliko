"use client";

import { memo } from "react";
import { UploadCloud } from "@/icons/icon";

interface PromptDropzoneOverlayProps {
  visible: boolean;
}

export const PromptDropzoneOverlay = memo(function PromptDropzoneOverlay({
  visible,
}: PromptDropzoneOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 rounded-[inherit] border-2 border-dashed border-primary bg-primary/5 backdrop-blur-sm animate-in fade-in duration-150"
      aria-hidden="true"
    >
      <UploadCloud className="h-6 w-6 text-primary" />
      <p className="text-sm font-medium text-primary">Drop files to attach</p>
    </div>
  );
});
