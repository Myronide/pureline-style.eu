import { type Block, isControl, listBlocks, statementStarts } from "../blocks";
import { closeOf, indentOf, lineHead, openOf, prevIndex, skipSpace, wordEndingAt } from "../scan";
import { collides } from "../scope";
import { dedentBlock, negate } from "../text";
import type { Finding, Rule, Source } from "../types";

const NESTED = /^(if|for|while|switch|try)\b/;
/** A function/loop body that ends in `if (c) { ...nested control flow... }` can exit early instead. */
function trailingIf(s: Source, scope: Block): Finding | null {
  const m = s.masked;
  const start = statementStarts(m, scope.open + 1, scope.close).pop();
  if (start === undefined || !/^if\s*\(/.test(m.slice(start, start + 12))) return null;

  const condOpen = m.indexOf("(", start);
  const condClose = closeOf(m, condOpen);
  if (condClose < 0) return null;
  const open = skipSpace(m, condClose + 1);
  if (m[open] !== "{") return null;
  const close = closeOf(m, open);
  if (close < 0 || m.slice(close + 1, scope.close).trim()) return null;

  if (!statementStarts(m, open + 1, close).some((at) => NESTED.test(m.slice(at, at + 8)))) return null;

  const finding: Finding = {
    rule: "PL-CF-001",
    severity: "warn",
    start,
    end: close + 1,
    message: "The whole body is wrapped in an if. Invert the condition and exit early.",
  };
  if (collides(s, scope, [open + 1, close])) return finding;

  const indent = indentOf(s, start);
  const exit = scope.kind === "function" ? "return;" : "continue;";
  const condition = negate(s.src.slice(condOpen + 1, condClose));
  const body = dedentBlock(s, open, close, indent);
  finding.edits = [{ start, end: close + 1, text: `if (${condition}) {\n${indent}${s.unit}${exit}\n${indent}}\n\n${body}` }];
  return finding;
}

/** `else if` shares its depth with the `if` it continues, so it must not be counted twice. */
function continuesChain(m: string, block: Block): boolean {
  const close = prevIndex(m, block.open);
  const open = close < 0 ? -1 : openOf(m, close);
  if (open < 0) return false;
  const q = prevIndex(m, open);
  return wordEndingAt(m, prevIndex(m, q - 1)) === "else";
}

export const guardClauses: Rule = {
  id: "PL-CF-001",
  title: "Prefer guard clauses",
  docs: "core/control-flow",
  find(s) {
    const blocks = listBlocks(s.masked);
    const out: Finding[] = [];

    for (const scope of blocks) {
      if (scope.kind !== "function" && scope.kind !== "loop") continue;
      const finding = trailingIf(s, scope);
      if (finding) out.push(finding);
    }

    for (const block of blocks) {
      if (!isControl(block.kind) || block.kind === "else" || block.depth !== 3) continue;
      if (continuesChain(s.masked, block)) continue;
      if (out.some((f) => block.open >= f.start && block.open < f.end)) continue;

      out.push({
        rule: "PL-CF-001",
        severity: "warn",
        start: lineHead(s, block.open),
        end: block.open + 1,
        message: "Nesting is 3 levels deep. Flatten it with guard clauses.",
      });
    }
    return out;
  },
};
