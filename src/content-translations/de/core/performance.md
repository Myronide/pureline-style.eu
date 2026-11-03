# Performance

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Performance {#performance}

Pureline stellt standardmäßig die Lesbarkeit an die erste Stelle, aber performancekritische Pfade sollen bewusst geschrieben werden.

In Hot Paths gilt:

- unnötige Allokationen vermeiden
- wiederholte Reflection vermeiden
- teure Auflösungen zwischenspeichern
- passende Collections verwenden
- verstecktes Blockieren vermeiden
- unnötiges Kopieren reduzieren
- Ownership klar halten

Performance-Optimierungen müssen verständlich bleiben.
