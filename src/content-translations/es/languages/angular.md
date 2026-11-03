# Estilo de código Angular

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules), el [perfil de JavaScript](javascript.md) y el [perfil de TypeScript](typescript.md) junto con este perfil. El perfil de Angular está pensado para **Angular 17 o posterior** con TypeScript en modo estricto. Un componente se lee como un pequeño pipeline: entran los inputs, después las guardas en la plantilla y los valores derivados, y sale el marcado.

## Perfil de Angular {#angular-profile}

### PL-NG-001 — Componentes standalone e `inject()` {#pl-ng-001--standalone-components-and-inject}

Todos los componentes son standalone (por defecto desde Angular 19; en las versiones 17 y 18, establece `standalone: true`). Declara las dependencias con `inject()` como campos `private readonly`, de modo que el cuerpo de la clase empiece con su estado y no con un constructor.

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

### PL-NG-002 — Los signals guardan el estado, OnPush lo renderiza {#pl-ng-002--signals-hold-state-onpush-renders-it}

- `signal()` guarda el estado escribible, `computed()` deriva valores, e `input()` y `output()` forman la interfaz; no mantengas nunca un valor derivado en un segundo campo. Todos los componentes establecen `ChangeDetectionStrategy.OnPush`, de modo que los signals leídos en la plantilla impulsan las actualizaciones.

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

### PL-NG-003 — Control de flujo integrado con `track` {#pl-ng-003--built-in-control-flow-with-track}

Usa `@if`, `@for` y `@switch`; no uses `*ngIf` ni `*ngFor` en código nuevo. Cada `@for` hace un seguimiento (track) de un identificador estable de los datos, nunca de `$index` en listas que puedan cambiar. Usa `@empty` para el estado vacío.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Formularios reactivos tipados {#pl-ng-004--typed-reactive-forms}

Usa formularios reactivos con controles `nonNullable`, para que un restablecimiento nunca produzca `null`. Tras la guarda de validez, lee los valores con `getRawValue()`, que está completamente tipado.

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

### PL-NG-005 — Componentes inteligentes y de presentación {#pl-ng-005--smart-and-presentational-components}

- Un componente **inteligente** (smart; una página o el destino de una ruta) inyecta servicios, es dueño de los signals y pasa inputs simples hacia abajo. Un componente de **presentación** recibe los datos mediante `input()`, notifica mediante `output()` y no inyecta servicios.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Los servicios tienen una única responsabilidad {#pl-ng-006--services-have-one-responsibility}

Un servicio habla con una API, guarda una pieza de estado compartido o implementa una regla de dominio. Los componentes nunca llaman directamente a `HttpClient`. Usa `providedIn: 'root'` salvo que una funcionalidad necesite una instancia con ámbito propio.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Carpetas por funcionalidad y densidad de carpetas {#pl-ng-007--feature-folders-and-folder-density}

- Agrupa los archivos por funcionalidad (`features/sessions/`): componente, plantilla, servicio y spec juntos. Nombra los archivos según su función: `session-list.component.ts`, `session-api.service.ts`.
- Una carpeta contiene como máximo **10 archivos fuente mantenidos a mano** por defecto ([PL-TS-007](typescript.md)). Divide según las responsabilidades, no en carpetas anidadas vacías ([PL-STRUCT-003](../core/structure.md)).

### PL-NG-008 — Tipos estrictos, sin `any` {#pl-ng-008--strict-types-no-any}

Activa `"strict": true` en `tsconfig.json`. No uses `any` en componentes, servicios ni plantillas. Trata los datos de HTTP o de almacenamiento como `unknown` y estréchalos en el límite ([PL-TS-001](typescript.md)).

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Herramientas {#pl-ng-009--tooling}

Ejecuta `ng lint` (de `@angular-eslint`), `ng build` y `ng test` en la CI. Da formato con el formateador oficial, Prettier, y compruébalo con `prettier --check`. Mantén las advertencias intencionadas: corrígelas o suprímelas indicando un motivo.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
