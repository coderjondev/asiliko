"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
} from "react";
import { PromptAttachments } from "./prompt-attachments";
import { PromptCodePreview } from "./prompt-code-preview";
import { PromptLargeTextDialog } from "./prompt-large-text-dialog";
import { PromptTextarea, type PromptTextareaHandle } from "./prompt-textarea";
import { PromptToolbar } from "./prompt-toolbar";
import { PromptActions } from "./prompt-actions";
import { PromptFileLimit } from "./prompt-file-limit";
import { PromptDropzoneOverlay } from "./prompt-dropzone-overlay";
import { usePasteHandler } from "../../hooks/use-paste-handler";
import { useSendMessage } from "../../hooks/use-send-message";
import {
  createAttachmentFromFile,
  releaseAttachmentPreview,
  textToFile,
} from "@/utils/file-utils";
import { detectCodeBlocks } from "@/utils/detect-code";
import { DEFAULT_MODELS } from "./index";
import type {
  LargeTextChoice,
  PromptAttachment,
  PromptMode,
  PromptModel,
  SendPayload,
} from "../../types/prompt-input.type";
import { cn } from "@/lib/utils";

export interface PromptInputProps {
  onSend: (payload: SendPayload) => void;
  models?: PromptModel[];
  defaultModelId?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function PromptInput({
  onSend,
  models = DEFAULT_MODELS,
  defaultModelId,
  placeholder = "Message...",
  disabled = false,
  className,
}: PromptInputProps) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<PromptAttachment[]>([]);
  const [mode, setMode] = useState<PromptMode>("normal");
  const [modelId, setModelId] = useState(defaultModelId ?? models[0]?.id ?? "");
  const [isRecording, setIsRecording] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [pendingLargeText, setPendingLargeText] = useState<string | null>(null);

  const textareaHandleRef = useRef<PromptTextareaHandle>(null);
  const dragCounterRef = useRef(0);

  const detectedCodeBlock = useMemo(() => {
    const blocks = detectCodeBlocks(text);
    return blocks[0] ?? null;
  }, [text]);

  const addAttachments = useCallback((files: File[]) => {
    setAttachments((prev) => [...prev, ...files.map(createAttachmentFromFile)]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const target = prev.find((attachment) => attachment.id === id);
      if (target) releaseAttachmentPreview(target);
      return prev.filter((attachment) => attachment.id !== id);
    });
  }, []);

  const resetComposer = useCallback(() => {
    setText("");
    setAttachments((prev) => {
      prev.forEach(releaseAttachmentPreview);
      return [];
    });
  }, []);

  const { canSend, send } = useSendMessage({
    text,
    attachments,
    mode,
    modelId,
    onSend,
    onAfterSend: resetComposer,
  });

  const { handlePaste } = usePasteHandler({
    onImages: addAttachments,
    onLargeText: setPendingLargeText,
    onPlainText: (pastedText) => setText((prev) => prev + pastedText),
  });

  const handleLargeTextChoice = useCallback(
    (choice: LargeTextChoice) => {
      if (pendingLargeText === null) return;

      if (choice === "attach-txt") {
        addAttachments([textToFile(pendingLargeText, "pasted-text.txt")]);
      } else if (choice === "attach-pasted") {
        addAttachments([textToFile(pendingLargeText, "pasted-content.txt")]);
      }

      setPendingLargeText(null);
    },
    [pendingLargeText, addAttachments],
  );

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.dataTransfer?.types.includes("Files")) return;
    dragCounterRef.current += 1;
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) setIsDraggingOver(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounterRef.current = 0;
    setIsDraggingOver(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      addAttachments(Array.from(files));
    }
  };

  const handleTextareaPaste = useCallback(
    (event: ClipboardEvent<HTMLTextAreaElement>) => handlePaste(event),
    [handlePaste],
  );

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl",
        "rounded-3xl border border-border/80 bg-background/80 shadow-lg shadow-black/3",
        "backdrop-blur-xl transition-colors dark:shadow-black/20",
        "focus-within:border-foreground/20 focus-within:shadow-xl",
        className,
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <PromptDropzoneOverlay visible={isDraggingOver} />

      <PromptAttachments
        attachments={attachments}
        onRemove={removeAttachment}
      />

      {detectedCodeBlock && <PromptCodePreview block={detectedCodeBlock} />}

      <PromptTextarea
        ref={textareaHandleRef}
        value={text}
        onChange={setText}
        onSend={send}
        onPaste={handleTextareaPaste}
        placeholder={placeholder}
        disabled={disabled}
      />

      <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-1 sm:px-3">
        <PromptToolbar
          mode={mode}
          onModeChange={setMode}
          onFilesSelected={addAttachments}
          disabled={disabled}
        />

        <div className="flex items-center gap-2.5">
          <PromptFileLimit currentLength={text.length} />
          <PromptActions
            models={models}
            selectedModelId={modelId}
            onModelSelect={setModelId}
            isRecording={isRecording}
            onToggleRecording={() => setIsRecording((prev) => !prev)}
            canSend={canSend}
            onSend={send}
          />
        </div>
      </div>

      <PromptLargeTextDialog
        open={pendingLargeText !== null}
        characterCount={pendingLargeText?.length ?? 0}
        onChoice={handleLargeTextChoice}
      />
    </div>
  );
}
