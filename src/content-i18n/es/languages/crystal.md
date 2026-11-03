# Estilo de código de cristal

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## Perfil de cristal

Crystal mantiene su propia identidad lingüística mientras sigue los principios de Pureline.

### PL-CR-001 — Se permiten guardias posfijos populares

Las condiciones de la postfija de cristal son compatibles con Pureline cuando expresan un protector corto y obvio.

Good:

```crystal
return unless valid
return if closed
```

Se adaptan bien a Pureline porque pueden mantener la lógica de guardia compacta y preservar un camino feliz lineal.

Use un bloque explícito cuando la condición o la acción guardada se vuelva más compleja:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

La regla no es "evitar condiciones postfix". La regla es: utilizar la forma que mantiene la intención inmediatamente obvia.

### PL-CR-002 — Evitar `else`

Evitar:

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

### PL-CR-003 — Denominación popular

Las variables y los métodos utilizan `snake_case`:

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

### PL-CR-004 — Prefiere la inferencia de tipo

Preferido:

```crystal
session = create_session(user)
```

Evitar anotaciones redundantes:

```crystal
session : Session = create_session(user)
```

cuando Crystal puede inferir el tipo claramente.

### PL-CR-005 — Guardias nili competentes

Preferido:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Evite enterrar el manejo esperado de Nil dentro de cadenas profundamente anidadas.

### PL-CR-006 — Las excepciones son para Estados excepcionales

Los resultados esperados deben utilizar preferentemente el modelado normal del dominio como `nil`, tipos de unión, estructuras de resultado o enums.

Las excepciones deben representar un fracaso excepcional, no una ramación ordinaria.

### PL-CR-007: Evite la cleridad macro sin necesidad

Las macros cristalinas son poderosas, pero Pureline evita ocultar el comportamiento ordinario detrás de la metaprogramación a menos que la abstracción produzca un claro beneficio arquitectónico.

El comportamiento generado debe permanecer predecible y reconocible.

---

### PL-CR-008 — Densidad de la carpeta

Una carpeta de Crystal o de espacio de nombres puede contener como máximo **10 producción `.cr` archivos** por defecto.

Especificaciones, archivos generados, enlaces y archivos de sólo metadatos no cuentan.

Cuando se supere el límite, dividir el espacio de nombres por responsabilidad mientras se preserva la estructura de Cristales de la región.
