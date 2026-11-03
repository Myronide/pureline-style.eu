# Stile del codice C

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

## Profilo C {#c-profile}

Pureline C segue il **C11/C17 idiomatico**: ownership esplicito, codici di errore espliciti e piccole unità di traduzione. C non ha distruttori né eccezioni, quindi la disciplina deve essere visibile nel codice stesso.

### PL-C-001 — Guard clause e flusso lineare {#pl-c-001--guard-clauses-and-linear-flow}

Valida per prima cosa gli argomenti e mantieni il percorso di successo al livello di indentazione di base (vedi [PL-CORE-003](../core/control-flow.md)); evita `else` dopo un ramo che ritorna.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Restituire e controllare i codici di errore {#pl-c-002--return-and-check-error-codes}

Le funzioni che possono fallire restituiscono uno stato `enum` e passano i risultati tramite parametri di output. Ogni stato viene controllato; uno scarto deliberato usa un cast `(void)` con un commento.

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

### PL-C-003 — Ownership esplicito dell'heap {#pl-c-003--explicit-heap-ownership}

Ogni allocazione sull'heap ha esattamente un proprietario. `*_create` trasferisce la proprietà al chiamante, `*_destroy` la rilascia e i chiamati non liberano mai i puntatori presi in prestito.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` solo per una singola uscita di cleanup {#pl-c-004--goto-only-for-a-single-cleanup-exit}

Salta in avanti a un'unica etichetta `cleanup:` per funzione, inizializza prima le risorse a `NULL` e non usare mai `goto` per i cicli o per saltare della logica.

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

### PL-C-005 — Correttezza di const e stato esplicito {#pl-c-005--const-correctness-and-explicit-state}

I parametri di sola lettura sono `const`, le variabili locali assegnate una sola volta sono `const` e lo stato a runtime viene passato esplicitamente in una struct di contesto invece che in variabili a livello di file.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Funzioni piccole e mirate {#pl-c-006--small-focused-functions}

Ogni funzione fa una sola cosa a un solo livello di astrazione; estrai una funzione di supporto quando un blocco ha bisogno di un nome. Una macchina a stati coesa può restare lunga invece di essere divisa arbitrariamente.

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

### PL-C-007 — Linkage statico e header minimi {#pl-c-007--static-linkage-and-minimal-headers}

Contrassegna come `static` le funzioni e le variabili non pubbliche, anteponi ai simboli pubblici il nome del loro modulo e dai a ogni header un include guard e solo la superficie rivolta al consumatore.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Densità delle cartelle sorgente {#pl-c-008--source-folder-density}

Una cartella di funzionalità C contiene al massimo **10 file `.c` e `.h` mantenuti a mano** per impostazione predefinita. Il codice generato, le librerie incluse (vendored) e i test non contano. Dividi lungo le responsabilità, mai in cartelle annidate fini a sé stesse.

```c
#include "session/session.h"
```

### PL-C-009 — Strumenti e avvisi {#pl-c-009--tooling-and-warnings}

Compila con `-std=c11 -Wall -Wextra -Werror -pedantic`, formatta con `clang-format` e controlla con `clang-tidy`. Ogni soppressione richiede un commento che ne spieghi il motivo.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
