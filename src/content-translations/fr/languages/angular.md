# Style de code Angular

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules), le [profil JavaScript](javascript.md) et le [profil TypeScript](typescript.md) avec ce profil. Le profil Angular cible **Angular 17 ou une version ultérieure** avec TypeScript en mode strict. Un composant se lit comme un petit pipeline : entrées, guards dans le template, valeurs dérivées, balisage en sortie.

## Profil Angular {#angular-profile}

### PL-NG-001 — Composants standalone et `inject()` {#pl-ng-001--standalone-components-and-inject}

Chaque composant est standalone (par défaut depuis Angular 19 ; définissez `standalone: true` en 17 et 18). Déclarez les dépendances avec `inject()` sous forme de champs `private readonly`, afin que le corps de la classe commence par son état et non par un constructeur.

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

### PL-NG-002 — Les signals portent l'état, OnPush en assure le rendu {#pl-ng-002--signals-hold-state-onpush-renders-it}

- `signal()` porte l'état modifiable, `computed()` dérive des valeurs, `input()` et `output()` forment l'interface ; ne gardez jamais une valeur dérivée dans un second champ. Chaque composant définit `ChangeDetectionStrategy.OnPush`, de sorte que les signals lus dans le template pilotent les mises à jour.

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

### PL-NG-003 — Flux de contrôle intégré avec `track` {#pl-ng-003--built-in-control-flow-with-track}

Utilisez `@if`, `@for` et `@switch` ; n'utilisez pas `*ngIf` ni `*ngFor` dans le nouveau code. Chaque `@for` suit un identifiant stable issu des données, jamais `$index` pour des listes susceptibles de changer. Utilisez `@empty` pour l'état vide.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Formulaires réactifs typés {#pl-ng-004--typed-reactive-forms}

Utilisez des formulaires réactifs avec des contrôles `nonNullable`, afin qu'une réinitialisation ne produise jamais `null`. Après le guard de validité, lisez les valeurs avec `getRawValue()`, qui est entièrement typé.

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

### PL-NG-005 — Composants intelligents et composants de présentation {#pl-ng-005--smart-and-presentational-components}

- Un composant **intelligent** (une page ou une cible de route) injecte les services, possède les signals et transmet de simples entrées vers le bas. Un composant **de présentation** reçoit les données via `input()`, notifie via `output()` et n'injecte aucun service.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Les services ont une seule responsabilité {#pl-ng-006--services-have-one-responsibility}

Un service dialogue avec une seule API, détient un seul morceau d'état partagé ou implémente une seule règle de domaine. Les composants n'appellent jamais `HttpClient` directement. Utilisez `providedIn: 'root'`, sauf si une fonctionnalité a besoin d'une instance à portée limitée.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Dossiers de fonctionnalité et densité des dossiers {#pl-ng-007--feature-folders-and-folder-density}

- Regroupez les fichiers par fonctionnalité (`features/sessions/`) : composant, template, service et spec ensemble. Nommez les fichiers d'après leur rôle : `session-list.component.ts`, `session-api.service.ts`.
- Un dossier contient au maximum **10 fichiers sources maintenus à la main** par défaut ([PL-TS-007](typescript.md)). Découpez selon les responsabilités, pas en dossiers imbriqués vides ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008 — Types stricts, pas de `any` {#pl-ng-008--strict-types-no-any}

Activez `"strict": true` dans `tsconfig.json`. N'utilisez pas `any` dans les composants, les services ni les templates. Traitez les données HTTP ou de stockage comme `unknown` et rétrécissez leur type à la frontière ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Outillage {#pl-ng-009--tooling}

Exécutez `ng lint` (de `@angular-eslint`), `ng build` et `ng test` en CI. Formatez avec le formateur officiel, Prettier, et vérifiez avec `prettier --check`. Gardez les avertissements intentionnels : corrigez-les ou supprimez-les avec une raison indiquée.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
