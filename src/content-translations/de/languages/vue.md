# Vue Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules), das [JavaScript-Profil](javascript.md) und das [TypeScript-Profil](typescript.md) zusammen mit diesem Profil an. Das Vue-Profil zielt auf **Vue 3 mit der Composition API, `<script setup>` und TypeScript im Strict-Modus**. Eine Komponente liest sich wie eine kleine Pipeline: typisierte Eingaben, wiederverwendbare Logik, abgeleitete Werte, Markup.

## Vue-Profil {#vue-profile}

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — Komponenten verwenden `<script setup lang="ts">` {#pl-vue-001--components-use-script-setup-langts}

Jede Komponente ist eine Single-File Component mit `<script setup lang="ts">` und einem `<style scoped>`-Block. Ordne die Blöcke als Script, Template, Style, damit die Eingaben vor dem Markup gelesen werden.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Props und Emits sind typisiert {#pl-vue-002--props-and-emits-are-typed}

Deklariere Props mit dem rein typbasierten `defineProps<T>()` und Emits mit `defineEmits<{ ... }>()`. Verwende Union-Typen für Varianten, niemals eine Reihe optionaler Booleans ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Computed statt Watch {#pl-vue-003--computed-over-watch}

Leite einen Wert mit `computed` ab, wann immer er sich aus Props oder State ergibt. Verwende `watch` nur für Seiteneffekte wie Anfragen oder Timer, niemals um ein Ref zu setzen, das ein `computed` erzeugen könnte.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Composables besitzen ein Anliegen {#pl-vue-004--composables-own-one-concern}

Lege wiederverwendbare zustandsbehaftete Logik in einer `useX`-Funktion ab, die Refs und Funktionen zurückgibt. Ein Composable behandelt ein Anliegen: ein Abonnement, ein Formular, eine Datenquelle. Gemeinsame Composables liegen in einem Ordner `composables/`.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` erzeugt, `v-show` schaltet um {#pl-vue-005--v-if-creates-v-show-toggles}

Verwende `v-if` für Guards, Leerzustände und Zweige, die nicht im DOM existieren dürfen. Verwende `v-show` für einen Wert, der oft wechselt, etwa ein Panel, das der Benutzer ein- und ausblendet.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Listen verwenden einen stabilen `:key` {#pl-vue-006--lists-use-a-stable-key}

Jedes `v-for` hat einen `:key`, der an einen stabilen Bezeichner aus den Daten gebunden ist, niemals an den Index einer Liste, die umsortiert oder gefiltert werden kann. Kombiniere `v-if` und `v-for` nicht auf einem Element; filtere stattdessen in einem `computed`.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Templates enthalten nur einfache Ausdrücke {#pl-vue-007--templates-hold-simple-expressions-only}

Ein Template-Ausdruck ist ein Property-Zugriff, ein einfacher Ternary oder ein kurzer Aufruf. Verlagere alles Längere in ein `computed` oder eine benannte Funktion. Verschachtelte Ternaries sind nicht Pureline ([Kontrollfluss](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

Wenn der Komponente ein `users`-Ref zur Verfügung steht:

```text
− Inline filtering          │ ✓ Pureline
<template>                  │ <script setup lang="ts">
  <span>{{ users.filter(    │ import { computed } from "vue";
    (user) => user.active   │
  ).length }}</span>        │ // users is a ref supplied by the component.
</template>                 │ const activeCount = computed(
                            │   () => users.value.filter((user) => user.active).length,
                            │ );
                            │ </script>
                            │
                            │ <template>
                            │   <span>{{ activeCount }}</span>
                            │ </template>
```

### PL-VUE-008 — Pinia hält gemeinsamen Zustand {#pl-vue-008--pinia-holds-shared-state}

Halte Zustand in einer Komponente oder einem Composable, bis zwei unabhängige Teile der App ihn brauchen, und verlagere ihn dann in einen Pinia-Store. Lies Stores mit `storeToRefs`, damit die Destrukturierung die Reaktivität behält.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Ordnerdichte {#pl-vue-009--folder-density}

Ein Ordner enthält standardmäßig höchstens **10 von Hand gepflegte Quelldateien**. Gruppiere Komponenten, Composables und Stores nach Feature (`features/sessions/`), wenn ein Feature mehr als eine Datei hat, und halte gemeinsame Primitive in einem einzigen Ordner `components/` ([Struktur](../core/structure.md)).

### PL-VUE-010 — Tooling {#pl-vue-010--tooling}

Führe **eslint-plugin-vue** (mit seiner Konfiguration `flat/recommended`) und **Prettier** für Linting und Formatierung aus und lasse in der CI **vue-tsc** die Typen prüfen. Eine deaktivierte Lint-Regel braucht einen Kommentar, der sagt, warum.
