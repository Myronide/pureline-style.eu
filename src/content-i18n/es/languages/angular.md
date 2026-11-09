# Estilo de código angular

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [core compartido](../README.md#shared-rules), [JavaScript profile](javascript.md), y [TypeScript profile](typescript.md) junto con este perfil. El perfil angular apunta a **Angular 17 o más tarde** con TypeScript en modo estricto. Un componente se lee como un pequeño gasoducto: entradas, guardas en la plantilla, valores derivados, marcado.

## Perfil angular

### PL-NG-001 — Componentes independientes y `inject()`

Cada componente es independiente (por defecto desde Angular 19; conjunto `standalone: true` en 17 y 18). Declarar las pertenencias con `inject()` como campos `private readonly`, por lo que el cuerpo de clase comienza con su estado, no con un gremio.

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

### PL-NG-002 — Estado de retención de señales, OnPush lo rende

- `signal()` mantiene el estado de escritura, `computed()` deriva valores, `input()` y `output()` forman la interfaz; nunca mantenga un valor derivado en un segundo campo. Cada componente establece `ChangeDetectionStrategy.OnPush`, por lo que las señales leen en la plantilla las actualizaciones.

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

Cuando un valor de plantilla se deriva de una señal, prefiere `computed()` sobre
un getter que repite el cálculo en cada acceso.

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

### PL-NG-003 — Flujo de control integrado con `track`

Utilice `@if`, `@for` y `@switch`; no utilice `*ngIf` o `*ngFor` en un código nuevo. Cada `@for` rastrea un identificador estable de los datos, nunca `$index` para listas que pueden cambiar. Utilice `@empty` para el estado vacío.

```html
@for (session of sessions(); track session.id) {
    <app-session-card [session]="session" />
} @empty {
    <p>No sessions yet.</p>
}
```

### PL-NG-004 — Formularios de reactividad tipo

Use formularios reactivos con los controles `nonNullable`, por lo que un restablecimiento nunca produce `null`. Después de la guardia de validez, lea los valores con `getRawValue()`, que está completamente tecleado.

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

### PL-NG-005 — Componentes inteligentes y de presentación

- Un componente **smart** (una página o un destino de ruta) inyecta servicios, posee las señales y pasa entradas simples hacia abajo. Un componente **1985tional** recibe datos a través de `input()`, informa a través de `output()`, y no inyecta servicios.

```ts
export class SessionListViewComponent {
    readonly items = input.required<Session[]>();
    readonly select = output<string>();
}
```

### PL-NG-006 — Los servicios tienen una responsabilidad

Un servicio habla con una API, mantiene un estado compartido o implementa una regla de dominio. Los componentes nunca llaman a `HttpClient` directamente. Use `providedIn: 'root'` a menos que una característica necesite una instancia con alcance.

```ts
@Injectable({ providedIn: 'root' })
export class SessionApi {
    private readonly http = inject(HttpClient);
    list(): Observable<Session[]> {
        return this.http.get<Session[]>('/api/sessions');
    }
}
```

### PL-NG-007 — Carpetas de características y densidad de carpeta

- Agrupar archivos por función (`features/sessions/`): componente, plantilla, servicio y especificaciones juntos. Nombre de los archivos por rol: `session-list.component.ts`, `session-api.service.ts`.
- Una carpeta contiene como máximo archivos fuente **10 mantenidos a mano** por defecto ([PL-TS-007](typescript.md)]. Dividir a lo largo de las responsabilidades, no en carpetas vacías anidadas [PL-STRUCT-003](../core/structure.md)].

### PL-NG-008 — Tipos estrictos, no `any`

Habilitar `"strict": true` en `tsconfig.json`. No utilice `any` en componentes, servicios o plantillas. Tratar los datos HTTP o de almacenamiento como `unknown` y reducirlo en el límite ([PL-TS-001](typescript.md)].

```ts
export function isSession(value: unknown): value is Session {
    return typeof value === 'object' && value !== null && 'id' in value;
}
```

### PL-NG-009 — Herramientas

Ejecute `ng lint` (desde `@angular-eslint`), `ng build` y `ng test` en CI. Formatee con el formulario oficial, Prettier, y compruébelo con `prettier --check`. Mantenga las advertencias intencionales: Arréglalos o supéralos con una razón.

```bash
ng build --configuration production
ng lint
npx prettier --check .
```
