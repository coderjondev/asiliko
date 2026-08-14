import type { PromptModel } from "@/types/prompt-input.type";

export const MIN_TEXTAREA_LINES = 1;
export const MAX_TEXTAREA_LINES = 10;

export const TEXTAREA_LINE_HEIGHT_PX = 24;
export const TEXTAREA_VERTICAL_PADDING_PX = 20;

export const CHARACTER_LIMIT = 8000;
export const CHARACTER_WARNING_THRESHOLD = 0.85;

export const LARGE_TEXT_PASTE_THRESHOLD = 8000;

export const ACCEPTED_FILE_TYPES: Record<string, string> = {
  ".png": "image",
  ".jpg": "image",
  ".jpeg": "image",
  ".gif": "image",
  ".webp": "image",
  ".pdf": "pdf",
  ".txt": "txt",
  ".md": "md",
  ".json": "json",
  ".docx": "docx",
  ".csv": "csv",
};

export const ACCEPTED_FILE_INPUT_ACCEPT =
  ".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.md,.json,.docx,.csv,image/*";

export const MAX_ATTACHMENT_SIZE_BYTES = 25 * 1024 * 1024;

export const DEFAULT_MODELS: PromptModel[] = [
  { id: "gpt-5", label: "GPT-5", description: "OpenAI flagship model" },
  { id: "claude", label: "Claude", description: "Anthropic flagship model" },
  { id: "gemini", label: "Gemini", description: "Google flagship model" },
  {
    id: "deepseek",
    label: "DeepSeek",
    description: "DeepSeek reasoning model",
  },
  { id: "grok", label: "Grok", description: "xAI flagship model" },
  { id: "llama", label: "Llama", description: "Meta open model" },
  { id: "mistral", label: "Mistral", description: "Mistral open model" },
];
