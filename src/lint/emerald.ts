import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for Emerald (.ems). Java-like braces and semicolons, `namespace A::B;` and `use A::B;`,
 * return type before the method name. Checks: nesting, else after an exit, weak and long names, function
 * length. Strings and `//` comments are masked first, so braces inside them do not count. Heuristic, like the rest.
 */

const JUMP = /^(return|throw|break|continue)\b/;
const CONTROL = /^(?:\}\s*)?(?:else\s+)?(if|for|while|switch)\b/;
const ELSE = /^\}?\s*else\b/;
const WEAK = /^(tmp|obj|thing|data\d+)$/;
const SHORT_OK = new Set(["i", "j", "k"]);
const MAX_NAME = 40;
const NOT_A_TYPE = new Set(["return", "throw", "new", "else", "case", "namespace", "use", "import", "package", "yield", "break", "continue", "instanceof", "in", "do"]);
/** `Type name` followed by `=`, `;`, `,` or `)`: local declarations and parameters. */
const DECL = /(?<![\w.])([A-Za-z_][\w.]*)(?:<[^<>;=()]*>)?(?:\[\])*\s+([A-Za-z_]\w*)\s*(?=[=;,)])/g;
/** Return type, then method name, then parameters and an opening brace. */
const METHOD = /^\s*(?:(?:public|private|protected|static|final|abstract|override|async|native)\s+)*([A-Za-z_][\w.]*(?:<[^<>]*>)?(?:\[\])*)\s+([A-Za-z_]\w*)\s*\([^)]*\)\s*(?:throws\s+[^{]*)?\{/;
const IDENT = /\b[A-Za-z_]\w*/g;

interface Line {
  index: number;
  code: string;
  offset: number;
  depth: number;
  delta: number;
}

/** Same length as the input: string contents and a `//` comment become spaces, so offsets stay valid. */
function mask(text: string): string {
  let out = "";
  let quote: string | null = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quote) {
      if (c === "\\" && i + 1 < text.length) {
        out += "  ";
        i++;
      } else if (c === quote) {
        quote = null;
        out += c;
      } else out += " ";
    } else if (c === '"' || c === "'") {
      quote = c;
      out += c;
    } else if (c === "/" && text[i + 1] === "/") {
      return out + " ".repeat(text.length - i);
    } else out += c;
  }
  return out;
}

const count = (s: string, c: string) => s.split(c).length - 1;

export function analyzeEmerald(code: string): Issue[] {
  let offset = 0;
  let depth = 0;
  const lines: Line[] = code.split("\n").map((text, index) => {
    const masked = mask(text);
    const delta = count(masked, "{") - count(masked, "}");
    const line: Line = { index, code: masked, offset, depth, delta };
    offset += text.length + 1;
    depth += delta;
    return line;
  });
  const issues: Issue[] = [];

  const at = (line: Line, from: number, length: number, severity: Severity, key: Msg["key"], vars?: Msg["vars"]) => {
    const start = line.offset + from;
    issues.push({ rule: ruleOf(key), severity, start, end: start + length, message: { key, vars }, fixable: false, line: line.index + 1, col: from + 1 });
  };

  // Nesting: open control blocks, each stored with the depth of its body. Popped when a line starts outside them.
  const open: number[] = [];
  for (const line of lines) {
    const stripped = line.code.trim();
    if (stripped === "") continue;
    const indent = line.code.length - line.code.trimStart().length;
    const level = line.depth - (stripped.startsWith("}") ? 1 : 0);
    while (open.length && level < open[open.length - 1]!) open.pop();

    if (CONTROL.test(stripped)) {
      if (open.length >= 2) at(line, indent, stripped.length, "warn", "lint.flattenNesting");
      if (line.code.includes("{")) open.push(level + 1);
    }

    // else after a block that already exits
    if (ELSE.test(stripped)) {
      const prev = previousCode(lines, line.index);
      if (prev && prev.depth > level && JUMP.test(prev.code.trim())) at(line, indent, stripped.length, "warn", "lint.avoidElse");
    }

    // names: over-long identifiers anywhere, weak names in declarations and parameters
    for (const m of line.code.matchAll(IDENT)) {
      if (m[0].length > MAX_NAME) at(line, m.index!, m[0].length, "warn", "lint.nameTooLong", { name: m[0] });
    }
    for (const m of line.code.matchAll(DECL)) {
      const type = m[1]!;
      const name = m[2]!;
      if (NOT_A_TYPE.has(type)) continue;
      const from = m.index! + m[0].trimEnd().length - name.length;
      if ((name.length === 1 && !SHORT_OK.has(name)) || WEAK.test(name)) at(line, from, name.length, "warn", "lint.nameSaysNothing", { name });
    }
  }

  // Function length: from the signature line to the line that closes its body.
  for (const line of lines) {
    const m = METHOD.exec(line.code);
    if (!m || NOT_A_TYPE.has(m[1]!)) continue;
    const counted = Math.max(0, blockEnd(lines, line) - line.index - 1);
    const indent = line.code.length - line.code.trimStart().length;
    if (counted > 50) at(line, indent, line.code.trim().length, "warn", "lint.longFunction", { lines: counted });
    else if (counted > 30) at(line, indent, line.code.trim().length, "info", "lint.reviewFunction", { lines: counted });
  }

  return issues.sort((a, b) => a.start - b.start);
}

/** Index of the line that closes the block opened on `start`; the signature line itself if it closes on the same line. */
function blockEnd(lines: Line[], start: Line): number {
  if (start.delta <= 0) return start.index;
  for (let j = start.index + 1; j < lines.length; j++) {
    const line = lines[j]!;
    if (line.depth + line.delta <= start.depth) return j;
  }
  return lines.length - 1;
}

function previousCode(lines: Line[], index: number): Line | null {
  for (let i = index - 1; i >= 0; i--) {
    if (lines[i]!.code.trim() !== "") return lines[i]!;
  }
  return null;
}

function ruleOf(key: Msg["key"]): string {
  switch (key) {
    case "lint.flattenNesting":
      return "PL-CF-001";
    case "lint.avoidElse":
      return "PL-CF-002";
    case "lint.nameSaysNothing":
    case "lint.nameTooLong":
      return "PL-NAME-001";
    default:
      return "PL-FN-001";
  }
}
