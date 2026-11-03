# Vue-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules), het [JavaScript-profiel](javascript.md) en het [TypeScript-profiel](typescript.md) samen met dit profiel toe. Het Vue-profiel richt zich op **Vue 3 met de Composition API, `<script setup>` en TypeScript in strikte modus**. Een component leest als een kleine pijplijn: getypeerde inputs, herbruikbare logica, afgeleide waarden, markup.

## Vue-profiel {#vue-profile}

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — Componenten gebruiken `<script setup lang="ts">` {#pl-vue-001--components-use-script-setup-langts}

Elke component is een Single-File Component met `<script setup lang="ts">` en een `<style scoped>`-blok. Orden de blokken script, template, style, zodat inputs vóór de markup worden gelezen.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Props en emits zijn getypeerd {#pl-vue-002--props-and-emits-are-typed}

Declareer props met een type-only `defineProps<T>()` en emits met `defineEmits<{ ... }>()`. Gebruik uniontypen voor varianten, nooit een reeks optionele booleans ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Computed boven watch {#pl-vue-003--computed-over-watch}

Leid een waarde af met `computed` zodra ze volgt uit props of toestand. Gebruik `watch` alleen voor neveneffecten zoals verzoeken of timers, nooit om een ref te zetten die een `computed` zou kunnen opleveren.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Composables beheren één aandachtsgebied {#pl-vue-004--composables-own-one-concern}

Zet herbruikbare logica met toestand in een `useX`-functie die refs en functies teruggeeft. Eén composable behandelt één aandachtsgebied: één abonnement, één formulier, één databron. Gedeelde composables staan in een map `composables/`.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` maakt aan, `v-show` schakelt om {#pl-vue-005--v-if-creates-v-show-toggles}

Gebruik `v-if` voor guards, lege toestanden en takken die niet in de DOM mogen bestaan. Gebruik `v-show` voor een waarde die vaak wisselt, zoals een paneel dat de gebruiker in- en uitklapt.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Lijsten gebruiken een stabiele `:key` {#pl-vue-006--lists-use-a-stable-key}

Elke `v-for` heeft een `:key` die is gebonden aan een stabiele identifier uit de data, nooit de index van een lijst die kan worden herordend of gefilterd. Combineer `v-if` en `v-for` niet op één element; filter in plaats daarvan in een `computed`.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Templates bevatten alleen eenvoudige expressies {#pl-vue-007--templates-hold-simple-expressions-only}

Een template-expressie is één property-toegang, één eenvoudige ternaire expressie of één korte aanroep. Verplaats alles wat langer is naar een `computed` of een benoemde functie. Geneste ternaire expressies zijn geen Pureline ([besturingsstroom](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

### PL-VUE-008 — Pinia bevat gedeelde toestand {#pl-vue-008--pinia-holds-shared-state}

Houd toestand in een component of composable totdat twee niet-gerelateerde delen van de app haar nodig hebben, verplaats haar dan naar een Pinia-store. Lees stores met `storeToRefs`, zodat destructuring de reactiviteit behoudt.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Mapdichtheid {#pl-vue-009--folder-density}

Een map bevat standaard maximaal **10 handmatig onderhouden bronbestanden**. Groepeer componenten, composables en stores per feature (`features/sessions/`) wanneer een feature meer dan één bestand heeft, en houd gedeelde primitieven in één map `components/` ([structuur](../core/structure.md)).

### PL-VUE-010 — Tooling {#pl-vue-010--tooling}

Voer **eslint-plugin-vue** (met de configuratie `flat/recommended`) en **Prettier** uit voor linting en opmaak, en voer in CI **vue-tsc** uit voor typecontrole. Een uitgeschakelde lintregel vraagt om een opmerking waarin staat waarom.
