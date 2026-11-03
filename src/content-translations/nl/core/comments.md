# Opmerkingen

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Opmerkingen {#comments}

### PL-DOC-001 — Opmerkingen leggen uit waarom, niet wat {#pl-doc-001--comments-explain-why-not-what}

Vermijd:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Nuttige opmerkingen leggen zaken uit als protocolbeperkingen, workarounds, bugs in externe code, niet-voor-de-hand-liggend wiskundig gedrag of ongebruikelijke prestatiebeperkingen.

Code moet uitleggen **wat** er gebeurt. Opmerkingen moeten uitleggen **waarom** iets ongebruikelijks nodig is.
