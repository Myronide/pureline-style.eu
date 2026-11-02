import { braces } from "./rules/braces";
import { comments } from "./rules/comments";
import { noElse } from "./rules/else";
import { compactCalls } from "./rules/formatting";
import { functions } from "./rules/functions";
import { guardClauses } from "./rules/guards";
import { naming } from "./rules/names";
import { nestedTernary } from "./rules/ternary";
import { interfaceForObjects, noAny, noInterfacePrefix, preferUnion } from "./rules/typescript";
import { createSource } from "./scan";
import type { Edit, Finding, Issue, Lang, Rule } from "./types";

export type { Edit, Issue, Lang, Rule, Severity } from "./types";
export { indentUnit } from "./scan";

export const rules: Rule[] = [
  guardClauses,
  noElse,
  nestedTernary,
  braces,
  naming,
  functions,
  compactCalls,
  comments,
  noAny,
  noInterfacePrefix,
  interfaceForObjects,
  preferUnion,
];

/** Doc slug that explains a rule, e.g. `core/control-flow`. */
export const docsFor = (rule: string) => rules.find((r) => r.id === rule)?.docs ?? "";

const MAX_PASSES = 40;

function collect(code: string, lang: Lang): { findings: Finding[]; position: (offset: number) => { line: number; col: number } } {
  const source = createSource(code, lang);
  const findings = rules.filter((r) => !r.langs || r.langs.includes(lang)).flatMap((r) => r.find(source));
  return { findings, position: source.position };
}

/** All violations in `code`, in source order. */
export function analyze(code: string, lang: Lang): Issue[] {
  const { findings, position } = collect(code, lang);
  return findings
    .map((f) => ({ ...f, ...position(f.start), fixable: !!f.edits?.length }))
    .sort((a, b) => a.start - b.start || a.rule.localeCompare(b.rule));
}

export function applyEdits(code: string, edits: Edit[]): string {
  return [...edits].sort((a, b) => b.start - a.start).reduce((text, e) => text.slice(0, e.start) + e.text + text.slice(e.end), code);
}

const overlaps = (a: Edit, b: Edit) => a.start < b.end && b.start < a.end;

/** Fixes that can be applied together: later ones first, anything touching an accepted edit waits for the next pass. */
function independent(findings: Finding[]): Finding[] {
  const taken: Edit[] = [];
  const chosen: Finding[] = [];
  for (const f of [...findings].sort((a, b) => b.start - a.start)) {
    const edits = f.edits ?? [];
    if (edits.some((e) => taken.some((t) => overlaps(e, t)))) continue;
    taken.push(...edits);
    chosen.push(f);
  }
  return chosen;
}

export interface Conversion {
  code: string;
  fixes: number;
}

/** Applies every mechanical fix, re-analyzing until nothing fixable is left. */
export function convert(code: string, lang: Lang): Conversion {
  let current = code;
  let fixes = 0;

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const fixable = collect(current, lang).findings.filter((f) => f.edits?.length);
    const batch = independent(fixable);
    if (!batch.length) break;

    const next = applyEdits(current, batch.flatMap((f) => f.edits!));
    if (next === current) break;
    current = next;
    fixes += batch.length;
  }
  return { code: current, fixes };
}
