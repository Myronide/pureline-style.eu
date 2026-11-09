# V Codestijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## V-profiel

### PL-V-001. Onveranderbaar door Standaard

Variabelen zijn onveranderlijk tenzij aangegeven met `mut`. Alleen `mut` aangeven waar een waarde moet veranderen. Zie [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002. Return Resultaat Types voor fouten

Een feilbare functie geeft `!T` terug en rapporteert een storing met `error(...)`.

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

### PL-V-003. Fouten vroegtijdig afhandelen met `or {}`

Behandel een mislukt gesprek op de call site. Propagaat alleen met `!` als de beller de fout moet bezitten.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

In een functie die een resultaat oplevert, verkiest `!` om een onveranderde
fout. Gebruik een `or`-blok als het foutpad extra handling nodig heeft.

```text
Explicit propagation                  │ ✓ Pureline
config := load_config(path) or {      │ config := load_config(path)!
    return err                        │ start(config)
}                                     │
                                      │
start(config)                         │
```

### PL-V-004. Gebruik opties voor afwezige waarden

Gebruik `?T` als afwezigheid een normaal resultaat is. Gebruik `!T` als er een reden nodig is.

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

### PL-V-005. Guard Clausles en kleine functies

Ongeldige invoer eerst weigeren zodat het succespad lineair blijft. Elke functie doet één taak. Zie [PL-CORE-003](../core/principles.md) en [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006. Naamgeving volgt V-verdragen

Functies en variabelen gebruiken `snake_case`. Struiken en enums gebruiken `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007. Initialiseer Struiken Expliciet

Noem elk veld in een struct literaal. Positionale initialisatie verbergt welke waarde waar naartoe gaat.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008. Eén verantwoordelijkheid per modulemap

In V is een map een module. De bestanden delen één `module` verklaring en één verantwoordelijkheid. Cohesie is belangrijker dan lijntelling ([Cohesie over grootte](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009. Houd mappen Dense genoeg om te scannen

Een map bevat hooguit 10 handbewaarde bronbestanden. Gegenereerde bestanden tellen niet mee. Deze limiet is overschreden, verdeeld door verantwoordelijkheid in een submodule map.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010. Formaat en vet voor beoordeling

Run beide tools op elke verandering, dus reviews bespreken intentie in plaats van lay-out of verdachte constructies.

```sh
v fmt -w .
v vet .
```
