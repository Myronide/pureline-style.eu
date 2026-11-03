# React-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules), het [JavaScript-profiel](javascript.md) en het [TypeScript-profiel](typescript.md) samen met dit profiel toe. Het React-profiel richt zich op **React 19 met TypeScript in strikte modus**, gebundeld met Vite en met routing via react-router. Componenten zijn functies. Pureline leest een component als een kleine pijplijn: props erin, guards, afgeleide waarden, markup eruit.

## React-profiel {#react-profile}

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Componenten zijn benoemde functies {#pl-react-001--components-are-named-functions}

- Een component is een benoemde functie in `PascalCase`, gedeclareerd met `function` of een `const`-arrow function, en op naam geëxporteerd.
- Eén component is één verantwoordelijkheid. Extraheer een subcomponent wanneer een blok markup een eigen toestand, eigen data of een eigen naam in het hoofd van de lezer heeft.
- Definieer geen componenten binnen andere componenten. Een component die tijdens het renderen wordt aangemaakt, wordt bij elke render opnieuw gemount en verliest zijn toestand.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Guard clauses vóór de hoofdmarkup {#pl-react-002--guard-clauses-before-the-main-markup}

Behandel laad-, fout- en lege toestanden eerst en keer vroeg terug. Het succespad blijft op het basisinspringniveau.

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

Vermijd geneste ternaire expressies in JSX. Bereken de tak in een benoemde constante of geef hem terug vanuit een guard. Eén enkele ternaire expressie voor een eenvoudige keuze uit twee in JSX is toegestaan.

### PL-REACT-003 — Hooks zijn onvoorwaardelijk en staan op het hoogste niveau {#pl-react-003--hooks-are-unconditional-and-top-level}

- Roep hooks aan op het hoogste niveau van een component of custom hook, bij elke render in dezelfde volgorde. Nooit binnen een voorwaarde, lus of geneste functie.
- Een custom hook heet `useX`, staat in een map `hooks/` wanneer hij gedeeld wordt en kapselt één aandachtsgebied in: één abonnement, één stuk toestand, één databron.
- Een custom hook geeft een stabiel, getypeerd resultaat terug. Documenteer met een korte opmerking alleen wat de aanroeper niet uit de naam en het type kan afleiden.

### PL-REACT-004 — Afgeleide waarden worden berekend, niet opgeslagen {#pl-react-004--derived-values-are-computed-not-stored}

Als een waarde uit props of toestand kan worden berekend, bereken hem dan tijdens het renderen. Kopieer props niet naar toestand en houd geen twee toestandsvariabelen bij die altijd met elkaar moeten overeenkomen.

Gebruik `useMemo` alleen waar gemeten kosten dat rechtvaardigen, zoals een dure berekening of een referentieel stabiele waarde waar een gememoïseerd kind van afhangt. Verpak niet standaard elke waarde in `useMemo`.

### PL-REACT-005 — Effecten synchroniseren met externe systemen {#pl-react-005--effects-synchronise-with-external-systems}

`useEffect` is bedoeld voor synchronisatie met iets buiten React: een DOM-API, een timer, een abonnement, een netwerkverbinding. Het is er niet voor om:

- toestand af te leiden uit props (bereken die in plaats daarvan, zie PL-REACT-004);
- te reageren op een gebruikersgebeurtenis (zet de logica in de event handler);
- applicatietoestand te initialiseren die een parent kan beheren.

Elk effect dat zich abonneert of werk start, geeft een cleanupfunctie terug die precies dat werk ongedaan maakt. Geef voor externe stores de voorkeur aan `useSyncExternalStore` boven een effect dat storewaarden naar toestand kopieert.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Props worden expliciet getypeerd {#pl-react-006--props-are-typed-explicitly}

- Declareer props met een `interface` (of een `type` voor unions) direct boven de component. Noem die `<Component>Props`.
- Gebruik geen `any` voor props, toestand of context. In `strict`-modus is `unknown` met narrowing de standaard voor waarden waarvan de vorm nog niet bekend is ([PL-TS-001](typescript.md)).
- Destructureer props in de parameterlijst wanneer het er weinig zijn. Neem bij veel props één parameter `props` en destructureer in de eerste regels van de body.
- Gebruik uniontypen voor varianten die veranderen wat de component rendert (`status: "idle" | "loading" | "done"`) in plaats van een reeks optionele booleans.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — Context draagt alleen waarden die meerdere onderdelen raken {#pl-react-007--context-carries-cross-cutting-values-only}

Gebruik context voor waarden die veel componenten nodig hebben en die zelden veranderen: de huidige gebruiker of eigenaar, het thema, de locale, een serviceclient. Gebruik context niet om gewone data door twee of drie niveaus te geven; geef in plaats daarvan props door, zodat de datastroom zichtbaar blijft.

Wanneer een context nodig is, maak hem dan beschikbaar via een custom hook die een duidelijke fout gooit wanneer de provider ontbreekt. Aanroepers zien dan nooit `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — Het laden van data heeft een eigenaar {#pl-react-008--data-loading-has-an-owner}

- Laad routedata via de router (loaders in react-router) waar de app die gebruikt, zodat laden en foutafhandeling bij de route horen.
- Gebruik buiten de router een databibliotheek of een custom hook die annulering, verouderde antwoorden en foutstatus afhandelt. Schrijf geen kale `fetch`-aanroepen in effecten zonder abort-signaal.
- Houd fetchresultaten op één plek. Componenten lezen het resultaat; ze herhalen niet elk het verzoek.

### PL-REACT-009 — Keys identificeren items, geen posities {#pl-react-009--keys-identify-items-not-positions}

- Gebruik een stabiele identifier uit de data als `key` van lijstitems.
- Gebruik de array-index niet als key voor lijsten die kunnen worden herordend, gefilterd of in lengte kunnen veranderen. Indexkeys zijn alleen acceptabel voor statische lijsten die nooit veranderen.

### PL-REACT-010 — Render is puur {#pl-react-010--render-is-pure}

Renderen berekent markup uit props en toestand en niets anders. Muteer tijdens het renderen geen props, variabelen op modulaire niveau of DOM-knooppunten, en start daar geen netwerkverzoeken of abonnementen. De app draait onder `StrictMode`, dat tijdens de ontwikkeling twee keer rendert om onzuivere renders bloot te leggen. Een component die bij de tweede render anders gedraagt, is een bug.

Neveneffecten horen in event handlers en effecten ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011 — Event handlers en callback-props {#pl-react-011--event-handlers-and-callback-props}

- Noem handlers binnen een component `handleX` (`handleSubmit`) en de props die ze ontvangen `onX` (`onSubmit`).
- Definieer een handler alleen inline wanneer het een doorstuuraanroep van één regel is. Langere handlers krijgen een naam, zodat de body van de component lineair blijft.
- Geef callbacks alleen als props door aan kinderen die ze nodig hebben. Verpak niet standaard elke handler in `useCallback`; gebruik het waar een gememoïseerd kind afhangt van referentiële stabiliteit.

### PL-REACT-012 — Stijlen blijven dicht bij de markup {#pl-react-012--styling-stays-close-to-the-markup}

- Utility-klassen (Tailwind CSS) blijven in de markup naast het element dat ze stylen.
- Een klassenreeks die op drie of meer plekken wordt herhaald, wordt een benoemde component of een benoemde constante, geen kopie.
- Houd voorwaardelijke klassen leesbaar: bereken de klassenlijst één keer in een benoemde constante wanneer er meer dan twee voorwaarden zijn.

### PL-REACT-013 — Mapdichtheid en featuremappen {#pl-react-013--folder-density-and-feature-folders}

- Groepeer componenten, hooks en hun tests per feature (`features/sessions/`), niet per bestandssoort over de hele app, wanneer een feature meer dan één bestand heeft.
- Gedeelde primitieven (knoppen, invoervelden, layout) staan in één map `components/` of `ui/`.
- Een map bevat standaard maximaal **10 handmatig onderhouden bronbestanden** ([PL-TS-007](typescript.md)). Dit zijn drempels voor review, geen harde limieten: splits op verantwoordelijkheden, niet in zinloze geneste mappen.
- Een bestand met meerdere componenten die toestand delen, is samenhangend. Houd ze bij elkaar ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014 — Routing is een grens {#pl-react-014--routing-is-a-boundary}

Routes koppelen URL's aan schermen. Houd routedefinities op één plek. Een routecomponent haalt zijn data aan de grens op of ontvangt ze daar, en geeft gewone props door aan presentationele componenten. Presentationele componenten lezen de URL niet zelf.
