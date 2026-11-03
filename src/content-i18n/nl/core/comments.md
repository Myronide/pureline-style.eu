# Opmerkingen

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Opmerkingen

### PL-DOC-001. Comments Leg uit waarom, Niet wat

Vermijd:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Nuttige opmerkingen verklaren dingen zoals protocol beperkingen, workarounds, externe bugs, niet-duidelijk wiskundig gedrag, of ongebruikelijke prestatie beperkingen.

Code moet **what** uitleggen. Opmerkingen moeten uitleggen **why** iets ongewoons is noodzakelijk.
