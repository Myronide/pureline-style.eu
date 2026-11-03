# Stile del codice GDScript

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) con questo profilo. GDScript 4 è un linguaggio di scripting tipizzato, associato ai nodi nelle scene. Leggi prima i [principi fondamentali](../core/principles.md); le regole qui sotto li applicano a nodi, segnali e scene.

## Profilo GDScript {#gdscript-profile}

### PL-GD-001 — Tipizzazione statica ovunque {#pl-gd-001--static-typing-everywhere}

Tipizza ogni variabile, parametro e valore di ritorno. L'editor controlla il codice tipizzato prima che venga eseguito e i tipi documentano l'intento. Usa `-> void` per le funzioni che non restituiscono nulla.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

### PL-GD-002 — Esportare i valori rivolti ai designer {#pl-gd-002--export-designer-facing-values}

Esponi con `@export` i valori che un designer dovrebbe regolare, tipizzati e con un intervallo dove possibile. Mantieni privati allo script i valori che appartengono al codice.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Riferimenti ai nodi con @onready {#pl-gd-003--node-references-with-onready}

Risolvi i nodi figli una sola volta con `@onready`, tipizzati, e dai al nodo un nome in base al suo ruolo. Non recuperare mai i nodi con `get_node()` dentro un ciclo o una callback eseguita a ogni frame.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — I segnali disaccoppiano la comunicazione verso l'alto {#pl-gd-004--signals-decouple-upward-communication}

Un nodo segnala gli eventi emettendo un segnale e non chiama i propri genitori o fratelli. Il proprietario che compone la scena connette il segnale. Le chiamate scendono verso i figli; gli eventi salgono come segnali.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Le callback del ciclo di vita servono al loro scopo {#pl-gd-005--lifecycle-callbacks-serve-their-purpose}

Usa `_ready()` per la configurazione che richiede il nodo nell'albero, `_process(delta)` per gli elementi visivi e i timer legati al frame rate e `_physics_process(delta)` per movimento e collisioni. Non mettere regole di gioco in `_process` né la configurazione in `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Nomi e costanti {#pl-gd-006--naming-and-constants}

- Funzioni, variabili e segnali: `snake_case`. `class_name` e tipi di nodo: `PascalCase`.
- I valori fissi usano `const` e `UPPER_SNAKE_CASE`, così il valore e il suo significato stanno in un solo posto.
- I nomi indicano il ruolo (`attack_cooldown`), mai un tipo o una posizione (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Le scene si compongono da scene piccole {#pl-gd-007--scenes-are-composed-from-small-scenes}

Costruisci una scena da piccole scene riutilizzabili, ciascuna con il proprio script e la propria responsabilità. Fai riferimento ai figli diretti per nome. Evita i percorsi profondi tra i nodi, perché accoppiano lo script al layout interno di un'altra scena.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Guard clause negli script {#pl-gd-008--guard-clauses-in-scripts}

Controlla per prima cosa lo stato non valido e ritorna subito. Il percorso principale di una funzione resta piatto e senza indentazione. Usa `is_instance_valid()` prima di toccare un riferimento a un nodo che potrebbe essere stato liberato.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Densità delle cartelle {#pl-gd-009--folder-density}

Una cartella di script mantenuti a mano contiene al massimo **10 file** per impostazione predefinita. Raggruppa gli script per funzionalità e tieni i componenti condivisi in un'unica cartella.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Strumenti {#pl-gd-010--tooling}

Mantieni attivi gli avvisi dell'editor di script di Godot e correggili invece di nasconderli. Esegui `gdformat` e `gdlint` dal toolkit di GDScript (`gdtoolkit`) nella CI.

```bash
gdformat --check scripts/
gdlint scripts/
```
