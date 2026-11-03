# Stile del codice V

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo V {#v-profile}

### PL-V-001 — Immutabile per impostazione predefinita {#pl-v-001--immutable-by-default}

Le variabili sono immutabili, a meno che siano dichiarate con `mut`. Dichiara `mut` solo dove un valore deve cambiare. Vedi [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Restituire tipi result per i fallimenti {#pl-v-002--return-result-types-for-failures}

Una funzione che può fallire restituisce `!T` e segnala il fallimento con `error(...)`.

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

### PL-V-003 — Gestire subito gli errori con `or {}` {#pl-v-003--handle-errors-early-with-or}

Gestisci una chiamata fallita nel punto della chiamata. Propaga con `!` solo quando il chiamante deve possedere l'errore.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

### PL-V-004 — Usare i tipi option per i valori assenti {#pl-v-004--use-option-types-for-absent-values}

Usa `?T` quando l'assenza è un esito normale. Usa `!T` quando il fallimento richiede una motivazione.

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

### PL-V-005 — Guard clause e funzioni piccole {#pl-v-005--guard-clauses-and-small-functions}

Rifiuta per primo l'input non valido, così il percorso di successo resta lineare. Ogni funzione svolge un solo compito. Vedi [PL-CORE-003](../core/principles.md) e [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — I nomi seguono le convenzioni di V {#pl-v-006--naming-follows-v-conventions}

Funzioni e variabili usano `snake_case`. Struct ed enum usano `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Inizializzare le struct in modo esplicito {#pl-v-007--initialise-structs-explicitly}

Nomina ogni campo in un letterale di struct. L'inizializzazione posizionale nasconde quale valore vada dove.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Una responsabilità per cartella di modulo {#pl-v-008--one-responsibility-per-module-folder}

In V una cartella è un modulo. I suoi file condividono un'unica dichiarazione `module` e un'unica responsabilità. La coesione conta più del numero di righe ([Coesione prima della dimensione](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Mantenere le cartelle abbastanza dense da poterle scorrere {#pl-v-009--keep-folders-dense-enough-to-scan}

Una cartella contiene al massimo 10 file sorgente mantenuti a mano per impostazione predefinita. I file generati non contano. Oltre quel limite, dividi per responsabilità in una cartella di sottomodulo.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Formattare e controllare con vet prima della revisione {#pl-v-010--format-and-vet-before-review}

Esegui entrambi gli strumenti a ogni modifica, così le revisioni discutono dell'intento invece del layout o di costrutti sospetti.

```sh
v fmt -w .
v vet .
```
