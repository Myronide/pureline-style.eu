# Estilo de código C

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las [reglas compartidas](../README.md#shared-rules) junto con este perfil. Las reglas nativas del idioma y las excepciones explícitas del perfil tienen precedencia sobre las preferencias de sintaxis del idioma. [Cohesión sobre Tamaño](../core/structure.md) se aplica en todo momento.

## C Perfil

Pureline C sigue a **idiomatic C11/C17**: propiedad explícita, códigos de error explícitos y pequeñas unidades de traducción. C no tiene ni dúctiles ni excepciones, por lo que la disciplina debe ser visible en el propio código.

### PL-C-001 — Cláusulas de protección y flujo lineal

Validar los argumentos primero y mantener la ruta de éxito en el nivel de sangría base (ver [PL-CORE-003](../core/control-flow.md)); evitar `else` después de una rama de retorno.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Volver y comprobar los códigos de error

Las funciones falibles devuelven un estado `enum` y pasan los resultados a través de parámetros de salida. Cada estado es comprobado; un descarte deliberado utiliza un molde `(void)` con un comentario.

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

### PL-C-003 — Propiedad explícita de la masa

Cada asignación de montón tiene exactamente un propietario. `*_create` transfiere la propiedad al que llama, `*_destroy` la libera y las calles nunca gratis.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` solo para una salida de limpieza única

Saltar hacia adelante a una etiqueta `cleanup:` por función, inicializar los recursos a `NULL` primero, y nunca utilizar `goto` para bucles o lógica omitida.

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

Para un único recurso con dos rutas de retorno simples, prefiera cerrarlo
directamente a cada retorno. Una etiqueta de limpieza compartida es útil a medida que crece la limpieza.

```text
Shared cleanup label              │ ✓ Pureline
int status = read_header(file);   │ int status = read_header(file);
if (status != OK) {               │ if (status != OK) {
    goto cleanup;                 │     fclose(file);
}                                 │     return status;
                                  │ }
status = read_body(file);         │
                                  │ status = read_body(file);
cleanup:                          │ fclose(file);
    fclose(file);                 │ return status;
    return status;                │
```

### PL-C-005 — Conservar la corrección y el Estado explícito

Los parámetros de sólo lectura son `const`, los locales asignados una vez son `const`, y el estado de ejecución se pasa explícitamente en una estructura de contexto en lugar de variables de archivo-scopio.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Funciones pequeñas y centradas

Cada función hace una cosa en un nivel de abstracción; extraiga un ayudante cuando un bloque necesita un nombre. Una máquina de estado cohesionado puede permanecer mucho tiempo en lugar de ser dividida arbitrariamente.

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

### PL-C-007 — Enlace estatico y cabeceras mínimas

Marcar funciones y variables no públicas `static`, prefijar símbolos públicos con su nombre de módulo, y dar a cada cabecera un protector de inclusión más sólo la superficie orientada al consumidor.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Densidad de la carpeta fuente

Una carpeta de características C tiene como máximo **10 mantenidos a mano `.c` y `.h` archivos** por defecto. código generado, bibliotecas vendidas y pruebas no cuentan. Dividir a lo largo de la responsabilidad, nunca en carpetas anidadas por su propio bien.

```c
#include "session/session.h"
```

### PL-C-009 — Herramientas y advertencias

Construya con `-std=c11 -Wall -Wextra -Werror -pedantic`, formato con `clang-format`, y consulte con `clang-tidy`. Cualquier supresión necesita un comentario que explique por qué.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
