import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { LanguageLogo } from "../components/LanguageLogo";
import { checkedRules, rules, ruleProfiles } from "../content";
import { useI18n } from "../i18n/context";

const chip = (active: boolean) =>
  `whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${active ? "bg-raised text-fg ring-1 ring-line" : "text-muted hover:text-fg"}`;

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

  return (
    <div className="shell py-14">
      <h1 className="display text-[2.5rem] leading-tight">{t("rules.title")}</h1>
      <p className="mt-4 max-w-2xl text-muted">
        {t("rules.summary", { total: rules.length, automated: automatedCount })}
      </p>

      <div className="mt-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-wrap gap-1 rounded-lg border border-line p-1" role="group" aria-label={t("rules.filter")}>
          {["All", ...ruleProfiles.map((p) => p.label)].map((name) => (
            <button key={name} onClick={() => setProfile(name)} className={chip(profile === name)} aria-pressed={profile === name}>
              {name === "All" ? t("rules.all") : label(name)}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("rules.search")}
            aria-label={t("rules.searchLabel")}
            className="w-full rounded-md border border-line bg-surface px-4 py-2 text-sm placeholder:text-muted/70 focus:border-accent focus:outline-none sm:w-80"
          />
          <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-muted">
            <input type="checkbox" checked={automated} onChange={(e) => setAutomated(e.target.checked)} className="accent-[var(--color-accent)]" />
            {t("rules.automated")}
          </label>
        </div>
      </div>

      <div className="island mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[46rem] text-left text-[15px]">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">{t("rules.id")}</th>
              <th className="px-5 py-3 font-medium">{t("rules.rule")}</th>
              <th className="px-5 py-3 font-medium">{t("rules.profile")}</th>
              <th className="px-5 py-3 font-medium">{t("rules.checker")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-b border-line/60 last:border-b-0 transition-colors hover:bg-raised/50">
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[13px] text-accent">{r.id}</td>
                <td className="px-5 py-3.5">
                  <Link to={r.href} className="text-fg hover:text-accent">{r.title}</Link>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                  <span className="flex items-center gap-2.5">
                    {r.profileSlug === "core" ? <Icon name="lucide:layers" className="size-4" /> : <LanguageLogo slug={r.profileSlug} className="size-4" />}
                    {label(r.profile)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {checkedRules.has(r.id) ? (
                    <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent">auto</span>
                  ) : <span className="text-muted">–</span>}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted">{t("rules.none")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ul className="island mt-6 divide-y divide-line/60 md:hidden">
        {list.map((r) => (
          <li key={r.id} className="px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[13px] text-accent">{r.id}</span>
              {checkedRules.has(r.id) && <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent">auto</span>}
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
      <p className="mt-4 text-xs text-muted">{t("rules.showing", { shown: list.length, total: rules.length })}</p>
    </div>
  );
}
