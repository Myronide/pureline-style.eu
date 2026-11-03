import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for Rust. Rust is brace-based but always uses explicit blocks, so the checks cover the
 * remaining rules: exits before else, nesting, names, function length, unwrap in production code.
 * Strings and comments are masked first, so braces inside them do not count. Heuristic, like the rest.
 */

const JUMP = /^(return|break|continue)\b/;
const CONTROL = /^(if|for|while|match|loop)\b/;
const WEAK = /^(tmp|obj|thing|data\d+|foo|bar|baz)$/;
const SHORT_OK = new Set(["i", "j", "k", "x", "y", "z"]);
const MAX_NAME = 40;

interface Line {
  text: string;
  code: string;
  offset: number;
  depth: number;
}

/** Same length as the input: string contents and comments become spaces, so offsets stay valid. */
function mask(text: string): string {
  let out = "";
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (!inString && c === "/" && text[i + 1] === "/") return out + " ".repeat(text.length - i);
    if (c === '"' && text[i - 1] !== "\\") {
      inString = !inString;
      out += c;
    } else out += inString ? " " : c;
  }
  return out;
}

export function analyzeRust(code: string): Issue[] {
  const raw = code.split("\n");
  let offset = 0;
  let depth = 0;
  const lines: Line[] = raw.map((text) => {
    const line: Line = { text, code: mask(text), offset, depth };
    offset += text.length + 1;
    for (const c of line.code) {
      if (c === "{") depth++;
      else if (c === "}") depth--;
    }
    return line;
  });
  const issues: Issue[] = [];
  const blank = (l: Line) => l.code.trim() === "";

  const at = (line: Line, from: number, length: number, severity: Severity, key: Msg["key"], vars?: Msg["vars"]) => {
    const start = line.offset + from;
    const number = lines.indexOf(line) + 1;
    issues.push({ rule: ruleOf(key), severity, start, end: start + length, message: { key, vars }, fixable: false, line: number, col: from + 1 } as Issue);
  };

  /** Index of the line whose closing brace ends the block opened on or after line `i`. */
  const blockEnd = (i: number): number => {
    const base = lines[i]!.depth;
    for (let j = i + 1; j < lines.length; j++) {
      const net = [...lines[j]!.code].reduce((n, c) => n + (c === "{" ? 1 : c === "}" ? -1 : 0), 0);
      if (lines[j]!.depth + net <= base) return j;
    }
    return lines.length - 1;
  };

  // Test modules are not production code: skip everything inside #[cfg(test)] blocks.
  const inTest = new Set<number>();
  lines.forEach((line, i) => {
    if (!/#\[cfg\(test\)\]/.test(line.code)) return;
    const end = blockEnd(i + 1);
    for (let j = i; j <= end; j++) inTest.add(j);
  });

  // Nesting: open control blocks, popped when their braces close.
  const open: { inner: number }[] = [];
  lines.forEach((line, i) => {
    if (blank(line)) return;
    const level = line.depth - (/^\s*\}/.exec(line.code)?.[0].length ?? 0) + (/^\s*\}/.test(line.code) ? 1 : 0);
    while (open.length && level < open[open.length - 1]!.inner) open.pop();
    const stripped = line.code.trim();
    const start = line.code.length - line.code.trimStart().length;
    if (CONTROL.test(stripped)) {
      if (open.length >= 2) at(line, start, stripped.length, "warn", "lint.flattenNesting");
      if (line.code.includes("{")) open.push({ inner: line.depth + 1 });
    }

    // else after a block that already exits
    if (/^\}?\s*else\b/.test(stripped)) {
      const prev = previousCodeLine(lines, i);
      const closing = /^\s*\}/.test(line.code) ? 1 : 0;
      if (prev && prev.depth > line.depth - closing && JUMP.test(prev.code.trim())) {
        at(line, start, stripped.length, "warn", "lint.avoidElse");
      }
    }

    // unwrap and expect in production code
    if (!inTest.has(i)) {
      const unwrap = /\.(unwrap|expect)\s*\(/.exec(line.code);
      if (unwrap) at(line, unwrap.index + 1, unwrap[1]!.length, "warn", "lint.rsUnwrap");
    }

    // names
    const binding = /\blet\s+(?:mut\s+)?([A-Za-z_]\w*)/.exec(line.code);
    if (binding && !inTest.has(i)) checkName(line, binding.index + binding[0].length - binding[1]!.length, binding[1]!, at);
    const type = /^(pub(\([^)]*\))?\s+)?(struct|enum|trait|type)\s+([A-Za-z_]\w*)/.exec(line.code);
    if (type && !inTest.has(i) && /^[a-z_]/.test(type[4]!)) at(line, line.code.indexOf(type[4]!), type[4]!.length, "warn", "lint.rsTypeName");
  });

  // function length
  lines.forEach((line, i) => {
    if (blank(line) || !/^\s*(pub(\([^)]*\))?\s+)?(async\s+|const\s+|unsafe\s+)*fn\s/.test(line.code)) return;
    if (!line.code.includes("{")) return;
    const end = blockEnd(i);
    const counted = end - i - 1;
    const start = line.code.length - line.code.trimStart().length;
    if (counted > 50) at(line, start, line.code.trim().length, "warn", "lint.longFunction", { lines: counted });
    else if (counted > 30) at(line, start, line.code.trim().length, "info", "lint.reviewFunction", { lines: counted });
  });

  return issues.sort((a, b) => a.start - b.start);
}

function previousCodeLine(lines: Line[], index: number): Line | null {
  for (let i = index - 1; i >= 0; i--) {
    const line = lines[i]!;
    if (line.code.trim() === "") continue;
    return line;
  }
  return null;
}

function checkName(line: Line, from: number, name: string, at: (l: Line, f: number, n: number, s: Severity, k: Msg["key"], v?: Msg["vars"]) => void) {
  if (name.length === 1 && !SHORT_OK.has(name)) at(line, from, name.length, "warn", "lint.nameSaysNothing", { name });
  else if (WEAK.test(name)) at(line, from, name.length, "warn", "lint.nameSaysNothing", { name });
  else if (name.length > MAX_NAME) at(line, from, name.length, "warn", "lint.nameTooLong", { name });
}

function ruleOf(key: Msg["key"]): string {
  switch (key) {
    case "lint.rsUnwrap":
      return "PL-RS-004";
    case "lint.rsTypeName":
      return "PL-RS-001";
    case "lint.flattenNesting":
      return "PL-CF-001";
    case "lint.avoidElse":
      return "PL-CF-002";
    case "lint.nameSaysNothing":
    case "lint.nameTooLong":
      return "PL-NAME-001";
    case "lint.longFunction":
    case "lint.reviewFunction":
      return "PL-FN-001";
    default:
      return "PL-RS-002";
  }
}
