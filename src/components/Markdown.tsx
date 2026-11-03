import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { repoUrl, resolveLink, slugify } from "../content";
import { Code } from "./Code";
import { Icon } from "./Icon";

function text(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  if (node && typeof node === "object" && "props" in node) return text((node as { props: { children?: ReactNode } }).props.children);
  return "";
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-muted">
        <span className="font-mono uppercase tracking-wider">{lang || "text"}</span>
        <button onClick={copy} className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-fg">
          <Icon name={copied ? "lucide:check" : "lucide:copy"} className="size-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <Code code={code} lang={lang} />
    </div>
  );
}

export function Markdown({ slug, children }: { slug: string; children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => <h2 id={slugify(text(children))}>{children}</h2>,
        h3: ({ children }) => {
          const title = text(children);
          const id = slugify(title);
          const rule = /^(PL-[A-Z0-9-]+)\s+—\s+(.+)$/.exec(title);
          if (!rule) return <h3 id={id}>{children}</h3>;
          return (
            <h3 id={id} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-xs font-medium text-accent">{rule[1]}</span>
              <span>{rule[2]}</span>
            </h3>
          );
        },
        h4: ({ children }) => <h4 id={slugify(text(children))}>{children}</h4>,
        pre: ({ children }) => {
          const child = children as { props?: { className?: string; children?: ReactNode } };
          const lang = /language-(\S+)/.exec(child.props?.className ?? "")?.[1] ?? "";
          return <CodeBlock lang={lang} code={text(child.props?.children).replace(/\n$/, "")} />;
        },
        a: ({ href = "", children }) => {
          if (/^https?:/.test(href)) return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
          if (href.startsWith("#")) return <a href={href}>{children}</a>;
          const to = resolveLink(slug, href);
          if (to) return <Link to={to}>{children}</Link>;
          const file = href.replace(/^(\.\.\/)+/, "");
          return <a href={`${repoUrl}/blob/HEAD/${file}`} target="_blank" rel="noreferrer">{children}</a>;
        },
        table: ({ children }) => <div className="overflow-x-auto"><table>{children}</table></div>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
