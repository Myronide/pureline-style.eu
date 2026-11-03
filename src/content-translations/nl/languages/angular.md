# Angular-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules), het [JavaScript-profiel](javascript.md) en het [TypeScript-profiel](typescript.md) samen met dit profiel toe. Het Angular-profiel richt zich op **Angular 17 of nieuwer** met TypeScript in strikte modus. Een component leest als een kleine pijplijn: inputs erin, guards in de template, afgeleide waarden, markup eruit.

## Angular-profiel {#angular-profile}

### PL-NG-001 — Standalone componenten en `inject()` {#pl-ng-001--standalone-components-and-inject}

Elke component is standalone (standaard vanaf Angular 19; stel `standalone: true` in op 17 en 18). Declareer afhankelijkheden met `inject()` als `private readonly`-velden, zodat de klassebody begint met zijn toestand en niet met een constructor.

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

### PL-NG-002 — Signals bevatten toestand, OnPush rendert haar {#pl-ng-002--signals-hold-state-onpush-renders-it}

- `signal()` bevat beschrijfbare toestand, `computed()` leidt waarden af, `input()` en `output()` vormen de interface; bewaar een afgeleide waarde nooit in een tweede veld. Elke component stelt `ChangeDetectionStrategy.OnPush` in, zodat signals die in de template worden gelezen de updates aansturen.

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

### PL-NG-003 — Ingebouwde besturingsstroom met `track` {#pl-ng-003--built-in-control-flow-with-track}

Gebruik `@if`, `@for` en `@switch`; gebruik geen `*ngIf` of `*ngFor` in nieuwe code. Elke `@for` volgt een stabiele identifier uit de data, nooit `$index` voor lijsten die kunnen veranderen. Gebruik `@empty` voor de lege toestand.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Getypeerde reactieve formulieren {#pl-ng-004--typed-reactive-forms}

Gebruik reactieve formulieren met `nonNullable`-controls, zodat een reset nooit `null` oplevert. Lees na de validiteitsguard de waarden met `getRawValue()`, dat volledig getypeerd is.

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

### PL-NG-005 — Smart en presentationele componenten {#pl-ng-005--smart-and-presentational-components}

- Een **smart** component (een pagina of routedoel) injecteert services, beheert de signals en geeft gewone inputs door naar beneden. Een **presentationele** component ontvangt data via `input()`, meldt via `output()` en injecteert geen services.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Services hebben één verantwoordelijkheid {#pl-ng-006--services-have-one-responsibility}

Een service praat met één API, bevat één stuk gedeelde toestand of implementeert één domeinregel. Componenten roepen `HttpClient` nooit rechtstreeks aan. Gebruik `providedIn: 'root'`, tenzij een feature een instantie met eigen scope nodig heeft.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Featuremappen en mapdichtheid {#pl-ng-007--feature-folders-and-folder-density}

- Groepeer bestanden per feature (`features/sessions/`): component, template, service en spec bij elkaar. Benoem bestanden naar rol: `session-list.component.ts`, `session-api.service.ts`.
- Een map bevat standaard maximaal **10 handmatig onderhouden bronbestanden** ([PL-TS-007](typescript.md)). Splits langs verantwoordelijkheden, niet in lege geneste mappen ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008 — Strikte typen, geen `any` {#pl-ng-008--strict-types-no-any}

Schakel `"strict": true` in in `tsconfig.json`. Gebruik geen `any` in componenten, services of templates. Behandel HTTP- of opslagdata als `unknown` en vernauw die aan de grens ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Tooling {#pl-ng-009--tooling}

Voer in CI `ng lint` (van `@angular-eslint`), `ng build` en `ng test` uit. Formatteer met de officiële formatter, Prettier, en controleer dit met `prettier --check`. Houd waarschuwingen bewust: los ze op of onderdruk ze met een vermelde reden.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
