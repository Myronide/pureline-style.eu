import type { Issue } from "./types";

const MAX_EXPRESSION_DEPTH = 3;
const FENCE_OPEN = /^---[ \t]*\r?\n/;
const FENCE_CLOSE = /^---[ \t]*\r?$/gm;
/** Script, style and HTML comment bodies are not template expressions. */
const NON_TEMPLATE = /<(script|style)\b[\s\S]*?<\/\1\s*>|<!--[\s\S]*?-->/gi;

function locate(code: string, offset: number): { line: number; col: number } {
  const before = code.slice(0, offset);
  const line = before.split("\n").length;
  const lineStart = before.lastIndexOf("\n") + 1;
  return { line, col: offset - lineStart + 1 };
}

function withPosition(code: string, issue: Issue): Issue {
  return { ...issue, ...locate(code, issue.start) };
}

/** Frontmatter body (between the two `---` fences) and the offset where markup begins. */
function frontmatter(code: string): { bodyStart: number; bodyEnd: number; markupStart: number } | undefined {
  const open = code.match(FENCE_OPEN);
  if (!open) return undefined;
  FENCE_CLOSE.lastIndex = open[0].length;
  const close = FENCE_CLOSE.exec(code);
  if (!close) return undefined;
  const closeLineEnd = code.indexOf("\n", close.index);
  return {
    bodyStart: open[0].length,
    bodyEnd: close.index,
    markupStart: closeLineEnd === -1 ? code.length : closeLineEnd + 1,
  };
}

/** Frontmatter issues from the TypeScript analyzer, shifted into full-file offsets. */
function frontmatterIssues(code: string, body: string, offset: number, analyzeTs: (code: string) => Issue[]): Issue[] {
  return analyzeTs(body).map((issue) => {
    const shifted: Issue = {
      ...issue,
      start: issue.start + offset,
      end: issue.end + offset,
      edits: issue.edits?.map((edit) => ({ ...edit, start: edit.start + offset, end: edit.end + offset })),
    };
    return withPosition(code, shifted);
  });
}

/** One PL-CF-001 warning per line where a `{` expression goes deeper than the limit. */
function nestingIssues(code: string, from: number): Issue[] {
  const markup = code.slice(from).replace(NON_TEMPLATE, (match) => match.replace(/[^\n]/g, " "));
  const issues: Issue[] = [];
  const flaggedLines = new Set<number>();
  let depth = 0;
  let lineStart = 0;

  for (let i = 0; i < markup.length; i++) {
    const char = markup[i];
    if (char === "\n") lineStart = i + 1;
    if (char === "}") depth = Math.max(0, depth - 1);
    if (char !== "{") continue;
    depth++;
    if (depth <= MAX_EXPRESSION_DEPTH || flaggedLines.has(lineStart)) continue;
    flaggedLines.add(lineStart);
    const start = from + i;
    issues.push(
      withPosition(code, {
        rule: "PL-CF-001",
        severity: "warn",
        start,
        end: start + 1,
        message: { key: "lint.flattenNesting" },
        fixable: false, line: 0, col: 0,
      }),
    );
  }
  return issues;
}

/** Issues for an Astro component: frontmatter via `analyzeTs`, then markup nesting. */
export function analyzeAstro(code: string, analyzeTs: (code: string) => Issue[]): Issue[] {
  const fence = frontmatter(code);
  if (!fence) return nestingIssues(code, 0).sort((a, b) => a.start - b.start);

  const body = code.slice(fence.bodyStart, fence.bodyEnd);
  const issues = [
    ...frontmatterIssues(code, body, fence.bodyStart, analyzeTs),
    ...nestingIssues(code, fence.markupStart),
  ];
  return issues.sort((a, b) => a.start - b.start || a.rule.localeCompare(b.rule));
}
