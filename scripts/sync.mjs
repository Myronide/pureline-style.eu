// Holt docs/code-style + Spezifikation aus Myronide/pureline-style.
// Mit eingeloggtem gh: gh api. Sonst: ein Tarball von codeload.github.com (kein REST-Rate-Limit).
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const REPO = "Myronide/pureline-style";
const OUT = new URL("../src/content", import.meta.url).pathname;
const STAGE = `${OUT}.tmp`;
const SPEC = "PURELINE_SPECIFICATION_1.7.md";
const DOCS = /^docs\/code-style\//;

function ghAuthed() {
  try { execFileSync("gh", ["auth", "status"], { stdio: "ignore" }); return true; } catch { return false; }
}

const gh = (path, raw = false) =>
  execFileSync("gh", ["api", path, ...(raw ? ["-H", "Accept: application/vnd.github.raw"] : [])], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** Returns a map of repo path -> file content. */
async function viaGh() {
  const tree = JSON.parse(gh(`repos/${REPO}/git/trees/HEAD?recursive=1`));
  const paths = tree.tree.filter((n) => n.type === "blob" && DOCS.test(n.path) && n.path.endsWith(".md")).map((n) => n.path);
  return new Map([...paths, SPEC].map((p) => [p, gh(`repos/${REPO}/contents/${p}`, true)]));
}

async function viaTarball() {
  const res = await fetch(`https://codeload.github.com/${REPO}/tar.gz/HEAD`);
  if (!res.ok) throw new Error(`tarball: ${res.status}`);
  const dir = mkdtempSync(join(tmpdir(), "pureline-"));
  try {
    execFileSync("tar", ["-xz", "-C", dir, "--strip-components=1"], { input: Buffer.from(await res.arrayBuffer()) });
    const files = new Map();
    const walk = (rel) => {
      for (const e of readdirSync(join(dir, rel), { withFileTypes: true })) {
        const p = rel ? `${rel}/${e.name}` : e.name;
        if (e.isDirectory()) walk(p);
        else if ((DOCS.test(p) && p.endsWith(".md")) || p === SPEC) files.set(p, readFileSync(join(dir, p), "utf8"));
      }
    };
    walk("");
    return files;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const useGh = ghAuthed();
const files = await (useGh ? viaGh() : viaTarball());
if (!files.has(SPEC) || files.size < 5) throw new Error(`unexpected repo contents (${files.size} files)`);

// Stage first so a failed run never wipes the existing content.
rmSync(STAGE, { recursive: true, force: true });
for (const [path, text] of files) {
  const dest = join(STAGE, path.replace(DOCS, ""));
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, text);
}
writeFileSync(join(STAGE, "meta.json"), JSON.stringify({ repo: REPO, syncedAt: new Date().toISOString(), files: files.size }, null, 2));
rmSync(OUT, { recursive: true, force: true });
renameSync(STAGE, OUT);
console.log(`synced ${files.size} files via ${useGh ? "gh" : "tarball"}`);
