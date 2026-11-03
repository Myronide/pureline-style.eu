# Functions

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Functions

### PL-FN-001. Una responsabilità chiara l'uso di un'altro è stato di

Preferred names:

```text
validateRequest()
createSession()
sendPacket()
loadUser()
closeConnection()
```

Avoid vague names:

```text
handleEverything()
process()
doStuff()
executeAll()
```

A function should normally represent one clearly identifiable action.

#### Size guidance

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

These are heuristics, not absolute limits.
