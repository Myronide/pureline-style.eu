# Estilo de código GDScript

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [compartidas](../README.md#shared-rules) con este perfil. GDScript 4 es un lenguaje de scripts tipo adjunto a los nodos en escenas. Lea los principios [core](../core/principles.md) primero; las reglas siguientes las aplican a los nodos, las señales y las escenas.

## Perfil GDScript

### PL-GD-001: mecanografía estática en todas partes

Escriba cada variable, parámetro y valor de retorno. El editor comprueba el código de tipo antes de que se ejecute, y los tipos de documento intent. Utilice `-> void` para funciones que no devuelven nada.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

Prefiere `:=` para los locales cuando el inicializador hace que el tipo estático sea claro.

```text
Explicit annotation                 │ ✓ Pureline
var speed: float = 240.0            │ var speed := 240.0
var direction: Vector2 = Vector2.UP │ var direction := Vector2.UP
```

### PL-GD-002 — Valores de referencia de diseño de exportación

Exponer valores un diseñador debe sintonizar con `@export`, escrito y variado cuando sea posible. Mantenga los valores que pertenecen al código privado al script.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Referencias de nodo con @onready

Nodos secundarios de la ciclón una vez con `@onready`, tecleado, y nombre el nodo por su papel. Nunca busque nodos con `get_node()` dentro de un bucle o una devolución de llamada por fotograma.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Comunicación de separación de señales hacia arriba

Un nodo informa de eventos al emitir una señal y no llama a sus padres o hermanos. El dueño que compone la escena conecta la señal. Llama a los niños; los eventos fluyen como señales.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Callbacks del ciclo de vida sirven a su propósito

Utilice `_ready()` para la configuración que necesita el nodo en el árbol, `_process(delta)` para imágenes y temporizadores de velocidad de fotogramas, y `_physics_process(delta)` para movimiento y colisión. No ponga las reglas del juego en `_process` ni la configuración en `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Nombre y constantes

- Funciones, variables y señales: `snake_case`. `class_name` y tipos de nodos: `PascalCase`.
- Los valores fijos utilizan `const` y `UPPER_SNAKE_CASE`, por lo que el valor y su significado viven en un solo lugar.
- Los nombres indican el rol (`attack_cooldown`), nunca un tipo o posición (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007: Las escenas se componen de escenas pequeñas

Construir una escena de escenas reutilizables pequeñas, cada uno con su propio guión y responsabilidad. Referencia: Niños directos por nombre. Evite las rutas profundas de los nodos, porque combinan el script con el diseño interno de otra escena.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Guarda las cláusulas en los guiones

Compruebe primero el estado inválido y regrese temprano. La ruta principal de una función permanece plana y sin identificar. Use `is_instance_valid()` antes de tocar una referencia del nodo que pudo haber sido liberada.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Densidad de la carpeta

Una carpeta de scripts mantenidos a mano contiene como máximo archivos **10** por defecto. Agrupe scripts por función y mantenga los componentes compartidos en una carpeta.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Herramientas

Mantenga las advertencias del editor de scripts de Godot habilitadas y cúbralas en lugar de ocultarlas. Ejecute `gdformat` y `gdlint` desde el kit de herramientas GDScript (`gdtoolkit`) en CI.

```bash
gdformat --check scripts/
gdlint scripts/
```
