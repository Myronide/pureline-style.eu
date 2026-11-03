import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { LanguageLogo } from "../components/LanguageLogo";
import { checkedRules, rules, ruleProfiles } from "../content";

const chip = (active: boolean) =>
  `rounded-md px-3 py-1.5 text-sm transition-colors ${active ? "bg-raised text-fg ring-1 ring-line" : "text-muted hover:text-fg"}`;

export function Rules() {
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

  return (
    <div className="shell py-14">
      <h1 className="display text-[2.5rem] leading-tight">Rule index</h1>
      <p className="mt-4 max-w-2xl text-muted">
        {rules.length} rules, {automatedCount} of them checked automatically in the editor. Every rule keeps its stable ID.
      </p>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg border border-line p-1" role="group" aria-label="Filter by profile">
          {["All", ...ruleProfiles.map((p) => p.label)].map((label) => (
            <button key={label} onClick={() => setProfile(label)} className={chip(profile === label)} aria-pressed={profile === label}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: else, PL-GO, semicolon"
            aria-label="Search rules"
            className="w-full rounded-md border border-line bg-surface px-4 py-2 text-sm placeholder:text-muted/70 focus:border-accent focus:outline-none sm:w-80"
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={automated} onChange={(e) => setAutomated(e.target.checked)} className="accent-[var(--color-accent)]" />
            Automated only
          </label>
        </div>
      </div>

      <div className="island mt-6 overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-[15px]">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">Rule</th>
              <th className="px-5 py-3 font-medium">Profile</th>
              <th className="px-5 py-3 font-medium">Checker</th>
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
                    {r.profile}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {checkedRules.has(r.id) ? (
                    <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent">auto</span>
                  ) : (
                    <span className="text-muted">–</span>
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted">No rule matches this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">Showing {list.length} of {rules.length} rules.</p>
    </div>
  );
}
