import { Link } from "react-router-dom";
import { Code as Highlighted } from "../components/Code";
import { Icon } from "../components/Icon";
import { docPath, INDEX_SLUG, languageDocs, repoUrl, shortTitle } from "../content";

const principles = [
  { title: "Linear flow", text: "Input, validation, transformation, execution, result. Read top to bottom, never into a pyramid." },
  { title: "Explicit intent", text: "Names, types and effects say what they do. Nothing clever, nothing hidden." },
  { title: "Minimal noise", text: "Remove unnecessary code, not characters. Idiomatic syntax stays." },
  { title: "Small units", text: "One responsibility per function. Size ranges are heuristics, not laws." },
  { title: "Clear ownership", text: "Every module, resource and mutation has one obvious owner." },
  { title: "Cohesion over size", text: "Keep cohesive logic together. Line count alone is never a violation." },
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
  const good = tone === "good";
  return (
    <figure className={`min-w-0 border-line ${good ? "" : "md:border-r md:pr-8"}`}>
      <figcaption className={`mb-3 flex items-center gap-2 text-sm font-medium ${good ? "text-accent" : "text-muted"}`}>
        <Icon name={good ? "lucide:check" : "lucide:minus"} className="size-4" />
        {label}
      </figcaption>
      <Highlighted code={code} lang="ts" />
    </figure>
  );
}

export function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:pt-36">
        <p className="mb-6 text-sm text-muted">Specification 1.7 · Linear flow, explicit intent</p>
        <h1 className="display max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02]">
          Code without noise.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          Pureline is a coding style for readable code: linear control flow, explicit intent, small units and clear ownership. It standardizes principles, not syntax.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link to={docPath(INDEX_SLUG)} className="inline-flex items-center gap-2 rounded-md bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90">
            Read the guide <Icon name="lucide:arrow-right" className="size-4" />
          </Link>
          <Link to="/editor" className="text-sm text-fg underline underline-offset-[6px] decoration-line transition-colors hover:decoration-accent">
            Try the live editor
          </Link>
          <a href={repoUrl} target="_blank" rel="noreferrer" className="text-sm text-muted underline underline-offset-[6px] decoration-line transition-colors hover:text-fg hover:decoration-accent">
            Source on GitHub
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="mb-10 max-w-xl">
          <h2 className="display text-3xl">Same behaviour, less noise.</h2>
          <p className="mt-3 text-muted">Both versions validate the same two conditions and pay the same way. Only one of them reads top to bottom.</p>
        </div>
        <div className="island grid gap-10 p-6 sm:p-8 md:grid-cols-2 md:gap-8">
          <Compare label="Noisy" tone="bad" code={noisy} />
          <Compare label="Pureline" tone="good" code={pure} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <h2 className="display mb-8 text-3xl">Six principles</h2>
        <dl className="island grid gap-x-12 gap-y-10 p-8 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="border-t border-line pt-6">
              <dt className="display text-xl">{p.title}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted">{p.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-3xl">Language profiles</h2>
            <p className="mt-3 text-muted">Every profile stays idiomatic for its language.</p>
          </div>
          <Link to={docPath("languages/README")} className="text-sm text-muted transition-colors hover:text-fg">All profiles</Link>
        </div>
        <ul className="island grid px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
          {languageDocs.map((d) => (
            <li key={d.slug} className="border-b border-line/70 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
              <Link to={docPath(d.slug)} className="group flex items-center justify-between py-4 pr-2 transition-colors hover:text-accent">
                <span className="font-medium">{shortTitle(d)}</span>
                <Icon name="lucide:arrow-up-right" className="size-4 text-muted transition-colors group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
