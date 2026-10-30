import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// BASE_PATH is only needed when served from a sub-path (e.g. /pureline-style.eu/ without a custom domain).
export default defineConfig({ base: process.env.BASE_PATH ?? "/", plugins: [react(), tailwindcss()] });
