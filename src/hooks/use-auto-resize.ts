import { useCallback, useEffect, type RefObject } from "react";
import {
  MAX_TEXTAREA_LINES,
  MIN_TEXTAREA_LINES,
  TEXTAREA_LINE_HEIGHT_PX,
  TEXTAREA_VERTICAL_PADDING_PX,
} from "../utils/constants";

interface UseAutoResizeOptions {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
}

export function useAutoResize({ textareaRef, value }: UseAutoResizeOptions) {
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    const minHeight = MIN_TEXTAREA_LINES * TEXTAREA_LINE_HEIGHT_PX + TEXTAREA_VERTICAL_PADDING_PX;
    const maxHeight = MAX_TEXTAREA_LINES * TEXTAREA_LINE_HEIGHT_PX + TEXTAREA_VERTICAL_PADDING_PX;

    el.style.height = "auto";
    const nextHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [textareaRef]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  return { resize };
}
