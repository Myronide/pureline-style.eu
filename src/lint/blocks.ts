import { closeOf, openOf, prevIndex, skipSpace, wordBefore, wordEndingAt } from "./scan";

export type BlockKind = "function" | "if" | "else" | "loop" | "switch" | "try" | "other";

export interface Block {
  open: number;
  close: number;
  kind: BlockKind;
  /** Control-flow nesting depth inside the enclosing function (the block itself included). */
  depth: number;
}

const CONTROL: ReadonlySet<BlockKind> = new Set(["if", "else", "loop", "switch", "try"]);
export const isControl = (kind: BlockKind) => CONTROL.has(kind);

export function headerStart(m: string, open: number): number {
  let s = open - 1;
  while (s >= 0 && !";{}".includes(m[s])) s--;
  return s + 1;
}

function classifyBlock(m: string, open: number): BlockKind {
  const p = prevIndex(m, open);
  if (p < 0) return "other";

  if (m[p] === ")") {
    const w = wordBefore(m, openOf(m, p));
    if (w === "if") return "if";
    if (w === "for" || w === "while" || w === "await") return "loop";
    if (w === "switch") return "switch";
    if (w === "catch") return "try";
    if (w === "synchronized" || w === "with") return "other";
    return "function";
  }

  if (m[p] === ">" && (m[p - 1] === "=" || m[p - 1] === "-")) return "function";

  const w = wordEndingAt(m, p);
  if (w === "else") return "else";
  if (w === "try" || w === "finally" || w === "catch") return "try";
  if (w === "do") return "loop";
  return /\)\s*(?::|throws\b)[^;{}()]*$/.test(m.slice(headerStart(m, open), open)) ? "function" : "other";
}

/** Every balanced `{ }` block with its kind and control-flow depth. */
export function listBlocks(m: string): Block[] {
  const blocks: Block[] = [];
  const stack: Block[] = [];
  for (let i = 0; i < m.length; i++) {
    if (m[i] === "{") {
      const kind = classifyBlock(m, i);
      const base = stack.length ? stack[stack.length - 1].depth : 0;
      const depth = kind === "function" ? 0 : isControl(kind) ? base + 1 : base;
      const block: Block = { open: i, close: -1, kind, depth };
      stack.push(block);
      blocks.push(block);
    } else if (m[i] === "}") {
      const block = stack.pop();
      if (block) block.close = i;
    }
  }
  return blocks.filter((b) => b.close !== -1);
}

const EXPRESSION_WORDS: ReadonlySet<string> = new Set(["return", "throw", "yield", "await", "new", "typeof", "case", "void", "delete", "in", "of"]);

/** `{` that opens an object literal / type literal rather than a statement block. */
function isExpressionBrace(m: string, open: number, from: number): boolean {
  let p = open - 1;
  while (p >= from && /\s/.test(m[p])) p--;
  if (p < from) return false;
  if (m[p] === ")" || m[p] === ">") return false;
  if ("=(,:?[&|+-*/%!".includes(m[p])) return true;
  return EXPRESSION_WORDS.has(wordEndingAt(m, p));
}

/** True when the newline at `at` ends a statement (no operator or continuation around it). */
export function endsStatement(m: string, at: number, to: number): boolean {
  const p = prevIndex(m, at);
  const q = skipSpace(m, at);
  if (p < 0 || q >= to) return true;
  const last = m[p];
  const doubled = (last === "+" || last === "-") && m[p - 1] === last;
  if (!doubled && "=+-*/%&|^?:,.(<[!".includes(last)) return false;
  if (last === ">" && m[p - 1] === "=") return false;
  return !".,?:+-*/%&|^)]=".includes(m[q]);
}

/** Offset just past the statement that begins at `start` (handles `;` and newline-terminated statements). */
export function statementEnd(m: string, start: number): number {
  const trim = (to: number) => {
    let e = to;
    while (e > start && /\s/.test(m[e - 1])) e--;
    return e;
  };

  let depth = 0;
  for (let i = start; i < m.length; i++) {
    const c = m[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") {
      if (--depth < 0) return trim(i);
    } else if (c === ";" && depth === 0) return i + 1;
    else if (c === "\n" && depth === 0 && endsStatement(m, i, m.length)) return trim(i);
  }
  return trim(m.length);
}

/** Start offsets of the top-level statements inside `m[from, to)`. */
export function statementStarts(m: string, from: number, to: number): number[] {
  const starts: number[] = [];
  let depth = 0;
  let fresh = true;

  for (let i = from; i < to; i++) {
    const c = m[i];
    if (fresh && depth === 0 && !/\s/.test(c)) {
      starts.push(i);
      fresh = false;
    }

    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "{") {
      if (depth === 0 && !isExpressionBrace(m, i, from)) {
        const close = closeOf(m, i);
        if (close === -1 || close >= to) break;
        i = close;
        fresh = !/^\s*(else|catch|finally)\b/.test(m.slice(i + 1, to));
        continue;
      }
      depth++;
    } else if (c === "}") depth--;
    else if (c === ";" && depth === 0) fresh = true;
    else if (c === "\n" && depth === 0 && !fresh && endsStatement(m, i, to)) fresh = true;
  }
  return starts;
}

/** `return` / `throw` / `continue` / `break` when the block ends with one, else null. */
export function terminator(m: string, from: number, to: number): string | null {
  const start = statementStarts(m, from, to).pop();
  if (start === undefined) return null;
  return /^(return|throw|continue|break)\b/.exec(m.slice(start, to).trim())?.[1] ?? null;
}

export interface IfHead {
  ifStart: number;
  condOpen: number;
  condClose: number;
}

/** The `if (...)` header in front of the block that opens at `open`, if any. */
export function ifHead(m: string, open: number): IfHead | null {
  const condClose = prevIndex(m, open);
  if (condClose < 0 || m[condClose] !== ")") return null;
  const condOpen = openOf(m, condClose);
  if (condOpen < 0) return null;
  const q = prevIndex(m, condOpen);
  if (wordEndingAt(m, q) !== "if") return null;
  return { ifStart: q - 1, condOpen, condClose };
}

/** `(` / `)` offsets of the parameter list of the function block that opens at `open`. */
export function paramList(m: string, open: number): [number, number] | null {
  let end = prevIndex(m, open);
  if (end >= 1 && m[end] === ">" && (m[end - 1] === "=" || m[end - 1] === "-")) {
    end = prevIndex(m, end - 1);
  } else if (m[end] !== ")") {
    const from = headerStart(m, open);
    const typed = /\)\s*(?::|throws\b)[^()]*$/.exec(m.slice(from, open));
    if (!typed) return null;
    end = from + typed.index;
  }
  if (m[end] !== ")") return null;
  const start = openOf(m, end);
  return start < 0 ? null : [start, end];
}
