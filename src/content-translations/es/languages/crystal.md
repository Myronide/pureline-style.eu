# Estilo de código Crystal

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de Crystal {#crystal-profile}

Crystal conserva su propia identidad como lenguaje mientras sigue los principios de Pureline.

### PL-CR-001 — Se permiten las guardas postfijas idiomáticas {#pl-cr-001--idiomatic-postfix-guards-are-allowed}

Las condiciones postfijas de Crystal cumplen Pureline cuando expresan una guarda corta y evidente.

Bien:

```crystal
return unless valid
return if closed
```

Encajan bien con Pureline porque mantienen compacta la lógica de las guardas y preservan un camino principal lineal.

Usa un bloque explícito cuando la condición o la acción protegida se vuelvan más complejas:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

La regla no es «evita las condiciones postfijas». La regla es: usa la forma que mantenga la intención evidente al instante.

### PL-CR-002 — Evita `else` {#pl-cr-002--avoid-else}

Evita:

```crystal
if valid
  execute
else
  reject
end
```

Prefiere:

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003 — Nombres idiomáticos {#pl-cr-003--idiomatic-naming}

Las variables y los métodos usan `snake_case`:

```crystal
session_service
packet_registry
load_user
create_session
```

Los tipos usan PascalCase:

```crystal
SessionService
PacketRegistry
UserStorage
```

### PL-CR-004 — Prefiere la inferencia de tipos {#pl-cr-004--prefer-type-inference}

Preferible:

```crystal
session = create_session(user)
```

Evita las anotaciones redundantes:

```crystal
session : Session = create_session(user)
```

cuando Crystal puede inferir el tipo con claridad.

### PL-CR-005 — Guardas explícitas de nil {#pl-cr-005--explicit-nil-guards}

Preferible:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Evita enterrar el tratamiento esperado de nil dentro de cadenas profundamente anidadas.

### PL-CR-006 — Las excepciones son para estados excepcionales {#pl-cr-006--exceptions-are-for-exceptional-states}

Los resultados esperados deberían modelarse preferiblemente con el modelado de dominio normal, como `nil`, tipos de unión, estructuras de tipo result o enums.

Las excepciones deben representar fallos excepcionales, no la ramificación ordinaria.

### PL-CR-007 — Evita la sofisticación con macros sin necesidad {#pl-cr-007--avoid-macro-cleverness-without-need}

Las macros de Crystal son potentes, pero Pureline evita ocultar comportamientos ordinarios tras la metaprogramación, salvo que la abstracción aporte un beneficio arquitectónico claro.

El comportamiento generado debe seguir siendo predecible y fácil de descubrir.

---

### PL-CR-008 — Densidad de carpetas {#pl-cr-008--folder-density}

Una carpeta de código fuente o de namespace de Crystal puede contener como máximo **10 archivos `.cr` de producción** por defecto.

Los specs, los archivos generados, los bindings y los archivos que solo contienen metadatos no cuentan.

Cuando se supera el límite, divide el namespace por responsabilidades conservando la estructura idiomática de Crystal.
