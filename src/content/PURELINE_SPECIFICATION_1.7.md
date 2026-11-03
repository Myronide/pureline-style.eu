# Pureline Specification 1.7

## Definition

**Pureline** is an opinionated coding style focused on linear control flow, explicit intent, compact formatting, small units, clear ownership, and minimal syntactic or architectural noise.

Pureline does not aim to minimize characters. It aims to minimize **unnecessary code**.

The preferred reading direction is:

```text
Input
↓
Validation
↓
Transformation
↓
Execution
↓
Result
```

Not:

```text
if
 └─ if
     └─ else
         └─ if
             └─ callback
                 └─ branch
```

The central Pureline principles are:

> **Linear Flow. Explicit Intent. Minimal Noise. Small Units. Clear Ownership. Cohesion over Size.**

**Version 1.7:** Adds the Python profile (`PL-PY-001` through `PL-PY-012`), the QML profile (`PL-QML-001` through `PL-QML-011`), the Astro profile (`PL-AS-001` through `PL-AS-009`), the HTML profile (`PL-HTML-001` through `PL-HTML-009`), and the CSS profile (`PL-CSS-001` through `PL-CSS-012`). **Version 1.6:** Adds the Novus profile (`PL-NV-001` through `PL-NV-013`) and the React profile (`PL-REACT-001` through `PL-REACT-014`), extends the Rust profile with `PL-RS-021` through `PL-RS-024` and a precise test exemption in `PL-RS-004`, and keeps all existing rule IDs and the 1.4 Cohesion over Size principle. Version 1.5 added the Rust profile (`PL-RS-001` through `PL-RS-020`).

**Version 1.7 (additional profiles):** Version 1.7 also adds the C# (`PL-CS-001`–`PL-CS-009`), Angular (`PL-NG-001`–`PL-NG-009`), Vue (`PL-VUE-001`–`PL-VUE-010`), GDScript (`PL-GD-001`–`PL-GD-010`), C (`PL-C-001`–`PL-C-009`), C++ (`PL-CPP-001`–`PL-CPP-008`), Lua (`PL-LUA-001`–`PL-LUA-012`), Dart (`PL-DART-001`–`PL-DART-012`), Flutter (`PL-FLUT-001`–`PL-FLUT-010`), V (`PL-V-001`–`PL-V-010`), Swift (`PL-SW-001`–`PL-SW-011`) and Kotlin (`PL-KT-001`–`PL-KT-011`) profiles without renumbering existing rules.

---

# 1. Pureline Core

These rules apply to all supported languages where the language allows them naturally.

| ID | Rule |
|---|---|
| PL-CORE-001 | Control flow should be as linear as possible |
| PL-CORE-002 | Avoid `else` |
| PL-CORE-003 | Prefer guard clauses |
| PL-CORE-004 | Use the clearest control-flow form for the language; brace-based languages use explicit blocks |
| PL-CORE-005 | Idiomatic language-native shorthand is allowed when it remains immediately readable |
| PL-CORE-006 | Functions should be small and focused |
| PL-CORE-007 | Names must carry meaning |
| PL-CORE-008 | Avoid unnecessary abstractions |
| PL-CORE-009 | Avoid God Classes and God Modules |
| PL-CORE-010 | Prefer immutable state |
| PL-CORE-011 | Prefer modern language features where they improve clarity |
| PL-CORE-012 | Avoid unnecessary vertical formatting |
| PL-CORE-013 | Comments must not compensate for unclear code |
| PL-CORE-014 | Handle invalid and error states early |
| PL-CORE-015 | Keep important side effects visible |
| PL-CORE-016 | Resources must have a clear lifecycle |
| PL-CORE-017 | Prefer framework-native APIs |
| PL-CORE-018 | Avoid magic values |
| PL-CORE-019 | Make dependencies explicit |
| PL-CORE-020 | Optimize hot paths deliberately, not accidentally |
| PL-CORE-021 | Keep packages and source folders small enough to scan at a glance |
| PL-CORE-022 | Cohesion over Size: prefer one coherent responsibility over arbitrary class line limits |

---

# 2. Control Flow

Control flow is one of the most important parts of Pureline.

Pureline standardizes **clarity and structure, not identical syntax across languages**. Java, JavaScript, TypeScript, Go, Emerald, and Emvus use explicit blocks for control flow. Languages with established readable shorthand, such as Crystal postfix guards, may use that shorthand when the condition and action remain simple.

## PL-CF-001 — Prefer Guard Clauses

Preferred:

```java
if (request == null) {
    return Result.empty();
}

if (!request.valid()) {
    return Result.invalid();
}

var session = sessions.create(request.user());
return executor.execute(session, request);
```

Avoid:

```java
if (request != null) {
    if (request.valid()) {
        var session = sessions.create(request.user());
        return executor.execute(session, request);
    } else {
        return Result.invalid();
    }
}

return Result.empty();
```

The happy path should remain as close to the base indentation level as possible.

## PL-CF-002 — Avoid `else`

Avoid:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Prefer:

```java
if (!valid) {
    reject();
    return;
}

execute();
```

A ternary expression may be used for simple value selection:

```java
var state = valid ? State.READY : State.INVALID;
```

Complex nested ternaries are not Pureline.

## PL-CF-003 — Explicit Blocks in Brace-Based Languages

In Java, JavaScript, TypeScript, Go, and other brace-based languages, control-flow bodies use explicit blocks.

Not Pureline:

```java
if (!valid) return;
```

Also not Pureline:

```java
if (!valid)
    return;
```

Pureline:

```java
if (!valid) {
    return;
}
```

The same principle applies to `for`, `while`, and comparable control-flow constructs.

This rule does **not** ban idiomatic shorthand in languages where that shorthand is a normal, readable part of the language. Crystal postfix guards such as `return unless valid` are Pureline-compliant when kept simple.

---

# 3. Naming

## PL-NAME-001 — Names Must Be Meaningful

Good:

```text
request
session
player
packet
handler
storage
result
connection
worker
```

Avoid:

```text
r
s
p
x
tmp
obj
data2
thing
```

Also avoid names that are unnecessarily long:

```text
currentIncomingPlayerConnectionRequestObject
```

The rule is:

> **As short as possible, as explicit as necessary.**

Exceptions are allowed for established local conventions such as loop counters:

```java
for (int i = 0; i < size; i++) {
}
```

---

# 4. Functions

## PL-FN-001 — One Clear Responsibility

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

### Size guidance

```text
~5–30 lines  → normal
~30–50 lines → review
50+ lines    → usually split
```

These are heuristics, not absolute limits.

---

# 5. Classes and Modules

## PL-STRUCT-001 — One Clear Responsibility

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

# 5.1 Package and Folder Density

## PL-STRUCT-002 — Keep Namespaces Small Enough to Scan

Pureline treats file and type density as part of code readability.

A package or source folder should be small enough that a developer can understand its contents at a glance without searching through a long flat list of unrelated files.

When the limit is exceeded, split the package or folder by responsibility instead of allowing it to become a dumping ground.

### Default limits

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

# 5.2 Cohesion over Size

## PL-STRUCT-003 — Cohesion over Size (Zusammengehörigkeit vor Zeilenbegrenzung)

> **Cohesion over Size — Zusammengehörigkeit vor Zeilenbegrenzung.**

The preferred maximum class size is **guidance, never a hard limit**. Keep strongly related logic together when splitting it would make the code harder to read, maintain, test, or reason about. A larger cohesive class is preferable to multiple artificial classes connected by unnecessary delegation.

### Class size guidance

| Class size | Pureline recommendation |
|---|---|
| Up to 200 lines | Preferred normal case |
| 201–400 lines | Unproblematic when the class has a clear responsibility |
| 401–600 lines | Deliberate architectural decision; keep its cohesion understandable |
| More than 600 lines | Review recommended, **not prohibited** |

The ranges are **heuristics, not hard limits**. Crossing a threshold must not, by itself, produce a style violation or require a split.

### When larger classes are justified

- **Parsers and lexers:** A cohesive state machine may become more complicated when its states and transitions are scattered across artificial abstractions.
- **Algorithms:** Tightly coupled processing phases can be easier to understand and optimize when kept together.
- **Central data structures:** Methods sharing the same invariants and internal state can belong in one class.
- **Complex but cohesive logic:** Splitting is counterproductive when it adds indirection, unnecessary delegation, or more coordination than clarity.

### When to split anyway

Split by **real responsibility boundaries**, not by line count. Indicators include distinct subsystems evolving independently, unrelated reasons to change, weak coupling among groups of methods, or separate lifecycles that are obscured by one class.

**Tooling rule:** Pureline Checker and IDE inspections may show an informational size notice with a cohesion-review suggestion, particularly above 600 lines. They must not treat the number of lines as sufficient evidence of a violation, automatically extract classes, or require suppressions merely to keep a cohesive class intact.

This principle applies to **all Pureline language profiles**, including Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, and Emvus. Language-specific syntax and idioms continue to take precedence.

---

# 6. Formatting

## PL-FMT-001 — Prefer Compact Horizontal Calls

Preferred:

```java
var box = Block.box(min, min, max, max, max, 16);
```

Avoid unnecessary vertical expansion:

```java
var box = Block.box(
    min,
    min,
    max,
    max,
    max,
    16
);
```

Vertical formatting is allowed when it reveals meaningful semantic structure.

Example:

```java
var server = Server.builder()
    .host(config.host())
    .port(config.port())
    .executor(executor)
    .build();
```

Pureline distinguishes between unnecessary vertical expansion and meaningful semantic grouping.

---

# 7. Comments

## PL-DOC-001 — Comments Explain Why, Not What

Avoid:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Useful comments explain things such as protocol constraints, workarounds, external bugs, non-obvious mathematical behavior, or unusual performance constraints.

Code should explain **what** happens. Comments should explain **why** something unusual is necessary.

---

# 8. Java Profile

## PL-JAVA-001 — Package by Responsibility

Preferred:

```text
src/main/java/
    space/example/project/
        api/
        runtime/
        service/
        network/
        storage/
        model/
```

Avoid generic dumping grounds such as `util/`, `manager/`, `misc/`, or `helper/` unless the package has a real and narrow purpose.

## PL-JAVA-002 — Naming

Classes:

```java
SessionService
PacketRegistry
UserStorage
ConnectionState
```

Interfaces use the `I` prefix:

```java
ISession
IStorage
IPacket
IConnection
```

Methods:

```java
open()
close()
load()
save()
execute()
resolve()
```

Variables:

```java
request
session
player
connection
```

Single-letter variables are disallowed unless they are established local conventions such as loop counters.

## PL-JAVA-003 — Prefer Records for Immutable Data

Preferred:

```java
public record SessionId(UUID value) {
}
```

Avoid boilerplate POJOs when a record is sufficient.

## PL-JAVA-004 — Explicit Null Handling

Avoid:

```java
Objects.requireNonNull(value);
```

for normal control-flow validation.

Prefer:

```java
if (value == null) {
    return;
}
```

or a domain-specific failure:

```java
if (config == null) {
    throw new ConfigurationException("Missing configuration");
}
```

## PL-JAVA-005 — Use Imports Instead of FQCNs

Avoid:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Prefer:

```java
import java.util.concurrent.CompletableFuture;
```

## PL-JAVA-006 — Prefer Modern Java

Use modern Java features when they improve the code:

```text
records
sealed types
pattern matching
switch expressions
var
virtual threads
text blocks
streams
```

Modern syntax should reduce noise, not create novelty for its own sake.

## PL-JAVA-007 — Prefer Switch for Real State Branching

Preferred:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Prefer this over long chains of unrelated state checks.

## PL-JAVA-008 — Concurrency

Do not block main or tick threads with HTTP, database operations, filesystem access, or blocking network I/O.

Virtual threads are preferred for blocking I/O where appropriate.

## PL-JAVA-009 — Streams Only When Clearer

Streams are encouraged when they improve readability. Use a loop if it is clearer, easier to debug, or better suited to the hot path.

## PL-JAVA-010 — Lifecycle Symmetry

Anything that is opened, registered, started, allocated, or subscribed must have an equally clear corresponding close, unregister, stop, release, or unsubscribe path.

---

# 9. JavaScript Profile

## PL-JS-001 — Braces Are Mandatory

Preferred:

```js
if (!user) {
    return;
}
```

Not Pureline:

```js
if (!user) return;
```

## PL-JS-002 — Use Semicolons

Preferred:

```js
const session = createSession(user);
session.start();
```

Pureline JavaScript uses semicolons consistently.

## PL-JS-003 — `const` First

Preferred:

```js
const user = loadUser();
```

Use `let` only for actual reassignment:

```js
let count = 0;
count++;
```

Do not use `var`.

## PL-JS-004 — Prefer `async` / `await`

Preferred:

```js
async function loadUser(id) {
    const response = await fetch(`/users/${id}`);

    if (!response.ok) {
        return null;
    }

    return response.json();
}
```

Avoid promise chains when `async` / `await` produces clearer control flow.

## PL-JS-005 — Arrow Functions Are Contextual

Normal named logic may use regular functions:

```js
function createSession(user) {
    return new Session(user);
}
```

Arrow functions are well suited for local callbacks:

```js
users.filter(user => user.active());
```

Do not use arrow functions everywhere by default.

## PL-JS-006 — Destructuring Must Improve Clarity

Good:

```js
const { id, name } = user;
```

Avoid destructuring large objects only because the language allows it.

---

## PL-JS-007 — Folder Density

A JavaScript feature/source folder may contain at most **10 production source modules** by default.

Barrel files such as `index.js`, tests, generated files, and metadata-only files do not count.

If the folder exceeds the limit, split it by responsibility rather than by arbitrary file count.

---

# 10. TypeScript Profile

TypeScript inherits all Pureline JavaScript rules.

## PL-TS-001 — Avoid `any`

Avoid:

```ts
function load(value: any): any {
}
```

Prefer:

```ts
function load(value: UserId): User {
}
```

Use `unknown` for truly unknown data:

```ts
function parse(input: unknown): Config {
}
```

## PL-TS-002 — Use Types Deliberately

Both inferred and explicit local types are Pureline-compliant.

```ts
const user = loadUser();
```

is valid when the inferred type is obvious.

Explicit typing is equally valid:

