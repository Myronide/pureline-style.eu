import type { Finding, Rule } from "../types";

/** Comments that open with a verb usually narrate the next line instead of explaining why. */
const NARRATION = /^(?:check|checks|get|gets|set|sets|create|creates|loop|loops|iterate|iterates|return|returns|increment|increments|decrement|decrements|call|calls|initiali[sz]e|initiali[sz]es|define|defines|declare|declares|add|adds|remove|removes|update|updates|print|prints|log|logs|send|sends|load|loads|save|saves|validate|validates|if|for)\b/i;

/** Anything that hints at a reason is worth keeping. */
const REASON = /\b(?:because|since|workaround|work-around|bug|todo|fixme|hack|why|otherwise|due to|protocol|so that|avoid|issue|must|required|never|always|careful|note|see|legacy|compat\w*)\b|https?:|#\d+/i;

/** Commented-out code is not narration; deleting it is the author's call. */
const CODE = /[(){};=]/;

const STOP:ReadonlySet<string> = new Set(["the", "and", "for", "with", "from", "into", "that", "this", "are", "not", "all", "any", "its", "their", "each", "then", "exists", "exist"]);

const stem = (word: string) => word.toLowerCase().replace(/(?:ies|es|s)$/, "");

export const comments: Rule = {
  id: "PL-DOC-001",
  title: "Comments explain why",
  docs: "core/comments",
  find(s) {
    const { src, masked } = s;
    const out: Finding[] = [];

    for (const comment of s.comments) {
      if (comment.block || src.startsWith("///", comment.start)) continue;

      const text = src.slice(comment.start + 2, comment.end).trim();
      const words = text.split(/\s+/);
      if (words.length > 9 || !NARRATION.test(text) || REASON.test(text) || CODE.test(text)) continue;

      const lineStart = src.lastIndexOf("\n", comment.start - 1) + 1;
      const lineEnd = comment.end;
      const own = !src.slice(lineStart, comment.start).trim();
      const code = own
        ? (masked.slice(lineEnd).split("\n").find((line) => line.trim()) ?? "")
        : masked.slice(lineStart, comment.start);

      const subjects = words.slice(1).map((w) => w.replace(/[^\w]/g, "")).filter((w) => w.length > 2 && !STOP.has(w.toLowerCase()));
      const haystack = code.toLowerCase();
      if (!subjects.some((w) => haystack.includes(stem(w)))) continue;

      const trailing = /[ \t]*$/.exec(src.slice(lineStart, comment.start))![0].length;
      const edit = own
        ? { start: lineStart, end: Math.min(src.length, lineEnd + 1), text: "" }
        : { start: comment.start - trailing, end: lineEnd, text: "" };

      out.push({
        rule: "PL-DOC-001",
        severity: "warn",
        start: comment.start,
        end: comment.end,
        message: { key: "lint.obviousComment" },
        edits: [edit],
      });
    }
    return out;
  },
};
