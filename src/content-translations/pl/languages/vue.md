# Vue Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules), [profil JavaScript](javascript.md) i [profil TypeScript](typescript.md) razem z tym profilem. Profil Vue dotyczy **Vue 3 z Composition API, `<script setup>` i TypeScriptem w trybie strict**. Komponent czyta się jak mały potok: typowane wejścia, logika wielokrotnego użytku, wartości pochodne, markup.

## Profil Vue {#vue-profile}

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — Komponenty używają `<script setup lang="ts">` {#pl-vue-001--components-use-script-setup-langts}

Każdy komponent to Single-File Component z `<script setup lang="ts">` i blokiem `<style scoped>`. Bloki ułóż w kolejności: script, template, style, aby wejścia były czytane przed markupem.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Propsy i emity są typowane {#pl-vue-002--props-and-emits-are-typed}

Propsy deklaruj za pomocą czysto typowego `defineProps<T>()`, a emity za pomocą `defineEmits<{ ... }>()`. Dla wariantów używaj typów unii, nigdy zestawu opcjonalnych wartości logicznych ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Computed zamiast watch {#pl-vue-003--computed-over-watch}

Wartość wyprowadzaj przez `computed`, ilekroć wynika z propsów lub stanu. `watch` stosuj tylko dla efektów ubocznych, takich jak żądania lub timery, nigdy do ustawiania refa, który mógłby wytworzyć `computed`.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Composable obsługuje jedno zagadnienie {#pl-vue-004--composables-own-one-concern}

Wielokrotnie używaną logikę ze stanem umieszczaj w funkcji `useX`, która zwraca refy i funkcje. Jeden composable obsługuje jedno zagadnienie: jedną subskrypcję, jeden formularz, jedno źródło danych. Współdzielone composables znajdują się w folderze `composables/`.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` tworzy, `v-show` przełącza {#pl-vue-005--v-if-creates-v-show-toggles}

`v-if` stosuj dla guardów, stanów pustych i gałęzi, które nie mogą istnieć w DOM. `v-show` stosuj dla wartości, która często się przełącza, takiej jak panel włączany przez użytkownika.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Listy używają stabilnego `:key` {#pl-vue-006--lists-use-a-stable-key}

Każde `v-for` ma `:key` powiązany ze stabilnym identyfikatorem z danych, nigdy z indeksem listy, która może być zmieniana kolejnością lub filtrowana. Nie łącz `v-if` i `v-for` na jednym elemencie; zamiast tego filtruj w `computed`.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Szablony zawierają wyłącznie proste wyrażenia {#pl-vue-007--templates-hold-simple-expressions-only}

Wyrażenie szablonu to jeden dostęp do właściwości, jeden prosty operator trójargumentowy albo jedno krótkie wywołanie. Wszystko dłuższe przenieś do `computed` lub nazwanej funkcji. Zagnieżdżone operatory trójargumentowe nie są Pureline ([przepływ sterowania](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

### PL-VUE-008 — Pinia przechowuje stan współdzielony {#pl-vue-008--pinia-holds-shared-state}

Stan trzymaj w komponencie lub composable, dopóki nie potrzebują go dwie niepowiązane części aplikacji, a wtedy przenieś go do store'a Pinia. Store'y odczytuj przez `storeToRefs`, aby destrukturyzacja zachowała reaktywność.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Gęstość folderów {#pl-vue-009--folder-density}

Folder domyślnie zawiera co najwyżej **10 ręcznie utrzymywanych plików źródłowych**. Gdy funkcja ma więcej niż jeden plik, grupuj komponenty, composables i store'y według funkcji (`features/sessions/`), a wspólne prymitywy trzymaj w jednym folderze `components/` ([struktura](../core/structure.md)).

### PL-VUE-010 — Narzędzia {#pl-vue-010--tooling}

Do lintowania i formatowania uruchamiaj **eslint-plugin-vue** (z konfiguracją `flat/recommended`) oraz **Prettier**, a w CI do sprawdzania typów **vue-tsc**. Wyłączona reguła lintera wymaga komentarza z powodem.
