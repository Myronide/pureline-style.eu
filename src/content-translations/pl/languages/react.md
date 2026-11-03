# React Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules), [profil JavaScript](javascript.md) i [profil TypeScript](typescript.md) razem z tym profilem. Profil React dotyczy **Reacta 19 z TypeScriptem w trybie strict**, budowanego przez Vite i obsługiwanego routingiem react-router. Komponenty są funkcjami. Pureline czyta komponent jak mały potok: propsy na wejściu, guardy, wartości pochodne, markup na wyjściu.

## Profil React {#react-profile}

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Komponenty są nazwanymi funkcjami {#pl-react-001--components-are-named-functions}

- Komponent to nazwana funkcja w `PascalCase`, zadeklarowana przez `function` lub funkcję strzałkową `const` i eksportowana po nazwie.
- Jeden komponent to jedna odpowiedzialność. Wyodrębnij podkomponent, gdy blok markupu ma własny stan, własne dane albo własną nazwę w głowie czytelnika.
- Nie definiuj komponentów wewnątrz innych komponentów. Komponent tworzony podczas renderowania jest montowany od nowa przy każdym renderze i traci swój stan.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Guard clauses przed głównym markupem {#pl-react-002--guard-clauses-before-the-main-markup}

Najpierw obsłuż stany ładowania, błędu i pusty, i wróć wcześnie. Główna ścieżka pozostaje na bazowym poziomie wcięcia.

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

Unikaj zagnieżdżonych operatorów trójargumentowych w JSX. Oblicz gałąź do nazwanej stałej lub zwróć ją z guarda. Pojedynczy operator trójargumentowy do prostego wyboru z dwóch opcji wewnątrz JSX jest dozwolony.

### PL-REACT-003 — Hooki są bezwarunkowe i na najwyższym poziomie {#pl-react-003--hooks-are-unconditional-and-top-level}

- Wywołuj hooki na najwyższym poziomie komponentu lub własnego hooka, w tej samej kolejności przy każdym renderze. Nigdy wewnątrz warunku, pętli ani funkcji zagnieżdżonej.
- Własny hook nazywa się `useX`, a gdy jest współdzielony, znajduje się w folderze `hooks/` i hermetyzuje jedno zagadnienie: jedną subskrypcję, jedną część stanu, jedno źródło danych.
- Własny hook zwraca stabilny, typowany wynik. Krótkim komentarzem dokumentuj tylko to, czego wywołujący nie może wywnioskować z nazwy i typu.

### PL-REACT-004 — Wartości pochodne się oblicza, a nie przechowuje {#pl-react-004--derived-values-are-computed-not-stored}

Jeśli wartość można obliczyć z propsów lub stanu, oblicz ją podczas renderowania. Nie kopiuj propsów do stanu i nie trzymaj dwóch zmiennych stanu, które zawsze muszą być zgodne.

`useMemo` stosuj tylko tam, gdzie uzasadnia to zmierzony koszt, na przykład kosztowne obliczenie albo referencyjnie stabilna wartość, od której zależy zmemoizowane dziecko. Nie opakowuj domyślnie każdej wartości w `useMemo`.

### PL-REACT-005 — Efekty synchronizują się z systemami zewnętrznymi {#pl-react-005--effects-synchronise-with-external-systems}

`useEffect` służy do synchronizacji z czymś poza Reactem: API DOM, timerem, subskrypcją, połączeniem sieciowym. Nie służy do:

- wyprowadzania stanu z propsów (zamiast tego go oblicz, zobacz PL-REACT-004);
- reagowania na zdarzenie użytkownika (umieść logikę w handlerze zdarzenia);
- inicjalizacji stanu aplikacji, którego właścicielem może być rodzic.

Każdy efekt, który subskrybuje lub uruchamia pracę, zwraca funkcję czyszczącą, która cofa dokładnie tę pracę. Dla zewnętrznych magazynów preferuj `useSyncExternalStore` zamiast efektu kopiującego wartości magazynu do stanu.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Propsy są typowane jawnie {#pl-react-006--props-are-typed-explicitly}

- Deklaruj propsy za pomocą `interface` (lub `type` dla unii) bezpośrednio nad komponentem. Nazwij go `<Component>Props`.
- Nie używaj `any` dla propsów, stanu ani kontekstu. W trybie `strict` domyślnym wyborem dla wartości o jeszcze nieznanym kształcie jest `unknown` wraz ze zawężaniem typu ([PL-TS-001](typescript.md)).
- Gdy propsów jest niewiele, destrukturyzuj je na liście parametrów. Przy wielu propsach przyjmij jeden parametr `props` i destrukturyzuj w pierwszych liniach ciała.
- Dla wariantów zmieniających to, co komponent renderuje (`status: "idle" | "loading" | "done"`), używaj typów unii zamiast zestawu opcjonalnych wartości logicznych.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — Kontekst przenosi wyłącznie wartości przekrojowe {#pl-react-007--context-carries-cross-cutting-values-only}

Używaj kontekstu dla wartości, których potrzebuje wiele komponentów i które rzadko się zmieniają: bieżący użytkownik lub właściciel, motyw, ustawienia regionalne, klient usługi. Nie używaj kontekstu do przekazywania zwykłych danych przez dwa lub trzy poziomy; przekaż propsy, co utrzymuje widoczny przepływ danych.

Gdy kontekst jest potrzebny, udostępnij go przez własny hook, który zgłasza czytelny błąd, gdy brakuje providera. Wywołujący nigdy wtedy nie zobaczą `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — Ładowanie danych ma właściciela {#pl-react-008--data-loading-has-an-owner}

- Tam, gdzie aplikacja z tego korzysta, ładuj dane trasy przez router (loadery w react-router), aby ładowanie i obsługa błędów mieszkały razem z trasą.
- Poza routerem używaj biblioteki danych lub własnego hooka, który obsługuje anulowanie, nieaktualne odpowiedzi i stan błędu. Nie pisz gołych wywołań `fetch` w efektach bez sygnału przerwania.
- Wyniki pobierania trzymaj w jednym miejscu. Komponenty odczytują wynik; nie powtarzają każdy z osobna żądania.

### PL-REACT-009 — Klucze identyfikują elementy, a nie pozycje {#pl-react-009--keys-identify-items-not-positions}

- Jako `key` elementów listy używaj stabilnego identyfikatora z danych.
- Nie używaj indeksu tablicy jako klucza dla list, które mogą być zmieniane kolejnością, filtrowane lub zmieniać długość. Klucze oparte na indeksie są akceptowalne tylko dla list statycznych, które nigdy się nie zmieniają.

### PL-REACT-010 — Renderowanie jest czyste {#pl-react-010--render-is-pure}

Renderowanie oblicza markup z propsów i stanu, i z niczego więcej. Nie modyfikuj propsów, zmiennych na poziomie modułu ani węzłów DOM podczas renderowania i nie uruchamiaj tam żądań sieciowych ani subskrypcji. Aplikacja działa pod `StrictMode`, który w trybie deweloperskim renderuje dwa razy, aby wykryć nieczyste renderowanie. Komponent, który zachowuje się inaczej przy drugim renderze, jest błędem.

Efekty uboczne należą do handlerów zdarzeń i efektów ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011 — Handlery zdarzeń i propsy typu callback {#pl-react-011--event-handlers-and-callback-props}

- Handlery wewnątrz komponentu nazywaj `handleX` (`handleSubmit`), a propsy, które je otrzymują, `onX` (`onSubmit`).
- Handler definiuj w linii tylko wtedy, gdy jest jednoliniowym wywołaniem przekazującym. Dłuższe handlery dostają nazwę, aby ciało komponentu pozostało liniowe.
- Callbacki przekazuj jako propsy tylko dzieciom, które ich potrzebują. Nie opakowuj domyślnie każdego handlera w `useCallback`; używaj go tam, gdzie zmemoizowane dziecko zależy od stabilności referencyjnej.

### PL-REACT-012 — Stylowanie pozostaje blisko markupu {#pl-react-012--styling-stays-close-to-the-markup}

- Klasy użytkowe (Tailwind CSS) zostają w markupie obok elementu, który stylizują.
- Ciąg klas powtórzony w trzech lub więcej miejscach staje się nazwanym komponentem lub nazwaną stałą, a nie kopią.
- Warunkowe klasy utrzymuj czytelne: gdy jest więcej niż dwa warunki, oblicz listę klas raz w nazwanej stałej.

### PL-REACT-013 — Gęstość folderów i foldery funkcji {#pl-react-013--folder-density-and-feature-folders}

- Gdy funkcja ma więcej niż jeden plik, grupuj komponenty, hooki i ich testy według funkcji (`features/sessions/`), a nie według rodzaju pliku w całej aplikacji.
- Wspólne prymitywy (przyciski, pola, layout) mieszkają w jednym folderze `components/` lub `ui/`.
- Folder domyślnie zawiera co najwyżej **10 ręcznie utrzymywanych plików źródłowych** ([PL-TS-007](typescript.md)). To progi przeglądowe, a nie twarde limity: dziel według odpowiedzialności, a nie na bezsensowne zagnieżdżone foldery.
- Plik z kilkoma komponentami współdzielącymi stan jest spójny. Trzymaj je razem ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014 — Routing jest granicą {#pl-react-014--routing-is-a-boundary}

Trasy mapują adresy URL na ekrany. Definicje tras trzymaj w jednym miejscu. Komponent trasy pobiera lub otrzymuje swoje dane na granicy i przekazuje zwykłe propsy w dół do komponentów prezentacyjnych. Komponenty prezentacyjne same nie odczytują adresu URL.
