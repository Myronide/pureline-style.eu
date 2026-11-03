import { closeOf, prevIndex, skipSpace, wordEndingAt } from "../scan";
import { escapeRe, identRe } from "../text";
import type { Edit, Finding, Rule, Source } from "../types";

const DOCS = "languages/typescript";

const ANY = /(?<=(?::|<|\bas|\||&|,)\s*)any\b(?![\w$]|\s*:)/g;

export const noAny: Rule = {
  id: "PL-TS-001",
  title: "Avoid any",
  docs: DOCS,
  langs: ["typescript"],
  find(s) {
    return [...s.masked.matchAll(ANY)].map((match) => ({
      rule: "PL-TS-001",
      severity: "warn" as const,
      start: match.index,
      end: match.index + 3,
      message: { key: "lint.noAny" },
      edits: [{ start: match.index, end: match.index + 3, text: "unknown" }],
    }));
  },
};

export const noInterfacePrefix: Rule = {
  id: "PL-TS-003",
  title: "No I prefix",
  docs: DOCS,
  langs: ["typescript"],
  find(s) {
    const out: Finding[] = [];
    for (const match of s.masked.matchAll(/\binterface\s+I([A-Z][\w$]*)/g)) {
      const bare = match[1];
      const full = `I${bare}`;
      const at = match.index + match[0].length - full.length;
      const finding: Finding = {
        rule: "PL-TS-003",
        severity: "warn",
        start: at,
        end: at + full.length,
        message: { key: "lint.noIPrefix", vars: { full, bare } },
      };
      if (!identRe(bare, "").test(s.masked)) {
        finding.edits = [...s.masked.matchAll(identRe(full))].map((use) => ({ start: use.index, end: use.index + full.length, text: bare }));
      }
      out.push(finding);
    }
    return out;
  },
};

const ENUM = /\b(export\s+)?(?:declare\s+)?(?:const\s+)?enum\s+([A-Za-z_$][\w$]*)\s*\{/g;
const MEMBER = /^([A-Za-z_$][\w$]*)\s*=\s*(["'])([^"'\\]*)\2$/;
const TYPE_POSITION = /[:<|&]$|\b(?:as|extends|implements)$/;

/** Splits an enum body into `name -> value`; null when any member is not a plain string literal. */
function stringMembers(s: Source, open: number, close: number): Map<string, string> | null {
  if (s.comments.some((c) => c.start > open && c.start < close)) return null;
  const members = new Map<string, string>();
  let from = open + 1;
  const take = (to: number) => {
    const text = s.src.slice(from, to).trim();
    if (!text) return true;
    const match = MEMBER.exec(text);
    if (match) members.set(match[1], match[3]);
    return match !== null;
  };

  for (let i = open + 1; i < close; i++) {
    if (s.masked[i] !== ",") continue;
    if (!take(i)) return null;
    from = i + 1;
  }
  return take(close) && members.size ? members : null;
}

function enumUses(s: Source, name: string, decl: [number, number], members: Map<string, string>): Edit[] | null {
  const edits: Edit[] = [];
  const member = new RegExp(`(?<![\\w$.])${escapeRe(name)}\\.([A-Za-z_$][\\w$]*)`, "g");
  const covered: [number, number][] = [];

  for (const use of s.masked.matchAll(member)) {
    const value = members.get(use[1]);
    if (value === undefined) return null;
    covered.push([use.index, use.index + use[0].length]);
    edits.push({ start: use.index, end: use.index + use[0].length, text: JSON.stringify(value) });
  }

  const inSrc = [...s.src.matchAll(new RegExp(`(?<![\\w$.])${escapeRe(name)}\\.`, "g"))].length;
  if (inSrc !== edits.length) return null;

  for (const bare of s.masked.matchAll(identRe(name))) {
    const at = bare.index;
    if ((at >= decl[0] && at < decl[1]) || covered.some(([a, z]) => at >= a && at < z)) continue;
    const before = s.masked.slice(0, prevIndex(s.masked, at) + 1);
    if (!TYPE_POSITION.test(before)) return null;
  }
  return edits;
}

export const preferUnion: Rule = {
  id: "PL-TS-005",
  title: "Prefer union types over enums",
  docs: DOCS,
  langs: ["typescript"],
  find(s) {
    const out: Finding[] = [];
    for (const match of s.masked.matchAll(ENUM)) {
      const open = match.index + match[0].length - 1;
      const close = closeOf(s.masked, open);
      if (close < 0) continue;

      const finding: Finding = {
        rule: "PL-TS-005",
        severity: "info",
        start: match.index,
        end: open,
        message: { key: "lint.unionOverEnum" },
      };

      const members = stringMembers(s, open, close);
      const uses = members ? enumUses(s, match[2], [match.index, close + 1], members) : null;
      if (members && uses) {
        const values = [...members.values()].map((v) => JSON.stringify(v));
        const head = `${match[1] ?? ""}type ${match[2]} =`;
        const inline = `${head} ${values.join(" | ")};`;
        const text = inline.length <= 90 ? inline : `${head}\n${values.map((v) => `  | ${v}`).join("\n")};`;
        finding.edits = [{ start: match.index, end: close + 1, text }, ...uses];
      }
      out.push(finding);
    }
    return out;
  },
};

const OBJECT_ALIAS = /\b(export\s+)?type\s+([A-Za-z_$][\w$]*)(<[^=]*>)?\s*=\s*\{/g;

export const interfaceForObjects: Rule = {
  id: "PL-TS-004",
  title: "interface for object contracts",
  docs: DOCS,
  langs: ["typescript"],
  find(s) {
    const { masked: m } = s;
    const out: Finding[] = [];

    for (const match of m.matchAll(OBJECT_ALIAS)) {
      const open = match.index + match[0].length - 1;
      const close = closeOf(m, open);
      if (close < 0) continue;
      const after = skipSpace(m, close + 1);
      if ("&|".includes(m[after] ?? "") || wordEndingAt(m, prevIndex(m, match.index)) === "declare") continue;
      if (/\[\s*[\w$]+\s+in\s/.test(m.slice(open, close))) continue;

      const edits: Edit[] = [{ start: match.index, end: open + 1, text: `${match[1] ?? ""}interface ${match[2]}${match[3] ?? ""} {` }];
      if (m[close + 1] === ";") edits.push({ start: close + 1, end: close + 2, text: "" });

      out.push({
        rule: "PL-TS-004",
        severity: "info",
        start: match.index,
        end: open,
        message: { key: "lint.interfaceOrType" },
        edits,
      });
    }
    return out;
  },
};
