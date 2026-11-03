import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for Python. Python is indentation-based, so the checks work on lines and indent levels
 * instead of the brace scanner used by the other languages. Heuristic, like the rest of the checker.
 */

const CONTROL = /^(if|for|while|with|try|match)\b/;
const JUMP = /^(return|raise|continue|break)\b/;
const PLACEHOLDER = /^(tmp|obj|thing|data\d*|foo|bar|baz)$/;
const SHORT_OK = new Set(["i", "j", "k"]);
const MAX_NAME = 40;
const MUTABLE_DEFAULT = /=\s*(\[\]|\{\}|set\(\)|dict\(\)|list\(\))/;

interface Line {
  text: string;
  indent: number;
  offset: number;
  blank: boolean;
}

function indentOf(text: string): number {
  return /^[ \t]*/.exec(text)![0].replace(/\t/g, "    ").length;
}

function splitLines(code: string): Line[] {
  let offset = 0;
  return code.split("\n").map((text) => {
    const line = { text, indent: indentOf(text), offset, blank: text.trim() === "" || text.trim().startsWith("#") };
    offset += text.length + 1;
    return line;
  });
}

export function analyzePython(code: string): Issue[] {
  const lines = splitLines(code);
  const issues: Issue[] = [];
  const at = (line: Line, from: number, length: number, severity: Severity, key: Msg["key"], vars?: Msg["vars"]) => {
    const start = line.offset + from;
    issues.push({ rule: ruleOf(key), severity, start, end: start + length, message: { key, vars }, fixable: false, line: 0, col: 0 } as Issue);
    issues[issues.length - 1]!.line = lines.indexOf(line) + 1;
    issues[issues.length - 1]!.col = from + 1;
  };

  // Nesting: the stack holds the control statements that enclose the current line.
  const stack: { indent: number }[] = [];
  lines.forEach((line, i) => {
    if (line.blank) return;
    while (stack.length && line.indent <= stack[stack.length - 1]!.indent) stack.pop();
    const stripped = line.text.trim();
    if (CONTROL.test(stripped)) {
      if (stack.length >= 2) at(line, line.indent, stripped.length, "warn", "lint.flattenNesting");
      stack.push({ indent: line.indent });
    }

    // else / elif directly after a block that already exits
    if (/^(else|elif)\b/.test(stripped)) {
      const body = lastStatementBefore(lines, i, line.indent);
      if (body && JUMP.test(body.text.trim())) at(line, line.indent, stripped.length, "warn", "lint.avoidElse");
    }

    // bare except
    if (/^except\s*:/.test(stripped)) at(line, line.indent, "except".length, "error", "lint.pyBareExcept");

    // names: assignments and parameters
    const assignment = /^([A-Za-z_]\w*)\s*(?::[^=]+)?=(?!=)/.exec(stripped);
    if (assignment) checkName(line, line.indent, assignment[1]!, at);
    const def = /^def\s+(\w+)\s*\(([^)]*)\)/.exec(stripped);
    if (def) {
      const params = def[2]!;
      let pos = line.indent + stripped.indexOf("(") + 1;
      for (const part of params.split(",")) {
        const name = /^\s*(\*{0,2}[A-Za-z_]\w*)/.exec(part);
        if (name) {
          const bare = name[1]!.replace(/^\*+/, "");
          if (bare !== "self" && bare !== "cls") checkName(line, pos + part.indexOf(bare), bare, at);
        }
        pos += part.length + 1;
      }
      if (MUTABLE_DEFAULT.test(params)) at(line, line.indent, stripped.length, "warn", "lint.pyMutableDefault");
      if (!def[1]!.startsWith("_") && !/->/.test(stripped) && !/:[^,)]+/.test(params)) at(line, line.indent, stripped.length, "info", "lint.pyTypeHints");
    }
  });

  // function length
  lines.forEach((line, i) => {
    const stripped = line.text.trim();
    if (line.blank || !/^(async\s+)?def\s/.test(stripped)) return;
    let end = i + 1;
    let counted = 0;
    while (end < lines.length) {
      const next = lines[end]!;
      if (!next.blank && next.indent <= line.indent) break;
      if (!next.blank) counted++;
      end++;
    }
    if (counted > 50) at(line, line.indent, stripped.length, "warn", "lint.longFunction", { lines: counted });
    else if (counted > 30) at(line, line.indent, stripped.length, "info", "lint.reviewFunction", { lines: counted });
  });

  return issues.sort((a, b) => a.start - b.start);
}

function checkName(line: Line, from: number, name: string, at: (l: Line, f: number, n: number, s: Severity, k: Msg["key"], v?: Msg["vars"]) => void) {
  if (name.length === 1 && !SHORT_OK.has(name)) at(line, from, name.length, "warn", "lint.nameSaysNothing", { name });
  else if (PLACEHOLDER.test(name)) at(line, from, name.length, "warn", "lint.nameSaysNothing", { name });
  else if (name.length > MAX_NAME) at(line, from, name.length, "warn", "lint.nameTooLong", { name });
}

/** The nearest code line above `index` that is indented deeper than `indent`: the last statement of the block above. */
function lastStatementBefore(lines: Line[], index: number, indent: number): Line | null {
  for (let i = index - 1; i >= 0; i--) {
    const line = lines[i]!;
    if (line.blank) continue;
    if (line.indent > indent) return line;
    return null;
  }
  return null;
}

function ruleOf(key: Msg["key"]): string {
  switch (key) {
    case "lint.flattenNesting":
    case "lint.avoidElse":
      return key === "lint.avoidElse" ? "PL-CF-002" : "PL-CF-001";
    case "lint.pyBareExcept":
      return "PL-PY-004";
    case "lint.pyMutableDefault":
      return "PL-PY-008";
    case "lint.pyTypeHints":
      return "PL-PY-003";
    case "lint.nameSaysNothing":
    case "lint.nameTooLong":
      return "PL-NAME-001";
    case "lint.longFunction":
    case "lint.reviewFunction":
      return "PL-FN-001";
    default:
      return "PL-PY-001";
  }
}
