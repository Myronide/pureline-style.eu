# Angular Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules), het [JavaScript profiel](javascript.md) en het [TypeScript profiel](typescript.md) toe samen met dit profiel. The Angular profile targets **Angular 17 or later** with TypeScript in strict mode. A component reads as a small pipeline: inputs in, guards in the template, derived values, markup out.

## Angular Profile

### PL-NG-001 — Standalone Components and `inject()`

Every component is standalone (default from Angular 19; set `standalone: true` on 17 and 18). Declare dependencies with `inject()` as `private readonly` fields, so the class body starts with its state, not with a constructor.

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

### PL-NG-002 — Signals Hold State, OnPush Renders It

- `signal()` holds writable state, `computed()` derives values, `input()` and `output()` form the interface; never keep a derived value in a second field. Every component sets `ChangeDetectionStrategy.OnPush`, so signals read in the template drive the updates.

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

### PL-NG-003 — Built-in Control Flow with `track`

Use `@if`, `@for`, and `@switch`; do not use `*ngIf` or `*ngFor` in new code. Every `@for` tracks a stable identifier from the data, never `$index` for lists that can change. Use `@empty` for the empty state.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Typed Reactive Forms

Use reactive forms with `nonNullable` controls, so a reset never yields `null`. After the validity guard, read values with `getRawValue()`, which is fully typed.

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

### PL-NG-005 — Smart and Presentational Components

- A **smart** component (a page or route target) injects services, owns the signals, and passes plain inputs down. A **presentational** component receives data through `input()`, reports through `output()`, and injects no services.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Services Have One Responsibility

A service talks to one API, holds one piece of shared state, or implements one domain rule. Components never call `HttpClient` directly. Use `providedIn: 'root'` unless a feature needs a scoped instance.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Feature Folders and Folder Density

- Group files by feature (`features/sessions/`): component, template, service, and spec together. Name files by role: `session-list.component.ts`, `session-api.service.ts`.
- A folder holds at most **10 hand-maintained source files** by default ([PL-TS-007](typescript.md)). Split along responsibilities, not into empty nested folders ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008 — Strict Types, No `any`

Enable `"strict": true` in `tsconfig.json`. Do not use `any` in components, services, or templates. Treat HTTP or storage data as `unknown` and narrow it at the boundary ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009. Gereedschape

Run `ng lint` (from `@angular-eslint`), `ng build`, and `ng test` in CI. Format with the official formatter, Prettier, and check it with `prettier --check`. Keep warnings intentional: fix them or suppress them with a stated reason.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
