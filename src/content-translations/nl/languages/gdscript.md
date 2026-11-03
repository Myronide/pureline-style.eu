# GDScript-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. GDScript 4 is een getypeerde scripttaal die aan nodes in scènes is gekoppeld. Lees eerst de [kernprincipes](../core/principles.md); de onderstaande regels passen ze toe op nodes, signals en scènes.

## GDScript-profiel {#gdscript-profile}

### PL-GD-001 — Overal statische typering {#pl-gd-001--static-typing-everywhere}

Type elke variabele, parameter en retourwaarde. De editor controleert getypeerde code voordat die draait, en de typen documenteren de intentie. Gebruik `-> void` voor functies die niets retourneren.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

### PL-GD-002 — Exporteer waarden voor ontwerpers {#pl-gd-002--export-designer-facing-values}

Maak waarden die een ontwerper moet kunnen afstellen beschikbaar met `@export`, getypeerd en waar mogelijk met een bereik. Houd waarden die bij de code horen privé voor het script.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Node-referenties met @onready {#pl-gd-003--node-references-with-onready}

Resolve child nodes eenmalig met `@onready`, getypeerd, en benoem de node naar zijn rol. Haal nodes nooit op met `get_node()` binnen een lus of een callback die per frame draait.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Signals ontkoppelen communicatie naar boven {#pl-gd-004--signals-decouple-upward-communication}

Een node meldt gebeurtenissen door een signal uit te zenden en roept zijn parents of siblings niet aan. De eigenaar die de scène samenstelt, verbindt het signal. Aanroepen gaan naar beneden naar kinderen; gebeurtenissen gaan als signals naar boven.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Lifecycle-callbacks dienen hun doel {#pl-gd-005--lifecycle-callbacks-serve-their-purpose}

Gebruik `_ready()` voor setup die de node in de boom nodig heeft, `_process(delta)` voor visuals en timers die op de framerate draaien, en `_physics_process(delta)` voor beweging en botsingen. Zet geen spelregels in `_process` en geen setup in `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Naamgeving en constanten {#pl-gd-006--naming-and-constants}

- Functies, variabelen en signals: `snake_case`. `class_name` en nodetypen: `PascalCase`.
- Vaste waarden gebruiken `const` en `UPPER_SNAKE_CASE`, zodat de waarde en haar betekenis op één plek staan.
- Namen geven de rol aan (`attack_cooldown`), nooit een type of positie (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Scènes worden samengesteld uit kleine scènes {#pl-gd-007--scenes-are-composed-from-small-scenes}

Bouw een scène op uit kleine herbruikbare scènes, elk met een eigen script en verantwoordelijkheid. Verwijs naar directe kinderen op naam. Vermijd diepe nodepaden, omdat ze het script koppelen aan de interne indeling van een andere scène.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Guard clauses in scripts {#pl-gd-008--guard-clauses-in-scripts}

Controleer ongeldige toestand eerst en keer vroeg terug. Het hoofdpad van een functie blijft vlak en zonder extra inspringing. Gebruik `is_instance_valid()` voordat je een node-referentie aanraakt die mogelijk is vrijgegeven.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Mapdichtheid {#pl-gd-009--folder-density}

Een map met handmatig onderhouden scripts bevat standaard maximaal **10 bestanden**. Groepeer scripts per feature en houd gedeelde componenten in één map.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Tooling {#pl-gd-010--tooling}

Houd de waarschuwingen van de Godot-scripteditor ingeschakeld en los ze op in plaats van ze te verbergen. Voer in CI `gdformat` en `gdlint` uit van de GDScript-toolkit (`gdtoolkit`).

```bash
gdformat --check scripts/
gdlint scripts/
```
