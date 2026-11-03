# Java Code Style

[Code style guide](../README.md) · [Original specification 1.6](../../../PURELINE_SPECIFICATION_1.6.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Java Profile

### PL-JAVA-001 — Package by Responsibility

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

### PL-JAVA-002 — Naming

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

### PL-JAVA-003 — Prefer Records for Immutable Data

Preferred:

```java
public record SessionId(UUID value) {
}
```

Avoid boilerplate POJOs when a record is sufficient.

### PL-JAVA-004 — Explicit Null Handling

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

### PL-JAVA-005 — Use Imports Instead of FQCNs

Avoid:

```java
java.util.concurrent.CompletableFuture<Result> future;
```

Prefer:

```java
import java.util.concurrent.CompletableFuture;
```

### PL-JAVA-006 — Prefer Modern Java

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

### PL-JAVA-007 — Prefer Switch for Real State Branching

Preferred:

```java
return switch (state) {
    case READY -> start();
    case CLOSED -> stop();
    case FAILED -> recover();
};
```

Prefer this over long chains of unrelated state checks.

### PL-JAVA-008 — Concurrency

Do not block main or tick threads with HTTP, database operations, filesystem access, or blocking network I/O.

Virtual threads are preferred for blocking I/O where appropriate.

### PL-JAVA-009 — Streams Only When Clearer

Streams are encouraged when they improve readability. Use a loop if it is clearer, easier to debug, or better suited to the hot path.

### PL-JAVA-010 — Lifecycle Symmetry

Anything that is opened, registered, started, allocated, or subscribed must have an equally clear corresponding close, unregister, stop, release, or unsubscribe path.
