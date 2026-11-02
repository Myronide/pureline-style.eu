import type { Source } from "./types";

export const escapeRe = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A word-bounded regex for an identifier. */
export const identRe = (name: string, flags = "g") => new RegExp(`(?<![\\w$])${escapeRe(name)}(?![\\w$])`, flags);

export function balanced(text: string): boolean {
  let depth = 0;
  for (const c of text) {
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

function dedentLine(line: string, unit: string): string {
  if (!line.trim()) return "";
  if (line.startsWith(unit)) return line.slice(unit.length);
  const lead = /^[ \t]*/.exec(line)![0].length;
  return line.slice(Math.min(lead, unit.length));
}

/** Inner lines of the block `{ open .. close }` that sits at `indent`, without blank lines around them. */
function innerLines(s: Source, open: number, close: number, indent: string): string[] {
  const lines = s.src.slice(open + 1, close).split("\n");
  if (lines[0].trim()) lines[0] = `${indent}${s.unit}${lines[0].trim()}`;
  else lines.shift();
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  return lines.map((line) => (line.trim() ? line : ""));
}

/** Block body as it stands inside the block, one level below `indent`. */
export const blockBody = (s: Source, open: number, close: number, indent: string) => innerLines(s, open, close, indent).join("\n");

/** Block body moved one level out so it sits at `indent`. */
export const dedentBlock = (s: Source, open: number, close: number, indent: string) =>
  innerLines(s, open, close, indent).map((line) => dedentLine(line, s.unit)).join("\n");

const ATOM = /^[\w$.?]+(\([^()]*\))?$/;
const EQUALITY = /^(.+?)\s*(===|!==|==|!=)\s*(.+)$/;
const FLIPPED: Record<string, string> = { "===": "!==", "!==": "===", "==": "!=", "!=": "==" };

/** Logical negation of a condition, as short as is still provably equivalent. */
export function negate(condition: string): string {
  const c = condition.trim();
  if (c.startsWith("!") && !c.startsWith("!=") && ATOM.test(c.slice(1))) return c.slice(1);
  if (ATOM.test(c)) return `!${c}`;

  const eq = EQUALITY.exec(c);
  if (eq && !/&&|\|\||\?|[<>]/.test(eq[1] + eq[3]) && balanced(eq[1]) && balanced(eq[3])) {
    return `${eq[1]} ${FLIPPED[eq[2]]} ${eq[3]}`;
  }
  return `!(${c})`;
}