```ts
const user: User = loadUser();
```

Pureline does **not** treat an explicit annotation as redundant merely because TypeScript could infer it.

Explicit types are especially useful when they:

- make intent clearer
- document an expected contract
- protect a boundary from unintended widening
- improve refactoring confidence
- make code easier to understand without following an entire call chain

Type inference should remove noise. It should never become a rule against using TypeScript's type system.

## PL-TS-003 — No Java-Style `I` Prefix

Preferred:

```ts
interface Session {
}
```

Not:

```ts
interface ISession {
}
```

The `I` prefix is profile-specific: Java, Emerald, and Emvus use it; TypeScript does not.

## PL-TS-004 — `interface` vs `type`

Use `interface` for object-like contracts:

```ts
interface User {
    id: string;
    name: string;
}
```

Use `type` for unions, aliases, and callable shapes:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

## PL-TS-005 — Prefer Union Types Over Enums When Appropriate

Preferred:

```ts
type State = "idle" | "ready" | "closed";
```

Use an enum only when an actual enum construct provides value.

## PL-TS-006 — Strong Types at Boundaries, Freedom Internally

Public APIs, external data, persistence boundaries, and network payloads should normally expose clear types.

Inside an implementation, both explicit annotations and inference are valid. Choose the form that makes the code easiest to understand. Pureline does not score one as cleaner purely because it contains fewer type annotations.

---

## PL-TS-007 — Folder Density

A TypeScript feature/source folder may contain at most **10 production source modules** by default.

Barrel files such as `index.ts`, declaration-only support files, tests, generated files, and metadata-only files do not count.

A split should represent a real responsibility boundary such as:

```text
session/
session/state/
session/transport/
session/storage/
```

---

# 11. Go Profile

Pureline Go must remain idiomatic Go. Pureline does not try to make Go look like Java.

## PL-GO-001 — Error Guards

Preferred:

```go
user, err := loadUser(id)

if err != nil {
    return nil, err
}

session := createSession(user)
return session, nil
```

This naturally matches Pureline's guard-first philosophy.

## PL-GO-002 — Avoid `else` After Terminating Branches

Avoid:

```go
if err != nil {
    return nil, err
} else {
    return createSession(user), nil
}
```

Prefer:

```go
if err != nil {
    return nil, err
}

return createSession(user), nil
```

## PL-GO-003 — Naming Must Remain Idiomatic

Good:

```text
user
session
conn
server
packet
request
ctx
err
wg
tx
```

Avoid meaningless one-letter names unless they are strongly established local conventions.

## PL-GO-004 — Short Receiver Names Are Allowed

Preferred:

```go
func (s *Server) Start() error {
}
```

Receiver names are local, conventional, and unambiguous.

Pureline does not force:

```go
func (server *Server) Start() error {
}
```

when it adds no clarity.

## PL-GO-005 — Small Interfaces

Preferred:

```go
type Storage interface {
    Load(id ID) (*User, error)
    Save(user *User) error
}
```

Avoid oversized interfaces containing unrelated responsibilities.

## PL-GO-006 — Define Interfaces Near Consumers

Interfaces should generally be defined where they are consumed rather than globally pre-designed as large inheritance-style abstractions.

## PL-GO-007 — Use `defer` for Clear Resource Lifecycles

Preferred:

```go
file, err := os.Open(path)

if err != nil {
    return err
}

defer file.Close()
```

## PL-GO-008 — Goroutines Need Ownership

Avoid fire-and-forget goroutines without an explicit lifecycle.

A long-lived goroutine should have clear handling for cancellation, error propagation, shutdown, and ownership.

## PL-GO-009 — Avoid Premature Interface Abstraction

Do not create an interface merely because a concrete type might theoretically have another implementation later. Create abstractions when there is a real consumer need.

---

# 12. Crystal Profile

Crystal keeps its own language identity while following Pureline principles.

## PL-CR-001 — Idiomatic Postfix Guards Are Allowed

Crystal postfix conditions are Pureline-compliant when they express a short, obvious guard.

Good:

```crystal
return unless valid
return if closed
```

They fit Pureline well because they can keep guard logic compact and preserve a linear happy path.

Use an explicit block when either the condition or the guarded action becomes more complex:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

The rule is not "avoid postfix conditions." The rule is: use the form that keeps the intent immediately obvious.

## PL-CR-002 — Avoid `else`

Avoid:

```crystal
if valid
  execute
else
  reject
end
```

Prefer:

```crystal
if !valid
  reject
  return
end

execute
```

## PL-CR-003 — Idiomatic Naming

Variables and methods use `snake_case`:

```crystal
session_service
packet_registry
load_user
create_session
```

Types use PascalCase:

```crystal
SessionService
PacketRegistry
UserStorage
```

## PL-CR-004 — Prefer Type Inference

Preferred:

```crystal
session = create_session(user)
```

Avoid redundant annotations:

```crystal
session : Session = create_session(user)
```

when Crystal can infer the type clearly.

## PL-CR-005 — Explicit Nil Guards

Preferred:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Avoid burying expected nil handling inside deeply nested chains.

## PL-CR-006 — Exceptions Are for Exceptional States

Expected outcomes should preferably use normal domain modeling such as `nil`, union types, result-like structures, or enums.

Exceptions should represent exceptional failure, not ordinary branching.

## PL-CR-007 — Avoid Macro Cleverness Without Need

Crystal macros are powerful, but Pureline avoids hiding ordinary behavior behind metaprogramming unless the abstraction produces a clear architectural benefit.

Generated behavior should remain predictable and discoverable.

---

## PL-CR-008 — Folder Density

A Crystal source or namespace folder may contain at most **10 production `.cr` files** by default.

Specs, generated files, bindings, and metadata-only files do not count.

When the limit is exceeded, split the namespace by responsibility while preserving idiomatic Crystal structure.

---

# 13. Emerald Profile

Pureline Emerald follows **native Emerald syntax** instead of borrowing the proposed Emvus syntax. Emerald is also the bootstrap language for Emvus, so this distinction matters for tools and compiler code.

## PL-EMS-001 — Keep Emerald Syntax Native

Emerald uses `.ems` files, `namespace` and `use` declarations with `::`, return types before method names, and semicolons.

```java
namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
```

Do **not** rewrite Emerald declarations as Emvus `package`, `method<T>`, `where`, or semicolon-free code. These are different languages.

## PL-EMS-002 — Use Semicolons Consistently

Follow Emerald's semicolon-based statement syntax. A formatter must not apply the Emvus optional-semicolon rule to `.ems` files.

```java
Int result = calculate(4);
println(result);
```

## PL-EMS-003 — Names and File Organization

- Types: `PascalCase`.
- Interfaces: `I` prefix (`IStorage`, `IPacket`).
- Methods, parameters, fields, and locals: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` where applicable.
- Keep `namespace` and `use` declarations explicit.
- Prefer source files named after their primary type, respecting existing Emerald repository naming conventions (for example, `SessionService.ems`).
- Use at most **8** production `.ems` files per source/namespace folder by default; tests and generated sources are excluded.

Do not rename existing working source files merely to satisfy a hypothetical cross-language convention.

## PL-EMS-004 — Guard Clauses with Braces

Use explicit blocks and keep the successful path unnested.

```java
public Int normalized(Int value) {
    if (value < 0) {
        return 0;
    }

    return value;
}
```

Avoid `else` when an early `return`, `continue`, or other termination makes it unnecessary. Inline brace-free `if` statements are not Pureline Emerald.

## PL-EMS-005 — Explicit Types and `var` Are Both Valid

Use a declared type when it clarifies an API boundary. Use `var` where a statically inferred type is immediately obvious; `var` is **not** a request for dynamic typing.

```java
Person person = Person("Jason", 20);
var copy = person.copy();
```

Neither form should be flagged as a style violation merely because the other is possible.

## PL-EMS-006 — Preserve Emerald's Object Model

Use Emerald's normal constructor call form without a Java-style `new` keyword.

```java
Connection connection = Connection();
```

Keep constructors, fields, inheritance, and interfaces explicit. Prefer small cohesive classes over extra manager/factory layers with no concrete responsibility.

## PL-EMS-007 — Prefer Data Classes for Data-Shaped Types

When a type primarily bundles related data and Emerald's supported generated members are suitable, prefer a data class over repeated boilerplate.

```java
public data class Coordinate(Int x, Int y);
```

Emerald's data-class generation includes a constructor, `equals`, `toString`, `copy`, and `withX` methods where applicable. Do not assume Emvus-only data-class features such as named-argument `copy`, generated `hashCode`, or Emvus destructuring are already part of Emerald.

## PL-EMS-008 — Use Macros Only for Genuine Compile-Time Abstractions

Emerald's AST macro system is appropriate for repetitive structural generation, not for disguising ordinary program logic.

- Prefer small, clearly named annotation macros.
- Make generated fields and methods discoverable to maintainers and tooling.
- Avoid replacing a straightforward method with difficult-to-debug macro behavior.
- Do not rely on undocumented macro capabilities or silently mutate unrelated declarations.
- Keep compile-time transformations separate from runtime side effects.

## PL-EMS-009 — Make Error Paths Explicit

Use the error mechanism supported by the actual Emerald API. Where a function returns `Result<T, E>`, handle or forward it intentionally. Do not copy Emvus-specific `success value`, `fail error`, postfix `?`, or `scoped` constructs into Emerald code unless that syntax is separately implemented there.

Guard invalid input early and make unexpected failure visible rather than swallowing it.

## PL-EMS-010 — Concurrency Has Ownership

Emerald's `Fiber`, `@Async`, `@Synchronized`, and thread facilities should be used with explicit lifecycles.

- Keep blocking work off inappropriate execution threads.
- Await operations whose results or failures matter.
- Synchronize shared mutable state intentionally.
- Do not confuse asynchronous execution with automatic thread safety.

## PL-EMS-011 — Keep Flow-Sensitive Code Understandable

Emerald Flow may optimize allocation and object lifetimes, but readable source semantics take priority.

- Prefer stable local references when multiple reads would be ambiguous.
- Do not manually rely on undocumented `Folded`, `Inline`, `Local`, `Pool`, `Shard`, `Root`, `Bond`, or `Static` storage choices.
- Avoid hidden escapes and accidental long-lived references in hot paths.
- Treat optimizer strategies as compiler implementation details, not source-level coding rituals.

## PL-EMS-012 — Test Compiler-Facing Abstractions

For compiler, AST, and runtime code, write tests for boundary conditions, error paths, generated members, and object lifetime behavior. A shorter method is not automatically better if it hides a phase transition or important side effect.

---

# 14. Emvus Profile

Pureline Emvus follows the **current Emvus language design**. This is a style profile for intended `.ev` syntax, not a claim that every showcased feature is already implemented by Ring 1. Keep Emvus distinct from Emerald.

## PL-EV-001 — Native Method Declarations

Declare methods with `method` and, when needed, a return type in `method<Type>`. Generic type variables are introduced through `where`, not by attaching another generic parameter list to the method name.

```java
method<Int> square(Int value) {
    return value * value
}

method<T> first(List<T> items) where T {
    return items.get(0)
}
```

A method without an explicit return type returns `Void`.

## PL-EV-002 — Empty Declaration Parentheses Are Optional; Call Parentheses Are Not

Both parameterless declarations are Pureline-compliant:

```java
method refresh {
    updateCache()
}

method shutdown() {
    closeConnections()
}
```

Both spellings declare zero-argument methods; the difference is cosmetic, **not** an overload distinction. Always write `refresh()` or `shutdown()` to execute the method; `object.refresh` is not a method call. Formatters should preserve or consistently configure either valid declaration style without marking the other as an error.

## PL-EV-003 — Braces Required; Semicolons Optional

Use explicit `{ ... }` blocks for `if`, loops, and comparable control flow. Prefer omitting optional semicolons in idiomatic Emvus, but do not reject existing valid semicolon-terminated code.

```java
method process(Int value) {
    if (value < 0) {
        return
    }

    println(value)
}
```

Brace-free inline guards and unnecessary `else` blocks are not Pureline. Keep continuation lines and long expressions unambiguous.

## PL-EV-004 — Naming, Imports, and Visibility

- Types: `PascalCase`; interfaces: `I` prefix (`IStorage`, `IConnection`).
- Methods, fields, properties, parameters, and locals: `camelCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Packages: lower-case dotted paths.
- Source filenames: **camelCase**, for example `sessionService.ev`, even if the primary class is `SessionService`.
- The default visibility is `public`; specify `private` or `protected` when required.
- Symbol resolution is case-insensitive but source spelling is preserved: use the **declared spelling** consistently and do not define names that differ only in case.

```java
package app.session

use {
    std.collections.[IList, IIterator],
    app.storage.userStorage as Storage
}
```

Use explicit imports and aliases instead of relying on confusing collisions.

## PL-EV-005 — Types Should Communicate Intent

Emvus is statically typed by default. `var` performs **static type inference**; `dynamic` explicitly requests runtime-typed behavior.

```java
Person person = Person("Jason", 20)
var current = person.copy()
dynamic payload = receiveUnknownPayload()
```

Use `dynamic` at genuinely dynamic boundaries, not to bypass normal type checks. Both explicit and inferred static local types are Pureline-compliant.

## PL-EV-006 — Handle Nullability Through Stable Flow

Emvus does not require a `T?` annotation. It tracks null states through control flow. Guard a possibly-null value early and prefer a stable local snapshot of mutable properties before reasoning about their nullability.

```java
method<String> displayName(Profile profile) {
    final var nickname = profile.nickname

    if (nickname == null) {
        return "Unknown"
    }

    return nickname
}
```

Never rely on repeated unsynchronized reads of a mutable property having the same value. Make required field initialization explicit.

## PL-EV-007 — Prefer Typed Result Handling for Expected Failures

Emvus has no `try/catch/finally` syntax. Use `Result<T, E>`, `success`, `fail`, `?`, and `switch` as the language specifies.

```java
method<Result<Int, RangeException>> validatePort(Int port) {
    if (port < 1 || port > 65535) {
        fail RangeException(port, 1, 65535)
    }

    success port
}

method showPort(Int port) {
    switch (validatePort(port)) {
        success(value) -> println(value)
        error(problem) -> errprintln(problem.message)
    }
}
```

