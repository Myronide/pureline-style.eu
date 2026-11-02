import { statementEnd } from "../blocks";
import { closeOf, indentOf, openOf, prevIndex, skipSpace, wordBefore } from "../scan";
import type { Finding, Rule, Source } from "../types";

const CONTROL = /\b(if|for|while)\s*\(/g;
const ELSE = /\belse\b(?!\s*(\{|if\b))/g;

/** The `while (...)` that closes a `do { } while (...)` has no body of its own. */
function isDoWhile(m: string, whileAt: number): boolean {
  const close = prevIndex(m, whileAt);
  if (close < 0 || m[close] !== "}") return false;
  const open = openOf(m, close);
  return open >= 0 && wordBefore(m, open) === "do";
}

/** ` {` + body on its own line + `}` in place of a braceless statement. */
function wrap(s: Source, keyword: number, body: number, end: number): string {
  const indent = indentOf(s, keyword);
  const lines = s.src.slice(body, end).split("\n");
  const text = lines.map((line, i) => (i === 0 ? line : s.unit + line)).join("\n");
  return ` {\n${indent}${s.unit}${text}\n${indent}}`;
}

function check(s: Source, out: Finding[], keyword: number, from: number): void {
  const m = s.masked;
  const body = skipSpace(m, from);
  if (body >= m.length || m[body] === "{" || m[body] === ";") return;
  if (/^(try|switch|do)\b/.test(m.slice(body, body + 7))) return;

  const end = statementEnd(m, body);
  const finding: Finding = {
    rule: "PL-CF-003",
    severity: "error",
    start: keyword,
    end,
    message: "Control-flow bodies need an explicit block.",
  };
  if (!s.src.slice(from, body).trim()) finding.edits = [{ start: from, end, text: wrap(s, keyword, body, end) }];
  out.push(finding);
}

export const braces: Rule = {
  id: "PL-CF-003",
  title: "Explicit blocks",
  docs: "core/control-flow",
  find(s) {
    const m = s.masked;
    const out: Finding[] = [];

    for (const match of m.matchAll(CONTROL)) {
      const open = match.index + match[0].length - 1;
      const close = closeOf(m, open);
      if (close === -1) continue;
      if (match[1] === "while" && isDoWhile(m, match.index)) continue;
      check(s, out, match.index, close + 1);
    }

    for (const match of m.matchAll(ELSE)) check(s, out, match.index, match.index + 4);
    return out;
  },
};
