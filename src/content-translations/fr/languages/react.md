# Style de code React

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules), le [profil JavaScript](javascript.md) et le [profil TypeScript](typescript.md) avec ce profil. Le profil React cible **React 19 avec TypeScript en mode strict**, empaqueté avec Vite et routé avec react-router. Les composants sont des fonctions. Pureline lit un composant comme un petit pipeline : props en entrée, guards, valeurs dérivées, balisage en sortie.

## Profil React {#react-profile}

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Les composants sont des fonctions nommées {#pl-react-001--components-are-named-functions}

- Un composant est une fonction nommée en `PascalCase`, déclarée avec `function` ou avec une fonction fléchée `const`, et exportée par son nom.
- Un composant a une seule responsabilité. Extrayez un sous-composant lorsqu'un bloc de balisage a son propre état, ses propres données ou son propre nom dans l'esprit du lecteur.
- Ne définissez pas de composants à l'intérieur d'autres composants. Un composant créé pendant le rendu est remonté à chaque rendu et perd son état.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Guard clauses avant le balisage principal {#pl-react-002--guard-clauses-before-the-main-markup}

Traitez d'abord les états de chargement, d'erreur et de vide, et retournez tôt. Le chemin nominal reste à l'indentation de base.

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

Évitez les ternaires imbriqués dans le JSX. Calculez la branche dans une constante nommée ou retournez-la depuis un guard. Un ternaire unique pour un choix simple entre deux possibilités à l'intérieur du JSX est permis.

### PL-REACT-003 — Les hooks sont inconditionnels et au niveau supérieur {#pl-react-003--hooks-are-unconditional-and-top-level}

- Appelez les hooks au niveau supérieur d'un composant ou d'un hook personnalisé, dans le même ordre à chaque rendu. Jamais dans une condition, une boucle ou une fonction imbriquée.
- Un hook personnalisé se nomme `useX`, se trouve dans un dossier `hooks/` lorsqu'il est partagé, et encapsule une seule préoccupation : un abonnement, un morceau d'état, une source de données.
- Un hook personnalisé retourne un résultat stable et typé. Ne documentez par un court commentaire que ce que l'appelant ne peut pas déduire du nom et du type.

### PL-REACT-004 — Les valeurs dérivées sont calculées, pas stockées {#pl-react-004--derived-values-are-computed-not-stored}

Si une valeur peut être calculée à partir des props ou de l'état, calculez-la pendant le rendu. Ne copiez pas les props dans l'état et ne gardez pas deux variables d'état qui doivent toujours concorder.

N'utilisez `useMemo` que là où un coût mesuré le justifie, comme un calcul coûteux ou une valeur référentiellement stable dont dépend un enfant mémoïsé. N'enveloppez pas chaque valeur dans `useMemo` par défaut.

### PL-REACT-005 — Les effets se synchronisent avec des systèmes externes {#pl-react-005--effects-synchronise-with-external-systems}

`useEffect` sert à se synchroniser avec quelque chose d'extérieur à React : une API du DOM, un minuteur, un abonnement, une connexion réseau. Il ne sert pas à :

- dériver un état à partir des props (calculez-le plutôt, voir PL-REACT-004) ;
- répondre à un événement utilisateur (placez la logique dans le gestionnaire d'événement) ;
- initialiser un état applicatif qu'un parent peut posséder.

Chaque effet qui s'abonne ou démarre un travail retourne une fonction de nettoyage qui défait exactement ce travail. Pour les stores externes, préférez `useSyncExternalStore` à un effet qui recopie les valeurs du store dans l'état.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Les props sont typées explicitement {#pl-react-006--props-are-typed-explicitly}

- Déclarez les props avec une `interface` (ou un `type` pour les unions) directement au-dessus du composant. Nommez-la `<Component>Props`.
- N'utilisez pas `any` pour les props, l'état ou le contexte. En mode `strict`, `unknown` associé au rétrécissement de type est la valeur par défaut pour les valeurs dont la forme n'est pas encore connue ([PL-TS-001](typescript.md)).
- Déstructurez les props dans la liste des paramètres lorsqu'elles sont peu nombreuses. Avec beaucoup de props, prenez un seul paramètre `props` et déstructurez dans les premières lignes du corps.
- Utilisez des types union pour les variantes qui changent ce que le composant rend (`status: "idle" | "loading" | "done"`) plutôt qu'un ensemble de booléens facultatifs.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — Le contexte ne porte que des valeurs transversales {#pl-react-007--context-carries-cross-cutting-values-only}

Utilisez le contexte pour les valeurs dont de nombreux composants ont besoin et qui changent rarement : l'utilisateur ou le propriétaire courant, le thème, la locale, un client de service. N'utilisez pas le contexte pour faire passer des données ordinaires à travers deux ou trois niveaux ; passez plutôt des props, ce qui garde le flux de données visible.

Lorsqu'un contexte est nécessaire, exposez-le par un hook personnalisé qui lève une erreur claire quand le provider est absent. Les appelants ne voient alors jamais `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — Le chargement des données a un propriétaire {#pl-react-008--data-loading-has-an-owner}

- Chargez les données de route par le routeur (loaders de react-router) là où l'application l'utilise, afin que le chargement et la gestion des erreurs vivent avec la route.
- En dehors du routeur, utilisez une bibliothèque de données ou un hook personnalisé qui gère l'annulation, les réponses obsolètes et l'état d'erreur. N'écrivez pas d'appels `fetch` bruts dans des effets sans signal d'abandon.
- Gardez les résultats de fetch à un seul endroit. Les composants lisent le résultat ; ils ne répètent pas chacun la requête.

### PL-REACT-009 — Les clés identifient les éléments, pas les positions {#pl-react-009--keys-identify-items-not-positions}

- Utilisez un identifiant stable issu des données comme `key` des éléments de liste.
- N'utilisez pas l'index du tableau comme clé pour les listes qui peuvent être réordonnées, filtrées ou changer de longueur. Les clés par index ne sont acceptables que pour des listes statiques qui ne changent jamais.

### PL-REACT-010 — Le rendu est pur {#pl-react-010--render-is-pure}

Le rendu calcule le balisage à partir des props et de l'état, et rien d'autre. Ne modifiez pas les props, les variables de niveau module ou les nœuds du DOM pendant le rendu, et n'y lancez pas de requêtes réseau ni d'abonnements. L'application s'exécute sous `StrictMode`, qui rend deux fois en développement pour révéler les rendus impurs. Un composant qui se comporte différemment au second rendu est un bogue.

Les effets de bord appartiennent aux gestionnaires d'événements et aux effets ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011 — Gestionnaires d'événements et props de callback {#pl-react-011--event-handlers-and-callback-props}

- Nommez les gestionnaires à l'intérieur d'un composant `handleX` (`handleSubmit`) et les props qui les reçoivent `onX` (`onSubmit`).
- Ne définissez un gestionnaire en ligne que s'il s'agit d'un simple appel de transmission sur une ligne. Les gestionnaires plus longs reçoivent un nom, afin que le corps du composant reste linéaire.
- Passez des callbacks en props uniquement aux enfants qui en ont besoin. N'enveloppez pas chaque gestionnaire dans `useCallback` par défaut ; utilisez-le là où un enfant mémoïsé dépend de la stabilité référentielle.

### PL-REACT-012 — Le style reste proche du balisage {#pl-react-012--styling-stays-close-to-the-markup}

- Les classes utilitaires (Tailwind CSS) restent dans le balisage, à côté de l'élément qu'elles stylent.
- Une chaîne de classes répétée à trois endroits ou plus devient un composant nommé ou une constante nommée, pas une copie.
- Gardez les classes conditionnelles lisibles : calculez la liste de classes une fois dans une constante nommée lorsqu'elle comporte plus de deux conditions.

### PL-REACT-013 — Densité des dossiers et dossiers de fonctionnalité {#pl-react-013--folder-density-and-feature-folders}

- Regroupez les composants, les hooks et leurs tests par fonctionnalité (`features/sessions/`), et non par type de fichier à l'échelle de toute l'application, dès qu'une fonctionnalité comporte plus d'un fichier.
- Les primitives partagées (boutons, champs, mise en page) vivent dans un seul dossier `components/` ou `ui/`.
- Un dossier contient au maximum **10 fichiers sources maintenus à la main** par défaut ([PL-TS-007](typescript.md)). Ce sont des seuils de revue, pas des limites strictes : découpez selon les responsabilités, pas en dossiers imbriqués dénués de sens.
- Un fichier contenant plusieurs composants qui partagent un état est cohésif. Gardez-les ensemble ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014 — Le routage est une frontière {#pl-react-014--routing-is-a-boundary}

Les routes associent des URL à des écrans. Gardez les définitions de routes à un seul endroit. Un composant de route récupère ou reçoit ses données à la frontière et transmet de simples props aux composants de présentation. Les composants de présentation ne lisent pas eux-mêmes l'URL.
