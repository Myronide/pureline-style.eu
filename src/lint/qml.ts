import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for QML. A file is an object tree; JavaScript lives in functions and handlers.
 * Checks: generic ids (rect1), unbraced early exits, nested ternaries, deep object nesting, long functions.
 * Comments and string contents are masked first. Heuristic, like the rest.
 */

const GENERIC_ID = /^(item|rect|rectangle|text|image|label|button|column|row|grid|box|view|list|repeater|loader|timer|frame|page|group|container|mouse|area|field|obj|object|tmp|data|foo|bar|baz)\d+$/i;
const MAX_OBJECT_DEPTH = 5;
const FUNCTION_REVIEW = 30;
const FUNCTION_LONG = 50;

/** Same length as the input: comments and string contents become spaces; newlines and quotes stay. */
function mask(text: string): string {
  let out = "";
  let state: "code" | "line" | "block" | "string" = "code";
  let quote = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    const next = text[i + 1];
    if (state === "code") {
      if (c === "/" && next === "/") {
        state = "line";
        out += "  ";
        i++;
      } else if (c === "/" && next === "*") {
        state = "block";
        out += "  ";
        i++;
      } else if (c === '"' || c === "'" || c === "`") {
        state = "string";
        quote = c;
        out += c;
      } else out += c;
    } else if (state === "line") {
      if (c === "\n") {
        state = "code";
        out += c;
      } else out += " ";
    } else if (state === "block") {
      if (c === "*" && next === "/") {
        state = "code";
        out += "  ";
        i++;
      } else out += c === "\n" ? c : " ";
    } else {
      if (c === "\\") {
        out += next === "\n" || next === undefined ? " " : "  ";
        i++;
      } else if (c === quote) {
        state = "code";
        out += c;
      } else out += c === "\n" ? c : " ";
    }
  }
  return out;
}

export function analyzeQml(code: string): Issue[] {
  const masked = mask(code);
  const lineStarts = [0];
  for (let i = 0; i < masked.length; i++) if (masked[i] === "\n") lineStarts.push(i + 1);
  const lineOf = (offset: number) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid]! <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  const lines = masked.split("\n");
  const issues: Issue[] = [];

  const at = (offset: number, length: number, severity: Severity, key: Msg["key"], vars?: Msg["vars"]) => {
    const line = lineOf(offset);
    issues.push({
      rule: ruleOf(key),
      severity,
      start: offset,
      end: offset + length,
      message: { key, vars },
      fixable: false,
      line: line + 1,
      col: offset - lineStarts[line]! + 1,
    });
  };

  // Ids that name a type instead of a role.
  lines.forEach((text, i) => {
    const id = /^\s*id:\s*([A-Za-z_]\w*)/.exec(text);
    if (!id || !GENERIC_ID.test(id[1]!)) return;
    const from = lineStarts[i]! + text.indexOf(id[1]!, text.indexOf("id:"));
    at(from, id[1]!.length, "warn", "lint.nameSaysNothing", { name: id[1]! });
  });

  // Unbraced early exits: `if (...) return;` on one line, or `if (...)` with the exit on the next line.
  lines.forEach((text, i) => {
    if (text.includes("{")) return;
    const start = lineStarts[i]!;
    const indent = text.length - text.trimStart().length;
    const single = /^\s*if\s*\(.*\)\s*(return|break|continue)\b.*;\s*$/.test(text);
    const split = !single && /^\s*if\s*\(.*\)\s*$/.test(text) && nextCode(lines, i) !== null && /^\s*(return|break|continue)\b/.test(nextCode(lines, i)!.text);
    if (single || split) at(start + indent, text.trim().length, "warn", "lint.explicitBlock");
  });

  // Nested ternaries: two conditional `?` on one line (`?.` and `??` are not ternaries).
  lines.forEach((text, i) => {
    const stripped = text.replace(/\?\?|\?\./g, "  ");
    const marks = [...stripped.matchAll(/\?/g)];
    if (marks.length < 2 || !stripped.includes(":")) return;
    at(lineStarts[i]! + marks[1]!.index!, 1, "warn", "lint.nestedTernary");
  });

  // Object and block nesting: report the brace that takes depth past the limit.
  let depth = 0;
  for (let i = 0; i < masked.length; i++) {
    const c = masked[i];
    if (c === "{") {
      depth++;
      if (depth === MAX_OBJECT_DEPTH + 1) at(i, 1, "warn", "lint.qmlNesting");
    } else if (c === "}") depth--;
  }

  // Function length: from the function's opening brace to its matching closing brace.
  const functionStart = /\bfunction\b[^{;]*\{/g;
  for (const match of masked.matchAll(functionStart)) {
    const open = match.index! + match[0].length - 1;
    const close = matchingBrace(masked, open);
    const startLine = lineOf(open);
    const endLine = lineOf(close);
    const counted = endLine - startLine - 1;
    const head = match.index! + (match[0].length - match[0].trimStart().length);
    const length = lines[startLine]!.trim().length;
    if (counted > FUNCTION_LONG) at(head, length, "warn", "lint.longFunction", { lines: counted });
    else if (counted > FUNCTION_REVIEW) at(head, length, "info", "lint.reviewFunction", { lines: counted });
  }

  return issues.sort((a, b) => a.start - b.start);
}

function nextCode(lines: string[], index: number): { text: string } | null {
  for (let i = index + 1; i < lines.length; i++) {
    if (lines[i]!.trim() !== "") return { text: lines[i]! };
  }
  return null;
}

/** Offset of the `}` matching the `{` at `open`; end of text if unbalanced. */
function matchingBrace(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return text.length - 1;
}

function ruleOf(key: Msg["key"]): string {
  switch (key) {
    case "lint.nameSaysNothing":
      return "PL-NAME-001";
    case "lint.explicitBlock":
      return "PL-CF-003";
    case "lint.nestedTernary":
      return "PL-CF-002";
    case "lint.qmlNesting":
      return "PL-CF-001";
    case "lint.flattenNesting":
      return "PL-CF-001";
    case "lint.longFunction":
    case "lint.reviewFunction":
      return "PL-FN-001";
    default:
      return "PL-QML-002";
  }
}
