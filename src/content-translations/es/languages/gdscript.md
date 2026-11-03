# Estilo de código GDScript

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) con este perfil. GDScript 4 es un lenguaje de scripting tipado que se asocia a los nodos de las escenas. Lee primero los [principios básicos](../core/principles.md); las reglas siguientes los aplican a los nodos, las señales y las escenas.

## Perfil de GDScript {#gdscript-profile}

### PL-GD-001 — Tipado estático en todas partes {#pl-gd-001--static-typing-everywhere}

Tipa cada variable, parámetro y valor de retorno. El editor comprueba el código tipado antes de ejecutarlo, y los tipos documentan la intención. Usa `-> void` en las funciones que no devuelven nada.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

### PL-GD-002 — Exporta los valores pensados para diseñadores {#pl-gd-002--export-designer-facing-values}

Expón con `@export` los valores que un diseñador deba ajustar, tipados y con rangos siempre que sea posible. Mantén privados al script los valores que pertenecen al código.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Referencias a nodos con @onready {#pl-gd-003--node-references-with-onready}

Resuelve los nodos hijos una sola vez con `@onready`, tipados, y nombra el nodo según su función. No obtengas nunca nodos con `get_node()` dentro de un bucle o de un callback que se ejecute en cada fotograma.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Las señales desacoplan la comunicación hacia arriba {#pl-gd-004--signals-decouple-upward-communication}

Un nodo informa de los eventos emitiendo una señal y no llama a sus padres ni a sus hermanos. El dueño que compone la escena conecta la señal. Las llamadas fluyen hacia los hijos; los eventos suben como señales.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Los callbacks del ciclo de vida cumplen su propósito {#pl-gd-005--lifecycle-callbacks-serve-their-purpose}

Usa `_ready()` para la preparación que necesita el nodo ya en el árbol, `_process(delta)` para los elementos visuales y los temporizadores a la frecuencia de fotogramas, y `_physics_process(delta)` para el movimiento y las colisiones. No pongas reglas del juego en `_process` ni preparación en `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Nombres y constantes {#pl-gd-006--naming-and-constants}

- Funciones, variables y señales: `snake_case`. `class_name` y tipos de nodo: `PascalCase`.
- Los valores fijos usan `const` y `UPPER_SNAKE_CASE`, de modo que el valor y su significado vivan en un solo lugar.
- Los nombres indican la función (`attack_cooldown`), nunca un tipo ni una posición (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Las escenas se componen de escenas pequeñas {#pl-gd-007--scenes-are-composed-from-small-scenes}

Construye una escena a partir de escenas pequeñas y reutilizables, cada una con su propio script y su responsabilidad. Haz referencia a los hijos directos por su nombre. Evita las rutas de nodos profundas, porque acoplan el script a la disposición interna de otra escena.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Guard clauses en los scripts {#pl-gd-008--guard-clauses-in-scripts}

Comprueba primero el estado inválido y retorna pronto. El camino principal de una función se mantiene plano y sin sangrar. Usa `is_instance_valid()` antes de tocar una referencia a un nodo que pueda haberse liberado.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Densidad de carpetas {#pl-gd-009--folder-density}

Una carpeta de scripts mantenidos a mano contiene como máximo **10 archivos** por defecto. Agrupa los scripts por funcionalidad y mantén los componentes compartidos en una única carpeta.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Herramientas {#pl-gd-010--tooling}

Mantén activadas las advertencias del editor de scripts de Godot y corrígelas en lugar de ocultarlas. Ejecuta `gdformat` y `gdlint`, del toolkit de GDScript (`gdtoolkit`), en la CI.

```bash
gdformat --check scripts/
gdlint scripts/
```
