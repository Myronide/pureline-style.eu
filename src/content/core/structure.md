# Classes, Modules, and Folder Density

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Classes and Modules

### PL-STRUCT-001 — One Clear Responsibility

Avoid structures like:

```text
ServerManager
 ├─ database
 ├─ players
 ├─ packets
 ├─ commands
 ├─ configuration
 ├─ HTTP
 └─ logging
```

Prefer:

```text
server/
    ServerRuntime

network/
    Connection
    PacketRegistry
    PacketDispatcher

session/
    Session
    SessionService

storage/
    UserStorage
    SessionStorage
```

A class has one clear responsibility when its members and internal state contribute to one cohesive concern. **Line count alone does not determine whether a class is well designed.** See `PL-STRUCT-003` for size guidance.

---

## Package and Folder Density

### PL-STRUCT-002 — Keep Namespaces Small Enough to Scan

Pureline treats file and type density as part of code readability.

A package or source folder should be small enough that a developer can understand its contents at a glance without searching through a long flat list of unrelated files.

When the limit is exceeded, split the package or folder by responsibility instead of allowing it to become a dumping ground.

#### Default limits

| Language | Pureline default |
|---|---|
| Java | Maximum 8 production top-level types/source files per package |
| Emerald | Maximum 8 production `.ems` source files per source/namespace folder |
| Emvus | Maximum 8 production `.ev` source files per package/source folder |
| JavaScript | Maximum 10 production source modules per feature/source folder |
| TypeScript | Maximum 10 production source modules per feature/source folder |
| Go | Maximum 12 non-test, non-generated `.go` files per package directory |
| Crystal | Maximum 10 production `.cr` files per source/namespace folder |
| Rust | Maximum 10 hand-maintained production `.rs` files per feature/source folder |

These files do not count toward the limit:

- tests and specs
- generated source files
- metadata-only files
- `package-info.java`
- `module-info.java`
- JavaScript/TypeScript barrel files such as `index.ts` or `index.js`
- generated bindings or protocol output
- migration snapshots and comparable machine-generated artifacts

The purpose of this rule is not to force arbitrary folder nesting. A split should introduce a real responsibility boundary.

Bad:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java
    PacketHandler.java
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Preferred:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java

network/packet/
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java

network/runtime/
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

A project may override these thresholds through a future Pureline configuration file, but the default rule should remain intentionally strict.

---

## Cohesion over Size

### PL-STRUCT-003 — Cohesion over Size (Zusammengehörigkeit vor Zeilenbegrenzung)

> **Cohesion over Size — Zusammengehörigkeit vor Zeilenbegrenzung.**

The preferred maximum class size is **guidance, never a hard limit**. Keep strongly related logic together when splitting it would make the code harder to read, maintain, test, or reason about. A larger cohesive class is preferable to multiple artificial classes connected by unnecessary delegation.

#### Class size guidance

| Class size | Pureline recommendation |
|---|---|
| Up to 200 lines | Preferred normal case |
| 201–400 lines | Unproblematic when the class has a clear responsibility |
| 401–600 lines | Deliberate architectural decision; keep its cohesion understandable |
| More than 600 lines | Review recommended, **not prohibited** |

The ranges are **heuristics, not hard limits**. Crossing a threshold must not, by itself, produce a style violation or require a split.

#### When larger classes are justified

- **Parsers and lexers:** A cohesive state machine may become more complicated when its states and transitions are scattered across artificial abstractions.
- **Algorithms:** Tightly coupled processing phases can be easier to understand and optimize when kept together.
- **Central data structures:** Methods sharing the same invariants and internal state can belong in one class.
- **Complex but cohesive logic:** Splitting is counterproductive when it adds indirection, unnecessary delegation, or more coordination than clarity.

#### When to split anyway

Split by **real responsibility boundaries**, not by line count. Indicators include distinct subsystems evolving independently, unrelated reasons to change, weak coupling among groups of methods, or separate lifecycles that are obscured by one class.

**Tooling rule:** Pureline Checker and IDE inspections may show an informational size notice with a cohesion-review suggestion, particularly above 600 lines. They must not treat the number of lines as sufficient evidence of a violation, automatically extract classes, or require suppressions merely to keep a cohesive class intact.

This principle applies to **all Pureline language profiles**, including Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, and Emvus. Language-specific syntax and idioms continue to take precedence.
