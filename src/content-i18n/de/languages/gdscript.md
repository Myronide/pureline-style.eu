# Codestil von GDScript

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) mit diesem Profil an. GDScript 4 ist eine typisierte Skriptsprache, die Knoten in Szenen angehängt wird. Lesen Sie zuerst die [Kernprinzipien](../core/principles.md), die unten aufgeführten Regeln gelten für Knoten, Signale und Szenen.

## GDScript-Profil

### PL-GD-001 — Statische Eingabe überall

Geben Sie jede Variable, jeden Parameter und jeden Rückgabewert ein. Der Editor überprüft den eingegebenen Code, bevor er ausgeführt wird, und die Art der Dokument-Intention. Verwenden Sie `-> void` für Funktionen, die nichts zurückgeben.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

Bevorzugen Sie `:=` für Einheimische, wenn der Initializer den statischen Typ klar macht.

```text
Explicit annotation                 │ ✓ Pureline
var speed: float = 240.0            │ var speed := 240.0
var direction: Vector2 = Vector2.UP │ var direction := Vector2.UP
```

### PL-GD-002 — Werte für den Export von Designer-Gesichtspunkten

Werte aufzeigen, die ein Designer mit `@export` abstimmen sollte, wo möglich eingegeben und gereiht werden. Behalten Sie Werte, die zum Code gehören, privat zum Skript..

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Knoten Referenzen mit @onready

Lösen Sie Child Nodes einmal mit `@onready`, eingegeben und benennen Sie den Node nach seiner Rolle. Holen Sie niemals Knoten mit `get_node()` in einer Schleife oder einem pro Frame Callback.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Signale entkoppelt die Kommunikation nach oben

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

- Functions, variables, and signals: `snake_case`. `class_name` und Knotentypen: `PascalCase`.
- Festwerte verwenden `const` und `UPPER_SNAKE_CASE`, so dass der Wert und seine Bedeutung an einem Ort leben.
- Namen geben die Rolle (`attack_cooldown`), nie einen Typ oder eine Position (`thing2`) an.

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Szenen sind von kleinen Szenen verwechselt

Erstellen Sie eine Szene aus kleinen wiederverwendbaren Szenen, jede mit eigenem Drehbuch und Verantwortung. Referenz direkte Kinder beim Namen. Vermeiden Sie tiefe Knotenpfade, weil sie das Skript mit dem internen Layout einer anderen Szene paaren.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Schutzklauseln in Scripts

Überprüfen Sie zuerst den ungültigen Zustand und kehren Sie früh zurück. Der Hauptweg einer Funktion bleibt flach und unentschieden. Verwenden Sie `is_instance_valid()`, bevor Sie eine Node-Referenz berühren, die möglicherweise freigegeben wurde.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Ordnerdichte

Ein Ordner mit handgepflegten Skripten enthält standardmäßig höchstens **10 Dateien**. Gruppenskripte nach Feature, und behalten Sie freigegebene Komponenten in einem Ordner.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Werkzeugbau

Halten Sie die Godot Script Editor Warnungen aktiviert und beheben Sie sie anstatt sie zu verstecken. Führen Sie `gdformat` und `gdlint` aus dem GDScript Toolkit (`gdtoolkit`) in CI aus.

```bash
gdformat --check scripts/
gdlint scripts/
```
