# C Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## C-Profil {#c-profile}

Pureline C folgt **idiomatischem C11/C17**: explizite Ownership, explizite Fehlercodes und kleine Übersetzungseinheiten. C hat weder Destruktoren noch Exceptions, deshalb muss die Disziplin im Code selbst sichtbar sein.

### PL-C-001 — Guard Clauses und linearer Fluss {#pl-c-001--guard-clauses-and-linear-flow}

Validiere Argumente zuerst und halte den Erfolgspfad auf der Basis-Einrückung (siehe [PL-CORE-003](../core/control-flow.md)); vermeide `else` nach einem Zweig, der zurückkehrt.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Fehlercodes zurückgeben und prüfen {#pl-c-002--return-and-check-error-codes}

Fehleranfällige Funktionen geben einen `enum`-Status zurück und liefern Ergebnisse über Out-Parameter. Jeder Status wird geprüft; ein bewusstes Verwerfen verwendet einen `(void)`-Cast mit einem Kommentar.

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

### PL-C-003 — Explizite Heap-Ownership {#pl-c-003--explicit-heap-ownership}

Jede Heap-Allokation hat genau einen Eigentümer. `*_create` überträgt die Ownership an den Aufrufer, `*_destroy` gibt sie frei, und Aufgerufene geben geliehene Zeiger nie frei.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` nur für einen einzigen Cleanup-Ausgang {#pl-c-004--goto-only-for-a-single-cleanup-exit}

Springe vorwärts zu genau einem `cleanup:`-Label pro Funktion, initialisiere Ressourcen zuerst mit `NULL` und verwende `goto` niemals für Schleifen oder übersprungene Logik.

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

### PL-C-005 — Const-Korrektheit und expliziter Zustand {#pl-c-005--const-correctness-and-explicit-state}

Schreibgeschützte Parameter sind `const`, einmal zugewiesene lokale Variablen sind `const`, und Laufzeitzustand wird explizit in einer Kontext-Struct übergeben statt in Variablen auf Dateiebene.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Kleine, fokussierte Funktionen {#pl-c-006--small-focused-functions}

Jede Funktion tut eine Sache auf einer Abstraktionsebene; extrahiere einen Helfer, wenn ein Block einen Namen braucht. Eine kohäsive Zustandsmaschine darf lang bleiben, statt willkürlich aufgeteilt zu werden.

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

### PL-C-007 — Statisches Linkage und minimale Header {#pl-c-007--static-linkage-and-minimal-headers}

Markiere nicht öffentliche Funktionen und Variablen als `static`, versehe öffentliche Symbole mit dem Namen ihres Moduls als Präfix und gib jedem Header einen Include-Guard sowie nur die für Konsumenten bestimmte Oberfläche.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Dichte der Quellordner {#pl-c-008--source-folder-density}

Ein C-Feature-Ordner enthält standardmäßig höchstens **10 von Hand gepflegte `.c`- und `.h`-Dateien**. Generierter Code, eingebundene Fremdbibliotheken und Tests zählen nicht. Teile entlang der Verantwortung auf, niemals in verschachtelte Ordner um ihrer selbst willen.

```c
#include "session/session.h"
```

### PL-C-009 — Tooling und Warnungen {#pl-c-009--tooling-and-warnings}

Baue mit `-std=c11 -Wall -Wextra -Werror -pedantic`, formatiere mit `clang-format` und prüfe mit `clang-tidy`. Jede Unterdrückung braucht einen Kommentar, der erklärt, warum.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
