# Estilo de código C

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas propias del lenguaje y las excepciones explícitas del perfil tienen prioridad sobre las preferencias de sintaxis comunes a todos los lenguajes. La [cohesión antes que tamaño](../core/structure.md) rige en todo momento.

## Perfil de C {#c-profile}

Pureline C sigue el **C11/C17 idiomático**: propiedad explícita, códigos de error explícitos y unidades de traducción pequeñas. C no tiene destructores ni excepciones, por lo que la disciplina debe ser visible en el propio código.

### PL-C-001 — Guard clauses y flujo lineal {#pl-c-001--guard-clauses-and-linear-flow}

Valida primero los argumentos y mantén el camino de éxito en el nivel de sangría base (consulta [PL-CORE-003](../core/control-flow.md)); evita `else` después de una rama que retorna.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Devuelve y comprueba códigos de error {#pl-c-002--return-and-check-error-codes}

Las funciones que pueden fallar devuelven un estado `enum` y entregan los resultados mediante parámetros de salida. Se comprueba cada estado; un descarte deliberado usa una conversión `(void)` con un comentario.

```c
int load(struct session *session)
{
    int status = session_open(session);
    if (status != 0) {
        return status;
    }
    return session_start(session);
}
```

### PL-C-003 — Propiedad explícita del heap {#pl-c-003--explicit-heap-ownership}

Cada reserva en el heap tiene exactamente un dueño. `*_create` transfiere la propiedad a quien llama, `*_destroy` la libera, y quienes reciben un puntero prestado nunca lo liberan.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` solo para una única salida de limpieza {#pl-c-004--goto-only-for-a-single-cleanup-exit}

Salta hacia adelante a una única etiqueta `cleanup:` por función, inicializa primero los recursos a `NULL` y no uses nunca `goto` para bucles ni para saltarse lógica.

```c
int report_write(const char *path, const char *text)
{
    int result = -1;
    FILE *file = fopen(path, "w");
    if (file == NULL || fputs(text, file) == EOF) {
        goto cleanup;
    }
    result = 0;
cleanup:
    if (file != NULL) {
        fclose(file);
    }
    return result;
}
```

### PL-C-005 — Corrección de const y estado explícito {#pl-c-005--const-correctness-and-explicit-state}

Los parámetros de solo lectura son `const`, las variables locales que se asignan una vez son `const`, y el estado en tiempo de ejecución se pasa de forma explícita en una struct de contexto en lugar de usar variables de ámbito de archivo.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Funciones pequeñas y enfocadas {#pl-c-006--small-focused-functions}

Cada función hace una sola cosa en un único nivel de abstracción; extrae una función auxiliar cuando un bloque necesite un nombre. Una máquina de estados cohesiva puede seguir siendo larga en lugar de dividirse de forma arbitraria.

```c
int save_report(const struct report *report, const char *path)
{
    char *text = NULL;
    int status = report_render(report, &text);
    if (status == 0) {
        status = file_write_text(path, text);
    }
    free(text);
    return status;
}
```

### PL-C-007 — Enlace estático y cabeceras mínimas {#pl-c-007--static-linkage-and-minimal-headers}

Marca como `static` las funciones y variables no públicas, antepón a los símbolos públicos el nombre de su módulo y da a cada cabecera una protección de inclusión (include guard) y solo la superficie que necesita quien la consume.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Densidad de carpetas de código fuente {#pl-c-008--source-folder-density}

Una carpeta de funcionalidad de C contiene como máximo **10 archivos `.c` y `.h` mantenidos a mano** por defecto. El código generado, las bibliotecas incluidas (vendored) y los tests no cuentan. Divide según la responsabilidad, nunca en carpetas anidadas por el simple hecho de anidar.

```c
#include "session/session.h"
```

### PL-C-009 — Herramientas y advertencias {#pl-c-009--tooling-and-warnings}

Compila con `-std=c11 -Wall -Wextra -Werror -pedantic`, da formato con `clang-format` y comprueba con `clang-tidy`. Toda supresión necesita un comentario que explique el motivo.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
