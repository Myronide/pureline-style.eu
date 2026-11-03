# V Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil V {#v-profile}

### PL-V-001 — Domyślnie niezmienne {#pl-v-001--immutable-by-default}

Zmienne są niezmienne, chyba że zadeklarowano je z `mut`. `mut` deklaruj tylko tam, gdzie wartość musi się zmieniać. Zobacz [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Dla awarii zwracaj typy wyniku {#pl-v-002--return-result-types-for-failures}

Funkcja, która może się nie powieść, zwraca `!T` i zgłasza awarię przez `error(...)`.

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

### PL-V-003 — Obsługuj błędy wcześnie za pomocą `or {}` {#pl-v-003--handle-errors-early-with-or}

Nieudane wywołanie obsłuż w miejscu wywołania. Propaguj przez `!` tylko wtedy, gdy błąd powinien należeć do wywołującego.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

### PL-V-004 — Dla brakujących wartości używaj typów opcji {#pl-v-004--use-option-types-for-absent-values}

Używaj `?T`, gdy brak wartości jest normalnym wynikiem. Używaj `!T`, gdy awaria wymaga podania przyczyny.

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

### PL-V-005 — Guard clauses i małe funkcje {#pl-v-005--guard-clauses-and-small-functions}

Niepoprawne dane wejściowe odrzucaj najpierw, aby ścieżka sukcesu pozostała liniowa. Każda funkcja wykonuje jedno zadanie. Zobacz [PL-CORE-003](../core/principles.md) i [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — Nazewnictwo zgodne z konwencjami V {#pl-v-006--naming-follows-v-conventions}

Funkcje i zmienne używają `snake_case`. Struktury i enumy używają `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Inicjalizuj struktury jawnie {#pl-v-007--initialise-structs-explicitly}

W literale struktury nazywaj każde pole. Inicjalizacja pozycyjna ukrywa, która wartość dokąd trafia.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Jedna odpowiedzialność na folder modułu {#pl-v-008--one-responsibility-per-module-folder}

W V folder jest modułem. Jego pliki dzielą jedną deklarację `module` i jedną odpowiedzialność. Spójność jest ważniejsza niż liczba linii ([Spójność ponad rozmiar](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Utrzymuj foldery na tyle gęste, by dało się je ogarnąć wzrokiem {#pl-v-009--keep-folders-dense-enough-to-scan}

Folder domyślnie zawiera co najwyżej 10 ręcznie utrzymywanych plików źródłowych. Pliki generowane nie są wliczane. Po przekroczeniu limitu podziel według odpowiedzialności na folder podmodułu.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Formatuj i sprawdzaj przed przeglądem {#pl-v-010--format-and-vet-before-review}

Uruchamiaj oba narzędzia przy każdej zmianie, aby przeglądy dotyczyły zamiaru, a nie układu czy podejrzanych konstrukcji.

```sh
v fmt -w .
v vet .
```
