# Prestazioni

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Prestazioni

Pureline prioritizes readability by default, but performance-sensitive paths should be written deliberately.

In hot paths:

- evitare le assegnazioni inutili
- evitare la riflessione ripetuta
- risoluzione cache costosa
- utilizzare raccolte adeguate
- evitare il blocco nascosto
- ridurre la copia non necessaria
- mantenere la proprietà chiara

Performance optimizations must remain understandable.
