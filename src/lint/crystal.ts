import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for Crystal. Blocks close with `end`, so nesting and function length come from block
 * openers and `end` lines. Postfix guards (`return x unless y`) open no block and are allowed.
 * Strings and `#` comments are masked first. Heuristic, like the other checkers.
 */

type UsedKey = "lint.flattenNesting" | "lint.avoidElse" | "lint.nameSaysNothing" | "lint.nameTooLong" | "lint.longFunction" | "lint.reviewFunction";

const RULE_OF: Record<UsedKey, string> = {
  "lint.flattenNesting": "PL-CF-001",
  "lint.avoidElse": "PL-CF-002",
  "lint.nameSaysNothing": "PL-NAME-001",
  "lint.nameTooLong": "PL-NAME-001",
  "lint.longFunction": "PL-FN-001",
  "lint.reviewFunction": "PL-FN-001",
};

const OPENER = /^(if|unless|while|until|case|begin|for|select|def|class|module|struct|enum|lib|macro|annotation)\b/;
const CONTROL = new Set(["if", "unless", "while", "until", "case", "begin", "for", "select"]);
const VALUE_OPENER = /^[\w@.:?!\s<>]*=\s*(if|unless|case|begin)\b/;
const DO_BLOCK = /\bdo(\s*\|[^|]*\|)?$/;
const ENDLESS_DEF = /^def\s+(?:self\.)?\w+[?!]?\s*(?:\([^)]*\))?\s*(?::[^=]+)?=\s*[^=\s(]/;
const JUMP = /^(return|break|next|raise)\b/;
const WEAK = /^(tmp|obj|thing|data\d*)$/;
const SHORT_OK = new Set(["i", "j", "k", "x", "y", "z"]);
const MAX_NAME = 40;

interface Line {
  code: string;
  offset: number;
  indent: number;
  no: number;
}

interface Block {
  kind: string;
  line: number;
}

const blank = (c: string) => (c === "\n" ? c : " ");

/** Same length as the input: string contents and `#` comments become spaces, newlines are kept. */
function mask(src: string): string {
  let out = "";
  let quote = "";
  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    if (quote) {
      if (c === "\\" && i + 1 < src.length) out += blank(c) + blank(src[++i]!);
      else if (c === quote) {
        out += c;
        quote = "";
      } else out += blank(c);
    } else if (c === '"' || c === "'") {
      quote = c;
      out += c;
    } else if (c === "#") {
      const eol = src.indexOf("\n", i);
      const stop = eol === -1 ? src.length : eol;
      out += " ".repeat(stop - i);
      i = stop - 1;
    } else out += c;
  }
  return out;
}

/** The block kind a line opens (`if`, `def`, `do`, ...), or null. Postfix guards and endless defs open nothing. */
function openerKind(s: string): string | null {
  const t = s.replace(/^(private|protected|abstract)\s+/, "");
  const m = OPENER.exec(t);
  if (m) return m[1] === "def" && ENDLESS_DEF.test(t) ? null : m[1]!;
  const value = VALUE_OPENER.exec(t);
  if (value) return value[1]!;
  return DO_BLOCK.test(t) ? "do" : null;
}

function isWeak(name: string): boolean {
  return (name.length === 1 && !SHORT_OK.has(name)) || WEAK.test(name);
}

function previousCode(lines: Line[], index: number): Line | null {
  for (let i = index - 1; i >= 0; i--) if (lines[i]!.code.trim() !== "") return lines[i]!;
  return null;
}

export function analyzeCrystal(code: string): Issue[] {
  const lines: Line[] = [];
  let offset = 0;
  mask(code)
    .split("\n")
    .forEach((text, index) => {
      lines.push({ code: text, offset, indent: text.length - text.trimStart().length, no: index + 1 });
      offset += text.length + 1;
    });
  const issues: Issue[] = [];
  const at = (line: Line, from: number, length: number, severity: Severity, key: UsedKey, vars?: Msg["vars"]) => {
    const start = line.offset + from;
    issues.push({ rule: RULE_OF[key], severity, start, end: start + length, message: { key, vars }, fixable: false, line: line.no, col: from + 1 });
  };

  // Identifiers longer than the limit, anywhere in code.
  for (const line of lines) {
    const re = /\b[A-Za-z_]\w*/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line.code))) {
      if (m[0].length > MAX_NAME) at(line, m.index, m[0].length, "warn", "lint.nameTooLong", { name: m[0] });
    }
  }

  // Nesting, else-after-exit, weak assignment names, and function length, in one pass over the blocks.
  const blocks: Block[] = [];
  const controlDepth = () => blocks.filter((b) => CONTROL.has(b.kind)).length;
  lines.forEach((line, i) => {
    const s = line.code.trim();
    if (s === "") return;

    if (/^end\b/.test(s)) {
      const block = blocks.pop();
      if (block && block.kind === "def") {
        const counted = lines.slice(block.line + 1, i).filter((l) => l.code.trim() !== "").length;
        const head = lines[block.line]!;
        const len = head.code.trim().length;
        if (counted > 50) at(head, head.indent, len, "warn", "lint.longFunction", { lines: counted });
        else if (counted > 30) at(head, head.indent, len, "info", "lint.reviewFunction", { lines: counted });
      }
      return;
    }

    const kind = openerKind(s);
    if (kind && CONTROL.has(kind) && controlDepth() >= 2) at(line, line.indent, s.length, "warn", "lint.flattenNesting");
    if (kind && !/\bend$/.test(s)) blocks.push({ kind, line: i });

    if (/^else\b/.test(s)) {
      const prev = previousCode(lines, i);
      if (prev && prev.indent > line.indent && JUMP.test(prev.code.trim())) at(line, line.indent, "else".length, "warn", "lint.avoidElse");
    }

    const assign = /^([A-Za-z_]\w*)\s*(?::[^=]+)?=(?![=~>])/.exec(s);
    if (assign && isWeak(assign[1]!)) at(line, line.indent, assign[1]!.length, "warn", "lint.nameSaysNothing", { name: assign[1]! });
  });

  return issues.sort((a, b) => a.start - b.start);
}
