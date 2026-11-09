# C Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) together with this profile. Language-native rules and explicit profile exceptions take precedence over cross-language syntax preferences. [Cohesion over Size](../core/structure.md) applies throughout.

## C Profile

Pureline C follows **idiomatic C11/C17**: explicit ownership, explicit error codes, and small translation units. C has no destructors or exceptions, so discipline must be visible in the code itself.

### PL-C-001. Clausole di guardia e flusso lineare

Validate arguments first and keep the success path at the base indentation level (see [PL-CORE-003](../core/control-flow.md)); avoid `else` after a returning branch.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Return and Check Error Codes

Fallible functions return an `enum` status and pass results through out-parameters. Every status is checked; a deliberate discard uses a `(void)` cast with a comment.

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

### PL-C-003. Proprietà esplicita del tallone interreno le misure

Each heap allocation has exactly one owner. `*_create` transfers ownership to the caller, `*_destroy` releases it, and callees never free borrowed pointers.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` Only for a Single Cleanup Exit

Jump forward to one `cleanup:` label per function, initialise resources to `NULL` first, and never use `goto` for loops or skipped logic.

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

Per una sola risorsa con due semplici percorsi di ritorno, preferisci chiuderla
directly at each return. A shared cleanup label is useful as cleanup grows.

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

### PL-C-005. Corretta ed esplicitata

I parametri di sola lettura sono `const`, i locali assegnati una volta sono `const`, e lo stato runtime viene passato esplicitamente in una struttura contestuale invece delle variabili del file-scope.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006. Piccole funzioni focalizzate

Each function does one thing at one level of abstraction; extract a helper when a block needs a name. A cohesive state machine may stay long rather than being split arbitrarily.

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

### PL-C-007.Sanac Linkage e intestazioni minime

Contrassegna le funzioni e le variabili non pubbliche `static`, prefissa i simboli pubblici con il loro nome di modulo e dai ad ogni intestazione una protezione include più solo la superficie rivolta al consumatore.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008. Densità della cartella sorgente

Una cartella di funzionalità C contiene al massimo **10 mantenuto a mano `.c` e `.h` file** per impostazione predefinita.. Generated code, vendored libraries, and tests do not count. Split along responsibility, never into nested folders for their own sake.

```c
#include "session/session.h"
```

### PL-C-009. Troppo e avvisi

Build with `-std=c11 -Wall -Wextra -Werror -pedantic`, format with `clang-format`, and check with `clang-tidy`. Any suppression needs a comment explaining why.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
