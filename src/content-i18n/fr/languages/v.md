# Style de code V

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. Les règles linguistiques et les exceptions explicites de profil ont priorité sur les préférences syntaxiques entre langues. [Cohésion sur taille](../core/structure.md) s'applique tout au long.

## V Profil

### PL-V-001 — Immutable par défaut

Les variables sont immutables sauf si elles sont déclarées avec `mut`. Déclarez `mut` seulement lorsqu'une valeur doit changer. Voir [PL-CORE-010](../core/principles.md).

```v
limit := 10
```

### PL-V-002 — Types de résultats de retour pour les défaillances

Une fonction jaugée renvoie `!T` et signale une défaillance avec `error(...)`.

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

### PL-V-003 — Poignez les erreurs tôt avec `or {}`

Gérer un appel raté sur le site d'appel. Propagate avec `!` seulement quand l'appelant doit posséder l'erreur.

```v
fn show_user() {
	user := load_user(42) or { return }
	println(user.name)
}
```

Dans une fonction qui retourne un résultat, préférez `!` pour propager un inchangé
erreur. Utilisez un bloc `or` lorsque le chemin d'erreur nécessite une manipulation supplémentaire.

```text
Explicit propagation                  │ ✓ Pureline
config := load_config(path) or {      │ config := load_config(path)!
    return err                        │ start(config)
}                                     │
                                      │
start(config)                         │
```

### PL-V-004 — Types d'options d'utilisation pour les valeurs absentes

Utilisez `?T` lorsque l'absence est un résultat normal. Utilisez `!T` lorsque l'échec a besoin d'une raison.

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

### PL-V-005 — Clauses de garde et petites fonctions

Rejeter les entrées invalides d'abord afin que le chemin de succès reste linéaire. Chaque fonction fait un travail. Voir [PL-CORE-003](../core/principles.md) et [PL-CORE-006](../core/principles.md).

```v
fn withdraw(balance int, amount int) !int {
	if amount <= 0 {
		return error('amount must be positive')
	}
	return balance - amount
}
```

### PL-V-006 — La désignation suit les V Conventions

Les fonctions et les variables utilisent `snake_case`. Les écailles et les enums utilisent `PascalCase`.

```v
enum Role {
	admin
	guest
}
```

### PL-V-007 — Initialiser explicitement les écueils

Nomme chaque champ dans une structure littérale. L'initialisation positionnelle cache où va la valeur.

```v
user := User{id: 1, name: 'ada'}
```

### PL-V-008 — Une seule responsabilité par dossier de module

En V, un dossier est un module. Ses fichiers partagent une déclaration `module` et une responsabilité. La cohésion est plus importante que le nombre de lignes ([Cohésion sur taille](../core/structure.md)).

```text
user/
    user.v     User type and constructors
    store.v    loading and saving users
```

### PL-V-009 — Gardez les dossiers suffisamment denses pour scanner

Un dossier contient au plus 10 fichiers source gérés manuellement par défaut. Les fichiers générés ne comptent pas. Passé cette limite, divisé par responsabilité dans un dossier sous-module.

```text
billing/
    invoice/    invoice.v, store.v, render.v
```

### PL-V-010 — Format et Vet avant révision

Exécutez les deux outils sur chaque changement, donc examinez l'intention au lieu de la disposition ou des constructions suspectes.

```sh
v fmt -w .
v vet .
```
