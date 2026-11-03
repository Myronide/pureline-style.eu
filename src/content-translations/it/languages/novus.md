# Stile del codice Novus

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Novus è un linguaggio self-hosting che compila in C portabile, con valori tipizzati dinamicamente, tipizzazione statica facoltativa, componenti `.nvh` renderizzati lato server e contenuto Markdown `.nvmd` tramite [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown). Il profilo segue gli esempi di Novus, la libreria standard e le regole che il language server di Novus controlla quando le diagnostiche dello stile Pureline sono attive (`novus.pureline.enabled`). [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

Gli ID di regola `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002` e `PL-NAME-001` sono quelli che il language server di Novus già segnala con la sorgente `pureline`. Le regole specifiche di Novus qui sotto usano il prefisso `PL-NV-*`.

## Profilo Novus {#novus-profile}

### PL-NV-001 — Nomi e visibilità {#pl-nv-001--naming-and-visibility}

- Classi, enum e componenti: `PascalCase`.
- Metodi, campi, variabili locali e parametri: `lowerCamelCase`.
- Nomi dei pacchetti (cartelle): brevi, in minuscolo, senza separatori.
- Costanti: `private final SCREAMING_SNAKE_CASE` a livello di file.
- Mantieni i membri privati, a meno che un altro pacchetto o file non li usi. Esponi i campi con `: get` o `: get, set` solo quando i chiamanti ne hanno bisogno.
- Nomi brevi sono ammessi per i contatori di ciclo (`i`, `j`, `k`). Gli altri nomi di una sola lettera e i segnaposto (`tmp`, `obj`, `thing`, `data2`) vengono segnalati da `PL-NAME-001`.

```nv
package geo

private final DEFAULT_SCALE = 1

define class Circle {
    private final double radius: get

    construct(double radius) {
        this.radius = radius
    }
}
```

### PL-NV-002 — Guard clause e flusso lineare {#pl-nv-002--guard-clauses-and-linear-flow}

Valida per prima cosa, ritorna in anticipo e mantieni il percorso di successo all'indentazione di base.

```nv
method openSession(Request request): Session {
    if (!request.isValid()) {
        return null
    }

    var user = request.user()
    if (user == null) {
        return null
    }

    return Session.open(user)
}
```

Evita `else` dopo un ramo che già esegue return, break o continue (`PL-CF-002`). Quando un `else` è davvero la forma più chiara, contrassegna la riga con un'esenzione motivata:

```nv
if (mode == Mode.FAST) {
    return fastPath()
} else { // pureline:allow-else both branches produce the result of the same call
    return slowPath()
}
```

### PL-NV-003 — Dichiarazioni: `final`, `var` e tipi espliciti {#pl-nv-003--declarations-final-var-and-explicit-types}

- Usa `final` per i valori che non cambiano mai; usa `var` per le variabili locali il cui tipo è ovvio dall'inizializzatore.
- Scrivi un tipo dichiarato dove chi legge dovrebbe altrimenti indovinare, e ai confini delle API (campi, parametri, tipi di ritorno).
- Ricorda che un tipo esplicito converte il valore: `integer x = 2.9` memorizza `2`. Rendi visibili queste conversioni invece di affidarti a esse per caso.
- Novus non ha assegnazioni composte. Scrivi `count = count + 1`, non `count += 1`, e tieni l'istruzione su una sola riga.

```nv
final MAX_RETRIES = 3

method retry(string url): integer {
    var attempts = 0
    while (attempts < MAX_RETRIES) {
        attempts = attempts + 1
    }
    return attempts
}
```

### PL-NV-004 — Costruzione e object literal {#pl-nv-004--construction-and-object-literals}

- Usa gli object literal (`Person{name="Tom"}`) per dati semplici senza comportamento.
- Usa `construct()` quando l'oggetto deve stabilire invarianti, derivare campi o validare argomenti.
- Non nascondere lavoro significativo negli inizializzatori dei campi; mantieni esplicita la costruzione in `construct()`.
- Una catena di ereditarietà `based` dovrebbe descrivere una reale relazione is-a. Preferisci un'`interface` quando si condivide solo il comportamento.

### PL-NV-005 — Firme dei metodi {#pl-nv-005--method-signatures}

- Dichiara i tipi dei parametri e di ritorno quando la firma fa parte di un'API, di un confine di modulo o di un componente `.nvh`.
- Usa `method name(args): type { }` per i metodi ordinari; mantieni gli elenchi di parametri abbastanza brevi da poterli scorrere.
- Gli overload dei metodi per numero o tipo di parametri sono ammessi quando il significato è identico. Non usare gli overload per nascondere comportamenti diversi dietro un solo nome.

### PL-NV-006 — La dimensione della funzione è un segnale di revisione {#pl-nv-006--function-size-is-a-review-signal}

Il language server rivede un metodo a 30 righe e lo segnala oltre le 50 righe (`PL-FN-001`). Sono soglie di revisione. Un metodo coeso che fa una sola cosa in sequenza può restare più lungo; dividilo quando mescola responsabilità come parsing, validazione e I/O.

### PL-NV-007 — Pacchetti, import e densità delle cartelle {#pl-nv-007--packages-imports-and-folder-density}

- Una cartella è un pacchetto. Importa l'unità più ristretta che serve: `import geo/circle` o `import @helpers` invece di importare un intero pacchetto quando basta un file.
- Mantieni al massimo **10 file `.nv` / `.nvh`** per cartella per impostazione predefinita (`PL-STRUCT-002`). Dividi lungo i confini di responsabilità, non in cartelle annidate prive di senso.
- Rivedi un file a **200 righe** (`PL-STRUCT-001`). È una soglia di revisione, non un limite rigido: mantieni una responsabilità per file e lascia insieme la logica coesa.

### PL-NV-008 — La concorrenza ha una proprietà visibile {#pl-nv-008--concurrency-has-visible-ownership}

- Rendi visibile la concorrenza nel punto della chiamata: `async` / `await`, `thread`, `virtual` e `sync` dichiarano cosa viene eseguito e dove.
- Tieni traccia di ogni task che conta. Non avviare lavoro fire-and-forget per risultati da cui il programma dipenderà in seguito.
- Proteggi esplicitamente lo stato mutabile condiviso con `sync`, invece di affidarti all'ordine delle chiamate.
- Segui la stessa disciplina di [PL-RS-013](rust.md#pl-rs-013--async-tasks-have-ownership-and-shutdown) per arresto e cancellazione.

### PL-NV-009 — L'ordine di valutazione è documentato, non presunto {#pl-nv-009--evaluation-order-is-documented-not-assumed}

Novus valuta gli operandi da sinistra a destra e documenta le eccezioni. Non scrivere codice il cui risultato dipende da un ordine insolito. Tieni gli effetti collaterali in istruzioni separate ed evita di combinare in una sola espressione la lettura di una variabile globale o di un campo con una chiamata successiva che lo modifica.

La catena `..` serve a costruire un oggetto o un array in un'unica sequenza lineare (`var names = []..append("Ada")..append("Grace")`). Usala quando ogni passaggio è una chiamata o un'assegnazione di membro sullo stesso destinatario. Spezza una catena in passaggi con nome quando un passaggio richiede un commento o un ramo.

### PL-NV-010 — Blocchi C e confini di piattaforma {#pl-nv-010--c-blocks-and-platform-boundaries}

Un blocco `c { ... }` è un confine nativo. Mantienilo piccolo, isolalo in un file dedicato e spiega con un commento che cosa il codice C presuppone su tipi, lifetime e piattaforma. Esponi la funzione nativa tramite un metodo Novus con una firma tipizzata, in modo che il resto del codice non veda mai i dettagli grezzi di C.

### PL-NV-011 — I componenti `.nvh` tengono separati markup e logica {#pl-nv-011--nvh-components-keep-markup-and-logic-apart}

In un componente `.nvh`:

- Dichiara lo stato reattivo con `ref` dentro `<?nv ... ?>` all'inizio del componente.
- Tieni gestori e calcoli in blocchi Novus; mantieni l'HTML concentrato su struttura e presentazione.
- Calcola i valori derivati in un solo punto, invece di ripetere l'espressione in più punti del markup.
- Tratta ogni componente come una sola responsabilità, come per una classe (`PL-STRUCT-001`).

### PL-NV-012 — Commenti e diagnostiche {#pl-nv-012--comments-and-diagnostics}

- I commenti spiegano il perché, non il cosa: il motivo di un workaround, una particolarità della piattaforma o un'invariante non ovvia ([PL-DOC-001](../core/comments.md)).
- Le diagnostiche di Pureline sono opt-in nell'editor (`novus.pureline.enabled`). Abilitale nei progetti condivisi, così gli stessi ID di regola compaiono in ogni editor e nella CI.
- Ogni esenzione `pureline:allow-else` richiede un motivo sulla stessa riga. Un'esenzione senza motivo è un rilievo di revisione.

### PL-NV-013 — Contenuto Markdown (`.nvmd`) {#pl-nv-013--markdown-content-nvmd}

Un file `.nvmd` è Markdown con dentro Novus, come `.mdx` è Markdown con JSX. Il generatore di [nvh-markdown](https://github.com/ezTxmMC/nvh-markdown) trasforma `Page.nvmd` in `Page.nvh` prima che giri il compilatore. Applica le regole precedenti al blocco di intestazione e agli eventuali moduli `.nv` che importa; il corpo Markdown segue queste regole:

- Il corpo porta il contenuto. Il blocco di intestazione (`<?nv ... ?>`) contiene solo ciò che serve alla pagina: import, props e pochi metodi. Sposta in un modulo `.nv`, e importalo, la logica più lunga di poche righe.
- Le chiavi del frontmatter sono le props della pagina. Mantienile brevi e piatte, e usa `{title}` invece di ripetere il valore nel testo.
- Limita ogni `{expr}` a un solo valore o a una sola chiamata. Calcola tutto ciò che è più lungo nell'intestazione o in un modulo, così il corpo si legge dall'alto in basso come prosa.
- Tieni i blocchi `{#if}` e `{#for}` a una profondità massima di due livelli. Quando un blocco ripete del markup, usa invece un componente (`<Callout>`, `<Toc>`).
- Un titolo il cui testo è dinamico riceve un id esplicito (`# {title} {#intro}`), così gli ancoraggi e `markdown.headings` restano stabili.
- I file `.nvh` generati sono output di build. Aggiungili a `.gitignore`, non modificarli mai e correggi invece il sorgente `.nvmd`. Mantieni intatto il contrassegno `<?nv /* nvmd-generated */`.
- Un blocco HTML con un gestore (`<button @click="hit">`) è nvh dentro Markdown. Mantieni brevi questi blocchi e separali dal testo circostante con righe vuote.
