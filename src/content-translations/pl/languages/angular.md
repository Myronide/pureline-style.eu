# Angular Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules), [profil JavaScript](javascript.md) i [profil TypeScript](typescript.md) razem z tym profilem. Profil Angular dotyczy **Angulara 17 lub nowszego** z TypeScriptem w trybie strict. Komponent czyta się jak mały potok: wejścia na początku, guardy w szablonie, wartości pochodne, markup na wyjściu.

## Profil Angular {#angular-profile}

### PL-NG-001 — Komponenty standalone i `inject()` {#pl-ng-001--standalone-components-and-inject}

Każdy komponent jest standalone (domyślnie od Angulara 19; w wersjach 17 i 18 ustaw `standalone: true`). Zależności deklaruj przez `inject()` jako pola `private readonly`, aby ciało klasy zaczynało się od stanu, a nie od konstruktora.

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

### PL-NG-002 — Sygnały przechowują stan, OnPush go renderuje {#pl-ng-002--signals-hold-state-onpush-renders-it}

- `signal()` przechowuje stan do zapisu, `computed()` wyprowadza wartości, a `input()` i `output()` tworzą interfejs; nigdy nie trzymaj wartości pochodnej w drugim polu. Każdy komponent ustawia `ChangeDetectionStrategy.OnPush`, dzięki czemu sygnały odczytywane w szablonie sterują aktualizacjami.

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

### PL-NG-003 — Wbudowany przepływ sterowania z `track` {#pl-ng-003--built-in-control-flow-with-track}

Używaj `@if`, `@for` i `@switch`; w nowym kodzie nie używaj `*ngIf` ani `*ngFor`. Każdy `@for` śledzi stabilny identyfikator z danych, nigdy `$index` dla list, które mogą się zmieniać. Dla stanu pustego użyj `@empty`.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Typowane formularze reaktywne {#pl-ng-004--typed-reactive-forms}

Używaj formularzy reaktywnych z kontrolkami `nonNullable`, aby reset nigdy nie dawał `null`. Po guardzie poprawności odczytuj wartości przez `getRawValue()`, które jest w pełni typowane.

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

### PL-NG-005 — Komponenty inteligentne i prezentacyjne {#pl-ng-005--smart-and-presentational-components}

- Komponent **inteligentny** (smart; strona lub cel trasy) wstrzykuje serwisy, jest właścicielem sygnałów i przekazuje w dół zwykłe wejścia. Komponent **prezentacyjny** otrzymuje dane przez `input()`, raportuje przez `output()` i nie wstrzykuje żadnych serwisów.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Serwisy mają jedną odpowiedzialność {#pl-ng-006--services-have-one-responsibility}

Serwis komunikuje się z jednym API, przechowuje jedną część współdzielonego stanu albo implementuje jedną regułę domenową. Komponenty nigdy nie wywołują `HttpClient` bezpośrednio. Używaj `providedIn: 'root'`, chyba że funkcja potrzebuje instancji o ograniczonym zasięgu.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Foldery funkcji i gęstość folderów {#pl-ng-007--feature-folders-and-folder-density}

- Grupuj pliki według funkcji (`features/sessions/`): komponent, szablon, serwis i spec razem. Pliki nazywaj według roli: `session-list.component.ts`, `session-api.service.ts`.
- Folder domyślnie zawiera co najwyżej **10 ręcznie utrzymywanych plików źródłowych** ([PL-TS-007](typescript.md)). Dziel według odpowiedzialności, a nie na puste zagnieżdżone foldery ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008 — Ścisłe typy, bez `any` {#pl-ng-008--strict-types-no-any}

Włącz `"strict": true` w `tsconfig.json`. Nie używaj `any` w komponentach, serwisach ani szablonach. Dane z HTTP lub magazynu traktuj jako `unknown` i zawężaj je na granicy ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Narzędzia {#pl-ng-009--tooling}

W CI uruchamiaj `ng lint` (z `@angular-eslint`), `ng build` i `ng test`. Formatuj oficjalnym formatterem, Prettierem, i sprawdzaj go przez `prettier --check`. Ostrzeżenia traktuj świadomie: napraw je albo wyłącz z podanym powodem.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
