# C Style de code

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## C Profil

Pureline C suit **idiomatique C11/C17**: propriété explicite, codes d'erreur explicites et petites unités de traduction. C n'a ni destructeurs ni exceptions, de sorte que la discipline doit être visible dans le code lui-même.

### PL-C-001 — Clauses de garde et débit linéaire

Valider les arguments d'abord et garder le chemin de succès au niveau de l'indentation de base (voir [PL-CORE-003](../core/control-flow.md)); éviter `else` après une branche de retour.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Retour et vérification des codes d'erreur

Les fonctions Fallible renvoient un état `enum` et les résultats de pass par des paramètres externes. Chaque statut est vérifié; un rejet délibéré utilise un cast `(void)` avec un commentaire.

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

### PL-C-003 — Propriété explicite de la masse

Chaque allocation de happe a exactement un propriétaire. `*_create` transfère la propriété à l'appelant, `*_destroy` la libère et les personnes qui ont été appelées n'ont jamais gratuité les pointeurs empruntés.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` Uniquement pour une sortie de nettoyage unique

Sautez vers un label `cleanup:` par fonction, initialisez les ressources vers `NULL` en premier et n'utilisez jamais `goto` pour des boucles ou une logique ignorée.

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

Pour une ressource unique avec deux chemins simples de retour, préférez la fermer
directement à chaque retour. Une étiquette de nettoyage partagée est utile à mesure que le nettoyage grandit.

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

### PL-C-005 — Correcte de la force et État explicite

Les paramètres en lecture seule sont `const`, les locaux assignés une fois sont `const`, et l'état d'exécution est passé explicitement dans une structure de contexte au lieu de variables de champ de fichiers.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Petites fonctions ciblées

Chaque fonction fait une chose à un niveau d'abstraction ; extrait un helper quand un bloc a besoin d'un nom. Une machine d'état cohésive peut rester longue plutôt que d'être divisée arbitrairement.

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

### PL-C-007 — En-têtes statiques et minimalistes

Marquer les fonctions et les variables non publiques `static`, préfixer les symboles publics avec leur nom de module, et donner à chaque en-tête une protection include plus seulement la surface orientée vers le consommateur.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Densité du dossier source

A C feature folder holds at most **10 hand-maintained `.c` and `.h` files** by default. Generated code, vendored libraries, and tests do not count. Split along responsibility, never into nested folders for their own sake.

```c
#include "session/session.h"
```

### PL-C-009 — Outils et avertissements

Construisez avec `-std=c11 -Wall -Wextra -Werror -pedantic`, format avec `clang-format`, et vérifiez avec `clang-tidy`. Toute suppression nécessite un commentaire expliquant pourquoi.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
