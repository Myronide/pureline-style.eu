# V Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## V-Profil {#v-profile}

### PL-V-001 — Standardmäßig unveränderlich {#pl-v-001--immutable-by-default}

Variablen sind unveränderlich, solange sie nicht mit `mut` deklariert werden. Deklariere `mut` nur dort, wo sich ein Wert ändern muss. Siehe [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Result-Typen für Fehler zurückgeben {#pl-v-002--return-result-types-for-failures}

Eine fehleranfällige Funktion gibt `!T` zurück und meldet den Fehler mit `error(...)`.

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

### PL-V-003 — Fehler früh mit `or {}` behandeln {#pl-v-003--handle-errors-early-with-or}

Behandle einen fehlgeschlagenen Aufruf an der Aufrufstelle. Reiche ihn nur mit `!` weiter, wenn der Aufrufer den Fehler besitzen soll.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

Bevorzuge in einer Funktion mit Result-Rückgabe `!`, um einen Fehler
unverändert weiterzugeben. Verwende einen `or`-Block für weitere Fehlerbehandlung.

```text
Explicit propagation                  │ ✓ Pureline
config := load_config(path) or {      │ config := load_config(path)!
    return err                        │ start(config)
}                                     │
                                      │
start(config)                         │
```

### PL-V-004 — Option-Typen für fehlende Werte verwenden {#pl-v-004--use-option-types-for-absent-values}

Verwende `?T`, wenn Abwesenheit ein normales Ergebnis ist. Verwende `!T`, wenn ein Fehler eine Begründung braucht.

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

### PL-V-005 — Guard Clauses und kleine Funktionen {#pl-v-005--guard-clauses-and-small-functions}

Weise ungültige Eingaben zuerst ab, damit der Erfolgspfad linear bleibt. Jede Funktion erledigt eine Aufgabe. Siehe [PL-CORE-003](../core/principles.md) und [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — Die Benennung folgt den V-Konventionen {#pl-v-006--naming-follows-v-conventions}

Funktionen und Variablen verwenden `snake_case`. Structs und Enums verwenden `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Structs explizit initialisieren {#pl-v-007--initialise-structs-explicitly}

Benenne jedes Feld in einem Struct-Literal. Positionale Initialisierung verbirgt, welcher Wert wohin gehört.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Eine Verantwortung pro Modulordner {#pl-v-008--one-responsibility-per-module-folder}

In V ist ein Ordner ein Modul. Seine Dateien teilen sich eine `module`-Deklaration und eine Verantwortung. Kohäsion zählt mehr als die Zeilenzahl ([Kohäsion vor Größe](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Ordner dicht genug halten, um sie zu überschauen {#pl-v-009--keep-folders-dense-enough-to-scan}

Ein Ordner enthält standardmäßig höchstens 10 von Hand gepflegte Quelldateien. Generierte Dateien zählen nicht. Teile jenseits dieses Limits nach Verantwortung in einen Untermodul-Ordner auf.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Vor dem Review formatieren und prüfen {#pl-v-010--format-and-vet-before-review}

Führe beide Werkzeuge bei jeder Änderung aus, damit Reviews über die Absicht sprechen statt über Layout oder verdächtige Konstrukte.

```sh
v fmt -w .
v vet .
```
