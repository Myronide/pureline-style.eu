# GDScript Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) toe met dit profiel. GDScript 4 is een getypte scripttaal die is verbonden met knooppunten in scènes. Lees eerst de [kernprincipes](../core/principles.md); de onderstaande regels gelden voor knooppunten, signalen en scènes.

## GDScript-profiel

### PL-GD-001. Statisch typen overal

Typ elke variabele, parameter en retourwaarde. De editor controleert getypte code voordat het draait, en de types document intent. Gebruik `-> void` voor functies die niets teruggeven.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

Liever `:=` voor lokale gebruikers als de initializer het statische type duidelijk maakt.

```text
Explicit annotation                 │ ✓ Pureline
var speed: float = 240.0            │ var speed := 240.0
var direction: Vector2 = Vector2.UP │ var direction := Vector2.UP
```

### PL-GD-002. Export Designer-Facing waarden

Expose waarden die een ontwerper moet afstemmen met `@export`, getypt en waar mogelijk gevariëerd. Houd waarden die tot de code behoren privé aan het script.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003. Knooppunt Referenties met @onready

Oplossen van kindknooppunten eenmaal met `@onready`, getypt, en noem de knooppunt door zijn rol. Nooit nodes met `get_node()` binnen een lus of per frame terughalen.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004. Signalen loskoppelen naar boven communicatie

Een knooppunt rapporteert gebeurtenissen door een signaal uit te zenden en roept zijn ouders of broers en zussen niet op. De eigenaar die de scène componeert verbindt het signaal. De oproepen stromen naar kinderen toe; gebeurtenissen stromen als signalen.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005. Levenscyclus terugroeplers Serve hun doel

Gebruik `_ready()` voor de opstelling die de knooppunt in de boom, `_process(delta)` voor frame-rate visuals en timers, en `_physics_process(delta)` voor beweging en botsing nodig heeft. Zet geen spelregels in `_process` of setup in `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006. Namen en Constanten

- Functies, variabelen en signalen: `snake_case`. `class_name` en knooppunttypes: `PascalCase`.
- Vaste waarden gebruiken `const` en `UPPER_SNAKE_CASE`, dus de waarde en de betekenis ervan leven op één plaats.
- Namen geven de rol aan (`attack_cooldown`), nooit een type of positie (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007. Scènes zijn samengesteld uit kleine scènes

Een scène uit kleine herbruikbare scènes, elk met zijn eigen script en verantwoordelijkheid. Refereren directe kinderen op naam. Vermijd diepe knooppaden, omdat ze het script koppelen aan de interne indeling van een andere scène.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008. Guard Clausles in Scripts

Controleer ongeldige status eerst en keer eerder terug. Het hoofdpad van een functie blijft vlak en onbepaald. Gebruik `is_instance_valid()` voordat u een knooppuntreferentie aanraakt die mogelijk vrij is.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009. Map Density

Een map met hand-onderhoud scripts bevat op zijn hoogst **10 bestanden** standaard. Groep scripts op functie, en houd gedeelde componenten in één map.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010. Gereedschape

Houd de waarschuwingen van de Godot scripteditor ingeschakeld en repareer ze in plaats van ze te verbergen. Run `gdformat` en `gdlint` van de GDScript toolkit (`gdtoolkit`) in CI.

```bash
gdformat --check scripts/
gdlint scripts/
```
