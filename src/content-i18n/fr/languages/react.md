# Style de code de réaction

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules), [Profil JavaScript](javascript.md) et [Profil TypeScript](typescript.md) avec ce profil. Le profil React cible **React 19 avec TypeScript en mode strict**, livré avec Vite, et routé avec réact-router. Les composants sont des fonctions. Pureline lit un composant comme un petit pipeline: les accessoires dans, les gardes, les valeurs dérivées, le marquage.

## Réagir au profil

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Les composants sont des fonctions nommées

- Un composant est une fonction nommée dans `PascalCase`, déclarée avec `function` ou une fonction de flèche `const`, et exportée par nom.
- Un élément est une responsabilité. Extraire une sous-composante lorsqu'un bloc de balisage a son propre état, ses propres données ou son propre nom dans la tête du lecteur.
- Ne définissez pas les composants à l'intérieur des autres composants. Un composant créé pendant le rendu est remonté sur chaque rendu et perd son état.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Clauses de garde avant le balisage principal

Poignez le chargement, l'erreur et les états vides d'abord et de revenir tôt. Le chemin réussi reste à l'indentation de base.

```tsx
export function UserPanel({ query }: UserPanelProps) {
    if (query.isPending) {
        return <Spinner />;
    }

    if (query.isError) {
        return <ErrorMessage error={query.error} />;
    }

    return <UserDetails user={query.data} />;
}
```

Évitez les ternaires imbriqués dans JSX. Calculez la branche dans une constante nommée ou retournez-la d'un garde. Un seul ternaire pour un simple choix à deux sens à l'intérieur de JSX est autorisé.

### PL-REACT-003 — Les crochets sont non conditionnels et de premier niveau

- Les crochets d'appel au niveau supérieur d'un composant ou crochet personnalisé, dans le même ordre sur chaque rendu. Jamais dans une condition, une boucle ou une fonction imbriquée.
- Un crochet personnalisé est nommé `useX`, vit dans un dossier `hooks/` quand il est partagé, et encapsule une préoccupation : un abonnement, un élément d'état, une source de données.
- Un crochet personnalisé renvoie un résultat stable, tapé. Documenter avec un commentaire court seulement ce que l'appelant ne peut pas déduire du nom et du type.

### PL-REACT-004 — Les valeurs dérivées sont calculées, non stockées

Si une valeur peut être calculée à partir d'un prop ou d'un état, calculez-la pendant le rendu. Ne pas copier les accessoires dans l'état, et ne pas garder deux variables d'état qui doivent toujours être d'accord.

Utilisez `useMemo` seulement lorsqu'un coût mesuré le justifie, comme un calcul coûteux ou une valeur referentiellement stable dont dépend un enfant mémorisé. Ne pas envelopper par défaut toutes les valeurs de `useMemo`.

### PL-REACT-005 — Synchronisation des effets avec les systèmes externes

`useEffect` est pour la synchronisation avec quelque chose en dehors de React: une API DOM, une minuterie, un abonnement, une connexion réseau. Il ne s'agit pas de:

