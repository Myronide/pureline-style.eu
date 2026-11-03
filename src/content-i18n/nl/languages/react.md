# Codestijl reacteren

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules), het [JavaScript profiel](javascript.md) en het [TypeScript profiel](typescript.md) toe samen met dit profiel. Het React profiel richt zich op **React 19 met TypeScript in strikte modus**, gebundeld met Vite, en gerouteerd met reactierouter. Componenten zijn functies. Pureline leest een component als een kleine pijpleiding: props in, guards, derived values, markup out.

## React Profile

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001. Componenten zijn genoemd functies

- Een component is een functie in `PascalCase`, die wordt aangegeven met `function` of een `const` pijlfunctie, en wordt geëxporteerd met naam.
- Eén onderdeel is één verantwoordelijkheid. Een subcomponent uitpakken als een blok markup zijn eigen staat, zijn eigen gegevens of zijn eigen naam in het hoofd van de lezer heeft.
- Definieer geen componenten binnen andere componenten. Een onderdeel dat tijdens render wordt gemaakt wordt op elke render gemonteerd en verliest zijn status.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002. Bewakersclausules voor de hoofdaantekening

Laadt, fout en leegt de toestand eerst en keert vroeg terug. Het succesvolle pad blijft op de basis inspringen.

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

Vermijd nested ternaren in JSX. Bereken de tak in een genoemde constante of geef het terug van een bewaker. Een enkele ternary voor een eenvoudige tweeweg keuze binnen JSX is toegestaan.

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

### PL-REACT-003. Haakjes zijn onvoorwaardelijke en topniveau

- Oproephaken op het bovenste niveau van een onderdeel of aangepaste haak, in dezelfde volgorde op elke render. Nooit in een toestand, loop, of nested functie.
- Een aangepaste haak wordt `useX` genoemd, leeft in een `hooks/`-map wanneer deze wordt gedeeld, en inkapselt één probleem: Eén abonnement, één stuk staat, één databron.
- Een aangepaste haak geeft een stabiel, getypt resultaat terug. Document met een korte opmerking alleen wat de beller niet kan afleiden uit de naam en het type.

### PL-REACT-004. Afgeleide waarden worden berekend, niet opgeslagen

Als een waarde kan worden berekend uit rekwisieten of toestand, bereken deze tijdens rendering. Kopieer geen rekwisieten naar status en houd geen twee statusvariabelen die altijd moeten overeenkomen.

Gebruik `useMemo` alleen als een gemeten kosten het rechtvaardigen, zoals een dure berekening of een referentiewaarde die een gememorandeerd kind afhankelijk is van. Niet elke waarde in `useMemo` inpakken standaard.

### PL-REACT-005. Effecten Synchroniseren met externe systemen

`useEffect` is voor het synchroniseren met iets buiten React: een DOM API, een timer, een abonnement, een netwerkverbinding. Het is niet voor:

- afgeleid van rekwisieten (bereken het in plaats daarvan, zie PL-REACT-004);
- reageren op een gebruikersgebeurtenissen (zet de logica in de event-afhandeling);
- initialisatie van de aanvraag staat dat een ouder kan bezitten.

Elk effect dat zich abonneert of begint werk geeft een opruimfunctie die onaangenaam dat werk. Voor externe opslag, verkies `useSyncExternalStore` boven een effect dat waardes kopieert in staat.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006. Voordelen zijn expliciet getypt

- Geef de rekwisieten met een `interface` (of een `type` voor vakbonden) direct boven het onderdeel. Zeg maar `<Component>Props`.
- Gebruik `any` niet voor props, status of context. Onder `strict`-modus is `unknown` plus vernauwing de standaard voor waarden waarvan de vorm nog niet bekend is ([PL-TS-001](typescript.md)).
- Design rekwisieten in de parameterlijst als er weinig van zijn. Neem met veel rekwisieten één `props` parameter en desstructureer in de eerste regels van het lichaam.
- Gebruik union types voor varianten die veranderen wat het onderdeel rendert (`status: "idle" | "loading" | "done"`) in plaats van een set van optionele booleanen.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007. Context Carries Cross-Cutting Values Only

