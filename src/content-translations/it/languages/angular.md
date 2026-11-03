# Stile del codice Angular

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules), il [profilo JavaScript](javascript.md) e il [profilo TypeScript](typescript.md) insieme a questo profilo. Il profilo Angular ha come obiettivo **Angular 17 o successivo** con TypeScript in modalità strict. Un componente si legge come una piccola pipeline: input in ingresso, guardie nel template, valori derivati, markup in uscita.

## Profilo Angular {#angular-profile}

### PL-NG-001 — Componenti standalone e `inject()` {#pl-ng-001--standalone-components-and-inject}

Ogni componente è standalone (predefinito da Angular 19; imposta `standalone: true` su 17 e 18). Dichiara le dipendenze con `inject()` come campi `private readonly`, così il corpo della classe inizia con il proprio stato e non con un costruttore.

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

### PL-NG-002 — I signal contengono lo stato, OnPush lo renderizza {#pl-ng-002--signals-hold-state-onpush-renders-it}

- `signal()` contiene lo stato scrivibile, `computed()` ricava i valori derivati, `input()` e `output()` formano l'interfaccia; non tenere mai un valore derivato in un secondo campo. Ogni componente imposta `ChangeDetectionStrategy.OnPush`, così i signal letti nel template guidano gli aggiornamenti.

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

### PL-NG-003 — Controllo di flusso integrato con `track` {#pl-ng-003--built-in-control-flow-with-track}

Usa `@if`, `@for` e `@switch`; non usare `*ngIf` o `*ngFor` nel nuovo codice. Ogni `@for` tiene traccia di un identificatore stabile preso dai dati, mai di `$index` per le liste che possono cambiare. Usa `@empty` per lo stato vuoto.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Reactive form tipizzati {#pl-ng-004--typed-reactive-forms}

Usa i reactive form con controlli `nonNullable`, così un reset non produce mai `null`. Dopo la guardia sulla validità, leggi i valori con `getRawValue()`, che è completamente tipizzato.

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

### PL-NG-005 — Componenti smart e di presentazione {#pl-ng-005--smart-and-presentational-components}

- Un componente **smart** (una pagina o la destinazione di una route) inietta i servizi, possiede i signal e passa semplici input verso il basso. Un componente **di presentazione** riceve i dati tramite `input()`, comunica tramite `output()` e non inietta servizi.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — I servizi hanno una sola responsabilità {#pl-ng-006--services-have-one-responsibility}

Un servizio comunica con una sola API, contiene un solo pezzo di stato condiviso o implementa una sola regola di dominio. I componenti non chiamano mai direttamente `HttpClient`. Usa `providedIn: 'root'`, a meno che una funzionalità non richieda un'istanza con ambito limitato.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Cartelle per funzionalità e densità delle cartelle {#pl-ng-007--feature-folders-and-folder-density}

- Raggruppa i file per funzionalità (`features/sessions/`): componente, template, servizio e spec insieme. Dai ai file un nome in base al ruolo: `session-list.component.ts`, `session-api.service.ts`.
- Una cartella contiene al massimo **10 file sorgente mantenuti a mano** per impostazione predefinita ([PL-TS-007](typescript.md)). Dividi in base alle responsabilità, non in cartelle annidate vuote ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008 — Tipi strict, niente `any` {#pl-ng-008--strict-types-no-any}

Abilita `"strict": true` in `tsconfig.json`. Non usare `any` in componenti, servizi o template. Tratta i dati HTTP o di storage come `unknown` e restringili (narrowing) al confine ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Strumenti {#pl-ng-009--tooling}

Esegui `ng lint` (da `@angular-eslint`), `ng build` e `ng test` nella CI. Formatta con il formatter ufficiale, Prettier, e verifica con `prettier --check`. Mantieni intenzionali gli avvisi: correggili oppure sopprimili con un motivo dichiarato.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