- dérivant de l'état des accessoires (calculez-le à la place, voir PL-REACT-004);
- répondre à un événement utilisateur (mettre la logique dans le gestionnaire d'événement);
- l'initialisation de la demande stipule qu'un parent peut posséder.

Chaque effet qui s'abonne ou démarre le travail retourne une fonction de nettoyage qui annule exactement ce travail. Pour les magasins externes, préférez `useSyncExternalStore` à un effet qui copie les valeurs de stockage dans l'état.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Les éléments sont tapés explicitement

- Déclarez les accessoires avec un `interface` (ou un `type` pour les syndicats) directement au-dessus du composant. Nomme-le `<Component>Props`.
- N'utilisez pas `any` pour les accessoires, l'état ou le contexte. En mode `strict`, `unknown` plus rétrécissement est la valeur par défaut pour les valeurs dont la forme n'est pas encore connue ([PL-TS-001](typescript.md)).
- Déstructurer les accessoires dans la liste des paramètres quand il y en a peu. Avec de nombreux accessoires, prenez un paramètre `props` et déstructurez-vous dans les premières lignes du corps.
- Utilisez des types de union pour les variantes qui changent ce que le composant rend (`status: "idle" | "loading" | "done"`) plutôt qu'un ensemble de booléens optionnels.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — Contexte Les valeurs croisées sont uniquement

Utiliser le contexte pour les valeurs dont de nombreux composants ont besoin et qui changent rarement : l'utilisateur ou le propriétaire actuel, thème, local, un client de service. Ne pas utiliser le contexte pour passer des données ordinaires à deux ou trois niveaux; les accessoires pass, qui maintient le flux de données visible.

Lorsqu'un contexte est nécessaire, exposez-le par un crochet personnalisé qui lance une erreur claire lorsque le fournisseur est absent. Les appelants ne voient jamais `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — Chargement des données a un propriétaire

- Chargez les données de route dans le routeur (chargeurs dans réact-router) où l'application l'utilise, de sorte que le chargement et la manipulation des erreurs vivent avec le parcours.
- En dehors du routeur, utilisez une bibliothèque de données ou un crochet personnalisé qui gère l'annulation, les réponses statiques et l'état d'erreur. N'écrivez pas des appels `fetch` nus dans des effets sans un signal d'arrêt.
- Gardez chercher les résultats en un seul endroit. Les composants lisent le résultat; ils ne répètent pas tous la requête.

### PL-REACT-009 — Clés Identifier les éléments, pas les positions

- Utilisez un identifiant stable des données comme `key` des éléments de la liste.
- N'utilisez pas l'index du tableau comme clé pour les listes qui peuvent être réordonnées, filtrées ou modifiées en longueur. Les clés d'index sont acceptables uniquement pour les listes statiques qui ne changent jamais.

### PL-REACT-010 — Le rendu est pur

Le rendu calcule le balisage des accessoires et de l'état et rien d'autre. Ne mutez pas les accessoires, les variables de niveau module ou les nœuds DOM pendant le rendu, et ne commencez pas les requêtes réseau ou les abonnements là-bas. L'application fonctionne sous `StrictMode`, qui rend deux fois en développement pour exposer les rendus de la marque. Un composant qui se comporte différemment sur le deuxième rendu est un bug.

Les effets secondaires sont présents dans les gestionnaires d'événements et les effets ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011 — Gestionnaires d'événements et apps de rappel

- Les gestionnaires de noms à l'intérieur d'un composant `handleX` (`handleSubmit`) et les accessoires qui les reçoivent `onX` (`onSubmit`).
- Définir un gestionnaire en ligne seulement lorsqu'il s'agit d'un appel de renvoi d'une ligne. Les gestionnaires plus longs obtiennent un nom, de sorte que le corps de la composante reste linéaire.
- Passer les rappels comme accessoires seulement aux enfants qui en ont besoin. Ne pas envelopper chaque gestionnaire dans `useCallback` par défaut; utilisez-le lorsqu'un enfant mémorisé dépend de la stabilité du référentiel.

### PL-REACT-012 — Le style reste proche du Markup

- Les classes utilitaires (Tailwind CSS) restent dans le balisage à côté de l'élément qu'elles stylent.
- Une chaîne de classe répétée en trois ou plusieurs endroits devient un composant nommé ou une constante nommée, et non une copie.
- Gardez les classes conditionnelles lisibles: calculez la liste de classes une fois dans une constante nommée lorsqu'elle comporte plus de deux conditions.

### PL-REACT-013 — Dossier de densité et dossiers de caractéristiques

- Les composants de groupe, les crochets et leurs tests par fonction (`features/sessions/`), pas par type de fichier dans toute l'application, lorsqu'une fonction a plus d'un fichier.
- Les primitives partagés (boutons, entrées, layout) vivent dans un dossier `components/` ou `ui/`.
- Un dossier contient au maximum des fichiers source **10 maintenus manuellement** par défaut ([PL-TS-007](typescript.md)). Révision des seuils, et non des limites rigides: les responsabilités partagées, non pas en dossiers imbriqués sans signification.
- Un fichier avec plusieurs composants qui partagent l'état est cohérent. Gardez-les ensemble ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014 — L'acheminement est une frontière

Routes map URLs vers les écrans. Gardez les définitions de route dans un seul endroit. Un composant de route récupère ou reçoit ses données à la limite et passe les accessoires de plaine vers le bas en composants de présentation. Les composants de présentation ne lisent pas l'URL eux-mêmes.