Gebruik context voor waarden die veel componenten nodig hebben en die zelden veranderen: de huidige gebruiker of eigenaar, thema, locale, een service client. Gebruik geen context om gewone gegevens door twee of drie niveaus te laten gaan; passeer in plaats daarvan de props, waardoor de datastroom zichtbaar blijft.

Wanneer een context nodig is, ontmasker het door een aangepaste haak die een duidelijke fout gooit wanneer de provider ontbreekt. Bellers zien dan nooit `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008. Gegevens laden heeft een eigenaar

- Laad routegegevens via de router (laders in reaction-router) waar de app deze gebruikt, zodat het laden en verwerken van fouten live met de route.
- Buiten de router, gebruik een databibliotheek of een aangepaste haak die annulering, stale reacties, en fout staat behandelt. Schrijf geen blote `fetch`-oproepen zonder een abort signaal.
- Hou de resultaten op één plek. Componenten lezen het resultaat; ze herhalen niet elk het verzoek.

### PL-REACT-009. Sleutels Identificeer items, geen posities

- Gebruik een stabiele identificatiecode uit de gegevens als de `key` van lijstposten.
- Gebruik de array index niet als de sleutel voor lijsten die kunnen worden geherordend, gefilterd of gewijzigd in lengte. Indexsleutels zijn alleen aanvaardbaar voor statische lijsten die nooit veranderen.

### PL-REACT-010. De huurder is puur

Rendering is een waardering van rekwisieten en staat en niets anders. Mutate props, module-niveau variabelen of DOM-knooppunten tijdens render niet tijdens het renderen, en start geen netwerkverzoeken of abonnementen daar. De app draait onder `StrictMode`, die tweemaal in ontwikkeling is om onzuivere renders bloot te stellen. Een component die zich anders gedraagt op de tweede render is een bug.

Bijwerkingen zijn te vinden in de hulpverleners en effecten ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011. Event Handlers en terugbellen

- Naamverwerkers binnen een component `handleX` (`handleSubmit`) en rekwisieten die ze `onX` (`onSubmit`) ontvangen.
- Een contactpersoon alleen inline ontcijferen als het een doorschakelgesprek is. Langere handlers krijgen een naam, zodat het onderdeel lichaam lineair blijft.
- Pass callbacks als rekwisieten alleen voor kinderen die ze nodig hebben. Niet elke handler in `useCallback` standaard inpakken; gebruik het wanneer een memoired kind afhankelijk is van de referentiestabiliteit.

### PL-REACT-012. Styling blijft dicht bij de markering

- Utility classes (Tailwind CSS) blijven in de markup naast het element dat ze stylen.
- Een klasse string die op drie of meer plaatsen wordt herhaald, wordt een benoemd onderdeel of een genoemde constante, geen kopie.
- Voorwaardelijke klassen leesbaar houden: Bereken de klasselijst eenmaal in een genoemde constante als het meer dan twee voorwaarden heeft.

### PL-REACT-013. Map Density en functiemappen

- Groepscomponenten, haken en hun tests door functie (`features/sessions/`), niet door bestandstype over de hele app, wanneer een functie meer dan één bestand heeft.
- Gedeelde primitieven (knoppen, ingangen, lay-out) leven in één `components/` of `ui/` map.
- Een map bevat hooguit **10 hand-onderhoud bronbestanden** standaard ([PL-TS-007](typescript.md)). Herzieningsdrempels, geen harde limieten:ee split langs verantwoordelijkheden, niet in betekenisloze nested mappen.
- Een bestand met verschillende componenten die de status delen is samenhangend. Hou ze bij elkaar ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014. Routing is een grens

Routes kaart URL's naar schermen. Houd routedefinities op één plaats. Een routecomponent haalt of ontvangt zijn gegevens aan de grens en geeft duidelijke rekwisieten door naar presentatiecomponenten. De URL zelf wordt niet door de presentatiecomponenten gelezen.
