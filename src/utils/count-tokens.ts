export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function characterCount(text: string): number {
  return text.length;
}
