"use client";

import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useAutoResize } from "@/hooks/use-auto-resize";
import { Textarea } from "../ui/textarea";

interface PromptTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface PromptTextareaHandle {
  focus: () => void;
}
export const PromptTextarea = memo(
  forwardRef<PromptTextareaHandle, PromptTextareaProps>(function PromptTextarea(
    { value, onChange, onSend, onPaste, placeholder = "Message...", disabled },
    ref,
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useAutoResize({ textareaRef, value });

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
    }));

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter") return;

      if (event.ctrlKey) {
        return;
      }

      event.preventDefault();
      onSend();
    };

    return (
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={onPaste}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label="Message"
        aria-multiline="true"
        className="w-full resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
      />
    );
  }),
);
