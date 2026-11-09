# Estilo de código V

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## V Perfil

### PL-V-001 — Inmutable por defecto

Las variables son inmutables a menos que se declaren con `mut`. Declarar `mut` sólo cuando un valor debe cambiar. Véase [PL-CORE-010](../core/principles.md].

```v
limit := 10
```

### PL-V-002 — Tipos de resultados de retorno para fallos

Una función falible devuelve `!T` e informa de fallas con `error(...)`.

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

### PL-V-003 — Manejar errores temprano con `or {}`

Maneje una llamada fallida en el sitio de llamada. Propagar con `!` sólo cuando el llamante debe ser el propietario del error.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

En una función que devuelve un resultado, prefiere `!` para propagar un cambio
error.. Utilice un bloque `or` cuando la ruta de error necesite manejo adicional.

```text
Explicit propagation                  │ ✓ Pureline
config := load_config(path) or {      │ config := load_config(path)!
    return err                        │ start(config)
}                                     │
                                      │
start(config)                         │
```

### PL-V-004 — Usar tipos de opción para los valores de ausencia

Use `?T` cuando la ausencia sea un resultado normal. Use `!T` cuando el fallo necesite una razón.

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

### PL-V-005 — Cláusulas de protección y funciones pequeñas

Rechazar entrada inválida primero para que la ruta de éxito siga siendo lineal. Cada función hace un trabajo. Véase [PL-CORE-003](../core/principles.md) y [PL-CORE-006](../core/principles.md].

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — La designación sigue las convenciones V

Las funciones y variables usan `snake_case`. Los estructos y enums usan `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Inicializar estructuras explícitamente

Nombrar cada campo en una estructura literal. La inicialización posicional oculta qué valor va a dónde.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Una responsabilidad por carpeta de módulo

En V, una carpeta es un módulo. Sus archivos comparten una declaración `module` y una responsabilidad. La cohesión importa más que el recuento de líneas ([Cohesión sobre Tamaño](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009: mantener las carpetas lo suficientemente densas para escanear

Una carpeta contiene como máximo 10 archivos fuente mantenidos a mano por defecto. Los archivos generados no cuentan. Pasado ese límite, dividido por responsabilidad en una carpeta submódulo.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Formato y verificación antes de la revisión

Ejecute ambas herramientas en cada cambio, así que las revisiones discutir la intención en lugar de diseño o construcciones sospechosas.

```sh
v fmt -w .
v vet .
```
