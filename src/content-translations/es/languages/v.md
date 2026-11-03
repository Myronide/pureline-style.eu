# Estilo de código V

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de V {#v-profile}

### PL-V-001 — Inmutable por defecto {#pl-v-001--immutable-by-default}

Las variables son inmutables salvo que se declaren con `mut`. Declara `mut` solo donde un valor deba cambiar. Consulta [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Devuelve tipos result para los fallos {#pl-v-002--return-result-types-for-failures}

Una función que puede fallar devuelve `!T` e informa del fallo con `error(...)`.

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

### PL-V-003 — Trata los errores pronto con `or {}` {#pl-v-003--handle-errors-early-with-or}

Trata una llamada fallida en el propio punto de llamada. Propaga con `!` solo cuando quien llama deba ser el dueño del error.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

### PL-V-004 — Usa tipos option para los valores ausentes {#pl-v-004--use-option-types-for-absent-values}

Usa `?T` cuando la ausencia sea un resultado normal. Usa `!T` cuando el fallo necesite un motivo.

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

### PL-V-005 — Guard clauses y funciones pequeñas {#pl-v-005--guard-clauses-and-small-functions}

Rechaza primero las entradas inválidas para que el camino de éxito siga siendo lineal. Cada función hace un único trabajo. Consulta [PL-CORE-003](../core/principles.md) y [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — Los nombres siguen las convenciones de V {#pl-v-006--naming-follows-v-conventions}

Las funciones y las variables usan `snake_case`. Los structs y los enums usan `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Inicializa los structs de forma explícita {#pl-v-007--initialise-structs-explicitly}

Nombra cada campo en un literal de struct. La inicialización posicional oculta qué valor va dónde.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Una responsabilidad por carpeta de módulo {#pl-v-008--one-responsibility-per-module-folder}

En V, una carpeta es un módulo. Sus archivos comparten una única declaración `module` y una única responsabilidad. La cohesión importa más que el número de líneas ([cohesión antes que tamaño](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Mantén las carpetas lo bastante densas como para recorrerlas de un vistazo {#pl-v-009--keep-folders-dense-enough-to-scan}

Una carpeta contiene como máximo 10 archivos fuente mantenidos a mano por defecto. Los archivos generados no cuentan. Superado ese límite, divide por responsabilidad en una carpeta de submódulo.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Da formato y revisa con vet antes de la revisión {#pl-v-010--format-and-vet-before-review}

Ejecuta ambas herramientas en cada cambio, para que las revisiones traten sobre la intención y no sobre el layout o las construcciones sospechosas.

```sh
v fmt -w .
v vet .
```
