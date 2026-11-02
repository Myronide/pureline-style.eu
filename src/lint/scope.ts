import { type Block, listBlocks, statementStarts } from "./blocks";
import { identRe } from "./text";
import type { Source } from "./types";

const KEYWORDS: ReadonlySet<string> = new Set(["return", "throw", "new", "else", "if", "for", "while", "do", "try", "switch", "case", "break", "continue", "yield", "assert", "await"]);

/** Names declared directly in `m[from, to)`; destructuring patterns are over-approximated. */
function declaredNames(m: string, from: number, to: number): string[] {
  const names: string[] = [];
  for (const start of statementStarts(m, from, to)) {
    const head = m.slice(start, start + 240);
    const js = /^(?:export\s+)?(?:const|let|var)\s+(\{[^}]*\}|\[[^\]]*\]|[\w$]+)/.exec(head);
    const decl = /^(?:async\s+)?(?:function\*?|class)\s+([\w$]+)/.exec(head);
    const java = /^(?:final\s+)?([A-Za-z_][\w$<>,.[\]?]*)[ \t]+([A-Za-z_$][\w$]*)[ \t]*(?:=|;)/.exec(head);

    if (js) names.push(...(js[1].match(/[\w$]+/g) ?? []));
    else if (decl) names.push(decl[1]);
    else if (java && !KEYWORDS.has(java[1])) names.push(java[2]);
  }
  return names;
}

/** Moving the statements of `inner` into `scope` must not collide with names that are already visible there. */
export function collides(s: Source, scope: Block, inner: [number, number]): boolean {
  const m = s.masked;
  const names = declaredNames(m, inner[0], inner[1]);
  if (!names.length) return false;

  const outside = m.slice(Math.max(0, scope.open - 300), inner[0]) + m.slice(inner[1], scope.close);
  return names.some((name) => identRe(name, "").test(outside));
}

export interface Exit {
  scope: Block;
  /** `return;` for functions, `continue;` for loops. */
  statement: string;
}

/** How to leave early from the function or loop whose body ends with the statement that spans `[start, end]`. */
export function exitAtEnd(s: Source, start: number, end: number): Exit | null {
  let scope: Block | undefined;
  for (const b of listBlocks(s.masked)) {
    if (b.open < start && b.close > end && (!scope || b.open > scope.open)) scope = b;
  }
  if (!scope || (scope.kind !== "function" && scope.kind !== "loop")) return null;
  if (s.masked.slice(end + 1, scope.close).trim()) return null;
  return { scope, statement: scope.kind === "function" ? "return;" : "continue;" };
}
