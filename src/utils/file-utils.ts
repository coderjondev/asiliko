import type { AttachmentKind, PromptAttachment } from "../types";
import { ACCEPTED_FILE_TYPES } from "./constants";

export function detectFileKind(fileName: string): AttachmentKind {
  const lower = fileName.toLowerCase();
  const ext = lower.slice(lower.lastIndexOf("."));
  const kind = ACCEPTED_FILE_TYPES[ext];
  return (kind as AttachmentKind) ?? "other";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = value < 10 ? 1 : 0;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

export function createAttachmentFromFile(file: File): PromptAttachment {
  const kind = detectFileKind(file.name);
  const previewUrl = kind === "image" ? URL.createObjectURL(file) : undefined;

  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    kind,
    name: file.name,
    size: file.size,
    previewUrl,
  };
}

export function releaseAttachmentPreview(attachment: PromptAttachment): void {
  if (attachment.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl);
  }
}

export function textToFile(text: string, fileName = "pasted-text.txt"): File {
  const blob = new Blob([text], { type: "text/plain" });
  return new File([blob], fileName, { type: "text/plain" });
}
