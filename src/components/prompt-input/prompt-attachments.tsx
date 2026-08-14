"use client";

import { memo } from "react";
import {
  FileText,
  FileJson,
  FileSpreadsheet,
  File as FileIcon,
  X,
} from "@/icons/icon";
import { formatFileSize } from "@/utils/file-utils";
import type { AttachmentKind, PromptAttachment } from "./index";
import { cn } from "@/lib/utils";

const FILE_ICONS: Record<Exclude<AttachmentKind, "image">, typeof FileText> = {
  pdf: FileText,
  txt: FileText,
  md: FileText,
  json: FileJson,
  docx: FileText,
  csv: FileSpreadsheet,
  other: FileIcon,
};

interface PromptAttachmentsProps {
  attachments: PromptAttachment[];
  onRemove: (id: string) => void;
}

export const PromptAttachments = memo(function PromptAttachments({
  attachments,
  onRemove,
}: PromptAttachmentsProps) {
  if (attachments.length === 0) return null;

  return (
    <div
      role="list"
      aria-label="Attached files"
      className="flex flex-wrap gap-2 px-3 pt-3 sm:px-4 sm:pt-4"
    >
      {attachments.map((attachment) =>
        attachment.kind === "image" ? (
          <ImageAttachmentChip
            key={attachment.id}
            attachment={attachment}
            onRemove={onRemove}
          />
        ) : (
          <FileAttachmentChip
            key={attachment.id}
            attachment={attachment}
            onRemove={onRemove}
          />
        ),
      )}
    </div>
  );
});

function ImageAttachmentChip({
  attachment,
  onRemove,
}: {
  attachment: PromptAttachment;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      role="listitem"
      className="group relative h-20 w-20 shrink-0 animate-in fade-in zoom-in-95 duration-200"
    >
      <img
        src={attachment.previewUrl}
        alt={attachment.name}
        className="h-full w-full rounded-xl object-cover ring-1 ring-border"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-xl bg-linear-to-t from-black/70 to-transparent px-1.5 py-1">
        <p className="truncate text-[10px] font-medium text-white">
          {attachment.name}
        </p>
        <p className="text-[9px] text-white/70">
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(attachment.id)}
        aria-label={`Remove ${attachment.name}`}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function FileAttachmentChip({
  attachment,
  onRemove,
}: {
  attachment: PromptAttachment;
  onRemove: (id: string) => void;
}) {
  const Icon =
    FILE_ICONS[attachment.kind as Exclude<AttachmentKind, "image">] ?? FileIcon;

  return (
    <div
      role="listitem"
      className={cn(
        "group relative flex items-center gap-2 rounded-xl border border-border bg-muted/60 py-1.5 pl-2 pr-7",
        "animate-in fade-in slide-in-from-bottom-1 duration-200",
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 max-w-36">
        <p className="truncate text-xs font-medium leading-tight">
          {attachment.name}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(attachment.id)}
        aria-label={`Remove ${attachment.name}`}
        className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
