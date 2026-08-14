export function isImageItem(item: DataTransferItem): boolean {
  return item.kind === "file" && item.type.startsWith("image/");
}

export function extractImagesFromClipboard(items: DataTransferItemList): File[] {
  const files: File[] = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (isImageItem(item)) {
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  }
  return files;
}

export function isLikelyUrl(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.includes(" ") || trimmed.includes("\n")) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
