# C Codestijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [shared core rules](../README.md#shared-rules) toe samen met dit profiel. Taal-native regels en expliciete profiel uitzonderingen hebben voorrang op de taaloverschrijdende syntax voorkeuren. [Cohesie over Size](../core/structure.md) geldt gedurende het gehele.

## C-profiel

Pureline C volgt **idiomatic C11/C17**: expliciete eigendom, expliciete foutcodes en kleine vertaaleenheden. C heeft geen vernietigers of uitzonderingen, dus discipline moet zichtbaar zijn in de code zelf.

### PL-C-001. Guard Clausles en Linear Flow

Valideer argumenten eerst en houd het succespad op het basisinspringen niveau (zie [PL-CORE-003](../core/control-flow.md)); vermijd `else` na een terugkerende tak.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002. Foutcodes retourneren en controleren

Fallable functies geven een `enum` status terug en geven resultaten door via out-parameters. Elke status wordt gecontroleerd; een doelbewuste teruggooi gebruikt een `(void)` cast met een commentaar.

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

### PL-C-003. Uitdrukkelijke Heap Ownership

Elke berg toewijzing heeft precies één eigenaar. `*_create` draagt eigendom over aan de beller, `*_destroy` geeft het uit, en callees geven nooit geleende aanwijzers vrij.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004. `goto` Alleen voor een enkele opruimingsuitgang

Spring naar voren naar één `cleanup:`-label per functie, initialiseer de middelen voor `NULL` als eerste, en gebruik nooit `goto` voor loops of overgeslagen logica.

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

Voor één enkele bron met twee eenvoudige terugkeerpaden, sluit deze liever af
rechtstreeks bij elke terugkeer. Een gedeeld opruimlabel is nuttig als opruiming groeit.

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

### PL-C-005. Const Correctheid en Expliciete Staat

Alleen-lezen parameters zijn `const`, locals die eenmaal zijn toegewezen `const`, en runtime status wordt expliciet doorgegeven in een context structuur in plaats van bestand-scoop variabelen.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006. Kleine, gerichte functies

Elke functie doet één ding op één niveau van abstractie; extraheren een helper wanneer een blok een naam nodig heeft. Een samenhangende staatsmachine kan lang blijven in plaats van willekeurig te worden gesplitst.

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

### PL-C-007. Statische koppeling en minimale berichtkoppen

Markeer niet-publieke functies en variabelen `static`, prefix publieke symbolen met hun modulenaam, en geef elke header en inclusief bewaker plus alleen het consumentenoppervlak.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008. Bronmap-dinensity

Een C-functie map bevat hooguit **10 hand-onderhoud `.c` en `.h`-bestanden** standaard. Genereerde code, bibliotheken met leveranciers, en tests tellen niet mee. Splits de verantwoordelijkheid, nooit in neste mappen voor hun eigen bestwil.

```c
#include "session/session.h"
```

### PL-C-009. Gereedschap en waarschuwingen

Bebouwd met `-std=c11 -Wall -Wextra -Werror -pedantic`, formaat met `clang-format`, en controleer met `clang-tidy`. Elke onderdrukking moet een commentaar waarom.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
