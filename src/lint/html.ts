import type { Issue, Msg, Severity } from "./types";

/**
 * Pureline checks for HTML (PL-HTML-002 to PL-HTML-008). A small tag tokenizer instead of a DOM parser:
 * comments are masked first, script and style bodies are skipped, nesting is tracked on a stack.
 * Heuristic, like the other checkers.
 */

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const MAX_DEPTH = 4;
const TAG = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
const ATTR = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

/** Message for a key that is not in LintKey yet. Only used for the NEW keys listed in the report. */
const newKey = (key: string): Msg => ({ key }) as unknown as Msg;

function parseAttrs(raw: string): Map<string, string> {
  const attrs = new Map<string, string>();
  const re = new RegExp(ATTR.source, "g");
  let a: RegExpExecArray | null;
  while ((a = re.exec(raw))) attrs.set(a[1]!.toLowerCase(), a[2] ?? a[3] ?? a[4] ?? "");
  return attrs;
}

export function analyzeHtml(code: string): Issue[] {
  // Comments are blanked with spaces (newlines kept) so offsets and line numbers stay the same.
  const masked = code.replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, " "));

  const lineStarts = [0];
  for (let i = 0; i < code.length; i++) if (code[i] === "\n") lineStarts.push(i + 1);
  const positionOf = (offset: number) => {
    let line = 0;
    while (line + 1 < lineStarts.length && lineStarts[line + 1]! <= offset) line++;
    return { line: line + 1, col: offset - lineStarts[line]! + 1 };
  };

  const issues: Issue[] = [];
  const report = (start: number, length: number, severity: Severity, message: Msg, rule: string) => {
    const { line, col } = positionOf(start);
    issues.push({ rule, severity, start, end: start + length, message, fixable: false, line, col });
  };

  const tag = new RegExp(TAG.source, "g");
  const stack: string[] = [];
  const labelFor = new Set<string>();
  const inputs: { start: number; length: number; attrs: Map<string, string>; wrapped: boolean }[] = [];
  let labelDepth = 0;
  let h1Count = 0;
  let m: RegExpExecArray | null;

  while ((m = tag.exec(masked))) {
    const whole = m[0];
    const closing = m[1] === "/";
    const name = m[2]!.toLowerCase();
    const rawAttrs = m[3] ?? "";
    const start = m.index;
    const end = start + whole.length;

    if (closing) {
      if (name === "label") labelDepth = Math.max(0, labelDepth - 1);
      const at = stack.lastIndexOf(name);
      if (at >= 0) stack.length = at;
      continue;
    }

    // Script and style bodies are not markup: check the script body, then skip past it.
    if (name === "script" || name === "style") {
      const endRe = new RegExp(`</${name}\\s*>`, "gi");
      endRe.lastIndex = end;
      const close = endRe.exec(masked);
      const contentEnd = close ? close.index : masked.length;
      const attrs = parseAttrs(rawAttrs);
      const type = (attrs.get("type") ?? "").trim().toLowerCase();
      if (name === "script" && !attrs.has("src") && type !== "application/json" && masked.slice(end, contentEnd).trim() !== "") {
        report(start, whole.length, "warn", newKey("lint.htmlInlineScript"), "PL-HTML-006");
      }
      tag.lastIndex = contentEnd;
      continue;
    }

    const attrs = parseAttrs(rawAttrs);
    if (attrs.has("style")) report(start, whole.length, "warn", newKey("lint.htmlInlineStyle"), "PL-HTML-003");

    switch (name) {
      case "img":
        if (!attrs.has("alt")) report(start, whole.length, "error", newKey("lint.htmlImgAlt"), "PL-HTML-005");
        break;
      case "h1":
        h1Count++;
        if (h1Count > 1) report(start, whole.length, "info", newKey("lint.htmlSecondH1"), "PL-HTML-002");
        break;
      case "html":
        if (!attrs.has("lang")) report(start, whole.length, "warn", newKey("lint.htmlLang"), "PL-HTML-007");
        break;
      case "label":
        labelDepth++;
        if (attrs.has("for")) labelFor.add(attrs.get("for")!);
        break;
      case "input":
        if ((attrs.get("type") ?? "").trim().toLowerCase() !== "hidden") {
          inputs.push({ start, length: whole.length, attrs, wrapped: labelDepth > 0 });
        }
        break;
    }

    if (!VOID.has(name) && !/\/\s*$/.test(rawAttrs)) {
      stack.push(name);
      if (stack.length > MAX_DEPTH) report(start, whole.length, "warn", { key: "lint.flattenNesting" }, "PL-HTML-008");
    }
  }

  // Inputs are checked after the whole file is read, so a label placed after the control still counts.
  for (const input of inputs) {
    const id = input.attrs.get("id");
    const labelled = input.wrapped || input.attrs.has("aria-label") || (id !== undefined && labelFor.has(id));
    if (!labelled) report(input.start, input.length, "warn", newKey("lint.htmlInputLabel"), "PL-HTML-004");
  }

  return issues.sort((a, b) => a.start - b.start);
}
