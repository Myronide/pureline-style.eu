# C-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. Taaleigen regels en expliciete profielvrijstellingen gaan voor op voorkeuren voor syntaxis die voor alle talen gelden. [Samenhang boven omvang](../core/structure.md) geldt overal.

## C-profiel {#c-profile}

Pureline C volgt **idiomatisch C11/C17**: expliciet eigenaarschap, expliciete foutcodes en kleine translation units. C kent geen destructors of uitzonderingen, dus de discipline moet zichtbaar zijn in de code zelf.

### PL-C-001 — Guard clauses en lineaire stroom {#pl-c-001--guard-clauses-and-linear-flow}

Valideer eerst de argumenten en houd het succespad op het basisinspringniveau (zie [PL-CORE-003](../core/control-flow.md)); vermijd `else` na een tak die terugkeert.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Retourneer en controleer foutcodes {#pl-c-002--return-and-check-error-codes}

Functies die kunnen falen retourneren een `enum`-status en geven resultaten door via uitvoerparameters. Elke status wordt gecontroleerd; een bewuste negering gebruikt een `(void)`-cast met een opmerking.

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

### PL-C-003 — Expliciet eigenaarschap van de heap {#pl-c-003--explicit-heap-ownership}

Elke heap-allocatie heeft precies één eigenaar. `*_create` draagt het eigenaarschap over aan de aanroeper, `*_destroy` geeft het vrij, en aangeroepen functies geven geleende pointers nooit vrij.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` alleen voor één opruimuitgang {#pl-c-004--goto-only-for-a-single-cleanup-exit}

Spring voorwaarts naar één `cleanup:`-label per functie, initialiseer resources eerst op `NULL` en gebruik `goto` nooit voor lussen of overgeslagen logica.

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

### PL-C-005 — Const-correctheid en expliciete toestand {#pl-c-005--const-correctness-and-explicit-state}

Parameters die alleen gelezen worden zijn `const`, lokale variabelen die één keer worden toegewezen zijn `const`, en runtimetoestand wordt expliciet doorgegeven in een contextstruct in plaats van via variabelen op bestandsniveau.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Kleine, gefocuste functies {#pl-c-006--small-focused-functions}

Elke functie doet één ding op één abstractieniveau; extraheer een hulpfunctie wanneer een blok een naam nodig heeft. Een samenhangende toestandsmachine mag lang blijven in plaats van willekeurig te worden gesplitst.

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

### PL-C-007 — Statische linkage en minimale headers {#pl-c-007--static-linkage-and-minimal-headers}

Markeer niet-publieke functies en variabelen als `static`, geef publieke symbolen de naam van hun module als voorvoegsel en geef elke header een include guard plus alleen het oppervlak dat voor de consument bedoeld is.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Dichtheid van bronmappen {#pl-c-008--source-folder-density}

Een featuremap in C bevat standaard maximaal **10 handmatig onderhouden `.c`- en `.h`-bestanden**. Gegenereerde code, gevendorde bibliotheken en tests tellen niet mee. Splits langs verantwoordelijkheid, nooit in geneste mappen om het geneste mappen zelf.

```c
#include "session/session.h"
```

### PL-C-009 — Tooling en waarschuwingen {#pl-c-009--tooling-and-warnings}

Bouw met `-std=c11 -Wall -Wextra -Werror -pedantic`, formatteer met `clang-format` en controleer met `clang-tidy`. Elke onderdrukking vraagt om een opmerking die uitlegt waarom.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
