# Vue Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules), het [JavaScript profiel](javascript.md) en het [TypeScript profiel](typescript.md) toe samen met dit profiel. Het Vue profiel richt zich op **Vue 3 met de Compositie API, `<script setup>` en TypeScript in strikte modus**. Een onderdeel leest als een kleine pijpleiding: getypte ingangen, herbruikbare logica, afgeleide waarden, markup.

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

### PL-VUE-001. Componenten gebruiken `<script setup lang="ts">`

Elk onderdeel is een enkel bestandscomponent met `<script setup lang="ts">` en een `<style scoped>`-blok. Bestel het blok script, sjabloon, stijl, dus de invoer wordt gelezen voordat markup.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002. Voordelen en EMIS zijn getypt

Declareer rekwisieten met een `defineProps<T>()`-type en straalt uit met `defineEmits<{ ... }>()`. Gebruik union types voor varianten, nooit een set van optionele booleanen ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003. Gecomputeerd over horloge

Een waarde met `computed` bepalen wanneer deze uit rekwisieten of toestand volgt. Gebruik `watch` alleen voor bijwerkingen zoals verzoeken of timers, nooit om een ref in te stellen die een `computed` kan produceren.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004. Composibles Eigen One Concern

Zet herbruikbare stateful logica in een `useX` functie die refs en functies teruggeeft. Een composible behandelt één zorg: één abonnement, één formulier, één gegevensbron. Gedeelde composibles live in een `composables/` map.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005. `v-if`-aanmaken, `v-show`-aan/uiten

Gebruik `v-if` voor bewakers, lege toestanden en takken die niet mogen bestaan in de DOM. Gebruik `v-show` voor een waarde die vaak omdraait, zoals een paneel dat de gebruiker aan het schakelen is.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006. Lijsten Gebruik een Stabiel `:key`

Elke `v-for` heeft een `:key` die gebonden is aan een stabiele identificatiecode uit de gegevens, nooit de index van een lijst die kan worden herorden of gefilterd. Combineer `v-if` en `v-for` niet op één element; filter in plaats daarvan in een `computed`.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007. Sjablonen bevatten eenvoudige expressies

Een sjabloon expressie is één toegang tot eigendom, één eenvoudige ternary, of een korte oproep. Verplaats iets langer in een `computed` of een genoemde functie. Genesteerde sternen zijn geen Pureline ([controlestroom](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

Met een `users` ref beschikbaar voor het onderdeel:

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

### PL-VUE-008. Pinia houdt gedeelde staat

Houd staat in een component of composible totdat twee niet-gerelateerde delen van de app nodig hebben, dan verplaatsen naar een Pinia winkel. Lees winkels met `storeToRefs` dus destructureren houdt reactiviteit.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009. Map Density

Een map bevat hooguit **10 hand-onderhoud bronbestanden** standaard. Groepscomponenten, composibles en opslagt op functie (`features/sessions/`) als een functie meer dan één bestand heeft, en gedeelde primitieven in één `components/`-map ([structuur](../core/structure.md) houdt).

### PL-VUE-010. Gereedschape

Run **eslint-plugin-vue** (met `flat/recommended` configuratie) en **Prettier** voor het formatteren en formatteren, en voer **vue-tsc** uit voor typecontrole in CI.ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ Een gehandicapte regel heeft een opmerking nodig die zegt waarom.
