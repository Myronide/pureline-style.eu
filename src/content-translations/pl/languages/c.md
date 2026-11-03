# C Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Reguły natywne dla języka i jawne wyjątki profilu mają pierwszeństwo przed preferencjami składniowymi obowiązującymi we wszystkich językach. [Spójność ponad rozmiar](../core/structure.md) obowiązuje w całym profilu.

## Profil C {#c-profile}

Pureline C opiera się na **idiomatycznym C11/C17**: jawnej własności, jawnych kodach błędów i małych jednostkach translacji. C nie ma destruktorów ani wyjątków, więc dyscyplina musi być widoczna w samym kodzie.

### PL-C-001 — Guard clauses i liniowy przepływ {#pl-c-001--guard-clauses-and-linear-flow}

Najpierw waliduj argumenty i trzymaj ścieżkę sukcesu na bazowym poziomie wcięcia (zobacz [PL-CORE-003](../core/control-flow.md)); unikaj `else` po gałęzi kończącej się return.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Zwracaj i sprawdzaj kody błędów {#pl-c-002--return-and-check-error-codes}

Funkcje, które mogą się nie powieść, zwracają status typu `enum`, a wyniki przekazują przez parametry wyjściowe. Każdy status jest sprawdzany; celowe odrzucenie używa rzutowania `(void)` z komentarzem.

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

### PL-C-003 — Jawna własność sterty {#pl-c-003--explicit-heap-ownership}

Każda alokacja na stercie ma dokładnie jednego właściciela. `*_create` przekazuje własność wywołującemu, `*_destroy` ją zwalnia, a wywoływane funkcje nigdy nie zwalniają pożyczonych wskaźników.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` tylko dla jednego wyjścia z czyszczeniem {#pl-c-004--goto-only-for-a-single-cleanup-exit}

Skacz do przodu do jednej etykiety `cleanup:` na funkcję, najpierw inicjalizuj zasoby wartością `NULL` i nigdy nie używaj `goto` do pętli ani pomijania logiki.

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

### PL-C-005 — Poprawność const i jawny stan {#pl-c-005--const-correctness-and-explicit-state}

Parametry tylko do odczytu są `const`, zmienne lokalne przypisywane raz są `const`, a stan czasu wykonania jest przekazywany jawnie w strukturze kontekstu zamiast w zmiennych na poziomie pliku.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Małe, skupione funkcje {#pl-c-006--small-focused-functions}

Każda funkcja robi jedną rzecz na jednym poziomie abstrakcji; wydziel funkcję pomocniczą, gdy blok potrzebuje nazwy. Spójna maszyna stanów może pozostać długa, zamiast być dzielona dowolnie.

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

### PL-C-007 — Wiązanie statyczne i minimalne nagłówki {#pl-c-007--static-linkage-and-minimal-headers}

Funkcje i zmienne niepubliczne oznaczaj jako `static`, symbole publiczne poprzedzaj nazwą modułu, a każdy nagłówek wyposaż w include guard i tylko powierzchnię przeznaczoną dla konsumenta.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Gęstość folderów źródłowych {#pl-c-008--source-folder-density}

Folder funkcji w C domyślnie zawiera co najwyżej **10 ręcznie utrzymywanych plików `.c` i `.h`**. Kod generowany, biblioteki vendorowane i testy nie są wliczane. Dziel według odpowiedzialności, nigdy na zagnieżdżone foldery dla samych folderów.

```c
#include "session/session.h"
```

### PL-C-009 — Narzędzia i ostrzeżenia {#pl-c-009--tooling-and-warnings}

Buduj z `-std=c11 -Wall -Wextra -Werror -pedantic`, formatuj za pomocą `clang-format` i sprawdzaj za pomocą `clang-tidy`. Każde wyciszenie wymaga komentarza wyjaśniającego dlaczego.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