- `?` is for deliberate error propagation where types permit it.
- `!` causes a panic on error; reserve it for established invariants or boundary checks that truly cannot recover.
- Do not discard a `Result` or hide expected failure behind `panic`.
- Keep `success`, `fail`, and `return` distinct rather than wrapping every operation unnecessarily.

## PL-EV-008 — Make Resource Lifetimes Visible with `scoped`

Use Emvus's `scoped` construct for resources that must be closed when their scope ends.

```java
method<String> readFile(String path) {
    scoped var file = Files.open(path)
    return file.readAll()
}
```

Do not replace `scoped` with Java `try-with-resources`, Go `defer`, or a nonexistent Emvus `finally`. A resource's lifetime should remain clear even when the compiler optimizes memory.

## PL-EV-009 — Prefer Data Classes to Boilerplate

Use `data class` for small, named, data-centric types with the built-in generated behavior.

```java
data class Member(String name, Int age)

data class Server(String host, Int port = 25565)
```

Primary data properties are read-only outside initialization. `copy()` and `withX(...)` express modified copies and are shallow by default. Prefer generated equality, hashing, and textual representation where appropriate rather than rewriting them manually. Keep larger behavior-rich types as regular classes.

**Do not introduce a separate `record` style requirement:** the agreed Emvus design uses `data class` for named data models and `Dictionary` for dictionary/object-literal data.

## PL-EV-010 — Lists, Tuples, and Dictionaries Retain Their Defined Semantics

For `[...]` literals, **all element types exactly equal** implies a `List`; otherwise the expression is a tuple. Do not make Pureline overwrite the language's type-driven rule with a stylistic preference.

```java
var numbers = [10, 20, 30]        // List<Int>
var response = [200, "Success"]   // [Int, String]
```

Dictionary literals use `{ key: value }`; inferred mixed value types use `dynamic` where required by the language model. Dictionaries are accessed by **keys**, not structural-record dot notation.

```java
var server = {
    "name": "Emvus",
    "port": 25565
}

println(server["name"])
```

A changing element type can legitimately change list-versus-tuple inference. Keep that behavior visible at API boundaries through explicit declared types where appropriate.

## PL-EV-011 — Destructuring Is Positional

Use `{ ... }` to destructure tuple or data-class components in declaration order. `_` may skip an element.

```java
var { status, message } = [200, "OK"]
var { first, _ } = loadPair()
```

Do not reinterpret destructuring as named record matching. Prefer short meaningful bindings, not indiscriminate unpacking.

## PL-EV-012 — `switch` Should Expose Complete Branching

Use `switch` statements or expressions for real state alternatives. Expressions must be exhaustive or have a defined catch-all / failure arm.

```java
method<String> rankLabel(Rank rank) {
    return switch (rank) {
        MEMBER -> "Member"
        MODERATOR -> "Moderator"
        ADMIN -> "Admin"
    }
}
```

Prefer clear `success(...)` and `error(...)` patterns to nested conditions for `Result`. Keep catch-all patterns deliberate, not a way to hide forgotten cases.

## PL-EV-013 — Use Cascades Only When They Clarify a Single Receiver

Cascades with `..` are useful for a short sequence of operations on the same receiver.

```java
Person person = Person("Anna", 20)
    ..birthday()
    ..age = 21
```

Avoid chains that conceal unrelated effects, mutate several objects implicitly, or stretch across many statements.

## PL-EV-014 — Fibers and Threads Need Clear Lifecycles

`fiber {}`, `virtual {}`, and `thread {}` are distinct execution constructs with a common task-result pattern. Choose based on the actual workload, not because concurrency looks compact.

```java
var task = fiber {
    return calculate(10)
}

Int result = task.await()
```

- Await results and failures that matter.
- Make cancellation and ownership clear for long-lived tasks.
- Synchronize shared mutable state; `@Synchronized` is available where appropriate.
- Do not assume a task's captured object is stack-local or can be released when the spawning method returns.
- Avoid hidden fire-and-forget work in ordinary business methods.

## PL-EV-015 — Macros Must Improve Discoverability, Not Obscure It

Emvus macros are compile-time AST transformations with target declarations, `quote`, `$(...)` substitution, and AST builder APIs.

```java
macro Trace on Method {
    target.body.prepend(quote statement {
        println("Method entered")
    })
}
```

Pureline requires:

- Small macros with clearly stated responsibilities and supported targets.
- Deterministic expansion; source-order behavior and resulting members remain discoverable.
- Hygiene to avoid accidental name collisions.
- Compiler diagnostics when expansion creates conflicting or invalid code.
- Ordinary methods instead of macros when no substantial compile-time benefit exists.
- No reliance on unreviewed macro-time I/O, network, clock, or random side effects.

Generated code must satisfy semantic checks; checker/formatter tooling should not treat generated locations as ordinary hand-maintained files.

## PL-EV-016 — Do Not Program Against HyperAlloc Flow Internals

Emvus code may be optimized through Sublang, Optimind, and HyperAlloc Flow. Developers should express **semantics and lifetimes**, not manually guess a future allocation strategy.

- Favor straightforward object lifecycles and stable ownership.
- Keep shared mutable state explicit, especially across tasks.
- Prefer immutable data classes for simple values when they fit the domain.
- Do not build APIs around assumptions that an object is always stack-allocated, scalar-replaced, or pooled.
- Evaluate hot-path allocation and escape behavior through measurement and diagnostics, not folklore.

## PL-EV-017 — Package Density and Source Organization

A package/source folder should contain at most **8** production `.ev` modules by default. Tests, generated sources, and metadata-only files do not count. Split by actual feature responsibility rather than mechanically creating arbitrary subpackages.

A package name and a filename are different concepts: `app.session` remains lower-case, while `sessionService.ev` is `camelCase`.

## PL-EV-018 — Language-Native Rules Override Cross-Language Imitation

Pureline tooling must not report a violation merely because Emvus differs from Java, Emerald, Rust, or Go:

- Optional `()` in **parameterless method declarations** are valid; calls always require `()`.
- Optional semicolons are valid.
- `where` is the native generic declaration syntax.
- `var` is statically inferred; `dynamic` is explicitly dynamic.
- `success`, `fail`, `?`, `!`, `scoped`, and AST macros have Emvus-specific meanings.
- `{ ... }` has valid context-dependent uses, including dictionaries and positional destructuring.
- `[ ... ]` is typed as a list or tuple according to Emvus's exact-element-type rule.

The formatter should be AST-aware, preserve meaning, and never apply Emerald's `::` namespaces or semicolon requirements to `.ev` files.

---

# 15. Rust Profile

Pureline Rust follows **idiomatic Rust** rather than translating Java conventions into Rust syntax. Ownership, lifetimes, enums, pattern matching, and the type system are core strengths, not obstacles to work around.

## PL-RS-001 — Idiomatic Naming and Visibility

- Types, traits, and enum variants: `PascalCase`.
- Functions, methods, modules, fields, and locals: `snake_case`.
- Constants and statics: `SCREAMING_SNAKE_CASE`.
- Crates: descriptive `snake_case` names (Cargo package names may use hyphens).
- Traits do **not** inherit the Java `I` prefix. Prefer `Storage`, not `IStorage`.
- Keep items private unless an actual consumer needs wider visibility; prefer `pub(crate)` when suitable.
- Use `use` imports rather than repeating long fully-qualified paths, except where explicit qualification resolves ambiguity.

## PL-RS-002 — Guard Clauses and Linear Flow

Validate early and keep the successful path at the base indentation level.

```rust
fn open_session(request: &Request) -> Result<Session, SessionError> {
    if !request.is_valid() {
        return Err(SessionError::InvalidRequest);
    }

    let user = request.user().ok_or(SessionError::MissingUser)?;
    Session::open(user)
}
```

Avoid `else` after a branch that already returns, breaks, or continues. An `if`/`else` **expression** is allowed for genuine two-way value selection where it is clearer than alternatives. `let ... else` is a **preferred Rust guard construct**, not a violation of the avoid-`else` principle.

```rust
let Some(session) = sessions.get(&id) else {
    return Err(SessionError::NotFound);
};

session.start()
```

## PL-RS-003 — Prefer `Result`, `Option`, and `?`

- Represent expected failures with `Result<T, E>`.
- Represent absence with `Option<T>`.
- Use `?` for straightforward propagation and `map_err`/`ok_or_else` when error context genuinely improves.
- Use `match` when outcomes need distinct handling; avoid convoluted chains of combinators.
- Do not discard `Result` values silently; decide whether to propagate, log, recover, or deliberately ignore with a justified explanation.

```rust
fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
```

## PL-RS-004 — Restrict `unwrap`, `expect`, and `panic!`

Never use `unwrap()` or `expect()` for ordinary recoverable production failures. They are acceptable in documented invariants that really cannot be violated, and inside test code (`#[cfg(test)]` modules and `tests/`), where a panic is the failure report. `panic!` is not a normal error-handling strategy. Prefer explicit handling over hidden failure via unchecked indexing or conversions.

## PL-RS-005 — Use `match` and Patterns for Real State Branching

Use exhaustive `match` for enums and meaningful alternatives; use `if let` or `let ... else` for simple single-pattern handling. Do not force `match` onto ordinary boolean checks. Avoid broad `_` arms that silently mask future states when enumerating variants would be clearer.

```rust
fn label(state: SessionState) -> &'static str {
    match state {
        SessionState::Ready => "Ready",
        SessionState::Closed => "Closed",
        SessionState::Failed => "Failed",
    }
}
```

## PL-RS-006 — Ownership Must Be Deliberate

- Prefer borrowing `&T` or `&mut T` when ownership transfer is unnecessary.
- Accept owned values when the callee genuinely needs ownership.
- Minimize cloning; use `.clone()` when its ownership cost and purpose are clear.
- Avoid needless `Arc`, `Rc`, `Box`, and interior mutability wrappers.
- Prefer short lifetimes and explicit ownership boundaries; do not fight the borrow checker with artificial leaks or pervasive shared ownership.

## PL-RS-007 — Immutable by Default

Use `let` unless mutation is needed. Keep `let mut` local and narrowly scoped. Avoid interior mutability as a default substitute for ordinary ownership design. Do not create unnecessary mutable globals.

## PL-RS-008 — Traits Require a Real Abstraction

Create a trait for an actual shared behavior, API boundary, interchangeable implementation, or test seam. Do not introduce traits merely to mirror Java interfaces or create factory/manager layers. Prefer simple inherent `impl` methods for single concrete implementations. Choose generics or trait objects based on actual polymorphism requirements.

## PL-RS-009 — Cohesion over Size for `struct`, `impl`, and Modules

`PL-STRUCT-003` applies to Rust as a **cohesion review**, not as a fixed line-count limit. A cohesive `impl` or state machine may be long. Split by independent responsibility, not by mechanically extracting traits, structs, or files. Avoid huge unrelated `mod.rs` or `lib.rs` dumping grounds.

## PL-RS-010 — Module and File Density

A Rust feature/source folder should contain at most **10 hand-maintained production `.rs` files** by default. Tests, generated code, bindings, and metadata-only files do not count. `mod.rs`, `lib.rs`, and `main.rs` count when they contain substantial maintained logic, not when serving only as module declarations/re-exports. This is a review threshold: split along actual responsibility boundaries, never into meaningless nested folders.

Prefer explicit modules with narrow public surfaces; keep internal implementation private.

## PL-RS-011 — Use Rustfmt as the Formatting Authority

- Follow `rustfmt` / `cargo fmt` for indentation, line wrapping, trailing commas, and idiomatic formatting.
- Prefer compact expressions and calls **when rustfmt supports them**; Pureline must not demand manual formatting that rustfmt will undo.
- Write clear expression structure rather than using formatting directives to fight the formatter.
- Use ordinary brace-delimited control flow; do not emulate Java semicolon rules inside expression-oriented Rust.

This rule overrides language-independent horizontal-call preferences when they conflict with the canonical Rust formatter.

## PL-RS-012 — Prefer Clear Iteration over Clever Chains

Iterators, closures, and combinators are encouraged when they directly express a transformation. Prefer a regular loop when it makes branching, side effects, borrowing, debugging, or hot-path behavior clearer. Avoid chaining adapters simply to reduce line count.

## PL-RS-013 — Async Tasks Have Ownership and Shutdown

- Use `async`/`.await` for asynchronous workloads where appropriate.
- Do not block an async executor with long-running synchronous I/O or CPU work; use dedicated blocking execution or worker threads as needed.
- Track spawned tasks, cancellation, error propagation, and orderly shutdown.
- Do not create hidden fire-and-forget tasks for important work.
- Use channels and synchronization primitives with clearly defined ownership and backpressure.
- Never hold a blocking or asynchronous lock across `.await` unless the design explicitly requires and safely supports it.

## PL-RS-014 — Resource Lifecycles Should Be Predictable

Prefer RAII and `Drop` for synchronous cleanup. Explicitly await or coordinate shutdown for asynchronous resources because `Drop` cannot itself await. Expose a `close()` / `shutdown()` method when the operation can fail or must complete before process exit. Avoid hiding significant fallible cleanup inside destructors alone.

## PL-RS-015 — Unsafe Code Must Be Isolated and Justified

Safe Rust is the default. Use `unsafe` only where required by a genuine FFI, hardware, or performance boundary. Keep unsafe regions small, document their invariants with `// SAFETY:`, encapsulate them behind a minimal safe API, and test the boundary. Do not use `unsafe` simply to bypass normal ownership checks.

## PL-RS-016 — FFI and Platform Boundaries Are Explicit

For Wayland, GPU, system libraries, and similar native integration, keep raw handles, lifetime guarantees, ownership transfer, threading assumptions, and error conversion visible. Isolate platform-specific code in focused modules. Generated bindings may be excluded from ordinary formatting and density limits.

## PL-RS-017 — Prefer Types that Encode Invariants

Use enums and small newtypes where they prevent real invalid states or clarify external boundaries. Do not create wrappers for every primitive without benefit. Prefer constructors that validate invariants and expose clear errors. Make invalid or uninitialized states difficult to represent.

## PL-RS-018 — Avoid Macro Cleverness

Prefer functions, traits, enums, and straightforward generics over macros for routine behavior. Use declarative or procedural macros when they eliminate meaningful structural repetition. Keep generated behavior discoverable and diagnostics understandable.

