import { ifHead, terminator } from "../blocks";
import { closeOf, indentOf, openOf, prevIndex, skipSpace, wordEndingAt } from "../scan";
import { collides, exitAtEnd } from "../scope";
import { blockBody, dedentBlock, negate } from "../text";
import type { Edit, Finding, Rule, Source } from "../types";

const MESSAGE = "Avoid else: exit early with return/throw so the happy path stays flat.";

interface Chain {
  /** Every earlier branch of the chain ends in return/throw/continue/break. */
  exits: boolean;
  /** The `if` is the first of its chain (not an `else if`). */
  first: boolean;
}

function earlierBranches(m: string, ifStart: number): Chain {
  let start = ifStart;
  let first = true;
  for (;;) {
    const p = prevIndex(m, start);
    if (p < 0 || wordEndingAt(m, p) !== "else") return { exits: true, first };
    first = false;

    const close = prevIndex(m, p - 3);
    if (close < 0 || m[close] !== "}") return { exits: false, first };
    const open = openOf(m, close);
    const head = open < 0 ? null : ifHead(m, open);
    if (!head || !terminator(m, open + 1, close)) return { exits: false, first };
    start = head.ifStart;
  }
}

const lineCount = (s: Source, open: number, close: number) => s.src.slice(open, close).split("\n").length;

interface Branches {
  ifStart: number;
  condOpen: number;
  condClose: number;
  openA: number;
  closeA: number;
  elseAt: number;
}

function plan(s: Source, b: Branches): Edit[] | undefined {
  const { masked: m, src } = s;
  if (src.slice(b.closeA + 1, b.elseAt).trim()) return undefined;

  const chain = earlierBranches(m, b.ifStart);
  if (!chain.exits) return undefined;

  const exitA = terminator(m, b.openA + 1, b.closeA);
  const indent = indentOf(s, b.ifStart);
  const next = skipSpace(m, b.elseAt + 4);

  if (m.startsWith("if", next) && !/[\w$]/.test(m[next + 2] ?? "")) {
    return exitA ? [{ start: b.closeA + 1, end: next, text: `\n\n${indent}` }] : undefined;
  }

  if (m[next] !== "{") return undefined;
  const closeB = closeOf(m, next);
  if (closeB < 0) return undefined;
  const exitB = terminator(m, next + 1, closeB);

  const guardIsB =
    chain.first &&
    exitB !== null &&
    (exitA === null || (exitA !== "throw" && (exitB === "throw" || lineCount(s, next, closeB) < lineCount(s, b.openA, b.closeA))));

  if (guardIsB) {
    const condition = src.slice(b.condOpen + 1, b.condClose);
    const rest = dedentBlock(s, b.openA, b.closeA, indent);
    const guard = `if (${negate(condition)}) {${src.slice(next + 1, closeB)}}`;
    return [{ start: b.ifStart, end: closeB + 1, text: rest ? `${guard}\n\n${rest}` : guard }];
  }

  if (!exitA) return neutralBranches(s, b, next, closeB, exitB, chain.first);

  const rest = dedentBlock(s, next, closeB, indent);
  return [{ start: b.closeA + 1, end: closeB + 1, text: rest ? `\n\n${rest}` : "" }];
}

/**
 * `if (c) { A } else { B }` where neither branch exits, as the last statement of a function or loop:
 * the shorter branch becomes an early exit, the other one is unwrapped.
 */
function neutralBranches(s: Source, b: Branches, openB: number, closeB: number, exitB: string | null, first: boolean): Edit[] | undefined {
  if (exitB || !first) return undefined;
  const exit = exitAtEnd(s, b.ifStart, closeB);
  if (!exit) return undefined;

  const indent = indentOf(s, b.ifStart);
  const guardIsA = lineCount(s, b.openA, b.closeA) < lineCount(s, openB, closeB);
  const [guardOpen, guardClose, restOpen, restClose] = guardIsA ? [b.openA, b.closeA, openB, closeB] : [openB, closeB, b.openA, b.closeA];
  if (collides(s, exit.scope, [restOpen + 1, restClose])) return undefined;

  const condition = s.src.slice(b.condOpen + 1, b.condClose);
  const body = [blockBody(s, guardOpen, guardClose, indent), `${indent}${s.unit}${exit.statement}`].filter(Boolean).join("\n");
  const rest = dedentBlock(s, restOpen, restClose, indent);
  const guard = `if (${guardIsA ? condition : negate(condition)}) {\n${body}\n${indent}}`;
  return [{ start: b.ifStart, end: closeB + 1, text: rest ? `${guard}\n\n${rest}` : guard }];
}

export const noElse: Rule = {
  id: "PL-CF-002",
  title: "Avoid else",
  docs: "core/control-flow",
  find(s) {
    const m = s.masked;
    const out: Finding[] = [];

    for (const match of m.matchAll(/\belse\b/g)) {
      const elseAt = match.index;
      const closeA = prevIndex(m, elseAt);
      if (closeA < 0 || m[closeA] !== "}") continue;
      const openA = openOf(m, closeA);
      const head = openA < 0 ? null : ifHead(m, openA);
      if (!head) continue;

      out.push({
        rule: "PL-CF-002",
        severity: "warn",
        start: elseAt,
        end: elseAt + 4,
        message: MESSAGE,
        edits: plan(s, { ...head, openA, closeA, elseAt }),
      });
    }
    return out;
  },
};
