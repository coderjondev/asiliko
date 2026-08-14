import { useCallback } from "react";
import type { PromptAttachment, PromptMode, SendPayload } from "@/types/prompt-input.type";

interface UseSendMessageOptions {
  text: string;
  attachments: PromptAttachment[];
  mode: PromptMode;
  modelId: string;
  onSend: (payload: SendPayload) => void;
  onAfterSend: () => void;
}

export function useSendMessage({
  text,
  attachments,
  mode,
  modelId,
  onSend,
  onAfterSend,
}: UseSendMessageOptions) {
  const canSend = text.trim().length > 0 || attachments.length > 0;

  const send = useCallback(() => {
    if (!canSend) return;

    onSend({
      text: text.trim(),
      attachments,
      mode,
      modelId,
    });
    onAfterSend();
  }, [canSend, text, attachments, mode, modelId, onSend, onAfterSend]);

  return { canSend, send };
}
