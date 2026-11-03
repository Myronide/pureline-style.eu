# Style de code C

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil C {#c-profile}

Pureline C suit le **C11/C17 idiomatique** : propriété explicite, codes d'erreur explicites et petites unités de traduction. C n'a ni destructeurs ni exceptions ; la discipline doit donc être visible dans le code lui-même.

### PL-C-001 — Guard clauses et flux linéaire {#pl-c-001--guard-clauses-and-linear-flow}

Validez d'abord les arguments et gardez le chemin de succès au niveau d'indentation de base (voir [PL-CORE-003](../core/control-flow.md)) ; évitez `else` après une branche qui retourne.

```c
int session_open(const struct request *request, struct session *out)
{
    if (out == NULL) {
        return SESSION_ERR_INVALID;
    }
    return session_init(out, request->user);
}
```

### PL-C-002 — Retourner et vérifier les codes d'erreur {#pl-c-002--return-and-check-error-codes}

Les fonctions faillibles retournent un statut `enum` et transmettent leurs résultats par des paramètres de sortie. Chaque statut est vérifié ; un rejet délibéré utilise un cast `(void)` accompagné d'un commentaire.

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

### PL-C-003 — Propriété explicite du tas {#pl-c-003--explicit-heap-ownership}

Chaque allocation sur le tas a exactement un propriétaire. `*_create` transfère la propriété à l'appelant, `*_destroy` la libère, et les appelés ne libèrent jamais des pointeurs empruntés.

```c
/* The caller owns the result and releases it with session_destroy(). */
struct session *session_create(const char *user);
```

### PL-C-004 — `goto` uniquement pour une sortie de nettoyage unique {#pl-c-004--goto-only-for-a-single-cleanup-exit}

Sautez vers l'avant vers une seule étiquette `cleanup:` par fonction, initialisez d'abord les ressources à `NULL`, et n'utilisez jamais `goto` pour des boucles ou pour sauter de la logique.

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

### PL-C-005 — Const-correctness et état explicite {#pl-c-005--const-correctness-and-explicit-state}

Les paramètres en lecture seule sont `const`, les variables locales affectées une seule fois sont `const`, et l'état d'exécution est transmis explicitement dans une struct de contexte plutôt que par des variables de portée fichier.

```c
int cache_insert(struct cache *cache, const char *key);
```

### PL-C-006 — Fonctions petites et ciblées {#pl-c-006--small-focused-functions}

Chaque fonction fait une seule chose à un seul niveau d'abstraction ; extrayez une fonction auxiliaire lorsqu'un bloc mérite un nom. Une machine à états cohésive peut rester longue plutôt que d'être découpée arbitrairement.

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

### PL-C-007 — Liaison statique et en-têtes minimaux {#pl-c-007--static-linkage-and-minimal-headers}

Marquez `static` les fonctions et variables non publiques, préfixez les symboles publics avec le nom de leur module, et donnez à chaque en-tête une garde d'inclusion ainsi que la seule surface destinée aux consommateurs.

```c
#ifndef PURELINE_SESSION_H
#define PURELINE_SESSION_H
struct session *session_create(const char *user);
#endif
```

### PL-C-008 — Densité des dossiers sources {#pl-c-008--source-folder-density}

Un dossier de fonctionnalité C contient au maximum **10 fichiers `.c` et `.h` maintenus à la main** par défaut. Le code généré, les bibliothèques embarquées (vendored) et les tests ne comptent pas. Découpez selon la responsabilité, jamais en dossiers imbriqués pour eux-mêmes.

```c
#include "session/session.h"
```

### PL-C-009 — Outillage et avertissements {#pl-c-009--tooling-and-warnings}

Compilez avec `-std=c11 -Wall -Wextra -Werror -pedantic`, formatez avec `clang-format` et vérifiez avec `clang-tidy`. Toute suppression exige un commentaire qui en explique la raison.

```c
/* Build check: cc -std=c11 -Wall -Wextra -Werror -pedantic -c session.c */
```
