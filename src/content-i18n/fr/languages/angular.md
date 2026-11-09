# Style de code angulaire

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules), [Profil JavaScript](javascript.md) et [Profil TypeScript](typescript.md) avec ce profil. Le profil Angulaire cible **Angulaire 17 ou plus** avec TypeScript en mode strict. Un élément se lit comme un petit pipeline : entrées dans, gardes dans le modèle, valeurs dérivées, balisage.

## Profil angulaire

### PL-NG-001 — Composants autonomes et `inject()`

Chaque composant est autonome (par défaut depuis Angular 19; définissez `standalone: true` sur 17 et 18). Déclarez les dépendances avec `inject()` comme champs `private readonly`, donc le corps de classe commence par son état, pas par un constructeur.

```ts
@Component({
    selector: 'app-session-card',
    template: `<h2>{{ session().name }}</h2>`,
})
export class SessionCardComponent {
    readonly session = input.required<Session>();
    private readonly router = inject(Router);
}
```

### PL-NG-002 — Signalisations en position, onPush la lance

- `signal()` détient l'état enregistrable, `computed()` dérive des valeurs, `input()` et `output()` forment l'interface; ne jamais conserver une valeur dérivée dans un second champ. Chaque composant définit `ChangeDetectionStrategy.OnPush`, donc les signaux lus dans le modèle conduisent les mises à jour.

```ts
@Component({
    selector: 'app-counter',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<button (click)="increment()">{{ count() }} / {{ doubled() }}</button>`,
})
export class CounterComponent {
    readonly count = signal(0);
    readonly doubled = computed(() => this.count() * 2);
    increment(): void {
        this.count.update((value) => value + 1);
    }
}
```

When a template value is derived from a signal, prefer `computed()` over
un getter qui répète le calcul sur chaque accès.

```text
Getter                               │ ✓ Pureline
get activeCount(): number {          │ readonly activeCount = computed(() =>
    return this.users().filter(      │     this.users().filter(
        (user) => user.active,       │         (user) => user.active,
    ).length;                        │     ).length,
}                                    │ );
                                     │
<span>{{ activeCount }}</span>       │ <span>{{ activeCount() }}</span>
```

### PL-NG-003 — Débit de contrôle intégré avec `track`

Utilisez `@if`, `@for` et `@switch`; n'utilisez pas `*ngIf` ou `*ngFor` dans un nouveau code. Chaque `@for` suit un identifiant stable à partir des données, jamais `$index` pour les listes qui peuvent changer. Utilisez `@empty` pour l'état vide.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Formulaires réactifs dactylographiés

Utilisez des formes réactives avec des commandes `nonNullable`, donc une remise à zéro ne donne jamais `null`. Après le garde de validité, lisez les valeurs avec `getRawValue()`, qui est entièrement tapé.

```ts
readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
});
submit(): void {
    if (this.form.invalid) {
        return;
    }

    this.users.create(this.form.getRawValue());
}
```

### PL-NG-005 — Composants intelligents et de présentation

- Un composant **smart** (une cible de page ou de route) injecte des services, possède les signaux et passe les entrées simples vers le bas. Un composant **presentational** reçoit des données par l'intermédiaire de `input()`, signale par `output()` et n'injecte aucun service.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Les services ont une responsabilité unique

Un service parle à une API, détient un morceau d'état partagé, ou implémente une règle de domaine. Les composants n'appellent jamais directement `HttpClient`. Utilisez `providedIn: 'root'` à moins qu'une fonctionnalité n'ait besoin d'une instance scoped.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Dossiers et densité de dossiers

- Grouper les fichiers par fonction (`features/sessions/`) : composant, modèle, service et spécifications ensemble. Fichiers de noms par rôle: `session-list.component.ts`, `session-api.service.ts`.
- Un dossier contient au maximum des fichiers source **10 maintenus manuellement** par défaut ([PL-TS-007](typescript.md)). Diviser les responsabilités en plusieurs dossiers ([PL-STRUCT-003](../core/structure.md)) et non pas dans des dossiers nichés vides.

### PL-NG-008 — Types stricts, n° `any`

Activer `"strict": true` dans `tsconfig.json`. N'utilisez pas `any` dans les composants, les services ou les modèles. Traiter les données HTTP ou de stockage comme `unknown` et les restreindre à la limite ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Outillage

Exécutez `ng lint` (à partir de `@angular-eslint`), `ng build` et `ng test` dans CI. Format avec le nom officiel, Prettier, et vérifiez-le avec `prettier --check`. Gardez les avertissements intentionnels : les fixer ou les supprimer avec une raison indiquée.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
