# V-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## V-Profil

### PL-V-001 — Standardmäßig nicht wandelbar

Variablen sind unveränderlich, sofern sie nicht mit `mut` deklariert werden. Nur dann `mut` angeben, wenn sich ein Wert ändern muss. Siehe [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Rückgabeergebnistypen für Fehler

Eine fehlbare Funktion liefert `!T` zurück und meldet Fehler mit `error(...)`.

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

### PL-V-003 — Fehler frühzeitig mit `or {}` handhaben

Behandeln Sie einen fehlgeschlagenen Anruf auf der Anrufseite.. Mit `!` nur dann angeben, wenn der Anrufer den Fehler besitzen sollte.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

In einer Funktion, die ein Ergebnis zurückgibt, bevorzugen Sie `!`, um ein unverändertes zu propagieren
Fehler. Verwenden Sie einen `or`-Block, wenn der Fehlerpfad zusätzliche Handhabung benötigt.

```text
Explicit propagation                  │ ✓ Pureline
config := load_config(path) or {      │ config := load_config(path)!
    return err                        │ start(config)
}                                     │
                                      │
start(config)                         │
```

### PL-V-004 — Optionstypen für die Werte von Absent verwenden

Verwenden Sie `?T`, wenn Abwesenheit ein normales Ergebnis ist. Verwenden Sie `!T`, wenn ein Fehler einen Grund benötigt.

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

### PL-V-005 — Schutzklauseln und kleine Funktionen

Lehnen Sie zuerst ungültige Eingaben ab, damit der Erfolgspfad linear bleibt. Jede Funktion erledigt einen Job. Siehe [PL-CORE-003](../core/principles.md) und [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — Benennung folgt V Übereinkommen

Funktionen und Variablen verwenden `snake_case`. Strukturen und Enums verwenden `PascalCase`..

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Explizite Initialisierung der Strukturen

Nennen Sie jedes Feld in einem struct wörtlich... Die Positionsinitialisierung verbirgt, welcher Wert wohin geht..

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Eine Verantwortung pro Modulordner

In V ist ein Ordner ein Modul. Die Dateien teilen eine `module`-Erklärung und eine Verantwortung. Kohäsion ist mehr als Linienzählung ([Kohäsion über Größe](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Ordnerdichte genug zum Scannen aufbewahren

Ein Ordner enthält standardmäßig höchstens 10 handgepflegerte Quelldateien. Generierte Dateien zählen nicht.. Über diese Grenze hinaus, aufgeteilt nach Verantwortung in einen Unter-Modul-Ordner.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Format und Vet vor der Überprüfung

Führen Sie beide Tools bei jeder Änderung aus, so dass Bewertungen Absichten anstelle von Layout oder verdächtigen Konstrukten diskutieren.

```sh
v fmt -w .
v vet .
```
