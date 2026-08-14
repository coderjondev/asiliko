export type AttachmentKind = "image" | "pdf" | "txt" | "md" | "json" | "docx" | "csv" | "other";

export interface PromptAttachment {
  id: string;
  file: File;
  kind: AttachmentKind;
  name: string;
  size: number;
  previewUrl?: string;
}

export interface DetectedCodeBlock {
  language: string;
  code: string;
  startIndex: number;
  endIndex: number;
}

export interface PromptModel {
  id: string;
  label: string;
  description?: string;
}

export type PromptMode = "normal" | "search";

export interface SendPayload {
  text: string;
  attachments: PromptAttachment[];
  mode: PromptMode;
  modelId: string;
}

export type LargeTextChoice = "attach-txt" | "attach-pasted" | "cancel";
