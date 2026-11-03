# Style de code Vue

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules), le [profil JavaScript](javascript.md) et le [profil TypeScript](typescript.md) avec ce profil. Le profil Vue cible **Vue 3 avec la Composition API, `<script setup>` et TypeScript en mode strict**. Un composant se lit comme un petit pipeline : entrées typées, logique réutilisable, valeurs dérivées, balisage.

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

### PL-VUE-001 — Les composants utilisent `<script setup lang="ts">` {#pl-vue-001--components-use-script-setup-langts}

Chaque composant est un Single-File Component avec `<script setup lang="ts">` et un bloc `<style scoped>`. Ordonnez les blocs script, template, style, afin que les entrées soient lues avant le balisage.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Les props et les emits sont typés {#pl-vue-002--props-and-emits-are-typed}

Déclarez les props avec `defineProps<T>()` en type seul et les emits avec `defineEmits<{ ... }>()`. Utilisez des types union pour les variantes, jamais un ensemble de booléens facultatifs ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — computed plutôt que watch {#pl-vue-003--computed-over-watch}

Dérivez une valeur avec `computed` chaque fois qu'elle découle des props ou de l'état. N'utilisez `watch` que pour des effets de bord comme des requêtes ou des minuteurs, jamais pour affecter un ref qu'un `computed` pourrait produire.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Un composable porte une seule préoccupation {#pl-vue-004--composables-own-one-concern}

Placez la logique à état réutilisable dans une fonction `useX` qui retourne des refs et des fonctions. Un composable gère une seule préoccupation : un abonnement, un formulaire, une source de données. Les composables partagés se trouvent dans un dossier `composables/`.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` crée, `v-show` bascule {#pl-vue-005--v-if-creates-v-show-toggles}

Utilisez `v-if` pour les guards, les états vides et les branches qui ne doivent pas exister dans le DOM. Utilisez `v-show` pour une valeur qui bascule souvent, comme un panneau que l'utilisateur ouvre et ferme.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Les listes utilisent un `:key` stable {#pl-vue-006--lists-use-a-stable-key}

Chaque `v-for` a une `:key` liée à un identifiant stable issu des données, jamais l'index d'une liste qui peut être réordonnée ou filtrée. Ne combinez pas `v-if` et `v-for` sur un même élément ; filtrez plutôt dans un `computed`.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Les templates ne contiennent que des expressions simples {#pl-vue-007--templates-hold-simple-expressions-only}

Une expression de template est un seul accès à une propriété, un seul ternaire simple ou un seul appel court. Déplacez tout ce qui est plus long dans un `computed` ou une fonction nommée. Les ternaires imbriqués ne sont pas du Pureline ([flux de contrôle](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

### PL-VUE-008 — Pinia porte l'état partagé {#pl-vue-008--pinia-holds-shared-state}

Gardez l'état dans un composant ou un composable jusqu'à ce que deux parties sans rapport de l'application en aient besoin, puis déplacez-le dans un store Pinia. Lisez les stores avec `storeToRefs` afin que la déstructuration conserve la réactivité.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Densité des dossiers {#pl-vue-009--folder-density}

Un dossier contient au maximum **10 fichiers sources maintenus à la main** par défaut. Regroupez les composants, les composables et les stores par fonctionnalité (`features/sessions/`) dès qu'une fonctionnalité comporte plus d'un fichier, et gardez les primitives partagées dans un seul dossier `components/` ([structure](../core/structure.md)).

### PL-VUE-010 — Outillage {#pl-vue-010--tooling}

Exécutez **eslint-plugin-vue** (avec sa configuration `flat/recommended`) et **Prettier** pour le lint et la mise en forme, et exécutez **vue-tsc** pour la vérification des types en CI. Une règle de lint désactivée exige un commentaire qui en explique la raison.
