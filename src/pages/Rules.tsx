import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { LanguageLogo } from "../components/LanguageLogo";
import { checkedRules, rules, ruleProfiles } from "../content";
import { useI18n } from "../i18n/context";

/** Profile names are data keys; "Core" and the "All" filter are translated for display only. */
export function Rules() {
  const { t } = useI18n();
  const [profile, setProfile] = useState("All");
  const [query, setQuery] = useState("");
  const [automated, setAutomated] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rules.filter(
      (r) =>
        (profile === "All" || r.profile === profile) &&
        (!automated || checkedRules.has(r.id)) &&
        (!q || r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)),
    );
  }, [profile, query, automated]);

  const automatedCount = rules.filter((r) => checkedRules.has(r.id)).length;
  const label = (name: string) => (name === "Core" ? t("rules.core") : name);
  const filters = ["All", ...ruleProfiles.map((p) => p.label)];

  return (
    <div className="shell py-14">
      <header>
        <h1 className="display text-[2.5rem] leading-tight">{t("rules.title")}</h1>
        <p className="mt-3 max-w-2xl text-muted">
          {t("rules.summary", { total: rules.length, automated: automatedCount })}
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">{t("rules.searchLabel")}</span>
            <Icon name="lucide:search" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("rules.search")}
              className="w-full rounded-lg border border-line bg-surface py-2.5 pl-11 pr-4 text-sm placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none"
            />
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={automated}
            onClick={() => setAutomated(!automated)}
            className={`inline-flex shrink-0 items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-colors ${automated ? "border-accent/50 bg-accent/10 text-accent" : "border-line text-muted hover:text-fg"}`}
          >
            <span className={`size-2 rounded-full ${automated ? "bg-accent" : "bg-muted/50"}`} />
            {t("rules.automated")}
          </button>
        </div>

        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" role="group" aria-label={t("rules.filter")}>
          {filters.map((name) => {
            const active = profile === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setProfile(name)}
                aria-pressed={active}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${active ? "bg-fg text-bg" : "text-muted hover:bg-raised hover:text-fg"}`}
              >
                {name === "All" ? t("rules.all") : label(name)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="island mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[46rem] text-left text-[15px]">
          <thead className="text-xs uppercase tracking-wide text-muted">
            <tr className="border-b border-line">
              <th className="px-6 py-4 font-medium">{t("rules.id")}</th>
              <th className="px-6 py-4 font-medium">{t("rules.rule")}</th>
              <th className="px-6 py-4 font-medium">{t("rules.profile")}</th>
              <th className="px-6 py-4 font-medium">{t("rules.checker")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-b border-line/50 last:border-b-0 transition-colors hover:bg-raised/40">
                <td className="whitespace-nowrap px-6 py-3.5 font-mono text-[13px] text-accent">{r.id}</td>
                <td className="px-6 py-3.5">
                  <Link to={r.href} className="text-fg transition-colors hover:text-accent">{r.title}</Link>
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-muted">
                  <span className="flex items-center gap-2.5">
                    {r.profileSlug === "core" ? <Icon name="lucide:layers" className="size-4" /> : <LanguageLogo slug={r.profileSlug} className="size-4" />}
                    {label(r.profile)}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  {checkedRules.has(r.id) ? (
                    <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent">auto</span>
                  ) : null}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted">{t("rules.none")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ul className="island mt-6 divide-y divide-line/50 md:hidden">
        {list.map((r) => (
          <li key={r.id} className="px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[13px] text-accent">{r.id}</span>
              {checkedRules.has(r.id) && <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent">auto</span>}
            </div>
            <Link to={r.href} className="mt-1.5 block text-[15px] text-fg hover:text-accent">{r.title}</Link>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted">
              {r.profileSlug === "core" ? <Icon name="lucide:layers" className="size-3.5" /> : <LanguageLogo slug={r.profileSlug} className="size-3.5" />}
              {label(r.profile)}
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="px-5 py-10 text-center text-muted">{t("rules.none")}</li>}
      </ul>

      <p className="mt-5 text-xs text-muted">{t("rules.showing", { shown: list.length, total: rules.length })}</p>
    </div>
  );
}
