# Style de code GDScript

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. GDScript 4 est un langage de script dactylographié attaché aux nœuds dans les scènes. Lisez d'abord les [principes de base](../core/principles.md) ; les règles ci-dessous les appliquent aux nœuds, aux signaux et aux scènes.

## Profil GDScript

### PL-GD-001 — Typographie statique partout

Saisissez chaque variable, paramètre et valeur de retour. L'éditeur vérifie le code dactylographié avant son exécution et le type d'intention du document. Utilisez `-> void` pour les fonctions qui ne renvoient rien.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

Préférez `:=` pour les locaux lorsque l'initialisateur rend le type statique clair.

```text
Explicit annotation                 │ ✓ Pureline
var speed: float = 240.0            │ var speed := 240.0
var direction: Vector2 = Vector2.UP │ var direction := Vector2.UP
```

### PL-GD-002 — Valeurs de l'Exportateur

Les valeurs d'exposition d'un concepteur doivent être compatibles avec `@export`, tapés et variaient lorsque c'est possible. Gardez les valeurs qui appartiennent au code privé du script.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Références de nœuds avec @onready

Résoudre les nœuds enfants une fois avec `@onready`, tapé, et nommer le nœud par son rôle. Ne jamais récupérer des nœuds avec `get_node()` dans une boucle ou un callback par image.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Découplement des signaux vers le haut

Un nœud signale des événements en émettant un signal et n'appelle pas ses parents ou ses frères et sœurs. Le propriétaire qui compose la scène relie le signal. Les appels se déversent vers les enfants; les événements se manifestent comme des signaux.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Les rappels au cycle de vie servent leur but

Utilisez `_ready()` pour la configuration qui nécessite le nœud dans l'arbre, `_process(delta)` pour les images et les minuteries de frame-rate, et `_physics_process(delta)` pour le mouvement et la collision. Ne mettez pas les règles de jeu dans `_process` ou dans `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Désignation et constantes

- Fonctions, variables et signaux: `snake_case`. Type de `class_name` et de nœuds: `PascalCase`.
- Les valeurs fixes utilisent `const` et `UPPER_SNAKE_CASE`, donc la valeur et sa signification vivent en un seul endroit.
- Les noms indiquent le rôle (`attack_cooldown`), jamais un type ou une position (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Les scènes sont composées de petites scènes

Construire une scène à partir de petites scènes réutilisables, chacune avec son propre script et sa propre responsabilité. Référencer les enfants directs par leur nom. Évitez les chemins de nœuds profonds, car ils couplent le script à la disposition interne d'une autre scène.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Clauses de garde en caractères

Vérifiez l'état invalide d'abord et retournez tôt. Le chemin principal d'une fonction reste plat et non dindent. Utilisez `is_instance_valid()` avant de toucher un noeud de référence qui peut avoir été libéré.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Densité du dossier

Un dossier de scripts maintenus manuellement contient au plus des fichiers **10** par défaut. Grouper les scripts par fonction et conserver les composants partagés dans un dossier.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Outillage

Gardez les avertissements de l'éditeur de script Godot activés et corrigez-les plutôt que de les cacher. Exécutez `gdformat` et `gdlint` à partir de la boîte à outils GDScript (`gdtoolkit`) dans CI.

```bash
gdformat --check scripts/
gdlint scripts/
```
