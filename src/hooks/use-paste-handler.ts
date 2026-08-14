import { useCallback, type ClipboardEvent } from "react";
import { LARGE_TEXT_PASTE_THRESHOLD } from "@/utils/constants";
import { extractImagesFromClipboard } from "@/utils/detect-image";

interface UsePasteHandlerOptions {
  onImages: (files: File[]) => void;
  onLargeText: (text: string) => void;
  onPlainText: (text: string) => void;
}

export function usePasteHandler({
  onImages,
  onLargeText,
  onPlainText,
}: UsePasteHandlerOptions) {
  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLTextAreaElement>) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const images = extractImagesFromClipboard(items);
      if (images.length > 0) {
        event.preventDefault();
        onImages(images);
        return;
      }

      const text = event.clipboardData.getData("text/plain");
      if (text && text.length > LARGE_TEXT_PASTE_THRESHOLD) {
        event.preventDefault();
        onLargeText(text);
        return;
      }

      if (text) {
        onPlainText(text);
      }
    },
    [onImages, onLargeText, onPlainText],
  );

  return { handlePaste };
}
