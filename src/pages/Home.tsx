import { Link } from "react-router-dom";
import { Authors } from "../components/Authors";
import { Code as Highlighted } from "../components/Code";
import { Icon } from "../components/Icon";
import { docPath, INDEX_SLUG, languageDocs, repoUrl, shortTitle } from "../content";

const principles = [
  { icon: "lucide:move-down", title: "Linear Flow", text: "Input, validation, transformation, execution, result. Read top to bottom, never into a pyramid." },
  { icon: "lucide:target", title: "Explicit Intent", text: "Names, types and effects say what they do. Nothing clever, nothing hidden." },
  { icon: "lucide:eraser", title: "Minimal Noise", text: "Remove unnecessary code, not characters. Idiomatic syntax stays." },
  { icon: "lucide:box", title: "Small Units", text: "One responsibility per function. Size ranges are heuristics, not laws." },
  { icon: "lucide:users", title: "Clear Ownership", text: "Every module, resource and mutation has one obvious owner." },
  { icon: "lucide:link-2", title: "Cohesion over Size", text: "Keep cohesive logic together. Line count alone is never a violation." },
];

const noisy = `function charge(user, amount) {
  if (user) {
    if (user.active) {
      if (amount > 0) {
        return pay(user, amount);
      } else {
        throw new Error("invalid amount");
      }
    }
  }
}`;

const pure = `function charge(user: User | null, amount: number): Receipt {
  if (!user?.active) {
    throw new InactiveUserError();
  }

  if (amount <= 0) {
    throw new InvalidAmountError(amount);
  }

  return pay(user, amount);
}`;

function Compare({ label, tone, code }: { label: string; tone: "bad" | "good"; code: string }) {
  const bad = tone === "bad";
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className={`flex items-center gap-2 border-b border-line px-4 py-2 text-xs font-medium ${bad ? "text-warn" : "text-accent"}`}>
        <Icon name={bad ? "lucide:x" : "lucide:check"} className="size-3.5" /> {label}
      </div>
      <Highlighted code={code} lang="ts" />
    </div>
  );
}

export function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-24">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
          <span className="brand-gradient size-1.5 rounded-full" /> Specification 1.6
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Code without <span className="brand-text">noise</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Pureline is an opinionated coding style built on linear control flow, explicit intent, compact formatting, small units, clear ownership and cohesion over arbitrary size limits.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to={docPath(INDEX_SLUG)} className="inline-flex items-center gap-2 brand-gradient rounded-md px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
            Read the guide <Icon name="lucide:arrow-right" />
          </Link>
          <Link to="/editor" className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-raised">
            <Icon name="lucide:wand-sparkles" /> Try the live editor
          </Link>
          <a href={repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-raised">
            <Icon name="simple-icons:github" /> View on GitHub
          </a>
        </div>
        <div className="mt-8">
          <Authors />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          <Compare label="Noisy" tone="bad" code={noisy} />
          <Compare label="Pureline" tone="good" code={pure} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">Principles</h2>
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="bg-surface p-6">
              <Icon name={p.icon} className="mb-4 size-5 text-violet" />
              <h3 className="mb-1.5 font-medium">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <h2 className="mb-2 text-2xl font-semibold tracking-tight">Language profiles</h2>
        <p className="mb-8 text-muted">Pureline standardizes principles, not syntax. Every profile stays idiomatic.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {languageDocs.map((d) => (
            <Link key={d.slug} to={docPath(d.slug)} className="group flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3.5 transition-colors hover:bg-raised">
              <span className="font-medium">{shortTitle(d)}</span>
              <Icon name="lucide:arrow-up-right" className="size-4 text-muted transition-colors group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
