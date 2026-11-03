# Codestil reagieren

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules), das [JavaScript profile](javascript.md) und das [TypeScript profile](typescript.md) zusammen mit diesem Profil an. Das React-Profil zielt auf **React 19 mit TypeScript im strengen Modus**, gebündelt mit Vite und mit React-Router geroutet. Komponenten sind Funktionen. Pureline liest eine Komponente als kleine Pipeline: Requisiten in, Wachen, abgeleitete Werte, Markup..

## Profil reagieren

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Komponenten sind benannte Funktionen

- Eine Komponente ist eine benannte Funktion in `PascalCase`, deklariert mit `function` oder einer `const` Pfeilfunktion und exportiert nach Namen.
- Eine Komponente ist eine Verantwortung. Extrahieren Sie eine Teilkomponente, wenn ein Markupblock seinen eigenen Zustand, eigene Daten oder seinen eigenen Namen im Kopf des Lesers hat.
- Nicht Komponenten innerhalb anderer Komponenten definieren. Eine während des Renders erzeugte Komponente wird auf jedem Render wieder montiert und verliert ihren Zustand.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Wachklauseln vor dem Hauptmarkup

Behandeln Sie zuerst Lade-, Fehler- und Leerzustände und kehren Sie frühzeitig zurück. Der erfolgreiche Pfad bleibt bei der Basiseinrückung.

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

Vermeiden Sie verschachtelte Tennare in JSX. Compute the branch into a named constant or return it from a guard. A single ternary for a simple two-way choice inside JSX is allowed.

```text
− Conditional JSX                            │ ✓ Pureline
function Profile({ user }: ProfileProps) {   │ function Profile({ user }: ProfileProps) {
    return user === null                     │     if (user === null) {
        ? <SignInPrompt />                   │         return <SignInPrompt />;
        : <ProfileCard user={user} />;       │     }
}                                            │
                                             │     return <ProfileCard user={user} />;
                                             │ }
```

### PL-REACT-003 — Hooks Are Unconditional and Top-Level

- Call hooks at the top level of a component or custom hook, in the same order on every render. Never inside a condition, loop, or nested function.
- A custom hook is named `useX`, lives in a `hooks/` folder when shared, and encapsulates one concern: one subscription, one piece of state, one data source.
- A custom hook returns a stable, typed result. Dokument mit einem kurzen Kommentar nur, was der Anrufer nicht aus dem Namen und Typ entnehmen kann.

### PL-REACT-004 — Abgeleitete Werte werden berechnet, nicht gespeichert

Wenn ein Wert aus Requisiten oder Zustand berechnet werden kann, berechnen Sie ihn während des Renderns. Kopieren Sie keine Requisiten in den Zustand und halten Sie nicht zwei Zustandsvariablen, die immer zustimmen müssen.

Verwenden Sie `useMemo` nur, wenn ein gemessener Preis es rechtfertigt, wie eine teure Berechnung oder einen referential stabilen Wert, von dem ein Memoized Child abhängt. Nicht jeden Wert standardmäßig in `useMemo` einwickeln.

### PL-REACT-005 — Auswirkungen Standardisierung mit externen Systemen

`useEffect` ist für die synchronisation mit etwas außerhalb React: eine DOM API, einen Timer, ein Abonnement, eine Netzwerkverbindung. Es ist nicht für:

- Zustand aus Requisiten ableiten (vermuten Sie stattdessen, siehe PL-REACT-004);
- Antwort auf ein Benutzerereignis (die Logik im Event-Handler eingeben);
- die Initialisierung der Anwendung besagt, dass ein Elternteil besitzen kann..

Jeder Effekt, der Arbeit abonniert oder startet, gibt eine Bereinigungsfunktion zurück, die genau das wieder rückgängig macht. Für externe Stores bevorzugen Sie `useSyncExternalStore` als einen Effekt, der Werte in den Zustand kopiert.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Vorladungen werden explizit eingegeben

- Declare props with an `interface` (or a `type` for unions) directly above the component. Name it `<Component>Props`.
- Do not use `any` for props, state, or context. Under `strict` mode, `unknown` plus narrowing is the default for values whose shape is not known yet ([PL-TS-001](typescript.md)).
- Destructure props in the parameter list when there are few of them. With many props, take one `props` parameter and destructure in the first lines of the body.
- Use union types for variants that change what the component renders (`status: "idle" | "loading" | "done"`) rather than a set of optional booleans.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — Context Carries Cross-Cutting Values Only

