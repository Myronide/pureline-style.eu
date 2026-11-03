import { Link } from "react-router-dom";
import { Code as Highlighted } from "../components/Code";
import { Icon } from "../components/Icon";
import { LanguageLogo } from "../components/LanguageLogo";
import { docPath, INDEX_SLUG, languageDocs, repoUrl, ruleCount, shortTitle } from "../content";

const principles = [
  { title: "Linear flow", text: "Input, validation, transformation, execution, result. Read top to bottom, never into a pyramid.", bar: "bg-violet" },
  { title: "Explicit intent", text: "Names, types and effects say what they do. Nothing clever, nothing hidden.", bar: "bg-blue" },
  { title: "Minimal noise", text: "Remove unnecessary code, not characters. Idiomatic syntax stays.", bar: "bg-accent" },
  { title: "Small units", text: "One responsibility per function. Size ranges are heuristics, not laws.", bar: "bg-violet" },
  { title: "Clear ownership", text: "Every module, resource and mutation has one obvious owner.", bar: "bg-blue" },
  { title: "Cohesion over size", text: "Keep cohesive logic together. Line count alone is never a violation.", bar: "bg-accent" },
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

const tints = ["bg-violet", "bg-blue", "bg-accent"];

const flow = ["Input", "Validation", "Transformation", "Execution", "Result"];

/** A thin brand line above a section title. It marks the start of a section without being a label. */
function Rule() {
  return <div className="brand-gradient mb-5 h-px w-16 rounded-full" aria-hidden />;
}

function Compare({ label, tone, code }: { label: string; tone: "bad" | "good"; code: string }) {
  const good = tone === "good";
  return (
    <figure className={`min-w-0 ${good ? "" : "md:border-r md:border-line md:pr-8"}`}>
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
      <section className="shell relative isolate grid items-center gap-16 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:pt-20">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[34rem] w-[64rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_61_255/0.22),rgb(59_107_255/0.10),transparent)] blur-2xl" />

        <div>
          <p className="mb-6 flex items-center gap-3 text-sm text-muted">
            <span className="brand-gradient h-px w-8 rounded-full" aria-hidden />
            Specification 1.7 · Linear flow, explicit intent
          </p>
          <h1 className="display text-[clamp(2.75rem,6.5vw,5.25rem)] leading-[1.02]">
            Code without noise.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Pureline is a coding style for readable code: linear control flow, explicit intent, small units and clear ownership. It standardizes principles, not syntax.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to={docPath(INDEX_SLUG)} className="brand-gradient inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgb(139_61_255/0.6)] transition-opacity hover:opacity-90">
              Read the guide <Icon name="lucide:arrow-right" className="size-4" />
            </Link>
            <Link to="/editor" className="text-sm text-fg underline underline-offset-[6px] decoration-line transition-colors hover:decoration-accent">
              Try the live editor
            </Link>
            <a href={repoUrl} target="_blank" rel="noreferrer" className="text-sm text-muted underline underline-offset-[6px] decoration-line transition-colors hover:text-fg hover:decoration-accent">
              Source on GitHub
            </a>
          </div>
        </div>

        <div className="relative lg:translate-y-6">
          <div aria-hidden className="brand-gradient absolute -inset-6 -z-10 rounded-[2rem] opacity-20 blur-3xl" />
          <div className="island overflow-hidden">
            <div className="flex items-center justify-between border-b border-line/80 px-5 py-3 text-xs text-muted">
              <span className="font-medium text-fg">charge.ts</span>
              <span className="text-accent">Pureline</span>
            </div>
            <Highlighted code={pure} lang="ts" />
          </div>
        </div>
      </section>

      <section className="shell pb-24">
        <Rule />
        <div className="mb-10 max-w-xl">
          <h2 className="display text-3xl">Same behaviour, less noise.</h2>
          <p className="mt-3 text-muted">Both versions validate the same two conditions and pay the same way. Only one of them reads top to bottom.</p>
        </div>
        <div className="island grid gap-10 p-6 sm:p-8 md:grid-cols-2 md:gap-8">
          <Compare label="Noisy" tone="bad" code={noisy} />
          <Compare label="Pureline" tone="good" code={pure} />
        </div>
      </section>

      <section className="shell pb-24">
        <Rule />
        <h2 className="display mb-8 text-3xl">Reading direction</h2>
        <ol className="island flex flex-wrap items-center gap-x-3 gap-y-4 p-6 sm:p-8">
          {flow.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="display text-lg">{step}</span>
              {i < flow.length - 1 && <Icon name="lucide:arrow-right" className="size-4 text-muted" />}
            </li>
          ))}
        </ol>
      </section>

      <section className="shell pb-24">
        <Rule />
        <h2 className="display mb-8 text-3xl">Six principles</h2>
        <dl className="island grid gap-x-12 gap-y-10 p-8 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title}>
              <span className={`mb-4 block h-1 w-10 rounded-full ${p.bar}`} aria-hidden />
              <dt className="display text-xl">{p.title}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted">{p.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell pb-24">
        <Rule />
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-3xl">Language profiles</h2>
            <p className="mt-3 text-muted">Every profile stays idiomatic for its language.</p>
          </div>
          <Link to={docPath("languages/README")} className="text-sm text-muted transition-colors hover:text-fg">All profiles</Link>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {languageDocs.map((d, i) => (
            <li key={d.slug} className="relative bg-surface">
              <span aria-hidden className={`absolute inset-x-0 top-0 h-px ${tints[i % tints.length]}`} />
              <Link to={docPath(d.slug)} className="group flex h-full flex-col justify-between gap-10 p-6 transition-colors hover:bg-raised">
                <span className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <LanguageLogo slug={d.slug} className="size-5 shrink-0 text-muted transition-colors group-hover:text-fg" />
                    <span className="font-medium">{shortTitle(d)}</span>
                  </span>
                  <Icon name="lucide:arrow-up-right" className="size-4 text-muted transition-colors group-hover:text-accent" />
                </span>
                <span className="text-xs text-muted">{ruleCount(d)} rules</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell pb-28">
        <div className="rounded-[1.35rem] p-px brand-gradient">
          <div className="flex flex-col gap-6 rounded-[1.3rem] bg-surface px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="display text-2xl">Start with the guide.</h2>
              <p className="mt-2 max-w-lg text-muted">Principles, the rules of every language profile, and a live editor that flags violations and converts the safe ones.</p>
            </div>
            <Link to={docPath(INDEX_SLUG)} className="inline-flex shrink-0 items-center gap-2 rounded-md bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90">
              Open the guide <Icon name="lucide:arrow-right" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
