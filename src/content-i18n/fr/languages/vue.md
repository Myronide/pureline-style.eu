# Style de code de la vue

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules), [Profil JavaScript](javascript.md) et [Profil TypeScript](typescript.md) avec ce profil. Le profil de la vue cible **83 3 avec l'API Composition, `<script setup>` et TypeScript en mode strict**. Un élément se lit comme un petit pipeline : saisie dactylographiée, logique réutilisable, valeurs dérivées, balisage.

## Vue de profil

```text
Props and emits
↓
Composables (state and logic)
↓
Computed values
↓
Template (markup)
```

### PL-VUE-001 — Les composants utilisent `<script setup lang="ts">`

Chaque composant est un composant monofichier avec `<script setup lang="ts">` et un bloc `<style scoped>`. Commandez le script de blocs, le modèle, le style, afin que les entrées soient lues avant le balisage.

```vue
<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>
<template>
  <h2>{{ props.title }}</h2>
</template>
```

### PL-VUE-002 — Les éléments et les éléments sont tapés

Déclarez les accessoires avec un `defineProps<T>()` de type unique et émet avec `defineEmits<{ ... }>()`. Utilisez des types d'union pour les variantes, jamais un ensemble de booléens optionnels ([PL-TS-001](typescript.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ status: "idle" | "running" | "done" }>();
const emit = defineEmits<{ select: [id: string] }>();
</script>
```

### PL-VUE-003 — Montres sur mesure

Dérivez une valeur avec `computed` chaque fois qu'elle provient d'un élément ou d'un état. Utilisez `watch` uniquement pour les effets secondaires comme les requêtes ou les minuteries, ne jamais définir une réf qu'un `computed` pourrait produire.

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ items: { done: boolean }[] }>();
const openCount = computed(() => props.items.filter((item) => !item.done).length);
</script>
```

### PL-VUE-004 — Composables Une seule préoccupation

Mettez la logique étatueuse réutilisable dans une fonction `useX` qui retourne refs et fonctions. Une poignée de taille Une préoccupation : un abonnement, un formulaire, une source de données. Les compositeurs partagés vivent dans un dossier `composables/`.

```ts
import { ref } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  return { count, increment: () => (count.value += 1) };
}
```

### PL-VUE-005 — `v-if` crée, `v-show` bascule

Utilisez `v-if` pour les gardes, les états vides et les branches qui ne doivent pas exister dans le DOM. Utilisez `v-show` pour une valeur qui retourne souvent, comme un panneau que l'utilisateur bascule.

```vue
<template>
  <p v-if="!session">No session selected.</p>
  <SessionDetails v-else :session="session" />
</template>
```

### PL-VUE-006 — Les listes utilisent un `:key` stable

Chaque `v-for` a un `:key` lié à un identifiant stable à partir des données, jamais l'index d'une liste qui peut être ré-ordonnée ou filtrée. Ne pas combiner `v-if` et `v-for` sur un élément; filtrer dans un `computed` à la place.

```vue
<template>
  <ul>
    <li v-for="session in visibleSessions" :key="session.id">{{ session.name }}</li>
  </ul>
</template>
```

### PL-VUE-007 — Modèles ne tiennent que des expressions simples

Une expression de modèle est un accès à une propriété, un simple ternaire ou un appel court. Déplacez plus longtemps quelque chose dans une `computed` ou une fonction nommée. Les ternaires nichés ne sont pas Pureline ([écoulement de contrôle](../core/control-flow.md)).

```vue
<script setup lang="ts">
const props = defineProps<{ done: boolean }>();
</script>

<template>
  <p>{{ props.done ? "Done" : "Open" }}</p>
</template>
```

Avec une `users` ref disponible pour le composant:

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

### PL-VUE-008 — Pinia détient l'État partagé

Gardez l'état dans un composant ou un composant jusqu'à ce que deux parties non reliées de l'application en aient besoin, puis déplacez-le dans un magasin Pinia. Lire les magasins avec `storeToRefs` afin de déstructurer garde la réactivité.

```ts
const { items } = storeToRefs(useSessionStore());
```

### PL-VUE-009 — Densité du dossier

Un dossier contient au maximum des fichiers source **10 gérés manuellement** par défaut. Les composants de groupe, les composants et les stockes par fonction (`features/sessions/`) lorsqu'une fonction a plus d'un fichier, et garde des primitives partagés dans un dossier `components/` ([structure](../core/structure.md)).

### PL-VUE-010 — Outillage

Exécutez **eslint-plugin-vue** (avec sa configuration `flat/recommended`) et **Prettier** pour le lintage et le formatage, et exécutez **vue-tsc** pour la vérification de type en CI. Une règle de lint handicapée nécessite un commentaire qui dit pourquoi.
