# Angular Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules), das [JavaScript-Profil](javascript.md) und das [TypeScript-Profil](typescript.md) zusammen mit diesem Profil an. Das Angular-Profil zielt auf **Angular 17 oder neuer** mit TypeScript im Strict-Modus. Eine Komponente liest sich wie eine kleine Pipeline: Eingaben hinein, Guards im Template, abgeleitete Werte, Markup heraus.

## Angular-Profil {#angular-profile}

### PL-NG-001 — Standalone-Komponenten und `inject()` {#pl-ng-001--standalone-components-and-inject}

Jede Komponente ist Standalone (Standard ab Angular 19; setze in 17 und 18 `standalone: true`). Deklariere Abhängigkeiten mit `inject()` als `private readonly`-Felder, damit der Klassenrumpf mit seinem Zustand beginnt und nicht mit einem Konstruktor.

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

### PL-NG-002 — Signals halten den Zustand, OnPush rendert ihn {#pl-ng-002--signals-hold-state-onpush-renders-it}

- `signal()` hält beschreibbaren Zustand, `computed()` leitet Werte ab, `input()` und `output()` bilden die Schnittstelle; halte einen abgeleiteten Wert nie in einem zweiten Feld. Jede Komponente setzt `ChangeDetectionStrategy.OnPush`, sodass im Template gelesene Signals die Updates steuern.

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

Wenn ein Template-Wert aus einem Signal abgeleitet wird, bevorzuge `computed()`
gegenüber einem Getter, der die Berechnung bei jedem Zugriff wiederholt.

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

### PL-NG-003 — Eingebauter Kontrollfluss mit `track` {#pl-ng-003--built-in-control-flow-with-track}

Verwende `@if`, `@for` und `@switch`; verwende in neuem Code kein `*ngIf` oder `*ngFor`. Jedes `@for` trackt einen stabilen Bezeichner aus den Daten, niemals `$index` bei Listen, die sich ändern können. Verwende `@empty` für den Leerzustand.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Typisierte Reactive Forms {#pl-ng-004--typed-reactive-forms}

Verwende Reactive Forms mit `nonNullable`-Controls, damit ein Zurücksetzen nie `null` liefert. Lies die Werte nach dem Gültigkeits-Guard mit `getRawValue()`, das vollständig typisiert ist.

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

### PL-NG-005 — Smarte und darstellende Komponenten {#pl-ng-005--smart-and-presentational-components}

- Eine **smarte** Komponente (eine Seite oder ein Routenziel) injiziert Services, besitzt die Signals und reicht einfache Eingaben nach unten. Eine **darstellende** Komponente erhält Daten über `input()`, meldet über `output()` und injiziert keine Services.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Services haben eine Verantwortung {#pl-ng-006--services-have-one-responsibility}

Ein Service spricht mit genau einer API, hält genau einen Teil des gemeinsamen Zustands oder setzt genau eine Domänenregel um. Komponenten rufen `HttpClient` nie direkt auf. Verwende `providedIn: 'root'`, es sei denn, ein Feature braucht eine Instanz mit eigenem Scope.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Feature-Ordner und Ordnerdichte {#pl-ng-007--feature-folders-and-folder-density}

- Gruppiere Dateien nach Feature (`features/sessions/`): Komponente, Template, Service und Spec zusammen. Benenne Dateien nach ihrer Rolle: `session-list.component.ts`, `session-api.service.ts`.
- Ein Ordner enthält standardmäßig höchstens **10 von Hand gepflegte Quelldateien** ([PL-TS-007](typescript.md)). Teile entlang von Verantwortlichkeiten auf, nicht in leere verschachtelte Ordner ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008 — Strikte Typen, kein `any` {#pl-ng-008--strict-types-no-any}

Aktiviere `"strict": true` in der `tsconfig.json`. Verwende kein `any` in Komponenten, Services oder Templates. Behandle HTTP- oder Storage-Daten als `unknown` und grenze sie an der Grenze ein ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Tooling {#pl-ng-009--tooling}

Führe in der CI `ng lint` (aus `@angular-eslint`), `ng build` und `ng test` aus. Formatiere mit dem offiziellen Formatter Prettier und prüfe es mit `prettier --check`. Halte Warnungen bewusst: Behebe sie oder unterdrücke sie mit einer angegebenen Begründung.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