## PL-RS-019 — Measure Performance Before Complexity

Avoid unnecessary allocations, clones, reference counting, and locking in measured hot paths. Prefer predictable ownership and data structures suited to the workload. Profile before replacing clean code with complex low-level optimizations, and validate latency as well as throughput for UI/compositor workloads.

## PL-RS-020 — Testing and Tooling

- Run `cargo fmt --check` for formatting and `cargo clippy` with project-agreed lint settings.
- Test normal, invalid, and failure paths, especially cancellation, lifecycle, FFI, and concurrency boundaries.
- Make warnings intentional; avoid blanket `allow` attributes to silence broad lint groups.
- Pureline Checker must use Rust syntax/AST-aware inspection (including `let ... else`, pattern matching, macros, and expression returns), not textual pattern matching.

## PL-RS-021 — Error Types Match the Crate Role

- Libraries expose typed errors: an `enum` that implements `std::error::Error` and `Display`, with one variant per distinct failure a caller can act on.
- Applications may use one opaque top-level error type at the boundary (`main`, request handlers, CLI commands) to carry context. Do not leak that opaque type through a library's public API.
- Preserve the source error (`source()` or a wrapped variant) instead of converting it to a string.
- `Display` messages are lowercase and carry no trailing punctuation, so that callers can compose them.

```rust
#[derive(Debug)]
pub enum ConfigError {
    Missing(PathBuf),
    Invalid(toml::de::Error),
}
```

## PL-RS-022 — Lints Are Configured Centrally

- Configure lint levels in the manifest (`[lints]` in `Cargo.toml`, or `[workspace.lints]` with `lints.workspace = true` in member crates), not in scattered crate-level attributes.
- Enable the lint groups the project agrees on, and list individual exceptions with a reason next to them.
- A crate-level `#![allow(...)]` is a finding unless a comment explains why the lint is wrong for this code.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
module_name_repetitions = "allow"
```

## PL-RS-023 — Cancellation-Safe Async Code

- When a future is dropped before it completes (for example as a losing branch of `select!`, or on timeout), state whether the operation is cancellation-safe. Document any operation that is not.
- Do not assume that a dropped future has rolled back its work. Commit state changes after the awaited step succeeds, or make the step idempotent.
- Keep the future that holds a lock or an open transaction out of `select!` branches that can drop it mid-operation.

## PL-RS-024 — Tests Sit Next to the Behaviour They Check

- Unit tests live in a `#[cfg(test)] mod tests` block at the end of the file they test. They can reach private items, which keeps the public surface narrow.
- Integration tests live in `tests/` and use only the public API.
- Test names state the behaviour (`rejects_expired_token`), not the function name alone.
- Fixtures are built by small helper functions, not by copying setup blocks into every test.

---

# 15.1 Novus Profile

Novus (`.nv`, `.nvh`) is a self-hosting language that compiles to portable C. Apply the shared core rules together with the rules below. The linter rules `PL-CF-002`, `PL-FN-001`, `PL-STRUCT-001`, `PL-STRUCT-002`, and `PL-NAME-001` are reported by the Novus language server under source `pureline` when `novus.pureline.enabled` is set. `.nvmd` pages are checked through the `.nvh` they generate, and the generator reports errors at the `.nvmd` line.

## PL-NV-001 — Naming and Visibility

- Classes, enums, and components: `PascalCase`. Methods, fields, locals, and parameters: `lowerCamelCase`.
- Package (folder) names: short, lowercase, without separators.
- File-level constants: `private final SCREAMING_SNAKE_CASE`.
- Keep members private unless another package or file uses them. Expose fields through `: get` or `: get, set` only when callers need them.
- Short names are allowed for loop counters (`i`, `j`, `k`). Other one-letter names and placeholders (`tmp`, `obj`, `thing`, `data2`) are reported by `PL-NAME-001`.

## PL-NV-002 — Guard Clauses and Linear Flow

Validate first, return early, and keep the successful path at the base indentation. Avoid `else` after a branch that already returns, breaks, or continues (`PL-CF-002`). When an `else` is genuinely the clearest form, mark the line with a justified exemption: `} else { // pureline:allow-else <reason>`.

## PL-NV-003 — Declarations: `final`, `var`, and Explicit Types

- Use `final` for values that never change; use `var` for locals whose type is obvious from the initialiser.
- Write a declared type where the reader would otherwise have to guess, and at API boundaries.
- An explicit type converts the value: `integer x = 2.9` stores `2`. Make such conversions visible.
- Novus has no compound assignment. Write `count = count + 1`, not `count += 1`.

## PL-NV-004 — Construction and Object Literals

- Use object literals (`Person{name="Tom"}`) for plain data with no behaviour.
- Use `construct()` when the object must establish invariants, derive fields, or validate arguments.
- Do not hide significant work in field initialisers.
- Use `based` inheritance only for a real is-a relationship. Prefer an `interface` when only the behaviour is shared.

## PL-NV-005 — Method Signatures

- Declare parameter and return types when the signature is part of an API, a module boundary, or an `.nvh` component.
- Keep parameter lists short enough to scan.
- Overloads by arity or parameter type are allowed when the meaning is identical. Do not use overloads to hide different behaviour behind one name.

## PL-NV-006 — Function Size Is a Review Signal

The language server reviews a method at 30 lines and reports it above 50 lines (`PL-FN-001`). These are review thresholds. A cohesive method that does one thing in sequence may stay longer; split it when it mixes responsibilities such as parsing, validation, and I/O.

## PL-NV-007 — Packages, Imports, and Folder Density

- A folder is a package. Import the narrowest unit that is needed: `import geo/circle` or `import @helpers` instead of a whole package when one file is enough.
- Keep at most **10 `.nv` / `.nvh` files** per folder by default (`PL-STRUCT-002`).
- Review a file at **200 lines** (`PL-STRUCT-001`). This is a review threshold, not a hard limit.

## PL-NV-008 — Concurrency Has Visible Ownership

