# GDScript Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. GDScript 4 to typowany język skryptowy przypisany do węzłów w scenach. Najpierw przeczytaj [zasady podstawowe](../core/principles.md); poniższe reguły stosują je do węzłów, sygnałów i scen.

## Profil GDScript {#gdscript-profile}

### PL-GD-001 — Statyczne typowanie wszędzie {#pl-gd-001--static-typing-everywhere}

Otypuj każdą zmienną, parametr i wartość zwracaną. Edytor sprawdza otypowany kod przed uruchomieniem, a typy dokumentują zamiar. Dla funkcji, które nic nie zwracają, używaj `-> void`.

```gdscript
var hp: int = 10
var target_position: Vector2 = Vector2.ZERO

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
```

### PL-GD-002 — Eksportuj wartości przeznaczone dla projektanta {#pl-gd-002--export-designer-facing-values}

Wartości, które projektant powinien dostrajać, udostępniaj przez `@export`, z typem i zakresem, gdzie to możliwe. Wartości należące do kodu utrzymuj prywatne dla skryptu.

```gdscript
@export var max_hp: int = 10
@export_range(0.0, 2.0, 0.1) var move_speed: float = 1.0
```

### PL-GD-003 — Referencje do węzłów przez @onready {#pl-gd-003--node-references-with-onready}

Węzły potomne rozwiązuj raz za pomocą `@onready`, z typem, i nazywaj węzeł według jego roli. Nigdy nie pobieraj węzłów przez `get_node()` wewnątrz pętli ani callbacku wywoływanego co klatkę.

```gdscript
@onready var sprite: Sprite2D = $Sprite2D
@onready var hit_timer: Timer = $HitTimer
```

### PL-GD-004 — Sygnały rozprzęgają komunikację w górę {#pl-gd-004--signals-decouple-upward-communication}

Węzeł zgłasza zdarzenia, emitując sygnał, i nie wywołuje swoich rodziców ani rodzeństwa. Sygnał podłącza właściciel, który komponuje scenę. Wywołania płyną w dół do dzieci; zdarzenia płyną w górę jako sygnały.

```gdscript
signal health_changed(current: int)

func take_damage(amount: int) -> void:
	hp = maxi(hp - amount, 0)
	health_changed.emit(hp)
```

### PL-GD-005 — Callbacki cyklu życia służą swojemu celowi {#pl-gd-005--lifecycle-callbacks-serve-their-purpose}

`_ready()` stosuj do konfiguracji, która wymaga węzła w drzewie, `_process(delta)` do wizualizacji zależnych od liczby klatek i timerów, a `_physics_process(delta)` do ruchu i kolizji. Nie umieszczaj reguł gry w `_process` ani konfiguracji w `_physics_process`.

```gdscript
func _physics_process(delta: float) -> void:
	velocity.y += GRAVITY * delta
	move_and_slide()
```

### PL-GD-006 — Nazewnictwo i stałe {#pl-gd-006--naming-and-constants}

- Funkcje, zmienne i sygnały: `snake_case`. `class_name` i typy węzłów: `PascalCase`.
- Wartości stałe używają `const` i `UPPER_SNAKE_CASE`, aby wartość i jej znaczenie żyły w jednym miejscu.
- Nazwy określają rolę (`attack_cooldown`), nigdy typ ani pozycję (`thing2`).

```gdscript
class_name HealthBar

const ATTACK_COOLDOWN: float = 0.6
```

### PL-GD-007 — Sceny składa się z małych scen {#pl-gd-007--scenes-are-composed-from-small-scenes}

Scenę buduj z małych, wielokrotnego użytku scen, każdej z własnym skryptem i odpowiedzialnością. Bezpośrednie dzieci wskazuj po nazwie. Unikaj głębokich ścieżek węzłów, ponieważ wiążą skrypt z wewnętrznym układem innej sceny.

```gdscript
# Good: the component is a direct child
@onready var health: HealthComponent = $HealthComponent
# Avoid: a deep path breaks when the scene layout changes
# @onready var sprite: Sprite2D = $Body/Visuals/Sprite2D
```

### PL-GD-008 — Guard clauses w skryptach {#pl-gd-008--guard-clauses-in-scripts}

Najpierw sprawdzaj niepoprawny stan i wracaj wcześnie. Główna ścieżka funkcji pozostaje płaska i bez wcięć. Przed użyciem referencji do węzła, który mógł zostać zwolniony, użyj `is_instance_valid()`.

```gdscript
func interact(player: Player) -> void:
	if not can_interact:
		return
	if not is_instance_valid(player):
		return

	open_dialog()
```

### PL-GD-009 — Gęstość folderów {#pl-gd-009--folder-density}

Folder z ręcznie utrzymywanymi skryptami domyślnie zawiera co najwyżej **10 plików**. Grupuj skrypty według funkcji, a wspólne komponenty trzymaj w jednym folderze.

```text
scenes/
├── player/      (player.gd, player.tscn, input_reader.gd)
├── enemies/     (slime.gd, slime.tscn, enemy_spawner.gd)
└── components/  (health_component.gd, hitbox.gd)
```

### PL-GD-010 — Narzędzia {#pl-gd-010--tooling}

Utrzymuj włączone ostrzeżenia edytora skryptów Godot i naprawiaj je zamiast ukrywać. W CI uruchamiaj `gdformat` i `gdlint` z zestawu narzędzi GDScript (`gdtoolkit`).

```bash
gdformat --check scripts/
gdlint scripts/
```
