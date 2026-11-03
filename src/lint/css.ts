import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for CSS. Comments and string contents are blanked first, then the braces are walked once
 * with a stack of open blocks. Heuristic, like the rest of the checker.
 */

const MASK = /\/\*[\s\S]*?(\*\/|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/g;
const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![\w-])/g;
const ID = /#[A-Za-z_][\w-]*/g;
const IMPORTANT = /!\s*important\b/i;
const MOTION = /^(animation|transition)$/;
const REDUCED = /@media[^{]*prefers-reduced-motion/;
const UTILITY_LAYER = /^@layer\s+utilities\b/;
const ROOT = /(^|[\s,]):root\b/;
const MAX_RULE_DEPTH = 2;
const MAX_DESCENDANTS = 2;

interface Block {
  kind: "rule" | "at";
  prelude: string;
}

/** Blank comments and strings to spaces, keeping every offset and newline. */
function mask(code: string): string {
  return code.replace(MASK, (match) => match.replace(/[^\n]/g, " "));
}

function ruleOf(key: string): string {
  switch (key) {
    case "lint.cssImportant":
      return "PL-CSS-004";
    case "lint.cssIdSelector":
    case "lint.cssDeepSelector":
      return "PL-CSS-003";
    case "lint.cssLiteralColor":
      return "PL-CSS-001";
    case "lint.flattenNesting":
      return "PL-CF-001";
    case "lint.cssReducedMotion":
      return "PL-CSS-010";
    default:
      return "PL-CSS";
  }
}

function inUtility(stack: Block[]): boolean {
  return stack.some(
    (b) => (b.kind === "at" && UTILITY_LAYER.test(b.prelude)) || (b.kind === "rule" && b.prelude.startsWith(".utility-")),
  );
}

function inRoot(stack: Block[]): boolean {
  return stack.some((b) => b.kind === "rule" && ROOT.test(b.prelude));
}

/** Descendant combinators in each comma-separated selector; pseudo arguments are dropped first. */
function deepestChain(prelude: string): number {
  const bare = prelude.replace(/\([^()]*\)/g, "()");
  return Math.max(
    0,
    ...bare.split(",").map((sel) => sel.trim().replace(/\s*[>+~]\s*/g, " ").split(/\s+/).filter(Boolean).length - 1),
  );
}

export function analyzeCss(code: string): Issue[] {
  const masked = mask(code);
  const lineStarts = [0];
  for (let i = 0; i < code.length; i++) if (code.charAt(i) === "\n") lineStarts.push(i + 1);
  const issues: Issue[] = [];

  const at = (start: number, length: number, severity: Severity, message: Msg) => {
    let line = 0;
    while (line + 1 < lineStarts.length && lineStarts[line + 1]! <= start) line++;
    issues.push({
      rule: ruleOf(message.key),
      severity,
      start,
      end: start + length,
      message,
      fixable: false,
      line: line + 1,
      col: start - lineStarts[line]! + 1,
    });
  };

  const reduced = REDUCED.test(masked);
  const stack: Block[] = [];

  const declaration = (from: number, to: number) => {
    const raw = masked.slice(from, to);
    const top = stack[stack.length - 1];
    const trimmed = raw.trim();
    const colon = trimmed.indexOf(":");
    if (!top || colon < 0) return;
    const lead = from + raw.length - raw.trimStart().length;
    const prop = trimmed.slice(0, colon).trim().toLowerCase();

    const important = IMPORTANT.exec(raw);
    if (important && !inUtility(stack)) {
      at(from + important.index, important[0].length, "warn", { key: "lint.cssImportant" } as unknown as Msg);
    }

    if (!prop.startsWith("--") && !inRoot(stack)) {
      const hex = new RegExp(HEX.source, "g");
      let m: RegExpExecArray | null;
      while ((m = hex.exec(raw))) {
        at(from + m.index, m[0].length, "info", { key: "lint.cssLiteralColor" } as unknown as Msg);
      }
    }

    if (MOTION.test(prop) && top.kind === "rule" && !reduced) {
      at(lead, colon, "info", { key: "lint.cssReducedMotion" } as unknown as Msg);
    }
  };

  let segStart = 0;
  for (let i = 0; i < masked.length; i++) {
    const ch = masked.charAt(i);
    if (ch === "{") {
      const raw = masked.slice(segStart, i);
      const prelude = raw.trim();
      const lead = segStart + raw.length - raw.trimStart().length;
      const block: Block = { kind: prelude.startsWith("@") ? "at" : "rule", prelude };

      if (block.kind === "rule") {
        const ruleDepth = stack.filter((b) => b.kind === "rule").length;
        if (ruleDepth >= MAX_RULE_DEPTH) at(lead, prelude.length, "warn", { key: "lint.flattenNesting" });

        const ids = new RegExp(ID.source, "g");
        let m: RegExpExecArray | null;
        while ((m = ids.exec(prelude))) {
          at(lead + m.index, m[0].length, "warn", { key: "lint.cssIdSelector" } as unknown as Msg);
        }

        if (deepestChain(prelude) > MAX_DESCENDANTS) {
          at(lead, prelude.length, "warn", { key: "lint.cssDeepSelector" } as unknown as Msg);
        }
      }

      stack.push(block);
      segStart = i + 1;
    } else if (ch === ";" || ch === "}") {
      declaration(segStart, i);
      if (ch === "}") stack.pop();
      segStart = i + 1;
    }
  }
  if (segStart < masked.length) declaration(segStart, masked.length);

  return issues.sort((a, b) => a.start - b.start);
}
