# Principi fondamentali

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Il nucleo di Pureline {#pureline-core}

Queste regole valgono per tutti i linguaggi supportati, dove il linguaggio le consente in modo naturale.

| ID | Regola |
|---|---|
| PL-CORE-001 | Il controllo di flusso dovrebbe essere il più lineare possibile |
| PL-CORE-002 | Evitare `else` |
| PL-CORE-003 | Preferire le guard clause |
| PL-CORE-004 | Usare la forma di controllo di flusso più chiara per il linguaggio; i linguaggi con parentesi graffe usano blocchi espliciti |
| PL-CORE-005 | Le scorciatoie idiomatiche native del linguaggio sono ammesse se restano immediatamente leggibili |
| PL-CORE-006 | Le funzioni dovrebbero essere piccole e mirate |
| PL-CORE-007 | I nomi devono portare significato |
| PL-CORE-008 | Evitare le astrazioni superflue |
| PL-CORE-009 | Evitare le God Class e i God Module |
| PL-CORE-010 | Preferire lo stato immutabile |
| PL-CORE-011 | Preferire le funzionalità moderne del linguaggio quando migliorano la chiarezza |
| PL-CORE-012 | Evitare la formattazione verticale superflua |
| PL-CORE-013 | I commenti non devono compensare un codice poco chiaro |
| PL-CORE-014 | Gestire subito gli stati non validi e di errore |
| PL-CORE-015 | Mantenere visibili gli effetti collaterali importanti |
| PL-CORE-016 | Le risorse devono avere un ciclo di vita chiaro |
| PL-CORE-017 | Preferire le API native del framework |
| PL-CORE-018 | Evitare i valori magici |
| PL-CORE-019 | Rendere esplicite le dipendenze |
| PL-CORE-020 | Ottimizzare i percorsi critici in modo deliberato, non per caso |
| PL-CORE-021 | Mantenere pacchetti e cartelle sorgente abbastanza piccoli da essere scorsi a colpo d'occhio |
| PL-CORE-022 | Coesione prima della dimensione: preferire un'unica responsabilità coerente ad arbitrari limiti di righe per classe |