Verwenden Sie den Kontext für Werte, die viele Komponenten benötigen und die sich selten ändern: der aktuelle Benutzer oder Eigentümer, das Thema, locale, ein Service-Client. Verwenden Sie keinen Kontext, um normale Daten durch zwei oder drei Ebenen zu übergeben; übergeben Sie stattdessen Requisiten, die den Datenfluss sichtbar halten.

Wenn ein Kontext benötigt wird, entlarv ihn durch einen benutzerdefinierten Haken, der einen eindeutigen Fehler verursacht, wenn der Anbieter fehlt. Anrufer sehen dann nie `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — Datenlast hat einen Eigentümer

- Laden Sie Routendaten durch den Router (Loader im Reaction-Router), wo die App sie verwendet, so dass das Laden und Fehlerbehandeln mit der Route live ist.
- Verwenden Sie außerhalb des Routers eine Datenbibliothek oder einen benutzerdefinierten Haken, der mit Stornierung, Stillstand und Fehlerstatus umgeht. Schreiben Sie keine bloßen `fetch`-Aufrufe in Effekten ohne ein Abortsignal.
- Behalten Sie die Ergebnisse an einem Ort... Komponenten lesen das Ergebnis, sie wiederholen nicht jede die Anforderung.

### PL-REACT-009 — Schlüssel, die Elemente identifizieren, nicht Positionen

- Verwenden Sie einen stabilen Identifier aus den Daten als `key` der Listenelemente.
- Verwenden Sie den Array-Index nicht als Schlüssel für Listen, die in der Länge neu geordnet, gefiltert oder geändert werden können. Indexschlüssel sind nur für statische Listen akzeptabel, die sich nie ändern.

### PL-REACT-010 — Render ist rein

Rendering berechnet Markup von Requisiten und Zustand und nichts anderes... Mutieren Sie während des Renders keine Requisiten, Variablen auf Modulebene oder DOM-Nodes und starten Sie dort keine Netzwerkanfragen oder Abonnements. Die App läuft unter `StrictMode`, was in der Entwicklung zweimal macht, um unreine Renders auszusetzen. Eine Komponente, die sich beim zweiten Render anders verhält, ist ein Fehler.

Nebenwirkungen gehören zu den Fällen, die mit den Verantwortlichen und Wirkungen ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)) zusammenhängen.

### PL-REACT-011 — Eventhandler und Callback-Propeller

- Name Handler in einer Komponente `handleX` (`handleSubmit`) und Requisiten, die sie `onX` (`onSubmit`) empfangen.
- Definieren Sie einen Handler-Inline nur, wenn es sich um einen Ein-Zeilen-Weiterleitungsruf handelt. Längere Handler bekommen einen Namen, so dass der Bauteilkörper linear bleibt.
- Übergeben Sie Rückrufe als Requisite nur an Kinder, die sie brauchen... Wickle nicht jeden Handler standardmäßig in `useCallback`; benutze ihn, wo ein Memoized-Kind von der Referenzstabilität abhängt.

### PL-REACT-012 — Das Styling bleibt dem Markup nahe

- Dienstprogrammklassen (Tailwind CSS) bleiben neben dem Element, das sie stilisieren, im Markup.
- Eine Klasse String wiederholt an drei oder mehr Orten wird eine benannte Komponente oder eine benannte Konstante, nicht eine Kopie.
- Bedingte Klassen lesbar halten: die Klassenliste einmal in einer benannten Konstante zu berechnen, wenn sie mehr als zwei Bedingungen hat.

### PL-REACT-013 — Folder Density and Feature Folders

- Group components, hooks, and their tests by feature (`features/sessions/`), not by file kind across the whole app, when a feature has more than one file.
- Shared primitives (buttons, inputs, layout) live in one `components/` or `ui/` folder.
- Ein Ordner enthält standardmäßig höchstens **10 handgepflegete Quelldateien** ([PL-TS-007](typescript.md)). Review thresholds, not hard limits: split along responsibilities, not into meaningless nested folders.
- A file with several components that share state is cohesive. Keep them together ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014 — Routing ist ein boundary

Routen Karte URLs zu Bildschirmen... Behalten Sie die Routendefinitionen an einem Ort.. Eine Route-Komponente holt oder empfängt ihre Daten an der Grenze und führt einfache Requisiten in Präsentationskomponenten hinab. Präsentationskomponenten lesen die URL nicht selbst.
