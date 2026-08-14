import type { DetectedCodeBlock } from "../types";

const FENCE_REGEX = /```(\w+)?\n([\s\S]*?)```/g;

const CODE_SIGNAL_PATTERNS: Array<{ language: string; pattern: RegExp }> = [
  { language: "typescript", pattern: /\b(const|let|function|interface|type)\s+\w+.*[:=]/ },
  { language: "javascript", pattern: /\bfunction\s+\w*\s*\([^)]*\)\s*{/ },
  { language: "jsx", pattern: /<[A-Z]\w*[\s/>]|return\s*\(\s*</ },
  { language: "python", pattern: /^\s*def\s+\w+\(.*\):\s*$/m },
  { language: "python", pattern: /^\s*(import|from)\s+\w+/m },
  { language: "rust", pattern: /\bfn\s+\w+\s*\(.*\)\s*(->\s*\w+\s*)?{/ },
  { language: "go", pattern: /\bfunc\s+\w+\s*\(/ },
  { language: "css", pattern: /[.#]?[\w-]+\s*{\s*[\w-]+\s*:\s*[^;]+;/ },
  { language: "json", pattern: /^\s*[{[][\s\S]*[}\]]\s*$/ },
  { language: "sql", pattern: /\b(SELECT|INSERT INTO|UPDATE|DELETE FROM)\b/i },
  { language: "shell", pattern: /^\s*(\$|#!\/bin\/(bash|sh))/m },
];

const MIN_RAW_CODE_LINES = 2;

export function detectCodeBlocks(text: string): DetectedCodeBlock[] {
  const blocks: DetectedCodeBlock[] = [];

  let match: RegExpExecArray | null;
  FENCE_REGEX.lastIndex = 0;
  while ((match = FENCE_REGEX.exec(text)) !== null) {
    blocks.push({
      language: match[1]?.toLowerCase() || "text",
      code: match[2].trimEnd(),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  if (blocks.length > 0) {
    return blocks;
  }

  const raw = detectRawCodeBlock(text);
  return raw ? [raw] : [];
}

function detectRawCodeBlock(text: string): DetectedCodeBlock | null {
  const lines = text.split("\n");
  if (lines.length < MIN_RAW_CODE_LINES) return null;

  for (const { language, pattern } of CODE_SIGNAL_PATTERNS) {
    if (pattern.test(text)) {
      return {
        language,
        code: text.trim(),
        startIndex: 0,
        endIndex: text.length,
      };
    }
  }

  return null;
}

export function containsCode(text: string): boolean {
  return detectCodeBlocks(text).length > 0;
}
