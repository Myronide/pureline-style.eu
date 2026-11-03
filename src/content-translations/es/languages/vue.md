# Estilo de código Vue

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules), el [perfil de JavaScript](javascript.md) y el [perfil de TypeScript](typescript.md) junto con este perfil. El perfil de Vue está pensado para **Vue 3 con la Composition API, `<script setup>` y TypeScript en modo estricto**. Un componente se lee como un pequeño pipeline: entradas tipadas, lógica reutilizable, valores derivados y marcado.

## Perfil de Vue {#vue-profile}

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — Los componentes usan `<script setup lang="ts">` {#pl-vue-001--components-use-script-setup-langts}

Todos los componentes son Single-File Components con `<script setup lang="ts">` y un bloque `<style scoped>`. Ordena los bloques como script, template y style, para que las entradas se lean antes que el marcado.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Las props y los emits están tipados {#pl-vue-002--props-and-emits-are-typed}

Declara las props con un `defineProps<T>()` solo de tipos, y los emits con `defineEmits<{ ... }>()`. Usa tipos de unión para las variantes, nunca un conjunto de booleanos opcionales ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Computed antes que watch {#pl-vue-003--computed-over-watch}

Deriva un valor con `computed` siempre que se desprenda de las props o del estado. Usa `watch` solo para efectos secundarios, como peticiones o temporizadores, nunca para asignar un ref que un `computed` podría producir.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Los composables se encargan de una única responsabilidad {#pl-vue-004--composables-own-one-concern}

Pon la lógica con estado reutilizable en una función `useX` que devuelva refs y funciones. Un composable se encarga de una responsabilidad: una suscripción, un formulario, una fuente de datos. Los composables compartidos viven en una carpeta `composables/`.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` crea, `v-show` alterna {#pl-vue-005--v-if-creates-v-show-toggles}

Usa `v-if` para las guardas, los estados vacíos y las ramas que no deben existir en el DOM. Usa `v-show` para un valor que cambia con frecuencia, como un panel que el usuario muestra y oculta.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Las listas usan un `:key` estable {#pl-vue-006--lists-use-a-stable-key}

Cada `v-for` tiene un `:key` enlazado a un identificador estable procedente de los datos, nunca al índice de una lista que pueda reordenarse o filtrarse. No combines `v-if` y `v-for` en un mismo elemento; filtra en un `computed` en su lugar.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Las plantillas contienen solo expresiones simples {#pl-vue-007--templates-hold-simple-expressions-only}

Una expresión de plantilla es un acceso a una propiedad, un ternario sencillo o una llamada corta. Traslada cualquier cosa más larga a un `computed` o a una función con nombre. Los ternarios anidados no son Pureline ([flujo de control](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

### PL-VUE-008 — Pinia guarda el estado compartido {#pl-vue-008--pinia-holds-shared-state}

Mantén el estado en un componente o en un composable hasta que dos partes no relacionadas de la aplicación lo necesiten; entonces muévelo a un store de Pinia. Lee los stores con `storeToRefs` para que la desestructuración conserve la reactividad.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Densidad de carpetas {#pl-vue-009--folder-density}

Una carpeta contiene como máximo **10 archivos fuente mantenidos a mano** por defecto. Agrupa los componentes, los composables y los stores por funcionalidad (`features/sessions/`) cuando una funcionalidad tenga más de un archivo, y mantén las primitivas compartidas en una única carpeta `components/` ([estructura](../core/structure.md)).

### PL-VUE-010 — Herramientas {#pl-vue-010--tooling}

Ejecuta **eslint-plugin-vue** (con su configuración `flat/recommended`) y **Prettier** para el lint y el formato, y ejecuta **vue-tsc** para la comprobación de tipos en la CI. Una regla de lint desactivada necesita un comentario que explique el motivo.
