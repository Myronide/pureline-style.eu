# Codestil der Vue-Code-Stil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules), das [JavaScript profile](javascript.md) und das [TypeScript profile](typescript.md) zusammen mit diesem Profil an. Das Vue-Profil zielt auf **Vue 3 mit der Composition API, `<script setup>` und TypeScript im strengen Modus**. A component reads as a small pipeline: Typisierte Eingaben, wiederverwendbare Logik, abgeleitete Werte, Markup.

## Vue-Profil

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — Komponenten verwenden `<script setup lang="ts">`

Jede Komponente ist eine Einzeldateikomponente mit `<script setup lang="ts">` und einem `<style scoped>`-Block. Bestellen Sie das Blocks Skript, Vorlage, Stil, so dass die Eingaben vor dem Markup gelesen werden.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Vor- und Aushilfsgeräte werden typisiert

Deklarieren Sie Requisiten mit einem Typ-only `defineProps<T>()` und emittiert mit `defineEmits<{ ... }>()`. Verwenden Sie die Unionstypen für Varianten, nie eine Reihe von optionalen Booleans ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Überwachte Uhr

Derive einen Wert mit `computed`, wenn er von Requisiten oder Zustand folgt. Verwenden Sie `watch` nur für Nebenwirkungen wie Anfragen oder Timer, um niemals eine Ref, die ein `computed` produzieren könnte, festzulegen.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Zusammenstellungen eigener Bedenken

Setzen Sie wiederverwendbare stateful Logik in einer `useX`-Funktion, die Refs und Funktionen zurückgibt. Ein Composable kümmert sich um ein Problem: ein Abonnement, ein Formular, eine Datenquelle. Geteilte Composables leben in einem `composables/`-Ordner.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` erzeugt, `v-show`-Klinken

Verwenden Sie `v-if` für Wachen, leere Zustände und Zweige, die im DOM nicht existieren dürfen. Verwenden Sie `v-show` für einen Wert, der oft umschlägt, wie z.B. ein Panel, das der Benutzer umschaltet.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Listen verwenden ein stabiles `:key`

Jedes `v-for` hat einen `:key`, der an einen stabilen Identifier aus den Daten gebunden ist, niemals den Index einer Liste, die neu geordnet oder gefiltert werden kann. Nicht auf einem Element `v-if` und `v-for` kombinieren; stattdessen in einem `computed` filtern.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Vorlagen enthalten nur einfache Ausdrücke

Ein Template-Ausdruck ist ein Zugriff auf eine Eigenschaft, ein einfacher Tenary oder ein Kurzruf. Verschieben Sie etwas länger in ein `computed` oder eine benannte Funktion. Verschachtelte Ternäre sind nicht Pureline ([Kontrollfluss](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

Mit einer `users` Ref zur Komponente:

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

### PL-VUE-008 — Pinia hält einen geteilten Staat

Halten Sie Zustand in einer Komponente oder komposierbar, bis zwei unabhängige Teile der App es benötigen, dann verschieben Sie es in einen Pinia-Shop. Read stores with `storeToRefs` so destructuring keeps reactivity.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Ordnerdichte

A folder holds at most **10 hand-maintained source files** by default. Group components, composables, and stores by feature (`features/sessions/`) when a feature has more than one file, and keep shared primitives in one `components/` folder ([structure](../core/structure.md)).

### PL-VUE-010 — Werkzeugbau

Run **eslint-plugin-vue** (with its `flat/recommended` configuration) and **Prettier** for linting and formatting, and run **vue-tsc** for type checking in CI. A disabled lint rule needs a comment that says why.
