// GitHub Pages has no SPA fallback: serve index.html for unknown paths via 404.html.
import { copyFileSync } from "node:fs";

copyFileSync(new URL("../dist/index.html", import.meta.url), new URL("../dist/404.html", import.meta.url));
