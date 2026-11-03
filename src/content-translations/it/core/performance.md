# Prestazioni

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Prestazioni {#performance}

Pureline privilegia la leggibilità per impostazione predefinita, ma i percorsi sensibili alle prestazioni vanno scritti in modo deliberato.

Nei percorsi critici (hot path):

- evita le allocazioni superflue
- evita la reflection ripetuta
- metti in cache le risoluzioni costose
- usa le collezioni adatte
- evita i blocchi nascosti
- riduci le copie superflue
- mantieni chiara la proprietà (ownership)

Le ottimizzazioni delle prestazioni devono restare comprensibili.
