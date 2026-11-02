import type { Comment, Lang, Source } from "./types";

const CLOSERS: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
const OPENERS: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

/** Blanks comments and string contents (keeping newlines and offsets) and collects the comments. */
function scan(src: string, lang: Lang): { masked: string; comments: Comment[] } {
  const out = src.split("");
  const comments: Comment[] = [];
  const blank = (from: number, to: number) => {
    for (let k = from; k < to; k++) if (out[k] !== "\n") out[k] = " ";
  };

  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];

    if (c === "/" && n === "/") {
      const nl = src.indexOf("\n", i);
      const end = nl === -1 ? src.length : nl;
      comments.push({ start: i, end, block: false });
      blank(i, end);
      i = end;
      continue;
    }

    if (c === "/" && n === "*") {
      const close = src.indexOf("*/", i + 2);
      const end = close === -1 ? src.length : close + 2;
      comments.push({ start: i, end, block: true });
      blank(i, end);
      i = end;
      continue;
    }

    if (lang === "java" && src.startsWith('"""', i)) {
      const close = src.indexOf('"""', i + 3);
      const end = close === -1 ? src.length : close + 3;
      blank(i + 3, Math.max(i + 3, end - 3));
      i = end;
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") j++;
        else if (src[j] === "\n" && c !== "`") break;
        j++;
      }
      blank(i + 1, Math.min(j, src.length));
      i = j + 1;
      continue;
    }

    i++;
  }

  return { masked: out.join(""), comments };
}

function detectUnit(src: string, lang: Lang): string {
  let smallest = 0;
  for (const line of src.split("\n")) {
    if (/^\t+\S/.test(line)) return "\t";
    const indent = /^( +)\S/.exec(line)?.[1].length ?? 0;
    if (indent && (!smallest || indent < smallest)) smallest = indent;
  }
  return " ".repeat(smallest >= 2 ? smallest : lang === "java" ? 4 : 2);
}

export function createSource(src: string, lang: Lang): Source {
  const { masked, comments } = scan(src, lang);
  const lineStarts = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === "\n") lineStarts.push(i + 1);

  return {
    src,
    masked,
    comments,
    lang,
    unit: detectUnit(src, lang),
    position(offset) {
      let lo = 0;
      let hi = lineStarts.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (lineStarts[mid] <= offset) lo = mid;
        else hi = mid - 1;
      }
      return { line: lo + 1, col: offset - lineStarts[lo] + 1 };
    },
  };
}

export const indentUnit = (src: string, lang: Lang) => detectUnit(src, lang);

/** Index of the bracket that closes the one at `open`, or -1. */
export function closeOf(m: string, open: number): number {
  const o = m[open];
  const c = CLOSERS[o];
  if (!c) return -1;
  let depth = 0;
  for (let i = open; i < m.length; i++) {
    if (m[i] === o) depth++;
    else if (m[i] === c && --depth === 0) return i;
  }
  return -1;
}

/** Index of the bracket that opens the one at `close`, or -1. */
export function openOf(m: string, close: number): number {
  const c = m[close];
  const o = OPENERS[c];
  if (!o) return -1;
  let depth = 0;
  for (let i = close; i >= 0; i--) {
    if (m[i] === c) depth++;
    else if (m[i] === o && --depth === 0) return i;
  }
  return -1;
}

export function skipSpace(m: string, from: number): number {
  let i = from;
  while (i < m.length && /\s/.test(m[i])) i++;
  return i;
}

/** Index of the last non-whitespace character before `before`, or -1. */
export function prevIndex(m: string, before: number): number {
  let i = before - 1;
  while (i >= 0 && /\s/.test(m[i])) i--;
  return i;
}

/** The identifier that ends at index `end` (inclusive). */
export function wordEndingAt(m: string, end: number): string {
  let s = end;
  while (s >= 0 && /[\w$]/.test(m[s])) s--;
  return m.slice(s + 1, end + 1);
}

/** The identifier directly before `idx`, skipping whitespace. */
export function wordBefore(m: string, idx: number): string {
  return wordEndingAt(m, prevIndex(m, idx));
}

export function indentOf(s: Source, offset: number): string {
  const lineStart = offset > 0 ? s.src.lastIndexOf("\n", offset - 1) + 1 : 0;
  return /^[ \t]*/.exec(s.src.slice(lineStart))![0];
}

/** Offset of the first non-blank character on the line that contains `offset`. */
export function lineHead(s: Source, offset: number): number {
  const lineStart = offset > 0 ? s.src.lastIndexOf("\n", offset - 1) + 1 : 0;
  return lineStart + indentOf(s, offset).length;
}
