import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for Novus (.nv). Brace-based, semicolons optional. Declarations are `method name(args): type { }`,
 * `define class X based Y { }`, `var`, `final`, `construct() { }`. Checks: nesting, else after an exit (exempt with
 * `// pureline:allow-else <reason>`), weak and long names, method length. Strings and `//` comments are masked first.
 * Heuristic, like the rest.
 */

const JUMP = /^(return|break|continue|throw)\b/;
const CONTROL = /^(if|while|for)\b/;
const ELSE = /^(\}\s*)?else\b/;
const WEAK = /^(tmp|obj|thing|data\d+)$/;
const SHORT_OK = new Set(["i", "j", "k"]);
const MAX_NAME = 40;
const ALLOW_ELSE = "pureline:allow-else";
const METHOD = /\bmethod\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/;
const VAR = /\bvar\b/;
const IDENT = /[A-Za-z_]\w*/g;

const RULE_OF: Partial<Record<Msg["key"], string>> = {
  "lint.flattenNesting": "PL-CF-001",
  "lint.avoidElse": "PL-CF-002",
  "lint.nameSaysNothing": "PL-NAME-001",
  "lint.nameTooLong": "PL-NAME-001",
  "lint.longFunction": "PL-FN-001",
  "lint.reviewFunction": "PL-FN-001",
};

interface Line {
  text: string;
  code: string;
  offset: number;
  /** Brace depth at the start of the line. */
  depth: number;
  /** Depth ignoring leading closing braces, so `} else {` sits at the level of its `if`. */
  effDepth: number;
}

/** Same length as the input: string contents and `//` comments become spaces, so offsets stay valid. */
function mask(text: string): string {
  let out = "";
  let quote: string | null = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quote) {
      if (c === quote) {
        quote = null;
        out += c;
      } else if (c === "\\" && i + 1 < text.length) {
        out += "  ";
        i++;
      } else out += " ";
      continue;
    }
    if (c === "/" && text[i + 1] === "/") return out + " ".repeat(text.length - i);
    if (c === '"' || c === "'" || c === "`") quote = c;
    out += c;
  }
  return out;
}

/** Name of a declaration fragment (`x`, `x: Type`, `x = 1`): the word before `:`/`=`, else the last word. */
function declName(fragment: string): { name: string; index: number } | null {
  const head = fragment.split(/[:=;]/)[0]!;
  const words = [...head.matchAll(IDENT)];
  const last = words[words.length - 1];
  return last ? { name: last[0], index: last.index! } : null;
}

/** Index of the nearest non-blank code line before `index`, or -1. */
function previousCodeIndex(lines: Line[], index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    if (lines[i]!.code.trim() !== "") return i;
  }
  return -1;
}

export function analyzeNovus(code: string): Issue[] {
  let offset = 0;
  let depth = 0;
  const lines: Line[] = code.split("\n").map((text) => {
    const masked = mask(text);
    const closers = (/^\s*(\}\s*)*/.exec(masked)![0].match(/\}/g) ?? []).length;
    const line: Line = { text, code: masked, offset, depth, effDepth: depth - closers };
    offset += text.length + 1;
    for (const c of masked) {
      if (c === "{") depth++;
      else if (c === "}") depth--;
    }
    return line;
  });
  const issues: Issue[] = [];

  const at = (index: number, from: number, length: number, severity: Severity, key: Msg["key"], vars?: Msg["vars"]) => {
    const start = lines[index]!.offset + from;
    issues.push({ rule: RULE_OF[key] ?? "", severity, start, end: start + length, message: { key, vars }, fixable: false, line: index + 1, col: from + 1 });
  };

  /** Index of the line whose closing brace ends the block opened on line `i`. */
  const blockEnd = (i: number): number => {
    const base = lines[i]!.depth;
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j]!.effDepth <= base && lines[j]!.code.includes("}")) return j;
    }
    return lines.length - 1;
  };

  const checkName = (index: number, from: number, name: string) => {
    if ((name.length === 1 && !SHORT_OK.has(name)) || WEAK.test(name)) at(index, from, name.length, "warn", "lint.nameSaysNothing", { name });
  };

  // Nesting: open control blocks, popped once their closing brace is reached.
  const open: number[] = []; // inner depth of each open control block
  lines.forEach((line, i) => {
    const stripped = line.code.trim();
    if (stripped === "") return;
    while (open.length && line.effDepth < open[open.length - 1]!) open.pop();
    const from = line.code.length - line.code.trimStart().length;

    if (CONTROL.test(stripped)) {
      if (open.length >= 2) at(i, from, stripped.length, "warn", "lint.flattenNesting");
      if (line.code.includes("{")) open.push(line.depth + 1);
    }

    // `} else {` or bare `else {` right after a block whose last statement exits
    if (ELSE.test(stripped) && !line.text.includes(ALLOW_ELSE)) {
      let k = previousCodeIndex(lines, i);
      if (!stripped.startsWith("}") && k >= 0 && lines[k]!.code.trim() === "}") k = previousCodeIndex(lines, k);
      if (k >= 0 && lines[k]!.depth > line.effDepth && JUMP.test(lines[k]!.code.trim())) {
        at(i, from, stripped.length, "warn", "lint.avoidElse");
      }
    }

    // long identifiers, anywhere in code
    for (const word of line.code.matchAll(IDENT)) {
      if (word[0].length > MAX_NAME) at(i, word.index!, word[0].length, "warn", "lint.nameTooLong", { name: word[0] });
    }

    // var declarations
    const v = VAR.exec(line.code);
    if (v) {
      const rest = line.code.slice(v.index + v[0].length);
      const decl = declName(rest);
      if (decl) checkName(i, v.index + v[0].length + decl.index, decl.name);
    }

    // parameters of a method signature on this line
    const m = METHOD.exec(line.code);
    if (m) {
      const params = m[2]!;
      const paramsStart = m.index + m[0].length - 1 - params.length;
      let pos = 0;
      for (const segment of params.split(",")) {
        const decl = declName(segment);
        if (decl) checkName(i, paramsStart + pos + decl.index, decl.name);
        pos += segment.length + 1;
      }
    }
  });

  // Method length: body lines between the signature and its closing brace.
  lines.forEach((line, i) => {
    if (!/\bmethod\b/.test(line.code) || !line.code.includes("{")) return;
    const counted = blockEnd(i) - i - 1;
    const from = line.code.length - line.code.trimStart().length;
    const length = line.code.trim().length;
    if (counted > 50) at(i, from, length, "warn", "lint.longFunction", { lines: counted });
    else if (counted > 30) at(i, from, length, "info", "lint.reviewFunction", { lines: counted });
  });

  return issues.sort((a, b) => a.start - b.start);
}
