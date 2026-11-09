# Estilo de código Vue

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [core compartido](../README.md#shared-rules), [JavaScript profile](javascript.md), y [TypeScript profile](typescript.md) junto con este perfil. El perfil Vue se dirige a **Vue 3 con la API de Composición, `<script setup>` y TypeScript en modo estricto**. Un componente se lee como un pequeño gasoducto: entradas mecanografiadas, lógica reutilizable, valores derivados, marcado.

## Perfil Vue

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — Los componentes utilizan `<script setup lang="ts">`

Cada componente es un componente de un solo archivo con `<script setup lang="ts">` y un bloque `<style scoped>`. Ordene el script de bloques, plantilla, estilo, por lo que las entradas se leen antes del marcado.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Se escriben los elementos y los emitos

Declarar accesorios con un tipo único `defineProps<T>()` y emite con `defineEmits<{ ... }>()`. Usar tipos de unión para variantes, nunca un conjunto de booleanos opcionales [PL-TS-001](typescript.md)].

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Control de la calidad

Derive un valor con `computed` cuando proceda de props o estado. Utilice `watch` sólo para efectos secundarios como peticiones o temporizadores, para nunca establecer una ref que un `computed` podría producir.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Composable Propio Preocupación

Ponga la lógica de estado reutilizable en una función `useX` que devuelve refs y funciones. Una componible se ocupa de una preocupación: una suscripción, un formulario, una fuente de datos. Composable compartido vive en una carpeta `composables/`.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` crea, `v-show` conmuta

Use `v-if` para guardias, estados vacíos y ramas que no deben existir en el DOM. Use `v-show` para un valor que se voltea a menudo, como un panel que el usuario alterna.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Listas de uso de un `:key` estable

Cada `v-for` tiene un `:key` unido a un identificador estable de los datos, nunca el índice de una lista que se puede reordenar o filtrar. No combine `v-if` y `v-for` en un elemento; en su lugar, filtre en un `computed`.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Las plantillas solo contienen expresiones simples

Una expresión de plantilla es un acceso a una propiedad, una simple palabra de inicio o una llamada corta. Mueva cualquier cosa más a una función `computed` o con nombre. Las fuentes anidadas no son Pureline [[flujo de control](../core/control-flow.md)].

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

Con un ref `users` disponible para el componente:

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

### PL-VUE-008 — Pinia mantiene el Estado compartido

Mantener estado en un componente o componible hasta que dos partes no relacionadas de la aplicación lo necesiten, luego moverlo a una tienda de Pinia. Read stores with `storeToRefs` so destructuring keeps reactivity.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Densidad de la carpeta

Una carpeta contiene como máximo archivos fuente **10 mantenidos a mano** por defecto. Agrupar componentes, componibles y almacenar por función (`features/sessions/`) cuando una característica tiene más de un archivo, y mantener primitivos compartidos en una carpeta `components/` ([estructura](../core/structure.md)).:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

### PL-VUE-010 — Herramientas

Run **eslint-plugin-vue** (with its `flat/recommended` configuration) and **Prettier** for linting and formatting, and run **vue-tsc** for type checking in CI. A disabled lint rule needs a comment that says why.
