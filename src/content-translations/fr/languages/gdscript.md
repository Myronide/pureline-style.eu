# Style de code GDScript

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. GDScript 4 est un langage de script typé attaché aux nœuds des scènes. Lisez d'abord les [principes fondamentaux](../core/principles.md) ; les règles ci-dessous les appliquent aux nœuds, aux signaux et aux scènes.

## Profil GDScript {#gdscript-profile}

### PL-GD-001 — Typage statique partout {#pl-gd-001--static-typing-everywhere}

Typez chaque variable, chaque paramètre et chaque valeur de retour. L'éditeur vérifie le code typé avant son exécution, et les types documentent l'intention. Utilisez `-> void` pour les fonctions qui ne retournent rien.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

### PL-GD-002 — Exporter les valeurs destinées aux designers {#pl-gd-002--export-designer-facing-values}

Exposez avec `@export` les valeurs qu'un designer doit pouvoir ajuster, typées et bornées lorsque c'est possible. Gardez privées au script les valeurs qui relèvent du code.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Références de nœuds avec @onready {#pl-gd-003--node-references-with-onready}

Résolvez les nœuds enfants une seule fois avec `@onready`, typés, et nommez le nœud d'après son rôle. Ne récupérez jamais des nœuds avec `get_node()` dans une boucle ou un callback exécuté à chaque frame.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Les signaux découplent la communication vers le haut {#pl-gd-004--signals-decouple-upward-communication}

Un nœud signale des événements en émettant un signal et n'appelle pas ses parents ni ses frères. C'est le propriétaire qui compose la scène qui connecte le signal. Les appels descendent vers les enfants ; les événements remontent sous forme de signaux.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Les callbacks de cycle de vie servent leur objectif {#pl-gd-005--lifecycle-callbacks-serve-their-purpose}

Utilisez `_ready()` pour la mise en place qui nécessite que le nœud soit dans l'arbre, `_process(delta)` pour les éléments visuels et les minuteurs à la cadence d'affichage, et `_physics_process(delta)` pour le déplacement et les collisions. Ne placez pas de règles de jeu dans `_process` ni de mise en place dans `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Nommage et constantes {#pl-gd-006--naming-and-constants}

- Fonctions, variables et signaux : `snake_case`. `class_name` et types de nœuds : `PascalCase`.
- Les valeurs fixes utilisent `const` et `UPPER_SNAKE_CASE`, afin que la valeur et sa signification vivent au même endroit.
- Les noms énoncent le rôle (`attack_cooldown`), jamais un type ni une position (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Les scènes se composent de petites scènes {#pl-gd-007--scenes-are-composed-from-small-scenes}

Construisez une scène à partir de petites scènes réutilisables, chacune avec son propre script et sa propre responsabilité. Référencez les enfants directs par leur nom. Évitez les chemins de nœuds profonds, car ils couplent le script à l'organisation interne d'une autre scène.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Guard clauses dans les scripts {#pl-gd-008--guard-clauses-in-scripts}

Vérifiez d'abord l'état invalide et retournez tôt. Le chemin principal d'une fonction reste plat, sans indentation supplémentaire. Utilisez `is_instance_valid()` avant de toucher à une référence de nœud qui a pu être libérée.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Densité des dossiers {#pl-gd-009--folder-density}

Un dossier de scripts maintenus à la main contient au maximum **10 fichiers** par défaut. Regroupez les scripts par fonctionnalité et gardez les composants partagés dans un seul dossier.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Outillage {#pl-gd-010--tooling}

Gardez activés les avertissements de l'éditeur de scripts de Godot et corrigez-les plutôt que de les masquer. Exécutez `gdformat` et `gdlint` du toolkit GDScript (`gdtoolkit`) en CI.

```bash
gdformat --check scripts/
gdlint scripts/
```
