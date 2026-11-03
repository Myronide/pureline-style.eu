# Astro Code Style

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) with this profile, and the [TypeScript profile](typescript.md) for the frontmatter script. Astro renders HTML on the server or at build time and ships JavaScript only where it is needed. Pureline Astro hält dieses Modell sichtbar: statischer Standard, interaktiv, wo deklariert. Pureline ist kompatibel mit Astro 5 und höher.

## Astroprofil

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — Komponenten sind `.astro`-Dateien, die in `PascalCase` genannt werden

Eine Komponente lebt in `src/components/` und ist nach dem benannt, was sie macht (`SessionCard.astro`). Eine Seite oder ein Layout lebt in `src/pages/` oder `src/layouts/`. Routendateien bleiben dünn: sie laden Daten und setzen Komponenten zusammen.

### PL-AS-002 — Frontmaterie ist linear und typisiert

Die Frontmaterie (zwischen `---` Zäunen) erledigt vier Dinge in Ordnung: empfangen typisierte Requisiten, laden Daten, berechnen abgeleitete Werte und dann rendern. Requisiten mit einem `interface Props` deklarieren. Halten Sie die Frontmaterie frei von Markup...

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

### PL-AS-003 — Statisch nach Standard, Inseln nach Erklärung

Render HTML ohne JavaScript, es sei denn, die Komponente muss auf den Benutzer reagieren oder sich im Laufe der Zeit ändern. Wenn es sein muss, markieren Sie die eine interaktive Komponente mit einer expliziten Client-Direktive: `client:visible` für Inhalt unter dem Falten, `client:idle` für nicht-überregende Widgets, `client:load` nur für das, was auf den ersten Lack benötigt wird. Eine Komponente ohne Direktive versendet nie JavaScript.

### PL-AS-004 — Vorlagen bleiben lesbar

- Bedingt mit `&&` oder einer benannten Variable für einen einzelnen Zweig; verwenden Sie einen Schutz in der Frontmaterie für frühe Ausgänge.
- Karten über Listen mit einem stabilen `key`, wenn die Liste interaktiv ist.
- Nisten Sie nicht mehr als zwei Expressionsebenen innerhalb des Markups. Verschieben Sie den inneren Teil auf eine Komponente...

Keep a short formatting expression in the template when it is used once
and reads clearly at the point of use.

```text
Named frontmatter value                         │ ✓ Pureline
---                                             │ ---
const { title } = Astro.props;                  │ const { title } = Astro.props;
const displayTitle = title.trim() || "Profil";  │ ---
---                                             │
                                                │ <h1>{title.trim() || "Profil"}</h1>
<h1>{displayTitle}</h1>                         │
```

### PL-AS-005 — Styles Are Scoped

Verwenden Sie `<style>`-Blöcke in der Komponente standardmäßig; Astro Scopes sie automatisch. Verwenden Sie `is:global` nur für dokumentweite Regeln wie Reset oder Theme Token und halten Sie diese in einem globalen Stylesheet.

### PL-AS-006 — Daten haben eine Quelle

Inhalt lebt in Content-Sammlungen (`src/content/`) mit einem schema (`defineCollection` und zod). Seiten hinterfragen die Sammlung; sie parsen Markdown-Dateien nicht selbst. Die entfernten Daten werden einmalig in die Frontmaterie der Seite geladen, die sie benötigt.

### PL-AS-007 — Rahmeninseln verfolgen ihr eigenes Profil

Eine React-, Vue- oder Svelte-Insel folgt dem Profil dieses Rahmens (für React: [PL-REACT](react.md)). Astro ändert nicht die Regeln der Komponente; es entscheidet nur, wo die Komponente hydratisiert wird.

### PL-AS-008 — Ordnerdichte

`src/components/` hält standardmäßig höchstens **10 Dateien**. Gruppenkomponenten nach Feature (`components/blog/`) wenn ein Feature mehrere Dateien hat.

### PL-AS-009 — Werkzeugbau

Führen Sie `astro check` (Typen und Vorlagendiagnose) und die Build in CI aus. Verwenden Sie die Ausgabe von `astro build`, um zu überprüfen, dass Seiten ohne Inseln kein JavaScript versenden.
