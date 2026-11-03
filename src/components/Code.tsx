import { useEffect, useState } from "react";
import { highlight } from "./highlight";

const pre = "overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-fg";

/** Code with GitHub Dark highlighting; plain text until the grammar has loaded. */
export function Code({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;
    setHtml(null);
    highlight(code, lang).then((result) => {
      if (!stale) {
        setHtml(result);
      }
    });
    return () => {
      stale = true;
    };
  }, [code, lang]);

  if (html) {
    return <div className="shiki-wrap" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <pre className={pre}><code>{code}</code></pre>;
}
