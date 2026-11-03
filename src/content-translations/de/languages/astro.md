# Astro Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) mit diesem Profil an, und das [TypeScript-Profil](typescript.md) für das Frontmatter-Skript. Astro rendert HTML auf dem Server oder zur Build-Zeit und liefert JavaScript nur dort aus, wo es gebraucht wird. Pureline Astro hält dieses Modell sichtbar: standardmäßig statisch, interaktiv dort, wo es deklariert ist. Pureline ist mit Astro 5 und höher kompatibel.

## Astro-Profil {#astro-profile}

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — Komponenten sind `.astro`-Dateien in `PascalCase` {#pl-as-001--components-are-astro-files-named-in-pascalcase}

Eine Komponente liegt in `src/components/` und ist nach dem benannt, was sie rendert (`SessionCard.astro`). Eine Seite oder ein Layout liegt in `src/pages/` bzw. `src/layouts/`. Routen-Dateien bleiben schlank: Sie laden Daten und setzen Komponenten zusammen.

### PL-AS-002 — Das Frontmatter ist linear und typisiert {#pl-as-002--frontmatter-is-linear-and-typed}

Das Frontmatter (zwischen den `---`-Zäunen) erledigt vier Dinge der Reihe nach: typisierte Props entgegennehmen, Daten laden, abgeleitete Werte berechnen und dann rendern. Deklariere Props mit einem `interface Props`. Halte das Frontmatter frei von Markup.

```astro
---
interface Props {
    title: string;
    draft?: boolean;
}

const { title, draft = false } = Astro.props;
if (draft) {
    return Astro.redirect("/drafts");
}
---
<h2>{title}</h2>
```

### PL-AS-003 — Standardmäßig statisch, Islands durch Deklaration {#pl-as-003--static-by-default-islands-by-declaration}

Rendere HTML ohne JavaScript, solange die Komponente nicht auf den Benutzer reagieren oder sich im Lauf der Zeit ändern muss. Muss sie das, markiere die eine interaktive Komponente mit einer expliziten Client-Direktive: `client:visible` für Inhalte unterhalb des sichtbaren Bereichs, `client:idle` für nicht dringende Widgets, `client:load` nur für das, was beim ersten Paint gebraucht wird. Eine Komponente ohne Direktive liefert nie JavaScript aus.

### PL-AS-004 — Templates bleiben lesbar {#pl-as-004--templates-stay-readable}

- Bedingungen mit `&&` oder einer benannten Variable für einen einzelnen Zweig; verwende für vorzeitige Ausstiege einen Guard im Frontmatter.
- Maps über Listen mit einem stabilen `key`, wenn die Liste interaktiv ist.
- Verschachtele innerhalb des Markups nicht mehr als zwei Ausdrucksebenen. Verlagere den inneren Teil in eine Komponente.

Lass einen kurzen Formatierungsausdruck im Template, wenn er nur einmal
vorkommt und an der Verwendungsstelle verständlich ist.

```text
Named frontmatter value                         │ ✓ Pureline
---                                             │ ---
const { title } = Astro.props;                  │ const { title } = Astro.props;
const displayTitle = title.trim() || "Profil";  │ ---
---                                             │
                                                │ <h1>{title.trim() || "Profil"}</h1>
<h1>{displayTitle}</h1>                         │
```

### PL-AS-005 — Styles sind scoped {#pl-as-005--styles-are-scoped}

Verwende standardmäßig `<style>`-Blöcke in der Komponente; Astro scoped sie automatisch. Verwende `is:global` nur für dokumentweite Regeln wie Reset oder Theme-Tokens und halte diese in einem einzigen globalen Stylesheet.

### PL-AS-006 — Daten haben eine Quelle {#pl-as-006--data-has-one-source}

Inhalte liegen in Content Collections (`src/content/`) mit einem Schema (`defineCollection` und zod). Seiten fragen die Collection ab; sie parsen Markdown-Dateien nicht selbst. Entfernte Daten werden einmal im Frontmatter der Seite geladen, die sie braucht.

### PL-AS-007 — Framework-Islands folgen ihrem eigenen Profil {#pl-as-007--framework-islands-follow-their-own-profile}

Eine React-, Vue- oder Svelte-Island folgt dem Profil des jeweiligen Frameworks (für React: [PL-REACT](react.md)). Astro ändert die Regeln der Komponente nicht; es entscheidet nur, wo die Komponente hydriert wird.

### PL-AS-008 — Ordnerdichte {#pl-as-008--folder-density}

`src/components/` enthält standardmäßig höchstens **10 Dateien**. Gruppiere Komponenten nach Feature (`components/blog/`), sobald ein Feature mehrere Dateien hat.

### PL-AS-009 — Tooling {#pl-as-009--tooling}

Führe in der CI `astro check` (Typ- und Template-Diagnosen) und den Build aus. Nutze die Ausgabe von `astro build`, um zu prüfen, dass Seiten ohne Islands kein JavaScript ausliefern.
