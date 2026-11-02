import { closeOf } from "../scan";
import { balanced } from "../text";
import type { Finding, Rule } from "../types";

const MAX_LINE = 100;

export const compactCalls: Rule = {
  id: "PL-FMT-001",
  title: "Compact horizontal calls",
  docs: "core/formatting",
  find(s) {
    const { masked: m, src } = s;
    const out: Finding[] = [];

    for (let open = m.indexOf("("); open !== -1; open = m.indexOf("(", open + 1)) {
      if (!/^[ \t]*\r?\n/.test(m.slice(open + 1, open + 200))) continue;

      const close = closeOf(m, open);
      if (close === -1) continue;

      const raw = src.slice(open + 1, close);
      if (raw.includes("`") || /[{}]/.test(m.slice(open + 1, close))) continue;
      if (s.comments.some((c) => c.start > open && c.start < close)) continue;

      const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
      const masked = m.slice(open + 1, close).split("\n").map((line) => line.trim()).filter(Boolean);
      const simple = lines.length > 0 && masked.every((line) => balanced(line)) && lines.slice(0, -1).every((line) => line.endsWith(","));
      if (!simple) continue;

      const joined = lines.map((line) => line.replace(/,$/, "")).join(", ");
      const lineStart = src.lastIndexOf("\n", open) + 1;
      const lineEnd = src.indexOf("\n", close);
      const tail = src.slice(close + 1, lineEnd === -1 ? src.length : lineEnd);
      if (open - lineStart + joined.length + tail.length + 2 > MAX_LINE) continue;

      out.push({
        rule: "PL-FMT-001",
        severity: "warn",
        start: open,
        end: close + 1,
        message: "Unnecessary vertical expansion: keep simple calls on one line.",
        edits: [{ start: open + 1, end: close, text: joined }],
      });
    }
    return out;
  },
};
