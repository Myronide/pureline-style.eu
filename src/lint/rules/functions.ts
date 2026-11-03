import { headerStart, listBlocks, paramList } from "../blocks";
import { lineHead, prevIndex, wordEndingAt } from "../scan";
import type { Finding, Rule } from "../types";

const VAGUE = /^(?:process|doStuff|handleEverything|executeAll|handleAll|doWork|doIt|manage)$/;
const REVIEW_LINES = 30;
const SPLIT_LINES = 50;

const ARROW_NAME = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*)?=\s*(?:async\s*)?$/;

/** Name of the function whose parameter list opens at `paren` (declared or assigned). */
function nameOf(m: string, paren: number): string {
  const direct = wordEndingAt(m, prevIndex(m, paren));
  if (direct && direct !== "function") return direct;
  return ARROW_NAME.exec(m.slice(headerStart(m, paren), paren))?.[1] ?? "";
}

export const functions: Rule = {
  id: "PL-FN-001",
  title: "One clear responsibility",
  docs: "core/functions",
  find(s) {
    const { masked: m } = s;
    const out: Finding[] = [];

    for (const block of listBlocks(m)) {
      if (block.kind !== "function") continue;
      const params = paramList(m, block.open);
      const start = lineHead(s, params ? params[0] : block.open);
      const name = params ? nameOf(m, params[0]) : "";

      if (VAGUE.test(name)) {
        out.push({ rule: "PL-FN-001", severity: "warn", start, end: block.open + 1, message: { key: "lint.nameVague", vars: { name } } });
      }

      const lines = s.position(block.close).line - s.position(block.open).line - 1;
      if (lines > SPLIT_LINES) {
        out.push({ rule: "PL-FN-001", severity: "warn", start, end: block.open + 1, message: { key: "lint.longFunction", vars: { lines } } });
      } else if (lines > REVIEW_LINES) {
        out.push({ rule: "PL-FN-001", severity: "info", start, end: block.open + 1, message: { key: "lint.reviewFunction", vars: { lines } } });
      }
    }
    return out;
  },
};
