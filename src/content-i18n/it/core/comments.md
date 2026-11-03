# Comments

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Comments

### PL-DOC-001. Commenti Spiegare perché, non quello che'(H) la domanda di energia

Avoid:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Useful comments explain things such as protocol constraints, workarounds, external bugs, non-obvious mathematical behavior, or unusual performance constraints.

Code should explain **what** happens. Comments should explain **why** something unusual is necessary.
