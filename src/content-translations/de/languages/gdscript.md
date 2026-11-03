# GDScript Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) mit diesem Profil an. GDScript 4 ist eine typisierte Skriptsprache, die an Nodes in Szenen hängt. Lies zuerst die [Grundprinzipien](../core/principles.md); die folgenden Regeln wenden sie auf Nodes, Signale und Szenen an.

## GDScript-Profil {#gdscript-profile}

### PL-GD-001 — Überall statische Typisierung {#pl-gd-001--static-typing-everywhere}

Typisiere jede Variable, jeden Parameter und jeden Rückgabewert. Der Editor prüft typisierten Code, bevor er läuft, und die Typen dokumentieren die Absicht. Verwende `-> void` für Funktionen, die nichts zurückgeben.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

Bevorzuge `:=` für lokale Variablen, wenn der Initialwert den statischen Typ erkennen lässt.

```text
Explicit annotation                 │ ✓ Pureline
var speed: float = 240.0            │ var speed := 240.0
var direction: Vector2 = Vector2.UP │ var direction := Vector2.UP
```

### PL-GD-002 — Werte für Designer exportieren {#pl-gd-002--export-designer-facing-values}

Mache Werte, die ein Designer anpassen soll, mit `@export` verfügbar, typisiert und, wo möglich, mit Wertebereich. Halte Werte, die zum Code gehören, im Skript privat.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Node-Referenzen mit @onready {#pl-gd-003--node-references-with-onready}

Löse Kind-Nodes einmalig mit `@onready` auf, typisiert, und benenne den Node nach seiner Rolle. Hole Nodes niemals mit `get_node()` innerhalb einer Schleife oder eines Callbacks, der pro Frame läuft.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Signale entkoppeln die Kommunikation nach oben {#pl-gd-004--signals-decouple-upward-communication}

Ein Node meldet Ereignisse, indem er ein Signal sendet, und ruft nicht in seine Eltern- oder Geschwister-Nodes hinein. Der Eigentümer, der die Szene zusammensetzt, verbindet das Signal. Aufrufe fließen nach unten zu den Kindern; Ereignisse fließen als Signale nach oben.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Lifecycle-Callbacks erfüllen ihren Zweck {#pl-gd-005--lifecycle-callbacks-serve-their-purpose}

Verwende `_ready()` für Setup, das den Node im Baum braucht, `_process(delta)` für Visuals und Timer im Frame-Takt und `_physics_process(delta)` für Bewegung und Kollision. Lege keine Spielregeln in `_process` und kein Setup in `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Benennung und Konstanten {#pl-gd-006--naming-and-constants}

- Funktionen, Variablen und Signale: `snake_case`. `class_name` und Node-Typen: `PascalCase`.
- Feste Werte verwenden `const` und `UPPER_SNAKE_CASE`, damit Wert und Bedeutung an einer Stelle liegen.
- Namen geben die Rolle an (`attack_cooldown`), niemals einen Typ oder eine Position (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Szenen werden aus kleinen Szenen zusammengesetzt {#pl-gd-007--scenes-are-composed-from-small-scenes}

Baue eine Szene aus kleinen, wiederverwendbaren Szenen, jede mit eigenem Skript und eigener Verantwortung. Referenziere direkte Kinder über ihren Namen. Vermeide tiefe Node-Pfade, weil sie das Skript an das interne Layout einer anderen Szene koppeln.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Guard Clauses in Skripten {#pl-gd-008--guard-clauses-in-scripts}

Prüfe ungültigen Zustand zuerst und kehre früh zurück. Der Hauptpfad einer Funktion bleibt flach und ohne Einrückung. Verwende `is_instance_valid()`, bevor du eine Node-Referenz anfasst, die möglicherweise freigegeben wurde.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Ordnerdichte {#pl-gd-009--folder-density}

Ein Ordner mit von Hand gepflegten Skripten enthält standardmäßig höchstens **10 Dateien**. Gruppiere Skripte nach Feature und halte gemeinsame Komponenten in einem Ordner.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Tooling {#pl-gd-010--tooling}

Lass die Warnungen des Godot-Skripteditors aktiviert und behebe sie, statt sie zu verstecken. Führe in der CI `gdformat` und `gdlint` aus dem GDScript-Toolkit (`gdtoolkit`) aus.

```bash
gdformat --check scripts/
gdlint scripts/
```
