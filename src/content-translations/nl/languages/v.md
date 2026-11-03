# V-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## V-profiel {#v-profile}

### PL-V-001 — Standaard onveranderlijk {#pl-v-001--immutable-by-default}

Variabelen zijn onveranderlijk, tenzij ze met `mut` zijn gedeclareerd. Declareer `mut` alleen waar een waarde moet veranderen. Zie [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Retourneer resultaattypen voor fouten {#pl-v-002--return-result-types-for-failures}

Een functie die kan falen retourneert `!T` en meldt de fout met `error(...)`.

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

### PL-V-003 — Behandel fouten vroeg met `or {}` {#pl-v-003--handle-errors-early-with-or}

Behandel een mislukte aanroep op de plek van de aanroep zelf. Geef de fout alleen door met `!` wanneer de aanroeper de fout moet beheren.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

### PL-V-004 — Gebruik optietypen voor afwezige waarden {#pl-v-004--use-option-types-for-absent-values}

Gebruik `?T` wanneer afwezigheid een normale uitkomst is. Gebruik `!T` wanneer een fout een reden nodig heeft.

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

### PL-V-005 — Guard clauses en kleine functies {#pl-v-005--guard-clauses-and-small-functions}

Wijs ongeldige invoer eerst af, zodat het succespad lineair blijft. Elke functie doet één taak. Zie [PL-CORE-003](../core/principles.md) en [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — Naamgeving volgt de conventies van V {#pl-v-006--naming-follows-v-conventions}

Functies en variabelen gebruiken `snake_case`. Structs en enums gebruiken `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Initialiseer structs expliciet {#pl-v-007--initialise-structs-explicitly}

Benoem elk veld in een structliteraal. Positionele initialisatie verbergt welke waarde waar naartoe gaat.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Eén verantwoordelijkheid per modulemap {#pl-v-008--one-responsibility-per-module-folder}

In V is een map een module. De bestanden ervan delen één `module`-declaratie en één verantwoordelijkheid. Samenhang weegt zwaarder dan het aantal regels ([Samenhang boven omvang](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Houd mappen overzichtelijk genoeg om te scannen {#pl-v-009--keep-folders-dense-enough-to-scan}

Een map bevat standaard maximaal 10 handmatig onderhouden bronbestanden. Gegenereerde bestanden tellen niet mee. Splits boven die limiet op verantwoordelijkheid in een map met een submodule.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Formatteer en vet vóór de review {#pl-v-010--format-and-vet-before-review}

Voer beide tools uit bij elke wijziging, zodat reviews over de intentie gaan en niet over layout of verdachte constructies.

```sh
v fmt -w .
v vet .
```
