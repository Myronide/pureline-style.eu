# GDScript Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) toe met dit profiel. GDScript 4 is a typed scripting language attached to nodes in scenes. Read the [core principles](../core/principles.md) first; the rules below apply them to nodes, signals, and scenes.

## GDScript Profile

### PL-GD-001 — Static Typing Everywhere

Type every variable, parameter, and return value. The editor checks typed code before it runs, and the types document intent. Use `-> void` for functions that return nothing.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

Prefer `:=` for locals when the initializer makes the static type clear.

```text
Explicit annotation                 │ ✓ Pureline
var speed: float = 240.0            │ var speed := 240.0
var direction: Vector2 = Vector2.UP │ var direction := Vector2.UP
```

### PL-GD-002 — Export Designer-Facing Values

Expose values a designer should tune with `@export`, typed and ranged where possible. Keep values that belong to the code private to the script.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Node References With @onready

Resolve child nodes once with `@onready`, typed, and name the node by its role. Never fetch nodes with `get_node()` inside a loop or a per-frame callback.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Signals Decouple Upward Communication

A node reports events by emitting a signal and does not call into its parents or siblings. The owner that composes the scene connects the signal. Calls flow down to children; events flow up as signals.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Lifecycle Callbacks Serve Their Purpose

Use `_ready()` for setup that needs the node in the tree, `_process(delta)` for frame-rate visuals and timers, and `_physics_process(delta)` for movement and collision. Do not put game rules in `_process` or setup in `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Naming and Constants

- Functions, variables, and signals: `snake_case`. `class_name` and node types: `PascalCase`.
- Fixed values use `const` and `UPPER_SNAKE_CASE`, so the value and its meaning live in one place.
- Names state the role (`attack_cooldown`), never a type or position (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Scenes Are Composed From Small Scenes

Build a scene from small reusable scenes, each with its own script and responsibility. Reference direct children by name. Avoid deep node paths, because they couple the script to the internal layout of another scene.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Guard Clauses in Scripts

Check invalid state first and return early. The main path of a function stays flat and unindented. Use `is_instance_valid()` before touching a node reference that may have been freed.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009. Map Density

A folder of hand-maintained scripts holds at most **10 files** by default. Group scripts by feature, and keep shared components in one folder.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010. Gereedschape

Keep the Godot script editor warnings enabled and fix them rather than hiding them. Run `gdformat` and `gdlint` from the GDScript toolkit (`gdtoolkit`) in CI.

```bash
gdformat --check scripts/
gdlint scripts/
```
