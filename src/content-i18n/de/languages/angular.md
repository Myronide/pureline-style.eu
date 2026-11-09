# Angular Code Style

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules), das [JavaScript profile](javascript.md) und das [TypeScript profile](typescript.md) zusammen mit diesem Profil an. The Angular profile targets **Angular 17 or later** with TypeScript in strict mode. A component reads as a small pipeline: inputs in, guards in the template, derived values, markup out.

## Winkelprofil

### PL-NG-001 — Standalone-Komponenten und `inject()`

Jede Komponente ist eigenständig (Standard von Angular 19; `standalone: true` auf 17 und 18 eingestellt). Deklarieren Sie Abhängigkeiten mit `inject()` als `private readonly`-Felder, so dass der Klassenkörper mit seinem Zustand beginnt, nicht mit einem Konstruktor.

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

### PL-NG-002 — Signale halten Zustand, OnPush Renders es

- `signal()` hält den beschreibbaren Zustand, `computed()` Derives Werte, `input()` und `output()` bilden die Schnittstelle; nie einen abgeleiteten Wert in einem zweiten Feld behalten. Jede Komponente setzt `ChangeDetectionStrategy.OnPush`, also werden die in der Vorlage gelesenen Signale die Updates antreiben.

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

Wenn ein Template-Wert aus einem Signal abgeleitet wird, bevorzugen Sie `computed()`
a getter that repeats the calculation on every access.

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

### PL-NG-003 — Eingebauter Regelstrom mit `track`

Verwenden Sie `@if`, `@for` und `@switch`; verwenden Sie `*ngIf` oder `*ngFor` nicht in neuem Code. Jedes `@for` verfolgt einen stabilen Identifier aus den Daten, nie `$index` für Listen, die sich ändern können. Verwenden Sie `@empty` für den leeren Zustand.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Typisierte Reaktive Formen

Verwenden Sie reaktive Formen mit `nonNullable`-Steuerungen, so dass ein Reset nie `null` ergibt. Nach dem Validity Guard lesen Sie Werte mit `getRawValue()`, die vollständig eingegeben ist.

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

### PL-NG-005 — Intelligente und Präsentationskomponenten

- Eine **smart**-Komponente (eine Seite oder ein Routenziel) injiziert Dienste, besitzt die Signale und leitet einfache Eingänge nach unten. Eine **presentational** Komponente empfängt Daten über `input()`, berichtet über `output()` und injiziert keine Dienste.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Dienstleistungen haben eine Verantwortung

Ein Dienst spricht mit einer API, hält ein Stück des geteilten Zustands oder implementiert eine Domain-Regel. Komponenten rufen `HttpClient` nie direkt an.. Verwenden Sie `providedIn: 'root'`, es sei denn, eine Funktion benötigt eine scoped Instanz.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Feature Ordner und Ordnerdichte

- Gruppendateien nach Funktion (`features/sessions/`): Komponente, Vorlage, Service und Spezifizierung zusammen. Namen von Dateien nach Rollen: `session-list.component.ts`, `session-api.service.ts`.
- Ein Ordner enthält standardmäßig höchstens **10 handgepflegete Quelldateien** ([PL-TS-007](typescript.md)). Verteilt die Verantwortlichkeiten, nicht in leere verschachtelte Ordner ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008 — Strenge Typen, keine `any`

Aktivieren Sie `"strict": true` in `tsconfig.json`. Verwenden Sie `any` nicht in Komponenten, Diensten oder Vorlagen. Treat HTTP or storage data as `unknown` and narrow it at the boundary ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Werkzeugbau

Run `ng lint` (from `@angular-eslint`), `ng build`, and `ng test` in CI. Format with the official formatter, Prettier, and check it with `prettier --check`. Keep warnings intentional: fix them or suppress them with a stated reason.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
