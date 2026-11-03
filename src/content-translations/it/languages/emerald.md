# Stile del codice Emerald

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo Emerald {#emerald-profile}

Pureline Emerald segue la **sintassi nativa di Emerald** invece di prendere in prestito la sintassi proposta per Emvus. Emerald è anche il linguaggio di bootstrap di Emvus, quindi questa distinzione conta per gli strumenti e per il codice del compilatore.

### PL-EMS-001 — Mantenere nativa la sintassi di Emerald {#pl-ems-001--keep-emerald-syntax-native}

Emerald usa file `.ems`, dichiarazioni `namespace` e `use` con `::`, tipi di ritorno prima dei nomi dei metodi e punti e virgola.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

**Non** riscrivere le dichiarazioni di Emerald come `package`, `method<T>`, `where` di Emvus o come codice senza punti e virgola. Sono linguaggi diversi.

### PL-EMS-002 — Usare i punti e virgola in modo coerente {#pl-ems-002--use-semicolons-consistently}

Segui la sintassi delle istruzioni di Emerald, basata sui punti e virgola. Un formatter non deve applicare ai file `.ems` la regola dei punti e virgola facoltativi di Emvus.

```java
Int result = calculate(4);
println(result);
```

### PL-EMS-003 — Nomi e organizzazione dei file {#pl-ems-003--names-and-file-organization}

- Tipi: `PascalCase`.
- Interfacce: prefisso `I` (`IStorage`, `IPacket`).
- Metodi, parametri, campi e variabili locali: `camelCase`.
- Costanti: `UPPER_SNAKE_CASE`, dove applicabile.
- Mantieni esplicite le dichiarazioni `namespace` e `use`.
- Preferisci file sorgente che prendono il nome dal loro tipo principale, rispettando le convenzioni di denominazione già presenti nel repository Emerald (ad esempio `SessionService.ems`).
- Usa al massimo **8** file `.ems` di produzione per cartella sorgente/namespace per impostazione predefinita; test e sorgenti generati sono esclusi.

Non rinominare i file sorgente esistenti che funzionano solo per soddisfare un'ipotetica convenzione valida tra i linguaggi.

### PL-EMS-004 — Guard clause con parentesi graffe {#pl-ems-004--guard-clauses-with-braces}

Usa blocchi espliciti e mantieni non annidato il percorso di successo.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Evita `else` quando un `return`, un `continue` o un'altra terminazione anticipata lo rende superfluo. Le istruzioni `if` in linea senza parentesi graffe non sono Pureline Emerald.

### PL-EMS-005 — Tipi espliciti e `var` sono entrambi validi {#pl-ems-005--explicit-types-and-var-are-both-valid}

Usa un tipo dichiarato quando chiarisce un confine di API. Usa `var` dove un tipo inferito staticamente è immediatamente ovvio; `var` **non** è una richiesta di tipizzazione dinamica.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Nessuna delle due forme va segnalata come violazione di stile solo perché l'altra è possibile.

### PL-EMS-006 — Preservare il modello a oggetti di Emerald {#pl-ems-006--preserve-emeralds-object-model}

Usa la normale forma di chiamata del costruttore di Emerald, senza una parola chiave `new` alla Java.

```java
Connection connection = Connection();
```

Mantieni espliciti costruttori, campi, ereditarietà e interfacce. Preferisci classi piccole e coese a ulteriori livelli di manager/factory privi di una responsabilità concreta.

### PL-EMS-007 — Preferire le data class per i tipi che modellano dati {#pl-ems-007--prefer-data-classes-for-data-shaped-types}

Quando un tipo raggruppa principalmente dati correlati e i membri generati supportati da Emerald sono adatti, preferisci una data class al boilerplate ripetuto.

```java
public data class Coordinate(Int x, Int y);
```

La generazione delle data class di Emerald comprende un costruttore, `equals`, `toString`, `copy` e i metodi `withX`, dove applicabili. Non dare per scontato che funzionalità delle data class esclusive di Emvus, come `copy` con argomenti con nome, `hashCode` generato o la destrutturazione di Emvus, facciano già parte di Emerald.

### PL-EMS-008 — Usare le macro solo per vere astrazioni a tempo di compilazione {#pl-ems-008--use-macros-only-for-genuine-compile-time-abstractions}

Il sistema di macro AST di Emerald è adatto alla generazione strutturale ripetitiva, non a mascherare la normale logica del programma.

- Preferisci macro di annotazione piccole e con nomi chiari.
- Rendi i campi e i metodi generati individuabili da chi mantiene il codice e dagli strumenti.
- Evita di sostituire un metodo semplice con un comportamento di macro difficile da debuggare.
- Non fare affidamento su capacità non documentate delle macro e non modificare in silenzio dichiarazioni non correlate.
- Tieni separate le trasformazioni a tempo di compilazione dagli effetti collaterali a runtime.

### PL-EMS-009 — Rendere espliciti i percorsi di errore {#pl-ems-009--make-error-paths-explicit}

Usa il meccanismo di errore supportato dalla vera API di Emerald. Dove una funzione restituisce `Result<T, E>`, gestiscilo o inoltralo in modo intenzionale. Non copiare in codice Emerald i costrutti esclusivi di Emvus `success value`, `fail error`, `?` postfisso o `scoped`, a meno che quella sintassi non sia implementata separatamente in Emerald.

Proteggi subito dagli input non validi e rendi visibile l'errore inatteso, invece di inghiottirlo.

### PL-EMS-010 — La concorrenza ha un proprietario {#pl-ems-010--concurrency-has-ownership}

`Fiber`, `@Async`, `@Synchronized` e le funzionalità per i thread di Emerald vanno usati con cicli di vita espliciti.

- Tieni il lavoro bloccante lontano dai thread di esecuzione non adatti.
- Attendi (await) le operazioni di cui contano i risultati o gli errori.
- Sincronizza lo stato mutabile condiviso in modo intenzionale.
- Non confondere l'esecuzione asincrona con la thread safety automatica.

### PL-EMS-011 — Mantenere comprensibile il codice sensibile a Flow {#pl-ems-011--keep-flow-sensitive-code-understandable}

Emerald Flow può ottimizzare l'allocazione e la durata degli oggetti, ma la semantica leggibile del sorgente ha la priorità.

- Preferisci riferimenti locali stabili quando più letture sarebbero ambigue.
- Non fare affidamento manualmente su scelte di archiviazione non documentate come `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond` o `Static`.
- Evita le fughe nascoste e i riferimenti di lunga durata accidentali nei percorsi critici.
- Considera le strategie dell'ottimizzatore come dettagli di implementazione del compilatore, non rituali di codifica a livello di sorgente.

### PL-EMS-012 — Testare le astrazioni rivolte al compilatore {#pl-ems-012--test-compiler-facing-abstractions}

Per il codice di compilatore, AST e runtime, scrivi test per le condizioni limite, i percorsi di errore, i membri generati e il comportamento della durata degli oggetti. Un metodo più corto non è automaticamente migliore se nasconde una transizione di fase o un effetto collaterale importante.
