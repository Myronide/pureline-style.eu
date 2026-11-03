# Stile del codice Emvus

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Emvus {#emvus-profile}

Pureline Emvus segue il **progetto attuale del linguaggio Emvus**. È un profilo di stile per la sintassi `.ev` prevista, non l'affermazione che ogni funzionalità presentata sia già implementata da Ring 1. Mantieni Emvus distinto da Emerald.

### PL-EV-001 — Dichiarazioni di metodo native {#pl-ev-001--native-method-declarations}

Dichiara i metodi con `method` e, quando serve, con un tipo di ritorno in `method<Type>`. Le variabili di tipo generico si introducono con `where`, non aggiungendo al nome del metodo un altro elenco di parametri generici.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

Un metodo senza un tipo di ritorno esplicito restituisce `Void`.

### PL-EV-002 — Le parentesi vuote nelle dichiarazioni sono facoltative; quelle nelle chiamate no {#pl-ev-002--empty-declaration-parentheses-are-optional-call-parentheses-are-not}

Entrambe le dichiarazioni senza parametri sono conformi a Pureline:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Entrambe le grafie dichiarano metodi senza argomenti; la differenza è solo estetica, **non** distingue un overload. Scrivi sempre `refresh()` o `shutdown()` per eseguire il metodo; `object.refresh` non è una chiamata di metodo. I formatter dovrebbero preservare o configurare in modo coerente uno dei due stili di dichiarazione validi, senza segnalare l'altro come errore.

### PL-EV-003 — Parentesi graffe obbligatorie; punti e virgola facoltativi {#pl-ev-003--braces-required-semicolons-optional}

Usa blocchi espliciti `{ ... }` per `if`, cicli e controlli di flusso analoghi. Nell'Emvus idiomatico è preferibile omettere i punti e virgola facoltativi, ma non rifiutare il codice esistente valido terminato da punto e virgola.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Le guardie in linea senza parentesi graffe e i blocchi `else` superflui non sono Pureline. Mantieni non ambigue le righe di continuazione e le espressioni lunghe.

### PL-EV-004 — Nomi, import e visibilità {#pl-ev-004--naming-imports-and-visibility}

- Tipi: `PascalCase`; interfacce: prefisso `I` (`IStorage`, `IConnection`).
- Metodi, campi, proprietà, parametri e variabili locali: `camelCase`.
- Costanti: `UPPER_SNAKE_CASE`.
- Pacchetti: percorsi puntati in minuscolo.
- Nomi dei file sorgente: **camelCase**, ad esempio `sessionService.ev`, anche se la classe principale è `SessionService`.
- La visibilità predefinita è `public`; specifica `private` o `protected` quando serve.
- La risoluzione dei simboli non distingue maiuscole e minuscole, ma la grafia del sorgente viene preservata: usa in modo coerente la **grafia dichiarata** e non definire nomi che differiscono solo per le maiuscole.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Usa import e alias espliciti invece di affidarti a collisioni di nomi confuse.

### PL-EV-005 — I tipi dovrebbero comunicare l'intento {#pl-ev-005--types-should-communicate-intent}

Emvus è tipizzato staticamente per impostazione predefinita. `var` esegue un'**inferenza statica dei tipi**; `dynamic` richiede esplicitamente un comportamento con tipi a runtime.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Usa `dynamic` ai confini davvero dinamici, non per aggirare i normali controlli sui tipi. Sia i tipi locali statici espliciti sia quelli inferiti sono conformi a Pureline.

### PL-EV-006 — Gestire la nullabilità tramite un flusso stabile {#pl-ev-006--handle-nullability-through-stable-flow}

Emvus non richiede un'annotazione `T?`. Traccia gli stati null attraverso il controllo di flusso. Proteggi subito un valore potenzialmente null e, prima di ragionare sulla sua nullabilità, preferisci un'istantanea locale stabile delle proprietà mutabili.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Non dare mai per scontato che letture ripetute e non sincronizzate di una proprietà mutabile restituiscano lo stesso valore. Rendi esplicita l'inizializzazione dei campi obbligatori.

### PL-EV-007 — Preferire la gestione tipizzata dei Result per i fallimenti previsti {#pl-ev-007--prefer-typed-result-handling-for-expected-failures}

Emvus non ha la sintassi `try/catch/finally`. Usa `Result<T, E>`, `success`, `fail`, `?` e `switch` come prevede il linguaggio.

```java
method<Result<Int, RangeException>> validatePort(Int port) {
    if (port < 1 || port > 65535) {
        fail RangeException(port, 1, 65535)
    }

    success port
}

method showPort(Int port) {
    switch (validatePort(port)) {
        success(value) -> println(value)
        error(problem) -> errprintln(problem.message)
    }
}
```

- `?` serve a propagare deliberatamente un errore dove i tipi lo permettono.
- `!` provoca un panic in caso di errore; riservalo a invarianti consolidate o a controlli di confine da cui non è davvero possibile riprendersi.
- Non scartare un `Result` e non nascondere un fallimento previsto dietro un `panic`.
- Tieni distinti `success`, `fail` e `return`, invece di avvolgere inutilmente ogni operazione.

### PL-EV-008 — Rendere visibile la durata delle risorse con `scoped` {#pl-ev-008--make-resource-lifetimes-visible-with-scoped}

Usa il costrutto `scoped` di Emvus per le risorse che devono essere chiuse al termine del loro ambito.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Non sostituire `scoped` con il `try-with-resources` di Java, il `defer` di Go o un inesistente `finally` di Emvus. La durata di una risorsa dovrebbe restare chiara anche quando il compilatore ottimizza la memoria.

### PL-EV-009 — Preferire le data class al boilerplate {#pl-ev-009--prefer-data-classes-to-boilerplate}

Usa `data class` per tipi piccoli, con nome e incentrati sui dati, sfruttando il comportamento generato già incluso.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Le proprietà dati primarie sono di sola lettura al di fuori dell'inizializzazione. `copy()` e `withX(...)` esprimono copie modificate e sono shallow per impostazione predefinita. Dove opportuno, preferisci l'uguaglianza, l'hashing e la rappresentazione testuale generati, invece di riscriverli a mano. Mantieni come classi normali i tipi più grandi e ricchi di comportamento.

**Non introdurre un requisito di stile `record` separato:** il progetto di Emvus concordato usa `data class` per i modelli di dati con nome e `Dictionary` per i dati di tipo dizionario/object literal.

### PL-EV-010 — Liste, tuple e dizionari mantengono la semantica definita {#pl-ev-010--lists-tuples-and-dictionaries-retain-their-defined-semantics}

Per i letterali `[...]`, se **tutti i tipi degli elementi sono esattamente uguali** si ottiene una `List`; altrimenti l'espressione è una tupla. Non fare in modo che Pureline sovrascriva la regola del linguaggio, guidata dai tipi, con una preferenza stilistica.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

I letterali di dizionario usano `{ key: value }`; i tipi di valore misti inferiti usano `dynamic` dove lo richiede il modello del linguaggio. Si accede ai dizionari tramite le **chiavi**, non con la notazione a punto dei record strutturali.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

Un tipo di elemento che cambia può legittimamente cambiare l'inferenza tra lista e tupla. Quando opportuno, mantieni visibile questo comportamento ai confini delle API tramite tipi dichiarati esplicitamente.

### PL-EV-011 — La destrutturazione è posizionale {#pl-ev-011--destructuring-is-positional}

Usa `{ ... }` per destrutturare i componenti di una tupla o di una data class nell'ordine di dichiarazione. `_` permette di saltare un elemento.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Non reinterpretare la destrutturazione come un confronto per nome sui record. Preferisci pochi binding brevi e significativi, non un'estrazione indiscriminata.

### PL-EV-012 — `switch` dovrebbe esporre una ramificazione completa {#pl-ev-012--switch-should-expose-complete-branching}

Usa istruzioni o espressioni `switch` per vere alternative di stato. Le espressioni devono essere esaustive oppure avere un ramo catch-all / di fallimento definito.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Per i `Result`, preferisci pattern chiari con `success(...)` ed `error(...)` alle condizioni annidate. Mantieni deliberati i pattern catch-all: non devono servire a nascondere casi dimenticati.

### PL-EV-013 — Usare le cascade solo quando chiariscono un unico destinatario {#pl-ev-013--use-cascades-only-when-they-clarify-a-single-receiver}

Le cascade con `..` sono utili per una breve sequenza di operazioni sullo stesso destinatario.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Evita le catene che nascondono effetti non correlati, mutano più oggetti in modo implicito o si estendono su molte istruzioni.

### PL-EV-014 — Fiber e thread hanno bisogno di cicli di vita chiari {#pl-ev-014--fibers-and-threads-need-clear-lifecycles}

`fiber {}`, `virtual {}` e `thread {}` sono costrutti di esecuzione distinti con un comune schema di risultato del task. Scegli in base al carico di lavoro reale, non perché la concorrenza appare compatta.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Attendi i risultati e gli errori che contano.
- Rendi chiare cancellazione e proprietà (ownership) per i task di lunga durata.
- Sincronizza lo stato mutabile condiviso; `@Synchronized` è disponibile dove opportuno.
- Non presumere che l'oggetto catturato da un task sia locale allo stack o possa essere rilasciato quando il metodo che l'ha avviato ritorna.
- Evita il lavoro fire-and-forget nascosto nei normali metodi di business.

### PL-EV-015 — Le macro devono migliorare l'individuabilità, non offuscarla {#pl-ev-015--macros-must-improve-discoverability-not-obscure-it}

Le macro di Emvus sono trasformazioni AST a tempo di compilazione, con dichiarazioni di destinazione (target), `quote`, sostituzione `$(...)` e API di costruzione dell'AST.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline richiede:

- Macro piccole, con responsabilità e destinazioni supportate dichiarate con chiarezza.
- Espansione deterministica; il comportamento nell'ordine del sorgente e i membri risultanti restano individuabili.
- Igiene (hygiene) per evitare collisioni accidentali di nomi.
- Diagnostiche del compilatore quando l'espansione crea codice in conflitto o non valido.
- Metodi ordinari al posto delle macro quando non esiste un beneficio sostanziale a tempo di compilazione.
- Nessuna dipendenza da effetti collaterali non revisionati a tempo di macro: I/O, rete, orologio o casualità.

Il codice generato deve superare i controlli semantici; gli strumenti di checker e formatter non dovrebbero trattare le posizioni generate come normali file mantenuti a mano.

### PL-EV-016 — Non programmare contro gli interni di HyperAlloc Flow {#pl-ev-016--do-not-program-against-hyperalloc-flow-internals}

Il codice Emvus può essere ottimizzato tramite Sublang, Optimind e HyperAlloc Flow. Gli sviluppatori dovrebbero esprimere **semantica e durate**, non indovinare a mano una futura strategia di allocazione.

- Privilegia cicli di vita degli oggetti lineari e una proprietà (ownership) stabile.
- Mantieni esplicito lo stato mutabile condiviso, soprattutto tra i task.
- Preferisci data class immutabili per i valori semplici, quando si adattano al dominio.
- Non costruire API sul presupposto che un oggetto sia sempre allocato sullo stack, sostituito da scalari o gestito in un pool.
- Valuta l'allocazione nei percorsi critici e il comportamento di escape con misurazioni e diagnostiche, non con il sentito dire.

### PL-EV-017 — Densità dei pacchetti e organizzazione dei sorgenti {#pl-ev-017--package-density-and-source-organization}

Un pacchetto/cartella sorgente dovrebbe contenere al massimo **8** moduli `.ev` di produzione per impostazione predefinita. Test, sorgenti generati e file con soli metadati non contano. Dividi in base all'effettiva responsabilità funzionale, senza creare meccanicamente sottopacchetti arbitrari.

Il nome di un pacchetto e il nome di un file sono concetti diversi: `app.session` resta in minuscolo, mentre `sessionService.ev` è in `camelCase`.

### PL-EV-018 — Le regole native del linguaggio prevalgono sull'imitazione tra linguaggi {#pl-ev-018--language-native-rules-override-cross-language-imitation}

Gli strumenti Pureline non devono segnalare una violazione solo perché Emvus differisce da Java, Emerald, Rust o Go:

- Le `()` facoltative nelle **dichiarazioni di metodi senza parametri** sono valide; le chiamate richiedono sempre `()`.
- I punti e virgola facoltativi sono validi.
- `where` è la sintassi nativa per dichiarare i generici.
- `var` è inferito staticamente; `dynamic` è esplicitamente dinamico.
- `success`, `fail`, `?`, `!`, `scoped` e le macro AST hanno significati specifici di Emvus.
- `{ ... }` ha usi validi dipendenti dal contesto, tra cui i dizionari e la destrutturazione posizionale.
- `[ ... ]` è tipizzato come lista o tupla secondo la regola di Emvus sull'esatta uguaglianza dei tipi degli elementi.

Il formatter dovrebbe riconoscere l'AST, preservare il significato e non applicare mai ai file `.ev` i namespace con `::` né l'obbligo dei punti e virgola di Emerald.
