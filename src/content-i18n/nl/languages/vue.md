# Vue Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules), het [JavaScript profiel](javascript.md) en het [TypeScript profiel](typescript.md) toe samen met dit profiel. The Vue profile targets **Vue 3 with the Composition API, `<script setup>`, and TypeScript in strict mode**. A component reads as a small pipeline: typed inputs, reusable logic, derived values, markup.

## Vue Profile

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — Components Use `<script setup lang="ts">`

Every component is a Single-File Component with `<script setup lang="ts">` and a `<style scoped>` block. Order the blocks script, template, style, so inputs are read before markup.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Props and Emits Are Typed

Declare props with a type-only `defineProps<T>()` and emits with `defineEmits<{ ... }>()`. Use union types for variants, never a set of optional booleans ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Computed Over Watch

Derive a value with `computed` whenever it follows from props or state. Use `watch` only for side effects such as requests or timers, never to set a ref that a `computed` could produce.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Composables Own One Concern

Put reusable stateful logic in a `useX` function that returns refs and functions. One composable handles one concern: one subscription, one form, one data source. Shared composables live in a `composables/` folder.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` Creates, `v-show` Toggles

Use `v-if` for guards, empty states, and branches that must not exist in the DOM. Use `v-show` for a value that flips often, such as a panel the user toggles.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Lists Use a Stable `:key`

Every `v-for` has a `:key` bound to a stable identifier from the data, never the index of a list that can be reordered or filtered. Do not combine `v-if` and `v-for` on one element; filter in a `computed` instead.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Templates Hold Simple Expressions Only

A template expression is one property access, one simple ternary, or one short call. Move anything longer into a `computed` or a named function. Nested ternaries are not Pureline ([control flow](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

With a `users` ref available to the component:

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

### PL-VUE-008 — Pinia Holds Shared State

Keep state in a component or composable until two unrelated parts of the app need it, then move it to a Pinia store. Read stores with `storeToRefs` so destructuring keeps reactivity.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009. Map Density

A folder holds at most **10 hand-maintained source files** by default. Group components, composables, and stores by feature (`features/sessions/`) when a feature has more than one file, and keep shared primitives in one `components/` folder ([structure](../core/structure.md)).

### PL-VUE-010. Gereedschape

Run **eslint-plugin-vue** (with its `flat/recommended` configuration) and **Prettier** for linting and formatting, and run **vue-tsc** for type checking in CI. A disabled lint rule needs a comment that says why.
