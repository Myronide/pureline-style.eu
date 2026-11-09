# C Code Style

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## C-Profil

Pureline C folgt **idiomatic C11/C17**: expliziter Besitz, explizite Fehlercodes und kleine Übersetzungseinheiten. C hat keine Destruktoren oder Ausnahmen, also muss Disziplin im Code selbst sichtbar sein.

### PL-C-001 — Schutzklauseln und linearer Fluss

Argumente zuerst validieren und den Erfolgspfad auf der Basiseinrückungsebene halten (siehe [PL-CORE-003](../core/control-flow.md)); `else` nach einem wiederkehrenden Zweig vermeiden.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Fehlercodes zurückgeben und überprüfen

Fallhafte Funktionen geben einen `enum`-Status zurück und übergeben Ergebnisse durch out-parameters. Jeder Status wird überprüft; ein absichtlicher Rückwurf verwendet einen `(void)`-cast mit einem Kommentar.

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

### PL-C-003 — explizite Heap-Eigenschaft

Jede Heap-Zuweisung hat genau einen Besitzer... `*_create` überträgt das Eigentum an dem Anrufer, `*_destroy` veröffentlicht es, und ruft nie kostenlos ausgeliehene Zeiger.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` Nur für einen einzigen Cleanup-Ausgang

Springt zu einem `cleanup:`-Label pro Funktion, initialisiert Ressourcen zuerst zu `NULL` und nutzt `goto` niemals für Loops oder übersprungene Logik.

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

Für eine einzige Ressource mit zwei einfachen Rücklaufpfaden, lieber schließen
direkt bei jeder Rückkehr. Ein gemeinsames Cleanup-Label ist nützlich, wenn das Cleanup wächst.

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

### PL-C-005 — Beständige Korrektheit und expliziter Zustand

Nur-Leseparameter sind `const`, die Einheimischen sind einmal `const` zugewiesen, und der Laufzeitzustand wird explizit in einem Kontextstruct statt in Datei-Skop-Variablen übergeben.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Kleine, fokussierte Funktionen

Jede Funktion tut auf einer Abstraktionsebene eine Sache; extrahieren Sie einen Helfer, wenn ein Block einen Namen braucht. Eine kohäsive Zustandsmaschine kann lange bleiben, anstatt willkürlich geteilt zu werden.

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

### PL-C-007 — Statische Verbindung und minimale Kopfbedeckungen

Markieren Sie nicht-öffentliche Funktionen und Variablen `static`, Präfix öffentliche Symbole mit ihrem Modulnamen, und geben jedem Header einen Include Guard plus nur die Verbraucher-angewandte Oberfläche.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Dichte des Quellordners

A C feature folder holds at most **10 hand-maintained `.c` and `.h` files** by default. Generated code, vendored libraries, and tests do not count. Split along responsibility, never into nested folders for their own sake.

```c
#include "session/session.h"
```

### PL-C-009 — Tooling and Warnings

Build with `-std=c11 -Wall -Wextra -Werror -pedantic`, format with `clang-format`, and check with `clang-tidy`. Any suppression needs a comment explaining why.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
