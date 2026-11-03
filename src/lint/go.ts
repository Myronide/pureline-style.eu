import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for Go. Go is brace-based and always uses explicit blocks, so the checks cover nesting,
 * exits before else, weak names, identifier length and function length. Comments and string, rune and raw
 * string contents are masked first, so braces inside them do not count. Heuristic, like the rest of the checker.
 */

type GoKey = Extract<
  Msg["key"],
  "lint.flattenNesting" | "lint.avoidElse" | "lint.nameSaysNothing" | "lint.nameTooLong" | "lint.longFunction" | "lint.reviewFunction"
>;

const RULE: Record<GoKey, string> = {
  "lint.flattenNesting": "PL-CF-001",
  "lint.avoidElse": "PL-CF-002",
  "lint.nameSaysNothing": "PL-NAME-001",
  "lint.nameTooLong": "PL-NAME-001",
  "lint.longFunction": "PL-FN-001",
  "lint.reviewFunction": "PL-FN-001",
};

const CONTROL = /^(if|for|switch)\b/;
const EXIT = /^(return|break|continue|panic\s*\()/;
const INLINE_EXIT_ELSE = /\b(return\b[^{}]*|break|continue|panic\s*\([^)]*\))\s*\}\s*else\b/;
const ELSE_LINE = /^\s*\}?\s*else\b/;
const WEAK = /^(tmp|obj|thing|data\d+)$/;
const SHORT_OK = new Set(["i", "j", "k", "x", "y", "z"]);
const MAX_NAME = 40;

interface Line {
  code: string;
  offset: number;
  /** Brace depth at the start of the line. */
  start: number;
  /** Brace depth after the line. */
  end: number;
  /** Depth of the line's own block: `start` minus leading closing braces. */
  level: number;
  blank: boolean;
}

