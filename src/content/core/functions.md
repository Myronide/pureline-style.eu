# Functions

[Code style guide](../README.md) · [Original specification 1.5](../../../PURELINE_SPECIFICATION_1.5.md)

## Functions

### PL-FN-001 — One Clear Responsibility

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
