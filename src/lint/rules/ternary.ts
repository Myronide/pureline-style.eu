import { endsStatement } from "../blocks";
import type { Finding, Rule } from "../types";

/** `?` that starts a ternary (not `?.`, `??`, `?:` optional members or `<?>` wildcards). */
const isTernary = (m: string, i: number) => m[i] === "?" && m[i - 1] !== "?" && !".?:>,)".includes(m[i + 1] ?? "");

export const nestedTernary: Rule = {
  id: "PL-CF-002",
  title: "No nested ternaries",
  docs: "core/control-flow",
  find(s) {
    const m = s.masked;
    const out: Finding[] = [];
    const open = new Set<number>();
    const closed = new Set<number>();
    let depth = 0;

    for (let i = 0; i < m.length; i++) {
      const c = m[i];
      if ("([{".includes(c)) depth++;
      else if (")]}".includes(c)) {
        for (const pending of [open, closed]) for (const d of pending) if (d >= depth) pending.delete(d);
        depth--;
      } else if (c === ";" || (c === "\n" && depth === 0 && endsStatement(m, i, m.length))) {
        open.clear();
        closed.clear();
      } else if (c === ",") {
        closed.delete(depth);
      } else if (isTernary(m, i)) {
        if (open.has(depth) || closed.has(depth)) {
          out.push({ rule: "PL-CF-002", severity: "warn", start: i, end: i + 1, message: { key: "lint.nestedTernary" } });
        }
        open.add(depth);
      } else if (c === ":" && open.has(depth) && m[i - 1] !== ":" && m[i + 1] !== ":") {
        open.delete(depth);
        closed.add(depth);
      }
    }
    return out;
  },
};