/** Same length as the input: comments and string, rune and raw-string contents become spaces (newlines stay). */
function mask(code: string): string {
  const blank = (c: string) => (c === "\n" ? "\n" : " ");
  let out = "";
  let i = 0;
  while (i < code.length) {
    const c = code[i]!;
    const next = code[i + 1];
    if (c === "/" && next === "/") {
      while (i < code.length && code[i] !== "\n") out += blank(code[i++]!);
    } else if (c === "/" && next === "*") {
      const end = code.indexOf("*/", i + 2);
      const stop = end < 0 ? code.length : end + 2;
      while (i < stop) out += blank(code[i++]!);
    } else if (c === '"' || c === "'" || c === "`") {
      out += " ";
      i++;
      while (i < code.length && code[i] !== c && (c === "`" || code[i] !== "\n")) {
        const width = c !== "`" && code[i] === "\\" ? 2 : 1;
        for (let k = 0; k < width && i < code.length; k++) out += blank(code[i++]!);
      }
      if (i < code.length && code[i] === c) {
        out += " ";
        i++;
      }
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

function splitLines(masked: string): Line[] {
  let depth = 0;
  let offset = 0;
  return masked.split("\n").map((code) => {
    const leading = (/^\s*(\}\s*)*/.exec(code)![0].match(/\}/g) ?? []).length;
    const start = depth;
    for (const c of code) {
      if (c === "{") depth++;
      else if (c === "}") depth--;
    }
    const line: Line = { code, offset, start, end: depth, level: start - leading, blank: code.trim() === "" };
    offset += code.length + 1;
    return line;
  });
}

export function analyzeGo(code: string): Issue[] {
  const lines = splitLines(mask(code));
  const issues: Issue[] = [];
  const at = (i: number, from: number, length: number, severity: Severity, key: GoKey, vars?: Msg["vars"]) => {
    const start = lines[i]!.offset + from;
    issues.push({ rule: RULE[key], severity, start, end: start + length, message: { key, vars }, fixable: false, line: i + 1, col: from + 1 });
  };

  // Only weak and single-letter names are checked here; overlong identifiers are scanned everywhere below.
  const declare = (i: number, from: number, list: string) => {
    for (const m of list.matchAll(/[A-Za-z_]\w*/g)) {
      const name = m[0];
      if (name === "_") continue;
      if ((name.length === 1 && !SHORT_OK.has(name)) || WEAK.test(name)) {
        at(i, from + m.index!, name.length, "warn", "lint.nameSaysNothing", { name });
      }
    }
  };

  // Nesting: `open` holds the blocks enclosing the current line; `control` marks if/for/switch blocks.
  const open: { inner: number; control: boolean }[] = [];
  let varBlock = false;
  lines.forEach((line, i) => {
    if (line.blank) return;
    while (open.length && line.level < open[open.length - 1]!.inner) open.pop();
    const stripped = line.code.trim();
    const indent = line.code.length - line.code.trimStart().length;

    // Nesting: `} else if` and `} else {` are continuations of the block they follow.
    const body = stripped.replace(/^(\}\s*)*(else\b\s*)?/, "");
    const control = CONTROL.test(body);
    if (control && open.filter((b) => b.control).length >= 2) at(i, indent, stripped.length, "warn", "lint.flattenNesting");
    if (line.end > line.level) open.push({ inner: line.end, control });

    // else after a block that already exits: same-line form first, then a previous line inside the closed block.
    const inline = INLINE_EXIT_ELSE.exec(line.code);
    if (inline) {
      at(i, inline.index + inline[0].length - "else".length, "else".length, "warn", "lint.avoidElse");
    } else if (ELSE_LINE.test(line.code)) {
      const prev = previousCodeLine(lines, i);
      if (prev && prev.end === line.start && EXIT.test(prev.code.trim())) {
        at(i, indent, stripped.length, "warn", "lint.avoidElse");
      }
    }

    // Names declared with := or var (single declaration or var ( ... ) block).
    const short = /(^|[^\w.])((?:[A-Za-z_]\w*)(?:\s*,\s*[A-Za-z_]\w*)*)\s*:=/.exec(line.code);
    if (short) declare(i, short.index + short[1]!.length, short[2]!);
    if (varBlock) {
      if (/^\s*\)/.test(line.code)) varBlock = false;
      else {
        const item = /^(\s*)((?:[A-Za-z_]\w*)(?:\s*,\s*[A-Za-z_]\w*)*)(?=\s|$)/.exec(line.code);
        if (item) declare(i, item[1]!.length, item[2]!);
      }
    } else if (/^\s*var\s*\(/.test(line.code)) {
      varBlock = true;
    } else {
      const single = /^(\s*var\s+)((?:[A-Za-z_]\w*)(?:\s*,\s*[A-Za-z_]\w*)*)/.exec(line.code);
      if (single) declare(i, single[1]!.length, single[2]!);
    }

    // Identifiers longer than the limit, anywhere in the code.
    for (const m of line.code.matchAll(/(?<!\w)[A-Za-z_]\w*/g)) {
      if (m[0].length > MAX_NAME) at(i, m.index!, m[0].length, "warn", "lint.nameTooLong", { name: m[0] });
    }
  });

  // Function length: from the `func` line to the first later line back at its own level.
  lines.forEach((line, i) => {
    if (line.blank || !/^\s*func\b/.test(line.code) || line.end <= line.level) return;
    let end = i + 1;
    while (end < lines.length && lines[end]!.level > line.level) end++;
    const counted = lines.slice(i + 1, end).filter((l) => !l.blank).length;
    const indent = line.code.length - line.code.trimStart().length;
    const length = line.code.trim().length;
    if (counted > 50) at(i, indent, length, "warn", "lint.longFunction", { lines: counted });
    else if (counted > 30) at(i, indent, length, "info", "lint.reviewFunction", { lines: counted });
  });

  return issues.sort((a, b) => a.start - b.start);
}

function previousCodeLine(lines: Line[], index: number): Line | null {
  for (let i = index - 1; i >= 0; i--) {
    if (!lines[i]!.blank) return lines[i]!;
  }
  return null;
}
