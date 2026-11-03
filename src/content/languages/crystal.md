# Crystal Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## Crystal Profile

Crystal keeps its own language identity while following Pureline principles.

### PL-CR-001 — Idiomatic Postfix Guards Are Allowed

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

### PL-CR-002 — Avoid `else`

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

### PL-CR-003 — Idiomatic Naming

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

### PL-CR-004 — Prefer Type Inference

Preferred:

```crystal
session = create_session(user)
```

Avoid redundant annotations:

```crystal
session : Session = create_session(user)
```

when Crystal can infer the type clearly.

### PL-CR-005 — Explicit Nil Guards

Preferred:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Avoid burying expected nil handling inside deeply nested chains.

### PL-CR-006 — Exceptions Are for Exceptional States

Expected outcomes should preferably use normal domain modeling such as `nil`, union types, result-like structures, or enums.

Exceptions should represent exceptional failure, not ordinary branching.

### PL-CR-007 — Avoid Macro Cleverness Without Need

Crystal macros are powerful, but Pureline avoids hiding ordinary behavior behind metaprogramming unless the abstraction produces a clear architectural benefit.

Generated behavior should remain predictable and discoverable.

---

### PL-CR-008 — Folder Density

A Crystal source or namespace folder may contain at most **10 production `.cr` files** by default.

Specs, generated files, bindings, and metadata-only files do not count.

When the limit is exceeded, split the namespace by responsibility while preserving idiomatic Crystal structure.
