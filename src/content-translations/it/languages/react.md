# Stile del codice React

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules), il [profilo JavaScript](javascript.md) e il [profilo TypeScript](typescript.md) insieme a questo profilo. Il profilo React ha come obiettivo **React 19 con TypeScript in modalità strict**, con bundling tramite Vite e routing con react-router. I componenti sono funzioni. Pureline legge un componente come una piccola pipeline: props in ingresso, guardie, valori derivati, markup in uscita.

## Profilo React {#react-profile}

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — I componenti sono funzioni con nome {#pl-react-001--components-are-named-functions}

- Un componente è una funzione con nome in `PascalCase`, dichiarata con `function` o come arrow function `const`, ed esportata per nome.
- Un componente è una responsabilità. Estrai un sottocomponente quando un blocco di markup ha un proprio stato, propri dati o un proprio nome nella mente di chi legge.
- Non definire componenti dentro altri componenti. Un componente creato durante il render viene rimontato a ogni render e perde il proprio stato.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Guard clause prima del markup principale {#pl-react-002--guard-clauses-before-the-main-markup}

Gestisci per primi gli stati di caricamento, errore e vuoto e ritorna subito. Il percorso di successo resta all'indentazione di base.

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

Evita i ternari annidati nel JSX. Calcola il ramo in una costante con nome oppure ritornalo da una guardia. È ammesso un singolo ternario per una semplice scelta tra due alternative dentro il JSX.

### PL-REACT-003 — Gli hook sono incondizionati e di primo livello {#pl-react-003--hooks-are-unconditional-and-top-level}

- Chiama gli hook al primo livello di un componente o di un hook personalizzato, nello stesso ordine a ogni render. Mai dentro una condizione, un ciclo o una funzione annidata.
- Un hook personalizzato si chiama `useX`, sta in una cartella `hooks/` quando è condiviso e incapsula una sola questione: una sottoscrizione, un pezzo di stato, una fonte di dati.
- Un hook personalizzato restituisce un risultato stabile e tipizzato. Documenta con un breve commento solo ciò che il chiamante non può dedurre dal nome e dal tipo.

### PL-REACT-004 — I valori derivati si calcolano, non si memorizzano {#pl-react-004--derived-values-are-computed-not-stored}

Se un valore si può calcolare da props o stato, calcolalo durante il render. Non copiare le props nello stato e non tenere due variabili di stato che devono sempre coincidere.

Usa `useMemo` solo dove un costo misurato lo giustifica, ad esempio un calcolo oneroso o un valore referenzialmente stabile da cui dipende un figlio memoizzato. Non avvolgere ogni valore in `useMemo` per impostazione predefinita.

### PL-REACT-005 — Gli effetti si sincronizzano con sistemi esterni {#pl-react-005--effects-synchronise-with-external-systems}

`useEffect` serve a sincronizzarsi con qualcosa di esterno a React: un'API del DOM, un timer, una sottoscrizione, una connessione di rete. Non serve per:

- derivare lo stato dalle props (calcolalo invece, vedi PL-REACT-004);
- rispondere a un evento dell'utente (metti la logica nel gestore dell'evento);
- inizializzare uno stato dell'applicazione che un genitore può possedere.

Ogni effetto che si sottoscrive o avvia del lavoro ritorna una funzione di cleanup che annulla esattamente quel lavoro. Per gli store esterni, preferisci `useSyncExternalStore` a un effetto che copia i valori dello store nello stato.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Le props sono tipizzate esplicitamente {#pl-react-006--props-are-typed-explicitly}

- Dichiara le props con un'`interface` (o un `type` per le unioni) subito sopra il componente. Chiamala `<Component>Props`.
- Non usare `any` per props, stato o contesto. In modalità `strict`, `unknown` più il narrowing è la scelta predefinita per i valori la cui forma non è ancora nota ([PL-TS-001](typescript.md)).
- Destruttura le props nell'elenco dei parametri quando sono poche. Con molte props, prendi un solo parametro `props` e destrutturalo nelle prime righe del corpo.
- Usa i tipi unione per le varianti che cambiano ciò che il componente rende (`status: "idle" | "loading" | "done"`), invece di un insieme di booleani facoltativi.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — Il contesto porta solo valori trasversali {#pl-react-007--context-carries-cross-cutting-values-only}

Usa il contesto per i valori di cui hanno bisogno molti componenti e che cambiano di rado: l'utente o il proprietario corrente, il tema, la lingua, un client di servizio. Non usare il contesto per passare dati ordinari attraverso due o tre livelli; passa invece le props, che mantengono visibile il flusso dei dati.

Quando serve un contesto, esponilo tramite un hook personalizzato che lancia un errore chiaro se manca il provider. In questo modo i chiamanti non vedono mai `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — Il caricamento dei dati ha un proprietario {#pl-react-008--data-loading-has-an-owner}

- Carica i dati delle route tramite il router (i loader di react-router) dove l'app lo usa, così caricamento e gestione degli errori restano insieme alla route.
- Fuori dal router, usa una libreria di dati o un hook personalizzato che gestisca cancellazione, risposte obsolete e stato di errore. Non scrivere chiamate `fetch` nude negli effetti senza un segnale di abort.
- Tieni i risultati delle fetch in un solo posto. I componenti leggono il risultato; non ripetono ciascuno la richiesta.

### PL-REACT-009 — Le chiavi identificano gli elementi, non le posizioni {#pl-react-009--keys-identify-items-not-positions}

- Usa come `key` degli elementi di una lista un identificatore stabile preso dai dati.
- Non usare l'indice dell'array come chiave per le liste che possono essere riordinate, filtrate o cambiare lunghezza. Le chiavi basate sull'indice sono accettabili solo per liste statiche che non cambiano mai.

### PL-REACT-010 — Il render è puro {#pl-react-010--render-is-pure}

Il render calcola il markup da props e stato e nient'altro. Non mutare props, variabili a livello di modulo o nodi del DOM durante il render, e non avviare lì richieste di rete o sottoscrizioni. L'app gira sotto `StrictMode`, che in sviluppo esegue il render due volte per far emergere i render impuri. Un componente che si comporta in modo diverso al secondo render è un bug.

Gli effetti collaterali appartengono ai gestori di eventi e agli effetti ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011 — Gestori di eventi e props di callback {#pl-react-011--event-handlers-and-callback-props}

- Chiama i gestori dentro un componente `handleX` (`handleSubmit`) e le props che li ricevono `onX` (`onSubmit`).
- Definisci un gestore in linea solo quando è una chiamata di inoltro di una riga. I gestori più lunghi ricevono un nome, così il corpo del componente resta lineare.
- Passa le callback come props solo ai figli che ne hanno bisogno. Non avvolgere ogni gestore in `useCallback` per impostazione predefinita; usalo dove un figlio memoizzato dipende dalla stabilità referenziale.

### PL-REACT-012 — Lo stile resta vicino al markup {#pl-react-012--styling-stays-close-to-the-markup}

- Le classi di utilità (Tailwind CSS) restano nel markup, accanto all'elemento che stilizzano.
- Una stringa di classi ripetuta in tre o più punti diventa un componente con nome o una costante con nome, non una copia.
- Mantieni leggibili le classi condizionali: calcola l'elenco delle classi una sola volta in una costante con nome quando ha più di due condizioni.

### PL-REACT-013 — Densità delle cartelle e cartelle per funzionalità {#pl-react-013--folder-density-and-feature-folders}

- Raggruppa componenti, hook e relativi test per funzionalità (`features/sessions/`), non per tipo di file in tutta l'app, quando una funzionalità ha più di un file.
- Le primitive condivise (pulsanti, input, layout) stanno in un'unica cartella `components/` o `ui/`.
- Una cartella contiene al massimo **10 file sorgente mantenuti a mano** per impostazione predefinita ([PL-TS-007](typescript.md)). Sono soglie di revisione, non limiti rigidi: dividi in base alle responsabilità, non in cartelle annidate prive di senso.
- Un file con più componenti che condividono lo stato è coeso. Tienili insieme ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014 — Il routing è un confine {#pl-react-014--routing-is-a-boundary}

Le route associano gli URL alle schermate. Tieni le definizioni delle route in un solo posto. Un componente di route recupera o riceve i propri dati al confine e passa props semplici ai componenti di presentazione. I componenti di presentazione non leggono essi stessi l'URL.
