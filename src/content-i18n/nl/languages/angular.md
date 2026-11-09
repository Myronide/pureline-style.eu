# Angulaire codestijl

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules), het [JavaScript profiel](javascript.md) en het [TypeScript profiel](typescript.md) toe samen met dit profiel. Het Angular profiel richt zich op **angular 17 of later** met TypeScript in strikte modus. Een onderdeel leest als een kleine pijpleiding: ingangen in, bewakers in het sjabloon, afgeleide waarden, markup out.

## Angulaire profiele pluginage

### PL-NG-001. Standalone componenten en `inject()`

Elk onderdeel is standalone (standaard vanaf de hoek 19; zet `standalone: true` op de 17 en 18). Declareer afhankelijkheden met `inject()` als `private readonly` velden, dus het klasse lichaam begint met zijn status, niet met een constructor.

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

### PL-NG-002. Signalen houden stand, OnPush R Austrian

- `signal()` houdt schrijfbare toestand, `computed()` afgeleide waarden, `input()` en `output()` vormen de interface; houd nooit een afgeleide waarde in een tweede veld. Elk onderdeel stelt `ChangeDetectionStrategy.OnPush` in, dus signalen lezen in de sjabloon drive de updates.

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

Wanneer een sjabloonwaarde wordt afgeleid van een signaal, verkies `computed()` boven
een getter die de berekening herhaalt op elke toegang.

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

### PL-NG-003. Ingebouwde regelstroom met `track`

Gebruik `@if`, `@for` en `@switch`; gebruik `*ngIf` of `*ngFor` niet in nieuwe code. Elke `@for` volgt een stabiele identificatiecode van de gegevens, nooit `$index` voor lijsten die kunnen veranderen. Gebruik `@empty` voor de lege staat.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004. Getypte reactieve vormen

Gebruik reactieve vormen met `nonNullable`-besturingen, dus een reset geeft nooit `null`. Na de geldigheidsguard lees je waarden met `getRawValue()`, die volledig getypt is.

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

### PL-NG-005. Slimme en presentatieve componenten

- Een **smart** component (een pagina of route target) injecteert diensten, bezit de signalen en geeft duidelijke ingangen door. Een **presentational** component ontvangt gegevens via `input()`, rapporteert via `output()` en injecteert geen diensten.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006. Diensten hebben één verantwoordelijkheid

Een dienst praat met één API, heeft één deel van gedeelde staat, of implementeert één domeinregel. Componenten nooit `HttpClient` direct aanroepen. `providedIn: 'root'` gebruiken tenzij een functie een scoped instantie nodig heeft.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007. Eigenschappenmappen en map-dinnen

- Groepsbestanden per functie (`features/sessions/`): onderdeel, template, service en spec samen. Naam bestanden per rol: `session-list.component.ts`, `session-api.service.ts`.
- Een map bevat hooguit **10 met de hand onderhouden bronbestanden** standaard ([PL-TS-007](typescript.md)). Splits langs verantwoordelijkheden, niet in lege nested mappen ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008. Strikte types, Geen `any`

`"strict": true` inschakelen in `tsconfig.json`. Gebruik `any` niet in componenten, diensten of sjablonen. Behandel HTTP of opslaggegevens als `unknown` en vernauw deze bij de grens ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009. Gereedschape

Run `ng lint` (van `@angular-eslint`), `ng build` en `ng test` in CI. Formatteer met de officiële formatter, Prachtiger, en controleer het met `prettier --check`. Waarschuwingen opzettelijk houden: Ze te herstellen of te onderdrukken met een bepaalde reden.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
