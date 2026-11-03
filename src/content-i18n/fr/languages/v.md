# V Code Style

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille] (../core/structure.md) s'applique tout au long.

## V Profile

### PL-V-001 — Immutable par défaut

Variables are immutable unless declared with `mut`. Declare `mut` only where a value must change. See [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Return Result Types for Failures

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

### PL-V-003 — Handle Errors Early With `or {}`

Handle a failed call at the call site. Propagate with `!` only when the caller should own the error.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

### PL-V-004 — Use Option Types for Absent Values

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

### PL-V-005 — Guard Clauses and Small Functions

Reject invalid input first so the success path stays linear. Each function does one job. See [PL-CORE-003](../core/principles.md) and [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — Naming Follows V Conventions

Functions and variables use `snake_case`. Structs and enums use `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Initialise Structs Explicitly

Name every field in a struct literal. Positional initialisation hides which value goes where.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — One Responsibility per Module Folder

In V, a folder is a module. Its files share one `module` declaration and one responsibility. Cohesion matters more than line count ([Cohesion over Size](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Keep Folders Dense Enough to Scan

A folder holds at most 10 hand-maintained source files by default. Generated files do not count. Past that limit, split by responsibility into a sub-module folder.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Format and Vet Before Review

Run both tools on every change, so reviews discuss intent instead of layout or suspicious constructs.

```sh
v fmt -w .
v vet .
```
