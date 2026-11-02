import { listBlocks, paramList } from "../blocks";
import type { Finding, Rule, Source } from "../types";

const WEAK = /^(?:r|s|p|x|tmp|temp|obj|data\d+|thing|stuff)$/;
const MAX_LENGTH = 30;

const JS_DECLARATION = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g;
const JAVA_LOCAL = /^[ \t]*(?:final[ \t]+)?(?!(?:return|throw|else|new|import|package|if|for|while|case|do|try|break|continue|yield|assert)\b)[A-Za-z_][\w$<>,.[\]?]*[ \t]+([A-Za-z_$][\w$]*)[ \t]*(?==|;)/gm;

/** Parameter names of the function whose body opens at `open`, with their offsets. */
function parameters(s: Source, open: number): { name: string; at: number }[] {
  const m = s.masked;
  const range = paramList(m, open);
  if (!range) return [];

  const found: { name: string; at: number }[] = [];
  let depth = 0;
  let from = range[0] + 1;
  const flush = (to: number) => {
    const text = m.slice(from, to);
    if (s.lang === "java") {
      const head = text.split("=")[0].trimEnd();
      const name = /([A-Za-z_$][\w$]*)(?:\s*\[\s*\])*$/.exec(head)?.[1];
      if (name) found.push({ name, at: from + head.length - name.length });
      return;
    }
    const match = /^\s*(?:(?:public|private|protected|readonly|override)\s+)*(?:\.\.\.)?([A-Za-z_$][\w$]*)/.exec(text);
    if (match) found.push({ name: match[1], at: from + match[0].length - match[1].length });
  };

  for (let i = range[0] + 1; i < range[1]; i++) {
    const c = m[i];
    if ("([{<".includes(c)) depth++;
    else if (")]}".includes(c) || (c === ">" && m[i - 1] !== "=")) depth--;
    else if (c === "," && depth === 0) {
      flush(i);
      from = i + 1;
    }
  }
  flush(range[1]);
  return found;
}

export const naming: Rule = {
  id: "PL-NAME-001",
  title: "Meaningful names",
  docs: "core/naming",
  find(s) {
    const out: Finding[] = [];
    const seen = new Set<number>();

    const check = (name: string, at: number) => {
      if (seen.has(at)) return;
      seen.add(at);
      const message = WEAK.test(name)
        ? `\`${name}\` says nothing. Name it after what it holds.`
        : name.length > MAX_LENGTH
          ? `\`${name}\` is longer than it needs to be: as short as possible, as explicit as necessary.`
          : null;
      if (message) out.push({ rule: "PL-NAME-001", severity: "warn", start: at, end: at + name.length, message });
    };

    for (const match of s.masked.matchAll(JS_DECLARATION)) check(match[1], match.index + match[0].length - match[1].length);
    if (s.lang === "java") {
      for (const match of s.masked.matchAll(JAVA_LOCAL)) check(match[1], match.index + match[0].trimEnd().length - match[1].length);
    }
    for (const block of listBlocks(s.masked)) {
      if (block.kind === "function") for (const p of parameters(s, block.open)) check(p.name, p.at);
    }
    return out;
  },
};
