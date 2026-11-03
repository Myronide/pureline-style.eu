# React Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules), das [JavaScript-Profil](javascript.md) und das [TypeScript-Profil](typescript.md) zusammen mit diesem Profil an. Das React-Profil zielt auf **React 19 mit TypeScript im Strict-Modus**, gebündelt mit Vite und geroutet mit react-router. Komponenten sind Funktionen. Pureline liest eine Komponente als kleine Pipeline: Props hinein, Guards, abgeleitete Werte, Markup heraus.

## React-Profil {#react-profile}

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Komponenten sind benannte Funktionen {#pl-react-001--components-are-named-functions}

- Eine Komponente ist eine benannte Funktion in `PascalCase`, deklariert mit `function` oder als `const`-Arrow-Function, und wird unter ihrem Namen exportiert.
- Eine Komponente hat eine Verantwortung. Extrahiere eine Unterkomponente, wenn ein Markup-Block eigenen Zustand, eigene Daten oder einen eigenen Namen im Kopf des Lesers hat.
- Definiere Komponenten nicht innerhalb anderer Komponenten. Eine Komponente, die während des Renderns erzeugt wird, wird bei jedem Render neu gemountet und verliert ihren Zustand.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Guard Clauses vor dem Haupt-Markup {#pl-react-002--guard-clauses-before-the-main-markup}

Behandle Lade-, Fehler- und Leerzustände zuerst und kehre früh zurück. Der erfolgreiche Pfad bleibt auf der Basis-Einrückung.

```tsx
export function UserPanel({ query }: UserPanelProps) {
    if (query.isPending) {
        return <Spinner />;
    }

    if (query.isError) {
        return <ErrorMessage error={query.error} />;
    }

    return <UserDetails user={query.data} />;
}
```

Vermeide verschachtelte Ternaries in JSX. Berechne den Zweig in eine benannte Konstante oder gib ihn aus einem Guard zurück. Ein einzelner Ternary für eine einfache Entweder-oder-Wahl innerhalb von JSX ist erlaubt.

### PL-REACT-003 — Hooks stehen bedingungslos auf oberster Ebene {#pl-react-003--hooks-are-unconditional-and-top-level}

- Rufe Hooks auf der obersten Ebene einer Komponente oder eines eigenen Hooks auf, bei jedem Render in derselben Reihenfolge. Niemals innerhalb einer Bedingung, einer Schleife oder einer verschachtelten Funktion.
- Ein eigener Hook heißt `useX`, liegt bei gemeinsamer Nutzung in einem Ordner `hooks/` und kapselt genau ein Anliegen: ein Abonnement, einen Zustand, eine Datenquelle.
- Ein eigener Hook gibt ein stabiles, typisiertes Ergebnis zurück. Dokumentiere mit einem kurzen Kommentar nur, was der Aufrufer aus Name und Typ nicht ableiten kann.

### PL-REACT-004 — Abgeleitete Werte werden berechnet, nicht gespeichert {#pl-react-004--derived-values-are-computed-not-stored}

Lässt sich ein Wert aus Props oder State berechnen, berechne ihn während des Renderns. Kopiere Props nicht in den State und halte nicht zwei State-Variablen, die immer übereinstimmen müssen.

Verwende `useMemo` nur dort, wo gemessene Kosten es rechtfertigen, etwa bei einer aufwendigen Berechnung oder einem referenziell stabilen Wert, von dem eine memoisierte Kindkomponente abhängt. Wickle nicht standardmäßig jeden Wert in `useMemo`.

### PL-REACT-005 — Effekte synchronisieren mit externen Systemen {#pl-react-005--effects-synchronise-with-external-systems}

`useEffect` dient der Synchronisation mit etwas außerhalb von React: einer DOM-API, einem Timer, einem Abonnement, einer Netzwerkverbindung. Es ist nicht gedacht für:

- das Ableiten von State aus Props (berechne ihn stattdessen, siehe PL-REACT-004);
- das Reagieren auf ein Benutzerereignis (lege die Logik in den Event-Handler);
- das Initialisieren von Anwendungszustand, den eine Elternkomponente besitzen kann.

Jeder Effekt, der abonniert oder Arbeit startet, gibt eine Cleanup-Funktion zurück, die genau diese Arbeit rückgängig macht. Bevorzuge für externe Stores `useSyncExternalStore` gegenüber einem Effekt, der Store-Werte in den State kopiert.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Props werden explizit typisiert {#pl-react-006--props-are-typed-explicitly}

- Deklariere Props mit einem `interface` (oder einem `type` für Unions) direkt über der Komponente. Benenne es `<Component>Props`.
- Verwende kein `any` für Props, State oder Context. Im `strict`-Modus ist `unknown` samt Narrowing der Standard für Werte, deren Form noch nicht bekannt ist ([PL-TS-001](typescript.md)).
- Destrukturiere Props in der Parameterliste, wenn es wenige sind. Nimm bei vielen Props einen einzigen Parameter `props` und destrukturiere in den ersten Zeilen des Rumpfs.
- Verwende Union-Typen für Varianten, die ändern, was die Komponente rendert (`status: "idle" | "loading" | "done"`), statt einer Reihe optionaler Booleans.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — Context transportiert nur übergreifende Werte {#pl-react-007--context-carries-cross-cutting-values-only}

Verwende Context für Werte, die viele Komponenten brauchen und die sich selten ändern: der aktuelle Benutzer oder Eigentümer, das Theme, die Locale, ein Service-Client. Verwende Context nicht, um gewöhnliche Daten durch zwei oder drei Ebenen zu reichen; gib stattdessen Props weiter, das hält den Datenfluss sichtbar.

Wird ein Context gebraucht, stelle ihn über einen eigenen Hook bereit, der einen klaren Fehler wirft, wenn der Provider fehlt. Aufrufer sehen dann nie `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — Das Laden von Daten hat einen Eigentümer {#pl-react-008--data-loading-has-an-owner}

- Lade Routendaten über den Router (Loader in react-router), wo die App ihn verwendet, damit Laden und Fehlerbehandlung bei der Route liegen.
- Verwende außerhalb des Routers eine Datenbibliothek oder einen eigenen Hook, der Abbruch, veraltete Antworten und Fehlerzustand behandelt. Schreibe keine nackten `fetch`-Aufrufe in Effekten ohne Abbruchsignal.
- Halte Fetch-Ergebnisse an einer Stelle. Komponenten lesen das Ergebnis; sie wiederholen nicht jeweils die Anfrage.

### PL-REACT-009 — Keys identifizieren Elemente, nicht Positionen {#pl-react-009--keys-identify-items-not-positions}

- Verwende einen stabilen Bezeichner aus den Daten als `key` von Listenelementen.
- Verwende den Array-Index nicht als Key für Listen, die umsortiert, gefiltert oder in der Länge verändert werden können. Index-Keys sind nur für statische Listen akzeptabel, die sich nie ändern.

### PL-REACT-010 — Rendern ist rein {#pl-react-010--render-is-pure}

Das Rendern berechnet Markup aus Props und State und nichts sonst. Verändere beim Rendern keine Props, keine Variablen auf Modulebene und keine DOM-Knoten, und starte dort keine Netzwerkanfragen oder Abonnements. Die App läuft unter `StrictMode`, der in der Entwicklung doppelt rendert, um unreine Renders aufzudecken. Eine Komponente, die sich beim zweiten Render anders verhält, ist ein Fehler.

Seiteneffekte gehören in Event-Handler und Effekte ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011 — Event-Handler und Callback-Props {#pl-react-011--event-handlers-and-callback-props}

- Benenne Handler innerhalb einer Komponente `handleX` (`handleSubmit`) und die Props, die sie erhalten, `onX` (`onSubmit`).
- Definiere einen Handler nur dann inline, wenn er ein einzeiliger Weiterleitungsaufruf ist. Längere Handler bekommen einen Namen, damit der Komponentenrumpf linear bleibt.
- Reiche Callbacks nur an Kinder weiter, die sie brauchen. Wickle nicht standardmäßig jeden Handler in `useCallback`; verwende es dort, wo eine memoisierte Kindkomponente von referenzieller Stabilität abhängt.

### PL-REACT-012 — Styling bleibt nah am Markup {#pl-react-012--styling-stays-close-to-the-markup}

- Utility-Klassen (Tailwind CSS) bleiben im Markup direkt bei dem Element, das sie stylen.
- Ein Klassen-String, der an drei oder mehr Stellen wiederholt wird, wird zu einer benannten Komponente oder einer benannten Konstante, nicht zu einer Kopie.
- Halte bedingte Klassen lesbar: Berechne die Klassenliste einmal in einer benannten Konstante, wenn es mehr als zwei Bedingungen gibt.

### PL-REACT-013 — Ordnerdichte und Feature-Ordner {#pl-react-013--folder-density-and-feature-folders}

- Gruppiere Komponenten, Hooks und ihre Tests nach Feature (`features/sessions/`) und nicht nach Dateiart über die ganze App hinweg, sobald ein Feature mehr als eine Datei hat.
- Gemeinsame Primitive (Buttons, Eingaben, Layout) liegen in einem einzigen Ordner `components/` oder `ui/`.
- Ein Ordner enthält standardmäßig höchstens **10 von Hand gepflegte Quelldateien** ([PL-TS-007](typescript.md)). Das sind Review-Schwellen, keine harten Grenzen: Teile entlang von Verantwortlichkeiten auf, nicht in sinnlos verschachtelte Ordner.
- Eine Datei mit mehreren Komponenten, die State teilen, ist kohäsiv. Halte sie zusammen ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014 — Routing ist eine Grenze {#pl-react-014--routing-is-a-boundary}

Routen bilden URLs auf Screens ab. Halte Routendefinitionen an einer Stelle. Eine Routenkomponente holt oder erhält ihre Daten an der Grenze und reicht einfache Props an darstellende Komponenten weiter. Darstellende Komponenten lesen die URL nicht selbst.
