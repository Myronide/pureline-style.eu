# Style de code V

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. Les règles natives du langage et les exceptions explicites du profil ont priorité sur les préférences de syntaxe communes à tous les langages. [Cohésion avant la taille](../core/structure.md) s'applique partout.

## Profil V {#v-profile}

### PL-V-001 — Immuable par défaut {#pl-v-001--immutable-by-default}

Les variables sont immuables, sauf si elles sont déclarées avec `mut`. Ne déclarez `mut` que là où une valeur doit changer. Voir [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Retourner des types résultat pour les échecs {#pl-v-002--return-result-types-for-failures}

Une fonction faillible retourne `!T` et signale l'échec avec `error(...)`.

```v
struct User {
	id   int
	name string
}

fn load_user(id int) !User {
	if id <= 0 {
		return error('invalid user id')
	}
	return User{id: id, name: 'ada'}
}
```

### PL-V-003 — Traiter les erreurs tôt avec `or {}` {#pl-v-003--handle-errors-early-with-or}

Traitez un appel en échec au point d'appel. Ne propagez avec `!` que lorsque l'appelant doit être propriétaire de l'erreur.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

### PL-V-004 — Utiliser les types option pour les valeurs absentes {#pl-v-004--use-option-types-for-absent-values}

Utilisez `?T` lorsque l'absence est un résultat normal. Utilisez `!T` lorsque l'échec nécessite une raison.

```v
fn find_user(users []User, id int) ?User {
	for user in users {
		if user.id == id {
			return user
		}
	}
	return none
}
```

### PL-V-005 — Guard clauses et petites fonctions {#pl-v-005--guard-clauses-and-small-functions}

Rejetez d'abord les entrées invalides pour que le chemin de succès reste linéaire. Chaque fonction fait un seul travail. Voir [PL-CORE-003](../core/principles.md) et [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — Le nommage suit les conventions de V {#pl-v-006--naming-follows-v-conventions}

Les fonctions et les variables utilisent `snake_case`. Les structs et les enums utilisent `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Initialiser les structs explicitement {#pl-v-007--initialise-structs-explicitly}

Nommez chaque champ dans un littéral de struct. L'initialisation positionnelle cache quelle valeur va où.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Une responsabilité par dossier de module {#pl-v-008--one-responsibility-per-module-folder}

En V, un dossier est un module. Ses fichiers partagent une même déclaration `module` et une seule responsabilité. La cohésion compte plus que le nombre de lignes ([Cohésion avant la taille](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Garder les dossiers assez denses pour être parcourus {#pl-v-009--keep-folders-dense-enough-to-scan}

Un dossier contient au maximum 10 fichiers sources maintenus à la main par défaut. Les fichiers générés ne comptent pas. Au-delà de cette limite, découpez par responsabilité dans un dossier de sous-module.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Formater et vérifier avant la revue {#pl-v-010--format-and-vet-before-review}

Exécutez les deux outils à chaque modification, afin que les revues portent sur l'intention plutôt que sur la mise en page ou des constructions suspectes.

```sh
v fmt -w .
v vet .
```
