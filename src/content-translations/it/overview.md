# Pureline Code Style 1.7

[Guida allo stile del codice](README.md) · [Specifica originale 1.7](../../PURELINE_SPECIFICATION_1.7.md)

## Definizione {#definition}

**Pureline** è uno stile di codifica con una propria linea, incentrato su flusso di controllo lineare, intento esplicito, formattazione compatta, unità piccole, responsabilità chiara e rumore sintattico o architetturale ridotto al minimo.

Pureline non punta a ridurre al minimo i caratteri. Punta a ridurre al minimo il **codice superfluo**.

La direzione di lettura preferita è:

```text
Input
↓
Validation
↓
Transformation
↓
Execution
↓
Result
```

Non questa:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

I principi centrali di Pureline sono:

> **Flusso lineare. Intento esplicito. Rumore minimo. Unità piccole. Responsabilità chiara. Coesione prima della dimensione.**

**Versione 1.7:** aggiunge il profilo Python (da `PL-PY-001` a `PL-PY-012`), il profilo QML (da `PL-QML-001` a `PL-QML-011`), il profilo Astro (da `PL-AS-001` a `PL-AS-009`), il profilo HTML (da `PL-HTML-001` a `PL-HTML-009`) e il profilo CSS (da `PL-CSS-001` a `PL-CSS-012`). La versione 1.6 aveva aggiunto il profilo Novus (da `PL-NV-001` a `PL-NV-013`) e il profilo React (da `PL-REACT-001` a `PL-REACT-014`), e aveva esteso il profilo Rust con le regole da `PL-RS-021` a `PL-RS-024` e con un'esenzione precisa per i test in `PL-RS-004`. Tutti gli ID delle regole esistenti e il principio Coesione prima della dimensione introdotto nella 1.4 sono conservati. La versione 1.5 aveva aggiunto il profilo Rust (da `PL-RS-001` a `PL-RS-020`).

**Versione 1.7 (profili aggiuntivi):** la versione 1.7 aggiunge anche i profili C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) e Kotlin (`PL-KT-001`–`PL-KT-011`), senza rinumerare le regole esistenti.

---

## Riepilogo di Pureline {#pureline-summary}

Il codice Pureline dovrebbe risultare:

- lineare
- esplicito
- compatto
- moderno
- a basso rumore
- modulare
- coeso a prescindere dal numero di righe
- prevedibile
- facile da scorrere
- facile da rifattorizzare
- difficile da fraintendere

La regola fondamentale resta:

> **Codice senza rumore.**

Un secondo principio governa ogni profilo di linguaggio:

> **Pureline standardizza i principi, non la sintassi.**

Un linguaggio deve restare idiomatico. Pureline elimina il rumore superfluo senza privare Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald o Emvus delle caratteristiche che li rendono efficaci fin dall'inizio.