- Make concurrency visible at the call site: `async` / `await`, `thread`, `virtual`, and `sync`.
- Track every task that matters. Do not start fire-and-forget work for results the program later depends on.
- Guard shared mutable state explicitly with `sync`.
- Apply [PL-RS-013](#pl-rs-013--async-tasks-have-ownership-and-shutdown)-style shutdown and cancellation discipline.

## PL-NV-009 — Evaluation Order Is Documented, Not Assumed

Do not write code whose result depends on an unusual ordering. Keep side effects in their own statements. The `..` chain is for building an object or array in one linear sequence on the same receiver; break it into named steps when a step needs a comment or a branch.

## PL-NV-010 — C Blocks and Platform Boundaries

A `c { ... }` block is a native boundary. Keep it small, isolate it in a focused file, and document what the C code assumes about types, lifetimes, and the platform. Expose it through a Novus method with a typed signature.

## PL-NV-011 — `.nvh` Components Keep Markup and Logic Apart

- Declare reactive state with `ref` inside `<?nv ... ?>`.
- Keep handlers and computations in Novus blocks; keep the HTML focused on structure.
- Compute derived values in one place, not repeatedly in the markup.
- Treat each component as one responsibility (`PL-STRUCT-001`).

## PL-NV-012 — Comments and Diagnostics

- Comments explain why, not what ([PL-DOC-001](#pl-doc-001--comments-explain-why-not-what)).
- Pureline diagnostics are opt-in in the editor. Enable them for shared projects so that the same rule IDs appear in every editor and in CI.
- Every `pureline:allow-else` exemption needs a reason on the same line.

## PL-NV-013 — Markdown Content (`.nvmd`)

A `.nvmd` file is Markdown with Novus in it. The generator in nvh-markdown turns `Page.nvmd` into `Page.nvh` before the compiler runs. Apply the rules above to the header block and to any `.nv` modules it imports; the Markdown body follows these rules.

- The body carries the content. The header block (`<?nv ... ?>`) carries only imports, props, and a few methods; longer logic moves into a `.nv` module.
- Frontmatter keys are the page's props. Keep them short and flat, and use `{title}` rather than repeating the value.
- Keep each `{expr}` to one value or one call. Compute anything longer in the header or a module.
- Keep `{#if}` and `{#for}` blocks at most two levels deep. When a block repeats markup, use a component (`<Callout>`, `<Toc>`).
- A heading whose text is dynamic gets an explicit id (`# {title} {#intro}`), so anchors and `markdown.headings` stay stable.
- Generated `.nvh` files are build output: add them to `.gitignore`, never edit them, and fix the `.nvmd` source. Keep the `<?nv /* nvmd-generated */` mark intact.
- An HTML block with a handler (`<button @click="hit">`) is nvh inside Markdown. Keep such blocks short and separate them with blank lines.

---

# 15.2 React Profile

The React profile targets React 19 with TypeScript in strict mode, bundled with Vite and routed with react-router. Apply the shared core rules, the JavaScript profile, and the TypeScript profile together with it. Components are functions; a component reads as props in, guards, derived values, markup out.

## PL-REACT-001 — Components Are Named Functions

Components are named functions in `PascalCase`, exported by name. One component is one responsibility. Never define a component inside another component: it is remounted on every render and loses its state.

## PL-REACT-002 — Guard Clauses Before the Main Markup

Handle loading, error, and empty states first and return early. Avoid nested ternaries in JSX; compute the branch into a named constant or return it from a guard.

## PL-REACT-003 — Hooks Are Unconditional and Top-Level

Call hooks at the top level of a component or custom hook, in the same order on every render. A custom hook is named `useX`, encapsulates one concern, and returns a stable, typed result.

## PL-REACT-004 — Derived Values Are Computed, Not Stored

Compute a value from props or state during render. Do not copy props into state. Use `useMemo` only where a measured cost or a memoized child's referential stability justifies it.

## PL-REACT-005 — Effects Synchronise with External Systems

`useEffect` synchronises with something outside React. It is not for deriving state, responding to user events, or initialising state a parent can own. Every subscribing effect returns a cleanup that undoes exactly its own work. Prefer `useSyncExternalStore` for external stores.

## PL-REACT-006 — Props Are Typed Explicitly

Declare props with an `interface` (or `type` for unions) named `<Component>Props`. Do not use `any`. Use union types for variants (`status: "idle" | "loading" | "done"`) rather than sets of optional booleans.

## PL-REACT-007 — Context Carries Cross-Cutting Values Only

Use context for values many components need and that change rarely (current user, theme, locale, service client). Pass ordinary data through props. Expose each context through a custom hook that throws a clear error when the provider is missing.

## PL-REACT-008 — Data Loading Has an Owner

Load route data through router loaders where the app uses them. Outside the router, use a data library or a hook that handles cancellation and stale responses. Do not write bare `fetch` calls in effects without an abort signal.

## PL-REACT-009 — Keys Identify Items, Not Positions

Use a stable identifier from the data as the key. Do not use array indices for lists that can be reordered, filtered, or changed in length.

## PL-REACT-010 — Render Is Pure

Rendering computes markup from props and state only. Do not mutate props, module state, or DOM nodes during render, and do not start requests or subscriptions there. The app runs under `StrictMode`; a component that behaves differently on its second render is a bug.

## PL-REACT-011 — Event Handlers and Callback Props

Name handlers `handleX` and props that receive them `onX`. Give longer handlers a name so the component body stays linear. Use `useCallback` only where a memoized child depends on referential stability.

## PL-REACT-012 — Styling Stays Close to the Markup

Utility classes stay next to the element they style. A class string repeated in three or more places becomes a named component or constant.

## PL-REACT-013 — Folder Density and Feature Folders

Group components, hooks, and tests by feature when a feature has several files. Shared primitives live in one `components/` or `ui/` folder. A folder holds at most 10 hand-maintained source files by default; split along responsibilities, not into meaningless nested folders.

## PL-REACT-014 — Routing Is a Boundary

Keep route definitions in one place. Route components receive or load data at the boundary and pass plain props to presentational components, which do not read the URL themselves.

---

# 15.3 Python Profile

Apply the shared core rules together with this profile. Python is indentation-based, so the brace rules of the JavaScript profile do not apply. Pureline Python follows **PEP 8**, **PEP 484 type hints**, and the formatter the project uses (ruff or black). Cohesion over Size applies throughout.

## PL-PY-001 — Idiomatic Naming

- Modules, packages, functions, methods, and variables: `snake_case`.
- Classes and exceptions: `PascalCase`. Exceptions end in `Error`.
- Module constants: `UPPER_SNAKE_CASE`.
- No Java-style prefixes (`IStorage`) or Hungarian notation. Use `Storage` for a protocol and `FileStorage` for an implementation.

## PL-PY-002 — Guard Clauses and Linear Flow

Validate first, return or raise early, and keep the successful path at the base indentation.

```python
def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
```

A one-line guard is allowed when the body is a single `return` or `raise`. Do not use one-line bodies for statements with side effects.

```python
if user is None: raise MissingUserError()   # not Pureline: the body is hidden on the header line
```

## PL-PY-003 — Type Hints at Boundaries

- Annotate public functions, methods, and class attributes.
- Annotate locals only when the type is not obvious from the right-hand side.
- Use `X | None` instead of `Optional[X]` on Python 3.10 and later.
- Run a type checker (mypy or pyright) in strict mode for new code.

## PL-PY-004 — Specific Exceptions, Never Bare `except`

Catch the narrowest exception that the code can handle. Never write `except:` or `except Exception: pass`. Preserve the cause when converting an error:

```python
try:
    config = tomllib.loads(text)
except tomllib.TOMLDecodeError as error:
    raise ConfigError(path) from error
```

## PL-PY-005 — Resources Use Context Managers

Open files, sockets, locks, and database sessions with `with`. Do not rely on `__del__` or on garbage collection for cleanup. Wrap a resource in a small context manager only when the same cleanup is needed in several places.

## PL-PY-006 — Comprehensions Only When They Read Clearly

A comprehension expresses one transformation with an optional filter. Use a loop when the body has side effects, branches, or more than one level of nesting.

```python
active_names = [user.name for user in users if user.active]
```

## PL-PY-007 — Data Classes Over Ad-hoc Dictionaries

Data that crosses a function boundary has a named shape. Use `@dataclass(frozen=True, slots=True)` for internal data and a validated model (for example Pydantic) at external boundaries. Do not pass `dict[str, Any]` between modules.

## PL-PY-008 — No Mutable Defaults and No Hidden Global State

Never use a mutable default argument (`def f(items=[])`); use `None` and create the value inside the function. Module-level state is limited to constants and configured singletons created at startup. Pass dependencies explicitly.

## PL-PY-009 — Async Tasks Have an Owner

Use `asyncio.TaskGroup` (or an equivalent structured scope) so that every task has a parent that waits for it and propagates its errors. Do not create fire-and-forget tasks with `asyncio.create_task` for work the program depends on. Do not call blocking I/O inside a coroutine; move it to `asyncio.to_thread`.

## PL-PY-010 — Package and Module Density

A package holds at most **10 modules** by default, excluding tests and generated code. Split along responsibility. Keep `__init__.py` to re-exports and short package docstrings; put real logic in named modules.

## PL-PY-011 — Formatting Is Delegated to the Formatter

Follow `ruff format` or black for layout, quotes, and trailing commas. Pureline does not require manual formatting that the formatter would undo.

## PL-PY-012 — Tooling

- Run `ruff check` for lint and a type checker for types, in CI.
- Test normal, invalid, and failure paths. Use `pytest` and keep fixtures in `conftest.py` only when several test modules share them.
- Avoid blanket `# noqa` and `# type: ignore` without a rule code and a reason on the same line.

---

# 15.4 QML Profile

Apply the shared core rules with this profile. QML is declarative: a file describes an object tree, its properties, and its bindings. JavaScript inside QML is for small expressions and handlers, and the JavaScript profile applies to every block in it. Pureline QML targets **Qt 6** with Qt Quick.

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

## PL-QML-001 — One Root Object per File

Each `.qml` file defines one component whose name is the file name (`SessionCard.qml` defines `SessionCard`). Put nested helper components in their own files when they are reused; keep a helper inline only when nothing else uses it.

## PL-QML-002 — Naming

- Component files and type names: `PascalCase`.
- Properties, signals, functions, and ids: `lowerCamelCase`.
- Ids name the role of the object (`titleLabel`, `retryButton`), never its type or position (`text1`, `rect2`).
- Signal handlers follow the signal name: `onClicked`, `onAccepted`.

## PL-QML-003 — Declare Interfaces Explicitly

Declare the inputs of a component with `required property` and a type. Use `readonly property` for values the component computes. Enable `pragma ComponentBehavior: Bound` so that ids resolve through explicit scope.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

## PL-QML-004 — Bindings Over Imperative Assignment

Express state as a binding (`visible: user.active`). Do not copy values in `Component.onCompleted` or in handlers when a binding would keep them correct. Assign imperatively only for a one-time action, such as starting an animation or sending a request.

## PL-QML-005 — Guards Are Bindings or Early Returns

Use `visible`, `enabled`, and `Loader.active` to switch branches. In a JavaScript function, return early instead of nesting the main path inside a condition.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

## PL-QML-006 — Keep Expressions Small

A binding holds one expression of at most one conditional and a short call. Move longer logic into a named function or a C++ / Python backend object. Nested ternaries are not Pureline.

## PL-QML-007 — Property Order Groups the Object

Write the properties of an object in this order, with a blank line between groups: identity (`id`), required and public properties, bindings, child objects, signal handlers, functions.

## PL-QML-008 — Layout Is Declarative

Use `Layout` types (`RowLayout`, `ColumnLayout`, `GridLayout`) and anchors for placement. Do not hard-code absolute `x` and `y` values for content that must adapt to size. Hard-coded sizes belong to design tokens in a `Theme` singleton.

## PL-QML-009 — Theme and Tokens in One Place

Colours, spacing, and font sizes come from one `Theme` singleton (`pragma Singleton`). Components read tokens; they never repeat literal values.

## PL-QML-010 — Folder Density

A folder of QML components holds at most **10 files** by default. Group components by feature (`views/session/`), and keep shared controls in one `controls/` folder.

## PL-QML-011 — Tooling

Run `qmllint` (with `--unqualified` warnings enabled) and the `qmlformat` tool in CI. Test behaviour with `QtTest`, and keep warnings intentional.

---

# 15.5 Astro Profile

Apply the shared core rules with this profile, and the TypeScript profile for the frontmatter script. Astro renders HTML on the server or at build time and ships JavaScript only where it is needed. Pureline Astro keeps that model visible: static by default, interactive where declared. Pureline is compatible with Astro 5 and later.

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

## PL-AS-001 — Components Are `.astro` Files Named in `PascalCase`

A component lives in `src/components/` and is named after what it renders (`SessionCard.astro`). A page or layout lives in `src/pages/` or `src/layouts/`. Route files stay thin: they load data and compose components.

## PL-AS-002 — Frontmatter Is Linear and Typed

The frontmatter (between `---` fences) does four things in order: receive typed props, load data, compute derived values, and then render. Declare props with an `interface Props`. Keep the frontmatter free of markup.

```astro
---
interface Props {
    title: string;
    draft?: boolean;
}

const { title, draft = false } = Astro.props;
if (draft) {
    return Astro.redirect("/drafts");
}
---
<h2>{title}</h2>
```

## PL-AS-003 — Static by Default, Islands by Declaration

Render HTML without JavaScript unless the component must respond to the user or change over time. When it must, mark the one interactive component with an explicit client directive: `client:visible` for content below the fold, `client:idle` for non-urgent widgets, `client:load` only for what is needed at first paint. A component without a directive never ships JavaScript.

## PL-AS-004 — Templates Stay Readable

- Conditionals with `&&` or a named variable for a single branch; use a guard in the frontmatter for early exits.
- Maps over lists with a stable `key` when the list is interactive.
- Do not nest more than two expression levels inside the markup. Move the inner part to a component.

## PL-AS-005 — Styles Are Scoped

Use `<style>` blocks in the component by default; Astro scopes them automatically. Use `is:global` only for document-wide rules such as reset or theme tokens, and keep those in one global stylesheet.

## PL-AS-006 — Data Has One Source

Content lives in content collections (`src/content/`) with a schema (`defineCollection` and zod). Pages query the collection; they do not parse Markdown files themselves. Remote data is loaded in the frontmatter of the page that needs it, once.

## PL-AS-007 — Framework Islands Follow Their Own Profile

A React, Vue, or Svelte island follows that framework's profile (for React: PL-REACT). Astro does not change the rules of the component; it only decides where the component is hydrated.

## PL-AS-008 — Folder Density

`src/components/` holds at most **10 files** by default. Group components by feature (`components/blog/`) once a feature has several files.

## PL-AS-009 — Tooling

Run `astro check` (types and template diagnostics) and the build in CI. Use `astro build` output to verify that pages without islands ship no JavaScript.

---

# 15.6 HTML Profile

Apply the shared core rules with this profile. HTML is the structure of a document. Pureline HTML uses **semantic elements**, keeps presentation in CSS, and keeps behaviour in JavaScript. Pureline HTML targets **HTML Living Standard** documents and the framework templates that produce them (Astro, JSX templates excluded: see the framework profiles).

## PL-HTML-001 — Use Semantic Elements

Choose the element for the meaning of the content: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. A `<div>` or `<span>` is for grouping that has no meaning of its own. A button that performs an action is a `<button>`; a link that navigates is an `<a href>`.

```html
<nav aria-label="Primary">
  <a href="/docs">Docs</a>
</nav>
```

## PL-HTML-002 — One Heading Structure per Page

A page has one `<h1>`. Headings follow their level in order (`h2` after `h1`, `h3` after `h2`) and are never chosen for their size; size belongs to CSS.

## PL-HTML-003 — Attributes Are Minimal and Quoted

Use lowercase element and attribute names, double quotes for attribute values, and no inline `style` attributes or inline event handlers. Omit attributes that equal their default. Keep `class` values short and named by role.

## PL-HTML-004 — Forms Have Labels

Every input has a visible `<label>` associated with `for` and `id`, or wraps the input. Placeholder text is not a label. Group related controls with `<fieldset>` and `<legend>`.

## PL-HTML-005 — Images and Media Have Text Alternatives

Every `<img>` has an `alt` attribute: a description for informative images, an empty `alt=""` for decorative ones. Give `width` and `height` to prevent layout shift. Videos provide captions through `<track>`.

## PL-HTML-006 — Keep Behaviour Out of Markup

Scripts are external files loaded with `type="module"` or `defer`. Do not place inline `<script>` blocks with application logic in the page. Inline JSON data for a single script is the only accepted exception, marked with `type="application/json"`.

## PL-HTML-007 — Document Head Is Complete

Each page sets `<html lang>`, a `<meta name="viewport">`, a unique `<title>`, and a `<meta name="description">` when the page is public. Favicons and social metadata are declared once in the layout, not repeated per page.

## PL-HTML-008 — Compact Nesting

Keep element nesting shallow. When a block nests more than four levels deep, extract a component or a template fragment. Put one block element per line; keep inline phrasing content on the same line as its text.

## PL-HTML-009 — Validation Is Part of the Build

Validate HTML in CI with the W3C validator or `html-validate`. A warning about a missing `alt` or label is a build failure, not a suggestion.

---

# 15.7 CSS Profile

Apply the shared core rules with this profile, and the HTML profile for the markup it styles. CSS is declarative: a rule states what an element looks like, not how the browser should compute it. Pureline CSS uses the modern language: custom properties, cascade layers, nesting, logical properties, and container queries. Tailwind CSS utilities follow the same principles when a project uses them.

```text
Tokens (custom properties)
↓
Layers (reset, base, components, utilities)
↓
Components (low specificity)
↓
Overrides (rare, explicit)
```

## PL-CSS-001 — Tokens Before Values

Colours, spacing, radii, font sizes, and durations are custom properties declared once on `:root` or in a theme scope. Components read `var(--space-3)`; they never repeat `#22d3ee` or `12px`.

```css
:root {
  --color-accent: #22d3ee;
  --space-3: 0.75rem;
}

.badge {
  color: var(--color-accent);
  padding: var(--space-3);
}
```

## PL-CSS-002 — Cascade Layers Own the Order

Declare the order of layers once: `@layer reset, base, components, utilities;`. Put each file's rules into the layer that matches their role. Do not rely on source order or on `!important` to win a conflict.

## PL-CSS-003 — Keep Specificity Low

Style with single classes. Do not style with element chains (`div section ul li a`) or ids. Specificity that grows with the markup makes later changes expensive. A selector deeper than two levels is a review finding.

## PL-CSS-004 — No `!important` Outside Utilities

`!important` is allowed only for utility classes that must override a component, and only in the utilities layer. Anywhere else it is a finding.

## PL-CSS-005 — Nesting Mirrors the Component

Use native CSS nesting for states and children of one component (`&:hover`, `& .title`). Do not nest more than two levels. Nesting never replaces a separate component.

## PL-CSS-006 — Logical Properties and Layout Modules

Use logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) for layouts that must work in both writing directions. Use Flexbox for one-dimensional rows and columns, and Grid for two-dimensional layouts. Do not use floats for layout.

## PL-CSS-007 — Responsive Rules Follow the Component

Prefer container queries (`@container`) for a component's own layout, and media queries for page-level structure. Each breakpoint is a named token, not a repeated literal.

## PL-CSS-008 — Property Order Is Consistent

Within a rule, group properties in this order with a blank line between groups: layout (`display`, position, flex/grid), box (size, margin, padding, border), typography, visual (colour, background, shadow), and motion (transition, animation).

## PL-CSS-009 — Naming

Class names are `kebab-case` and describe the role of the element (`session-card`, `session-card-title`), not its appearance (`red-box`). BEM-style names are allowed when a project already uses them.

## PL-CSS-010 — Motion Respects the User

Every animation or transition has a `@media (prefers-reduced-motion: reduce)` alternative that removes or shortens it. Animate `transform` and `opacity` only.

## PL-CSS-011 — Folder Density

A stylesheet folder holds at most **10 files**. Split by layer or by component group, not by property type (`colors.css`, `spacing.css`).

## PL-CSS-012 — Tooling

Run a linter such as `stylelint` with the project's rules in CI. Enable the stylelint rules for specificity and `!important`, so that PL-CSS-003 and PL-CSS-004 are checked automatically.

---

# 15.8 C# Profile

Apply the shared core rules with this profile. C# is a managed, brace-based language with strong compiler support. Pureline C# targets **.NET 8** or later.

## PL-CS-001 — Naming Follows the .NET Convention

Use `PascalCase` for types, members, and constants, `camelCase` for locals and parameters, and `_camelCase` for private fields. Names state the role of a value, not its type.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

## PL-CS-002 — Nullable Reference Types Are On

Set `<Nullable>enable</Nullable>` in every project. `string` never holds null, and `string?` declares that it may. Do not silence the compiler with `!`; fix the flow instead.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

## PL-CS-003 — Records for Immutable Data

Model data that moves between layers as a `record`. Derive changed copies with `with` instead of mutating. Use a class only when the object has identity or behaviour of its own.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

## PL-CS-004 — Guard Clauses Return Early

Check invalid input first and return immediately, so the main path stays at the outer indentation level with no `else`. See control flow.

```csharp
public static decimal Discount(decimal total)
{
    if (total <= 0)
    {
        return 0;
    }

    return total * 0.1m;
}
```

## PL-CS-005 — Dispose with `using` Declarations

Use a `using` declaration so disposal happens at the end of the enclosing scope. Each `IDisposable` has one owner, and that owner disposes it.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

## PL-CS-006 — Async All the Way with Task

Return `Task` or `Task<T>`, suffix the name with `Async`, accept a `CancellationToken`, and never block with `.Result` or `.Wait()`. Use `ValueTask` only where a measurement justifies it.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

## PL-CS-007 — LINQ Only When It Reads Clearly

Use LINQ for one linear transformation: a filter, a projection, or a materialization. Switch to a `foreach` loop when the query has side effects, branches, or more than three chained operators.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

## PL-CS-008 — Namespace per Folder, Bounded Folder Density

The namespace mirrors the folder path, so `Sessions/Views/` uses `Acme.Sessions.Views`. A folder holds at most **10 hand-maintained source files** by default. Group by feature rather than by kind, and exceed the limit only when every file serves one responsibility (cohesion over size, see structure).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

## PL-CS-009 — Tooling

Run `dotnet format --verify-no-changes` in CI as the official formatter. Enable the Roslyn analyzers and add StyleCop.Analyzers for naming and ordering rules, keep warnings intentional, and test behaviour with xUnit or NUnit (see tooling).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```

---

# 15.9 Angular Profile

Apply the shared core rules, the JavaScript profile, and the TypeScript profile together with this profile. The Angular profile targets **Angular 17 or later** with TypeScript in strict mode. A component reads as a small pipeline: inputs in, guards in the template, derived values, markup out.

## PL-NG-001 — Standalone Components and `inject()`

Every component is standalone (default from Angular 19; set `standalone: true` on 17 and 18). Declare dependencies with `inject()` as `private readonly` fields, so the class body starts with its state, not with a constructor.

```ts
@Component({
    selector: 'app-session-card',
    template: `<h2>{{ session().name }}</h2>`,
})
export class SessionCardComponent {
    readonly session = input.required<Session>();
    private readonly router = inject(Router);
}
```

## PL-NG-002 — Signals Hold State, OnPush Renders It

- `signal()` holds writable state, `computed()` derives values, `input()` and `output()` form the interface; never keep a derived value in a second field. Every component sets `ChangeDetectionStrategy.OnPush`, so signals read in the template drive the updates.

```ts
@Component({
    selector: 'app-counter',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<button (click)="increment()">{{ count() }} / {{ doubled() }}</button>`,
})
export class CounterComponent {
    readonly count = signal(0);
    readonly doubled = computed(() => this.count() * 2);
    increment(): void {
        this.count.update((value) => value + 1);
    }
}
```

## PL-NG-003 — Built-in Control Flow with `track`

Use `@if`, `@for`, and `@switch`; do not use `*ngIf` or `*ngFor` in new code. Every `@for` tracks a stable identifier from the data, never `$index` for lists that can change. Use `@empty` for the empty state.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

## PL-NG-004 — Typed Reactive Forms

Use reactive forms with `nonNullable` controls, so a reset never yields `null`. After the validity guard, read values with `getRawValue()`, which is fully typed.

```ts
readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
});
submit(): void {
    if (this.form.invalid) {
        return;
    }

    this.users.create(this.form.getRawValue());
}
```

## PL-NG-005 — Smart and Presentational Components

- A **smart** component (a page or route target) injects services, owns the signals, and passes plain inputs down. A **presentational** component receives data through `input()`, reports through `output()`, and injects no services.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

## PL-NG-006 — Services Have One Responsibility

A service talks to one API, holds one piece of shared state, or implements one domain rule. Components never call `HttpClient` directly. Use `providedIn: 'root'` unless a feature needs a scoped instance.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

## PL-NG-007 — Feature Folders and Folder Density

- Group files by feature (`features/sessions/`): component, template, service, and spec together. Name files by role: `session-list.component.ts`, `session-api.service.ts`.
- A folder holds at most **10 hand-maintained source files** by default (PL-TS-007). Split along responsibilities, not into empty nested folders (PL-STRUCT-003).

## PL-NG-008 — Strict Types, No `any`

Enable `"strict": true` in `tsconfig.json`. Do not use `any` in components, services, or templates. Treat HTTP or storage data as `unknown` and narrow it at the boundary (PL-TS-001).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

## PL-NG-009 — Tooling

Run `ng lint` (from `@angular-eslint`), `ng build`, and `ng test` in CI. Format with the official formatter, Prettier, and check it with `prettier --check`. Keep warnings intentional: fix them or suppress them with a stated reason.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```

---

# 15.10 Vue Profile

Apply the shared core rules, the JavaScript profile, and the TypeScript profile together with this profile. The Vue profile targets **Vue 3 with the Composition API, `<script setup>`, and TypeScript in strict mode**. A component reads as a small pipeline: typed inputs, reusable logic, derived values, markup.


```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

## PL-VUE-001 — Components Use `<script setup lang="ts">`

Every component is a Single-File Component with `<script setup lang="ts">` and a `<style scoped>` block. Order the blocks script, template, style, so inputs are read before markup.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

## PL-VUE-002 — Props and Emits Are Typed

Declare props with a type-only `defineProps<T>()` and emits with `defineEmits<{ ... }>()`. Use union types for variants, never a set of optional booleans (PL-TS-001).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

## PL-VUE-003 — Computed Over Watch

Derive a value with `computed` whenever it follows from props or state. Use `watch` only for side effects such as requests or timers, never to set a ref that a `computed` could produce.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

## PL-VUE-004 — Composables Own One Concern

Put reusable stateful logic in a `useX` function that returns refs and functions. One composable handles one concern: one subscription, one form, one data source. Shared composables live in a `composables/` folder.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

## PL-VUE-005 — `v-if` Creates, `v-show` Toggles

Use `v-if` for guards, empty states, and branches that must not exist in the DOM. Use `v-show` for a value that flips often, such as a panel the user toggles.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

## PL-VUE-006 — Lists Use a Stable `:key`

Every `v-for` has a `:key` bound to a stable identifier from the data, never the index of a list that can be reordered or filtered. Do not combine `v-if` and `v-for` on one element; filter in a `computed` instead.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

## PL-VUE-007 — Templates Hold Simple Expressions Only

A template expression is one property access, one simple ternary, or one short call. Move anything longer into a `computed` or a named function. Nested ternaries are not Pureline (control flow).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

## PL-VUE-008 — Pinia Holds Shared State

Keep state in a component or composable until two unrelated parts of the app need it, then move it to a Pinia store. Read stores with `storeToRefs` so destructuring keeps reactivity.

```ts
const { items } = storeToRefs(useSessionStore());
```

## PL-VUE-009 — Folder Density

A folder holds at most **10 hand-maintained source files** by default. Group components, composables, and stores by feature (`features/sessions/`) when a feature has more than one file, and keep shared primitives in one `components/` folder (structure).

## PL-VUE-010 — Tooling

Run **eslint-plugin-vue** (with its `flat/recommended` configuration) and **Prettier** for linting and formatting, and run **vue-tsc** for type checking in CI. A disabled lint rule needs a comment that says why.

---

# 15.11 GDScript Profile

Apply the shared core rules with this profile. GDScript 4 is a typed scripting language attached to nodes in scenes. Read the core principles first; the rules below apply them to nodes, signals, and scenes.

## PL-GD-001 — Static Typing Everywhere

Type every variable, parameter, and return value. The editor checks typed code before it runs, and the types document intent. Use `-> void` for functions that return nothing.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

## PL-GD-002 — Export Designer-Facing Values

Expose values a designer should tune with `@export`, typed and ranged where possible. Keep values that belong to the code private to the script.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

## PL-GD-003 — Node References With @onready

Resolve child nodes once with `@onready`, typed, and name the node by its role. Never fetch nodes with `get_node()` inside a loop or a per-frame callback.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

## PL-GD-004 — Signals Decouple Upward Communication

A node reports events by emitting a signal and does not call into its parents or siblings. The owner that composes the scene connects the signal. Calls flow down to children; events flow up as signals.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

## PL-GD-005 — Lifecycle Callbacks Serve Their Purpose

Use `_ready()` for setup that needs the node in the tree, `_process(delta)` for frame-rate visuals and timers, and `_physics_process(delta)` for movement and collision. Do not put game rules in `_process` or setup in `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

## PL-GD-006 — Naming and Constants

- Functions, variables, and signals: `snake_case`. `class_name` and node types: `PascalCase`.
- Fixed values use `const` and `UPPER_SNAKE_CASE`, so the value and its meaning live in one place.
- Names state the role (`attack_cooldown`), never a type or position (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

## PL-GD-007 — Scenes Are Composed From Small Scenes

Build a scene from small reusable scenes, each with its own script and responsibility. Reference direct children by name. Avoid deep node paths, because they couple the script to the internal layout of another scene.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

## PL-GD-008 — Guard Clauses in Scripts

Check invalid state first and return early. The main path of a function stays flat and unindented. Use `is_instance_valid()` before touching a node reference that may have been freed.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

## PL-GD-009 — Folder Density

A folder of hand-maintained scripts holds at most **10 files** by default. Group scripts by feature, and keep shared components in one folder.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

## PL-GD-010 — Tooling

Keep the Godot script editor warnings enabled and fix them rather than hiding them. Run `gdformat` and `gdlint` from the GDScript toolkit (`gdtoolkit`) in CI.

```bash
gdformat --check scripts/
gdlint scripts/
```

---

# 15.12 C Profile

Apply the shared core rules together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. Cohesion over Size applies throughout.


Pureline C follows **idiomatic C11/C17**: explicit ownership, explicit error codes, and small translation units. C has no destructors or exceptions, so discipline must be visible in the code itself.

## PL-C-001 — Guard Clauses and Linear Flow

Validate arguments first and keep the success path at the base indentation level (see PL-CORE-003); avoid `else` after a returning branch.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

## PL-C-002 — Return and Check Error Codes

Fallible functions return an `enum` status and pass results through out-parameters. Every status is checked; a deliberate discard uses a `(void)` cast with a comment.

```c
int load(struct session *session)
{
    int status = session_open(session);
    if (status != 0) {
        return status;
    }
    return session_start(session);
}
```

## PL-C-003 — Explicit Heap Ownership

Each heap allocation has exactly one owner. `*_create` transfers ownership to the caller, `*_destroy` releases it, and callees never free borrowed pointers.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

## PL-C-004 — `goto` Only for a Single Cleanup Exit

Jump forward to one `cleanup:` label per function, initialise resources to `NULL` first, and never use `goto` for loops or skipped logic.

```c
int report_write(const char *path, const char *text)
{
    int result = -1;
    FILE *file = fopen(path, "w");
    if (file == NULL || fputs(text, file) == EOF) {
        goto cleanup;
    }
    result = 0;
cleanup:
    if (file != NULL) {
        fclose(file);
    }
    return result;
}
```

## PL-C-005 — Const Correctness and Explicit State

Read-only parameters are `const`, locals assigned once are `const`, and runtime state is passed explicitly in a context struct instead of file-scope variables.

```c
int cache_insert(struct cache *cache, const char *key);
```

## PL-C-006 — Small, Focused Functions

Each function does one thing at one level of abstraction; extract a helper when a block needs a name. A cohesive state machine may stay long rather than being split arbitrarily.

```c
int save_report(const struct report *report, const char *path)
{
    char *text = NULL;
    int status = report_render(report, &text);
    if (status == 0) {
        status = file_write_text(path, text);
    }
    free(text);
    return status;
}
```

## PL-C-007 — Static Linkage and Minimal Headers

Mark non-public functions and variables `static`, prefix public symbols with their module name, and give every header an include guard plus only the consumer-facing surface.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

## PL-C-008 — Source Folder Density

A C feature folder holds at most **10 hand-maintained `.c` and `.h` files** by default. Generated code, vendored libraries, and tests do not count. Split along responsibility, never into nested folders for their own sake.

```c
#include "session/session.h"
```

## PL-C-009 — Tooling and Warnings

Build with `-std=c11 -Wall -Wextra -Werror -pedantic`, format with `clang-format`, and check with `clang-tidy`. Any suppression needs a comment explaining why.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```

---

# 15.13 C++ Profile

Apply the shared core rules together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. Cohesion over Size applies throughout.


Pureline C++ follows **modern C++17 and C++20** idioms. Ownership lives in types, resources are released by destructors, and failure is returned as a value.

## PL-CPP-001 — RAII and Unique Ownership

Every resource is owned by an object whose destructor releases it. Use `std::unique_ptr` (via `std::make_unique`) by default; `std::shared_ptr` only for genuinely shared ownership. Raw `new` and `delete` do not appear in application code.

```cpp
#include <fstream>
#include <string>

void save(const std::string& path, const std::string& text) {
    std::ofstream output{path};  // closed on every return path
    output << text;
}
```

## PL-CPP-002 — Const by Default

Mark values `const` unless they must change, and use `constexpr` for compile-time constants. Pass read-only arguments by `const &`; take by value only when the function stores or consumes them.

```cpp
constexpr int kMaxRetries = 3;

bool retry_allowed(const int attempt) {
    return attempt < kMaxRetries;
}
```

## PL-CPP-003 — Guard Clauses and `std::expected`

Validate at the top of the function and keep the success path at base indentation, following control flow. Use `std::optional<T>` for absence and `std::expected<T, E>` for failures the caller must handle (C++23; C++17/20 projects use an equivalent such as `tl::expected`). Never return error codes through out parameters.

```cpp
#include <expected>
#include <string>

enum class ConfigError { Missing };

std::expected<std::string, ConfigError> load_path(const std::string& path) {
    if (path.empty()) {
        return std::unexpected{ConfigError::Missing};
    }
    return path;
}
```

## PL-CPP-004 — Range-Based `for`

Prefer range-based `for` over index loops. Use a standard algorithm only when its name states the intent more clearly than a loop.

```cpp
#include <string>
#include <vector>

int count_long(const std::vector<std::string>& names) {
    int count = 0;
    for (const auto& name : names) {
        if (name.size() > 8) {
            ++count;
        }
    }
    return count;
}
```

## PL-CPP-005 — Small Classes with One Responsibility

A class owns one coherent concept and its invariants. Keep data private and expose a narrow interface. Split classes that mix storage, pricing, persistence, or presentation. Cohesion over Size decides, not a line count.

```cpp
#include <vector>

class Cart {
public:
    void add(int price_cents) { prices_.push_back(price_cents); }

private:
    std::vector<int> prices_;
};
```

## PL-CPP-006 — Header and Source Split

Declare interfaces in a `.hpp` header and define them in a matching `.cpp`. Every header uses `#pragma once` or classic include guards, and never contains `using namespace`, which leaks names into every includer.

```cpp
// format.hpp
#pragma once

#include <string>

std::string format_price(int cents);
```

## PL-CPP-007 — Folder Density

A source folder holds at most **10 hand-maintained production files** (`.hpp` and `.cpp` both count) by default. Tests, generated code, and vendored code do not count. Past that threshold, split along real responsibility boundaries, never into meaningless nested folders.

```cpp
#include "orders/order.hpp"
#include "orders/order_pricing.hpp"
#include "orders/order_persistence.hpp"
```

## PL-CPP-008 — Tooling Enforces the Baseline

Format with `clang-format`, lint with `clang-tidy`, and compile with `-Wall -Wextra -Werror`. Warnings are defects, not suggestions.

```cpp
// Build:  clang++ -std=c++20 -Wall -Wextra -Werror -c cart.cpp
// Lint:   clang-tidy cart.cpp -- -std=c++20
```

---

# 15.14 Lua Profile

Apply the shared core rules with this profile. Lua is small and table-centric: a file is a chunk that builds one module table, and structure comes from plain tables and functions. Pureline Lua targets **Lua 5.4**.


```text
Requires (explicit dependencies)
↓
Local helpers
↓
Module table
↓
return module
```

## PL-LUA-001 — Local by Default

Declare every variable and function with `local`. A global is shared state that any other file can overwrite silently. Do not write to `_G` or `_ENV` outside a program's entry point. See naming and state and side effects.

```lua
local function parse_port(text)
    return tonumber(text)
end
```

## PL-LUA-002 — One Module Table per File

Each file builds a local table, fills it with its public functions, and returns it. Require dependencies at the top so they stay visible.

```lua
local json = require("json")

local session = {}

function session.create(user)
    return { id = user.id, active = true }
end

return session
```

## PL-LUA-003 — Guard Clauses and Early Return

Check missing and invalid input first, return early, and keep the main path unindented. Follow control flow and functions.

```lua
function session.rename(current, name)
    if current == nil then
        return nil, "missing session"
    end
    if type(name) ~= "string" or name == "" then
        return nil, "invalid name"
    end

    current.name = name
    return current
end
```

## PL-LUA-004 — Explicit Nil Checks

Compare against `nil` directly. `false` is a real value in Lua, so `if not value` also catches a meaningful `false`. Test `== nil` when the difference matters.

```lua
local function timeout_or_default(config)
    if config.timeout == nil then
        return 30
    end
    return config.timeout
end
```

## PL-LUA-005 — Errors Are Values

Return `nil, err` for expected failures such as a missing file or bad input, and check the pair at the call site. Use `assert` only for programmer errors and broken invariants, where stopping is the correct response.

```lua
local function read_config(path)
    local file, err = io.open(path, "r")
    if file == nil then
        return nil, err
    end

    local text = file:read("a")
    file:close()
    return text
end
```

## PL-LUA-006 — Metatables Only When They Clarify

Plain tables and functions are the default. Use a metatable (`__index` for a type, `__tostring` for debugging output) only when it makes call sites clearer. Do not build inheritance chains or operator overloads for convenience. See avoid unnecessary abstractions.

```lua
local Stack = {}
Stack.__index = Stack

function Stack.new()
    return setmetatable({ items = {} }, Stack)
end
```

## PL-LUA-007 — Small Functions

Each function does one thing and fits on a screen. Extract a named local function instead of a long body with a comment marking each section. See functions.

## PL-LUA-008 — String Keys for Records

Records use string keys and dot access. Reserve integer keys for sequences, and never mix the two in one table.

```lua
local user = { name = "Ada", active = true } -- record: string keys
local tags = { "admin", "ops" }              -- sequence: integer keys
```

## PL-LUA-009 — Blocks End on Their Own Lines

Every `function`, `if`, `for`, `while`, and `do` block closes with `end` on its own line, aligned with its opening keyword. Keep blocks multi-line, even for a single statement. See formatting.

```lua
for _, job in ipairs(jobs) do
    if job.pending then
        start(job)
    end
end
```

## PL-LUA-010 — No Clever One-Liners

Prefer a sequence of plain statements over dense expressions. Do not use `cond and a or b` when `a` can be `nil` or `false`, because the fallback fires silently. Use an `if` instead.

```lua
local mode = "guest"
if user.admin then
    mode = user.mode
end
```

## PL-LUA-011 — Folder Density

A folder of hand-maintained Lua modules holds at most **10 files** by default. Group modules by feature (`session/`, `net/`), and keep shared helpers in one `util/` folder. See structure.

## PL-LUA-012 — Tooling

Run `luacheck` in CI with zero warnings, so undefined globals and unused locals fail the build. Format every file with `StyLua`. Treat both tools as the authority on style details they cover.

---

# 15.15 Dart Profile

Apply the shared core rules together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. Cohesion over Size applies throughout.


Dart 3 with sound null safety is the baseline. All examples assume Dart 3 syntax.

## PL-DART-001 — `final` and `const` by Default

Declare locals and fields as `final` unless they are reassigned. Use `const` for compile-time values.

```dart
final user = loadUser();
const retryLimit = 3;
```

- Avoid `var` when the value is never reassigned.
- Prefer `const` constructors for widgets, value objects, and configuration.

## PL-DART-002 — Sound Null Safety Without `!`

Make nullability explicit in types. Handle `null` with `?.` and `??` when the expression is simple.

```dart
String? nickname;
final label = nickname ?? 'anonymous';
final length = nickname?.length ?? 0;
```

- Avoid the `!` operator. Use it only with a comment that states why the value cannot be null.
- Prefer promotion through checks over `!`.

## PL-DART-003 — Named Parameters with `required` for Public API

Public constructors and functions take named parameters. Mark mandatory ones `required`.

```dart
final class Session {
  const Session({required this.id, this.timeout = const Duration(seconds: 30)});

  final String id;
  final Duration timeout;
}
```

- Named arguments make call sites explicit (PL-CORE-007).
- Use positional parameters only for obvious, single-value helpers.

## PL-DART-004 — Async Code Uses `Future` and `Stream` for Their Purpose

Use `Future` for one result and `Stream` for a sequence of events. Use `async` and `await` instead of chained `.then`.

```dart
Future<User> loadUser(UserId id) async {
  final response = await api.fetch(id);
  return User.fromJson(response);
}

Stream<Packet> incoming(Socket socket) async* {
  await for (final packet in socket) {
    yield packet;
  }
}
```

- Do not wrap a single value in a `Stream`, and do not force a multi-event source into a `Future`.
- Keep side effects visible at the call site (PL-CORE-015).

## PL-DART-005 — Avoid `dynamic`

Use concrete types, generics, or `Object?` for unknown data. Narrow unknown data with pattern matching before use.

```dart
Config parseConfig(Object? input) {
  if (input is! Map<String, Object?>) {
    throw const FormatException('Config must be a map');
  }
  return Config.fromMap(input);
}
```

- Treat `dynamic` as an exception that must be justified at the boundary.

## PL-DART-006 — Guard Clauses with Early Return

Check invalid and absent states first and return. Keep the main path unindented (PL-CORE-003).

```dart
String describe(User? user) {
  if (user == null) return 'unknown';
  if (!user.isActive) return 'inactive';
  return user.name;
}
```

- See control flow for the shared rule.
- Avoid `else` after a returning branch (PL-CORE-002).

## PL-DART-007 — Sealed Classes and Switch Expressions for State

Model closed sets of states as `sealed` classes. Handle them with an exhaustive `switch` expression.

```dart
sealed class SessionState {
  const SessionState();
}

final class Ready extends SessionState {
  const Ready();
}

final class Closed extends SessionState {
  const Closed(this.reason);
  final String reason;
}

String label(SessionState state) => switch (state) {
      Ready() => 'ready',
      Closed(:final reason) => 'closed: $reason',
    };
```

- Prefer this over boolean flags or string states.
- The compiler enforces that every state is handled.

## PL-DART-008 — Naming

Use `lowerCamelCase` for members, variables, parameters, and constants. Use `UpperCamelCase` for types, classes, enums, and extensions.

```dart
class SessionStore {}

final maxRetries = 3;
const defaultTimeout = Duration(seconds: 30);
```

- Names must carry meaning (PL-CORE-007). Avoid abbreviations such as `usr` or `cfg`.
- Use `snake_case` only for file names.

## PL-DART-009 — `_` Marks Library-Private Names

Prefix names with `_` only when they must stay hidden from other libraries. Do not use `_` as a substitute for documentation.

```dart
class _RetryPolicy {
  const _RetryPolicy();
}

void _connect() {}
```

- Keep public surface small so that the library's contract stays clear.

## PL-DART-010 — Small Classes with One Responsibility

Keep classes focused on one coherent responsibility. Split a class when it mixes unrelated concerns, not when it passes an arbitrary line count (PL-CORE-009, PL-CORE-022).

```dart
final class TokenParser {
  const TokenParser();

  Token parse(String raw) => Token(raw.trim());
}
```

- Prefer composition of small classes over inheritance hierarchies.

## PL-DART-011 — Folder Density

A Dart source folder under `lib/` may contain at most **10 hand-maintained source files** by default.

Generated files, `part` files, barrel files such as `lib/feature.dart`, and tests do not count. A split should follow a real boundary:

```text
lib/session/
lib/session/state/
lib/session/transport/
lib/session/storage/
```

- See structure for the shared size rules (PL-CORE-021).

## PL-DART-012 — Tooling: `dart format` and `dart analyze` with `lints`

Format and analyze every package before review. Enable the `lints` package in `analysis_options.yaml`.

```yaml
include: package:lints/recommended.yaml
```

```bash
dart format --set-exit-if-changed .
dart analyze
```

- Treat analyzer warnings as failures in CI.
- Do not disable lints locally without a comment that explains the exception.

---

# 15.16 Flutter Profile

Apply the shared core rules together with this profile. The Flutter profile targets **Dart 3 with Flutter 3.x** and sound null safety. The Dart language rules apply underneath: `final` by default, and sealed types where they model a closed set of states. A widget is a function of its configuration and state: configuration in, guards, derived values, widget tree out.

## PL-FLUT-001 — Build Methods Are Small and Free of Side Effects

`build` computes a widget tree from its inputs and nothing else. It does not start requests, write storage, navigate, or mutate fields. When the tree grows past one screen of nesting, extract a block (PL-FLUT-002). Side effects belong in event handlers and the state layer (state and side effects).

## PL-FLUT-002 — Extract Growing Widgets into Const Classes

Extract a block into its own `StatelessWidget` when it has its own name, data, or state. Do not extract helper methods that return widgets: they cannot be `const` and hide the widget boundary from Flutter.

```dart
class SessionHeader extends StatelessWidget {
  const SessionHeader({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Text(title, style: Theme.of(context).textTheme.titleLarge),
    );
  }
}
```

## PL-FLUT-003 — Const Constructors Wherever Possible

Mark constructors `const` when all fields are final, and write `const` at every call site whose value is compile-time constant.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

## PL-FLUT-004 — One State Management Approach per App

Choose one approach for the whole app and name it in the project README: Riverpod, or `ChangeNotifier` with `provider` for smaller apps. Use it consistently. `setState` is fine for purely local UI state, such as a toggle or an expanded flag. Business state lives in providers or notifiers, not in widgets.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

## PL-FLUT-005 — No Network or Storage Calls Inside Build

`build` runs on every rebuild, so a request placed there repeats unpredictably. Load data in the state layer; widgets render the result.

## PL-FLUT-006 — Guard Clauses Before the Main Tree

Handle loading, error, and empty states first and return early. The successful layout stays at the base indentation.

```dart
@override
Widget build(BuildContext context) {
  final error = state.error;
  if (state.isLoading) {
    return const LoadingView();
  }
  if (error != null) {
    return ErrorView(message: error);
  }
  return ProfileDetails(user: state.user);
}
``` Avoid nested conditionals in widget trees.

## PL-FLUT-007 — Keys Only Where List Identity Matters

Give a key only when a widget's identity must survive reordering or removal, such as stateful list items or a `Dismissible`. Use a stable identifier from the data, never the list index.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

## PL-FLUT-008 — BuildContext After await Needs a Mounted Check

A `BuildContext` may belong to a widget removed while an `await` was pending. Check that it is still mounted before using it after an `await`.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Inside a `State` subclass, check `mounted` instead.

## PL-FLUT-009 — Feature Folders and Folder Density

Group widgets, providers, and tests by feature (`lib/features/sessions/`), not by file kind across the app. A folder holds at most **10 hand-maintained source files** by default. This is a review threshold: split along responsibilities, not into meaningless nested folders (structure).

## PL-FLUT-010 — Tooling Gates Every Change

Every change passes the formatter and analyzers before review:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` settles layout, so formatting debates never reach review. Warnings are not optional: a disabled lint rule needs a reason in `analysis_options.yaml`.

---

# 15.17 V Profile

Apply the shared core rules together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. Cohesion over Size applies throughout.

## PL-V-001 — Immutable by Default

Variables are immutable unless declared with `mut`. Declare `mut` only where a value must change. See PL-CORE-010.

```v
limit := 10
```

## PL-V-002 — Return Result Types for Failures

A fallible function returns `!T` and reports failure with `error(...)`.

```v
struct User {
	id   int
	name string
}

fn load_user(id int) !User {
	if id <= 0 {
		return error('invalid user id')
	}
	return User{id: id, name: 'ada'}
}
```

## PL-V-003 — Handle Errors Early With `or {}`

Handle a failed call at the call site. Propagate with `!` only when the caller should own the error.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

## PL-V-004 — Use Option Types for Absent Values

Use `?T` when absence is a normal outcome. Use `!T` when failure needs a reason.

```v
fn find_user(users []User, id int) ?User {
	for user in users {
		if user.id == id {
			return user
		}
	}
	return none
}
```

## PL-V-005 — Guard Clauses and Small Functions

Reject invalid input first so the success path stays linear. Each function does one job. See PL-CORE-003 and PL-CORE-006.

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

## PL-V-006 — Naming Follows V Conventions

Functions and variables use `snake_case`. Structs and enums use `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

## PL-V-007 — Initialise Structs Explicitly

Name every field in a struct literal. Positional initialisation hides which value goes where.

```v
user := User{id: 1, name: 'ada'}
```

## PL-V-008 — One Responsibility per Module Folder

In V, a folder is a module. Its files share one `module` declaration and one responsibility. Cohesion matters more than line count (Cohesion over Size).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

## PL-V-009 — Keep Folders Dense Enough to Scan

A folder holds at most 10 hand-maintained source files by default. Generated files do not count. Past that limit, split by responsibility into a sub-module folder.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

## PL-V-010 — Format and Vet Before Review

Run both tools on every change, so reviews discuss intent instead of layout or suspicious constructs.

```sh
v fmt -w .
v vet .
```

---

# 15.18 Swift Profile

Apply the shared core rules together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. Cohesion over Size applies throughout.


Pureline Swift follows **idiomatic Swift 5.9 and later**: value semantics, optionals, exhaustive enums, and explicit access control are language strengths and should be used as such.

## PL-SW-001 — Naming Follows Swift Conventions

- Types and protocols: `UpperCamelCase`. Members and locals: `lowerCamelCase`, named for their meaning (Naming).

```swift
protocol PaymentGateway { func charge(_ order: Order) throws -> Receipt }
```

## PL-SW-002 — Explicit Access Control

- Write access levels explicitly. Default to `private`; widen to `fileprivate` or `internal` only when a real consumer needs it.

```swift
public struct ConfigLoader {
    private let decoder: JSONDecoder
    public func load(from url: URL) throws -> Config { /* ... */ }
}
```

## PL-SW-003 — `let` over `var`

Use `let` unless mutation is required. Keep `var` locals narrowly scoped.

```swift
let total = items.reduce(0, +)
```

## PL-SW-004 — Guard Clauses for Early Exit

Validate early with `guard` and keep the successful path at base indentation (Control Flow). Avoid `else` after a branch that already exits.

```swift
func open(_ request: Request) throws -> Session {
    guard request.isValid else { throw SessionError.invalidRequest }
    guard let user = request.user else { throw SessionError.missingUser }
    return try Session.open(for: user)
}
```

## PL-SW-005 — Optionals Are Unwrapped Safely

- Unwrap with `if let` or `guard let`; use `??` for simple defaults. Never force-unwrap (`!`) or `try!` outside tests; there, use `XCTUnwrap`.

```swift
guard let cached = cache[key] else { return nil }
let name = user.nickname ?? user.login
```

## PL-SW-006 — Value Types by Default

Model data as `struct` and `enum`. Use `class` only for shared identity or mutable reference state, and mark it `final` unless inheritance is designed in.

```swift
struct Money: Equatable { let cents: Int; let currency: Currency }
```

## PL-SW-007 — Protocols Only for Real Abstractions

Introduce a protocol for a real interchangeable implementation, API boundary, or test seam. A single concrete type with no seam should stay concrete (Architecture).

```swift
protocol Clock { func now() -> Date }
struct Scheduler { let clock: any Clock }
```

## PL-SW-008 — Exhaustive `switch` over Enums

Switch over enums without `default` so the compiler flags new cases. Use `if case` or `guard case` for a single pattern.

```swift
enum SessionState { case ready, closed, failed }

func label(for state: SessionState) -> String {
    switch state {
    case .ready: return "Ready"
    case .closed: return "Closed"
    case .failed: return "Failed"
    }
}
```

## PL-SW-009 — Small, Focused Functions

Keep functions to one level of abstraction: a short sequence of named steps. Extract a helper when a block needs a name to be understood (Functions).

```swift
func submit(_ order: Order) throws {
    try validate(order)
    try orders.save(order, receipt: payment.charge(order))
}
```

## PL-SW-010 — Folder Density

A Swift source folder should contain at most **10 hand-maintained `.swift` files** by default; generated and test files do not count. This is a review threshold: split along responsibility boundaries, never into meaningless nested folders (Structure).

```text
Sources/Checkout/
    Order.swift
    PaymentFlow.swift
```

## PL-SW-011 — Tooling Enforces Format and Lint

- Format with `swift-format` and lint with `SwiftLint` using the project-agreed configuration; keep exceptions there, with reasons, not as scattered `// swiftlint:disable` comments.

```bash
swift-format lint --recursive Sources Tests
swiftlint lint --strict
```

---

# 15.19 Kotlin Profile

Apply the shared core rules together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. Cohesion over Size applies throughout.

## PL-KT-001 — val over var

Default to `val`. Use `var` only when a value truly changes and the mutation stays local. See State and Side Effects.

```kotlin
val retries = 3
val limit = retries * 2
```

## PL-KT-002 — Data Classes for Plain Data

Use `data class` for values that carry data and compare by content. Do not hand-write `equals`, `hashCode`, or copy boilerplate.

```kotlin
data class SessionId(val value: String)
```

## PL-KT-003 — Sealed Types with Exhaustive when

Model states as `sealed interface` and branch with an exhaustive `when` expression. Avoid `else`, which silently absorbs new cases.

```kotlin
sealed interface ConnectionState {
    data object Idle : ConnectionState
    data class Connected(val host: String) : ConnectionState
    data class Failed(val reason: String) : ConnectionState
}

fun describe(state: ConnectionState): String = when (state) {
    ConnectionState.Idle -> "idle"
    is ConnectionState.Connected -> "connected to ${state.host}"
    is ConnectionState.Failed -> "failed: ${state.reason}"
}
```

## PL-KT-004 — Null Safety Without !!

Use `?.` for optional access and `?:` for fallbacks or early exits. Never use `!!` outside tests; it turns a null check into a runtime crash.

```kotlin
fun greet(name: String?): String {
    val safeName = name ?: return "Hello, guest"
    return "Hello, $safeName"
}
```

## PL-KT-005 — Scope Functions Only When They Read Clearly

Use `let`, `run`, or `apply` when they remove a temporary name or configure one object. Do not chain or nest them; a plain statement is clearer.

```kotlin
fun salutation(name: String?): String =
    name?.trim()?.let { "Dear $it" } ?: "Guest"
```

## PL-KT-006 — Extension Functions with Narrow Scope

Add an extension only when it reads as a property of the receiver. Avoid extensions on `Any` or broad types, and never hide side effects behind one.

```kotlin
fun String.toSlug(): String = trim().lowercase().replace(' ', '-')
```

## PL-KT-007 — Named Arguments for Booleans and Many Parameters

Name arguments for every boolean flag and for any call with more than two parameters. A bare `true` tells the reader nothing.

```kotlin
fun openSession(host: String, port: Int, secure: Boolean) = println("$host:$port $secure")
openSession(host = "example.org", port = 443, secure = true)
```

## PL-KT-008 — Guard Clauses and Small Functions

Reject invalid input first and return immediately, so the success path stays unindented. Each function performs one step and fits on one screen. See Control Flow and Functions.

```kotlin
fun resolveName(name: String?, isActive: Boolean): String {
    if (name == null) return "guest"
    if (!isActive) return "inactive"
    return name
}
```

## PL-KT-009 — Naming

Types use UpperCamelCase. Functions, properties, and parameters use lowerCamelCase. Top-level `const val` uses UPPER_SNAKE_CASE.

```kotlin
class SessionService
const val MAX_PACKET_SIZE = 4096
val retryLimit = 3
fun openSession() {}
```

## PL-KT-010 — Folder Density

Keep at most 10 hand-maintained source files per folder by default. Generated files do not count. Past that limit, split by responsibility, not by file type, and document any justified exception.

```text
src/main/kotlin/space/example/project/
    session/   (SessionService.kt, SessionState.kt)
    network/   (PacketCodec.kt, ConnectionPool.kt)
```

## PL-KT-011 — Tooling

Run ktlint for formatting and detekt for static analysis in CI. Fix findings, or suppress one with a narrow, commented reason.

```bash
./gradlew ktlintCheck detekt
```

---

# 16. Abstraction Rules

## PL-ARCH-001 — Abstraction Requires a Reason

Avoid abstractions such as:

```text
AbstractBaseFactoryManagerProvider
```

merely to reduce duplication.

Good reasons for abstraction include:

```text
multiple real implementations
clear API boundaries
platform-specific implementations
test seams
dependency inversion
shared domain contracts
```

---

# 17. Architecture

Pureline prefers clear dependency direction.

Example:

```text
domain
↓
service
↓
infrastructure
```

or feature-oriented modules:

```text
session/
network/
storage/
command/
runtime/
api/
```

Avoid cycles such as:

```text
network → session → storage → network
```

---

# 18. Side Effects

Important side effects should remain visible.

Preferred:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Potentially misleading:

```java
sessions.createAndPersistAndNotify(user);
```

if persistence and event publication are important externally observable actions.

Pureline does not require exposing every internal operation. It requires avoiding surprising hidden behavior.

---

# 19. Immutability

Prefer immutable values by default.

Mutation should be intentional, local, and easy to identify.

Preferred examples include Java records, TypeScript readonly data, `const` in JavaScript, immutable value objects, and short-lived mutable local state.

Avoid shared mutable state where practical.

---

# 20. Dependencies

Dependencies should be visible in constructors, function parameters, or explicit module wiring.

Avoid hidden global access patterns and unnecessary service locators.

Dependency injection is encouraged where it improves architecture, but Pureline does not require a heavy DI framework.

---

# 21. Performance

Pureline prioritizes readability by default, but performance-sensitive paths should be written deliberately.

In hot paths:

- avoid unnecessary allocations
- avoid repeated reflection
- cache expensive resolution
- use appropriate collections
- avoid hidden blocking
- reduce unnecessary copying
- keep ownership clear

Performance optimizations must remain understandable.

---

# 22. Language Profiles

```text
Pureline Core
│
├── Pureline Java
│   ├── Records
│   ├── I-prefixed interfaces
│   ├── Modern Java
│   ├── Explicit null handling
│   └── Virtual Threads
│
├── Pureline JavaScript
│   ├── const-first
│   ├── semicolons
│   ├── braces
│   └── async/await
│
├── Pureline TypeScript
│   ├── strong typing
│   ├── inference
│   ├── unknown > any
│   └── unions/types
│
├── Pureline Go
│   ├── idiomatic error guards
│   ├── small interfaces
│   ├── defer
│   └── explicit goroutine lifecycle
│
├── Pureline Crystal
│   ├── idiomatic postfix guards
│   ├── explicit blocks for complex flow
│   ├── nil guards
│   └── type inference
│
├── Pureline Rust
│   ├── Result / Option / ? and let-else guards
│   ├── ownership, borrowing, RAII
│   ├── exhaustive match and enums
│   ├── error types by crate role
│   ├── central lints, rustfmt / clippy
│   ├── cancellation-safe async lifecycles
│   └── test placement
│
├── Pureline React (on JavaScript + TypeScript)
│   ├── components as named functions
│   ├── guards before markup
│   ├── hooks, derived state, effects
│   └── pure render, typed props
│
├── Pureline Novus (.nv / .nvh / .nvmd)
│   ├── final / var / explicit types
│   ├── construct() and object literals
│   ├── packages and narrow imports
│   └── .nvh components with ref state
│
├── Pureline Python
│   ├── PEP 8 naming, guard clauses
│   ├── type hints, specific exceptions
│   ├── dataclasses, context managers
│   └── ruff / type checker
│
├── Pureline QML
│   ├── one root object per file
│   ├── required properties, bindings
│   ├── Theme tokens, layouts
│   └── qmllint
│
├── Pureline Astro
│   ├── typed frontmatter
│   ├── static by default, islands by declaration
│   ├── scoped styles, content collections
│   └── astro check
│
├── Pureline HTML
│   ├── semantic elements
│   ├── labels, alt text, document head
│   └── behaviour out of markup
│
├── Pureline CSS
│   ├── tokens, cascade layers
│   ├── low specificity, no !important
│   ├── logical properties, container queries
│   └── reduced motion, stylelint
│
├── Pureline Emerald (.ems)
│   ├── namespace / use with ::
│   ├── typed declarations and semicolons
│   ├── data classes and AST macros
│   └── Flow-aware lifecycle clarity
│
└── Pureline Emvus (.ev)
    ├── method<Type> and where generics
    ├── Result, fail/success, scoped
    ├── data classes, dictionaries, tuples
    ├── AST macros
    └── fiber / virtual / thread
```

---

# 23. Tooling Model

Pureline tooling should share the same rule specification across:

```text
Pureline Checker
Pureline Formatter
Pureline CLI
IntelliJ Plugin
VS Code Extension
Eclipse Plugin
future IDE integrations
```

Diagnostics should reference stable rule IDs.

Example:

```text
PL-CF-002
Avoid else after a terminating branch.

Line 48:
} else {

Suggested fix:
Remove the else block and continue with the happy path.
```

This allows the website, CLI, formatter, linter, and IDE integrations to stay consistent.

**Emerald and Emvus tooling requirement:** use separate grammars for `.ems` and `.ev`. The checker must distinguish real syntax and resolved AST constructs from textual lookalikes; macro-generated declarations, inferred tuple/list forms, optional method-declaration parentheses, and optional Emvus semicolons require language-aware handling. Existing and newly added profile IDs must produce consistent diagnostics across tools.

**Versioning:** Rust rules use stable `PL-RS-*` IDs; Novus, React, Python, QML, Astro, HTML, CSS, Emerald, and Emvus rules use `PL-NV-*`, `PL-REACT-*`, `PL-PY-*`, `PL-QML-*`, `PL-AS-*`, `PL-HTML-*`, `PL-CSS-*`, `PL-EMS-*`, and `PL-EV-*` IDs. The established `PL-CORE-*`, `PL-CF-*`, `PL-JAVA-*`, `PL-JS-*`, `PL-TS-*`, `PL-GO-*`, and `PL-CR-*` IDs are not renumbered. Version 1.4 added `PL-CORE-022` and `PL-STRUCT-003`; version 1.5 added `PL-RS-001`–`PL-RS-020`; version 1.6 added `PL-NV-001`–`PL-NV-013`, `PL-REACT-001`–`PL-REACT-014`, and `PL-RS-021`–`PL-RS-024`; version 1.7 adds `PL-PY-001`–`PL-PY-012`, `PL-QML-001`–`PL-QML-011`, `PL-AS-001`–`PL-AS-009`, `PL-HTML-001`–`PL-HTML-009`, and `PL-CSS-001`–`PL-CSS-012` without renumbering existing rules.

---

# 24. Pureline Summary

Pureline code should feel:

- linear
- explicit
- compact
- modern
- low-noise
- modular
- cohesive regardless of line count
- predictable
- easy to scan
- easy to refactor
- hard to misunderstand

The core rule remains:

> **Code without noise.**

A second principle governs every language profile:

> **Pureline standardizes principles, not syntax.**

A language should remain idiomatic. Pureline removes unnecessary noise without stripping away the features that make Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald, or Emvus effective in the first place.
