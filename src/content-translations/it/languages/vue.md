# Stile del codice Vue

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules), il [profilo JavaScript](javascript.md) e il [profilo TypeScript](typescript.md) insieme a questo profilo. Il profilo Vue ha come obiettivo **Vue 3 con la Composition API, `<script setup>` e TypeScript in modalità strict**. Un componente si legge come una piccola pipeline: input tipizzati, logica riutilizzabile, valori derivati, markup.

## Profilo Vue {#vue-profile}

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — I componenti usano `<script setup lang="ts">` {#pl-vue-001--components-use-script-setup-langts}

Ogni componente è un Single-File Component con `<script setup lang="ts">` e un blocco `<style scoped>`. Ordina i blocchi script, template, style, così gli input si leggono prima del markup.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Props ed emit sono tipizzati {#pl-vue-002--props-and-emits-are-typed}

Dichiara le props con un `defineProps<T>()` solo di tipo e gli emit con `defineEmits<{ ... }>()`. Usa i tipi unione per le varianti, mai un insieme di booleani facoltativi ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Computed al posto di watch {#pl-vue-003--computed-over-watch}

Ricava un valore con `computed` ogni volta che deriva da props o stato. Usa `watch` solo per gli effetti collaterali come richieste o timer, mai per impostare un ref che un `computed` potrebbe produrre.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — I composable si occupano di una sola questione {#pl-vue-004--composables-own-one-concern}

Metti la logica con stato e riutilizzabile in una funzione `useX` che restituisce ref e funzioni. Un composable gestisce una sola questione: una sottoscrizione, un form, una fonte di dati. I composable condivisi stanno in una cartella `composables/`.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` crea, `v-show` alterna {#pl-vue-005--v-if-creates-v-show-toggles}

Usa `v-if` per guardie, stati vuoti e rami che non devono esistere nel DOM. Usa `v-show` per un valore che cambia spesso, come un pannello che l'utente apre e chiude.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Le liste usano una `:key` stabile {#pl-vue-006--lists-use-a-stable-key}

Ogni `v-for` ha una `:key` legata a un identificatore stabile preso dai dati, mai l'indice di una lista che può essere riordinata o filtrata. Non combinare `v-if` e `v-for` sullo stesso elemento; filtra invece in un `computed`.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — I template contengono solo espressioni semplici {#pl-vue-007--templates-hold-simple-expressions-only}

Un'espressione di template è un solo accesso a una proprietà, un solo ternario semplice o una sola breve chiamata. Sposta tutto ciò che è più lungo in un `computed` o in una funzione con nome. I ternari annidati non sono Pureline ([controllo di flusso](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

### PL-VUE-008 — Pinia contiene lo stato condiviso {#pl-vue-008--pinia-holds-shared-state}

Tieni lo stato in un componente o in un composable finché due parti non correlate dell'app ne hanno bisogno, poi spostalo in uno store Pinia. Leggi gli store con `storeToRefs`, così la destrutturazione mantiene la reattività.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Densità delle cartelle {#pl-vue-009--folder-density}

Una cartella contiene al massimo **10 file sorgente mantenuti a mano** per impostazione predefinita. Raggruppa componenti, composable e store per funzionalità (`features/sessions/`) quando una funzionalità ha più di un file, e tieni le primitive condivise in un'unica cartella `components/` ([struttura](../core/structure.md)).

### PL-VUE-010 — Strumenti {#pl-vue-010--tooling}

Esegui **eslint-plugin-vue** (con la configurazione `flat/recommended`) e **Prettier** per lint e formattazione, ed esegui **vue-tsc** per il controllo dei tipi nella CI. Una regola di lint disabilitata richiede un commento che spieghi il perché.
