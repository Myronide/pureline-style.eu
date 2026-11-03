# React Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules), the [JavaScript profile](javascript.md), and the [TypeScript profile](typescript.md) together with this profile. The React profile targets **React 19 with TypeScript in strict mode**, bundled with Vite, and routed with react-router. Components are functions. Pureline reads a component as a small pipeline: props in, guards, derived values, markup out.

## React Profile

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Components Are Named Functions

- A component is a named function in `PascalCase`, declared with `function` or a `const` arrow function, and exported by name.
- One component is one responsibility. Extract a sub-component when a block of markup has its own state, its own data, or its own name in the reader's head.
- Do not define components inside other components. A component created during render is remounted on every render and loses its state.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002. Clausole di guardia prima del contrassegno principale le mercieeeeeeeeeeeeeeeeeeeeeeeee

Handle loading, error, and empty states first and return early. The successful path stays at the base indentation.

```tsx
export function UserPanel({ query }: UserPanelProps) {
    if (query.isPending) {
        return <Spinner />;
    }

    if (query.isError) {
        return <ErrorMessage error={query.error} />;
    }

    return <UserDetails user={query.data} />;
}
```

Avoid nested ternaries in JSX. Compute the branch into a named constant or return it from a guard. A single ternary for a simple two-way choice inside JSX is allowed.

```text
− Conditional JSX                            │ ✓ Pureline
function Profile({ user }: ProfileProps) {   │ function Profile({ user }: ProfileProps) {
    return user === null                     │     if (user === null) {
        ? <SignInPrompt />                   │         return <SignInPrompt />;
        : <ProfileCard user={user} />;       │     }
}                                            │
                                             │     return <ProfileCard user={user} />;
                                             │ }
```

### PL-REACT-003. I ganci sono senza condizioni e di livello superioreorato triossido di sodio lassassa

- Call hooks at the top level of a component or custom hook, in the same order on every render. Never inside a condition, loop, or nested function.
- A custom hook is named `useX`, lives in a `hooks/` folder when shared, and encapsulates one concern: one subscription, one piece of state, one data source.
- A custom hook returns a stable, typed result. Document with a short comment only what the caller cannot infer from the name and type.

### PL-REACT-004. I valori derivati sono calcolati, non memorizzati

If a value can be computed from props or state, compute it during render. Do not copy props into state, and do not keep two state variables that must always agree.

Usa `useMemo` solo quando un costo misurato lo giustifica, come un calcolo costoso o un valore referenzialmente stabile da cui dipende un figlio memoizzato. Non avvolgere tutti i valori in `useMemo` per impostazione predefinita..

### PL-REACT-005. Effetti Sincronizza con i sistemi esterni

`useEffect` è per la sincronizzazione con qualcosa di esterno React: una API DOM, un timer, un abbonamento, una connessione di rete. It is not for:

- deriving state from props (compute it instead, see PL-REACT-004);
- responding to a user event (put the logic in the event handler);
- initialising application state that a parent can own.

Every effect that subscribes or starts work returns a cleanup function that undoes exactly that work. For external stores, prefer `useSyncExternalStore` over an effect that copies store values into state.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006. I Prop sono digitati esplicitamente.l,..

- Declare props with an `interface` (or a `type` for unions) directly above the component. Name it `<Component>Props`.
- Do not use `any` for props, state, or context. Under `strict` mode, `unknown` plus narrowing is the default for values whose shape is not known yet ([PL-TS-001](typescript.md)).
- Destructure props in the parameter list when there are few of them. With many props, take one `props` parameter and destructure in the first lines of the body.
- Use union types for variants that change what the component renders (`status: "idle" | "loading" | "done"`) rather than a set of optional booleans.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007. Contesto Solo valori di taglio incrociato di brie

Use context for values that many components need and that change rarely: the current user or owner, theme, locale, a service client. Do not use context to pass ordinary data through two or three levels; pass props instead, which keeps the data flow visible.

When a context is needed, expose it through a custom hook that throws a clear error when the provider is missing. Callers then never see `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008. Il caricamento dei dati ha un proprietario

- Load route data through the router (loaders in react-router) where the app uses it, so that loading and error handling live with the route.
- Outside the router, use a data library or a custom hook that handles cancellation, stale responses, and error state. Do not write bare `fetch` calls in effects without an abort signal.
- Keep fetch results in one place. Components read the result; they do not each repeat the request.

### PL-REACT-009 — Keys Identify Items, Not Positions

- Use a stable identifier from the data as the `key` of list items.
- Do not use the array index as the key for lists that can be reordered, filtered, or changed in length. Index keys are acceptable only for static lists that never change.

### PL-REACT-010 — Render Is Pure

Rendering computes markup from props and state and nothing else. Do not mutate props, module-level variables, or DOM nodes during render, and do not start network requests or subscriptions there. The app runs under `StrictMode`, which renders twice in development to expose impure renders. A component that behaves differently on the second render is a bug.

Side effects belong in event handlers and effects ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011 — Event Handlers and Callback Props

- Name handlers inside a component `handleX` (`handleSubmit`) and props that receive them `onX` (`onSubmit`).
- Define a handler inline only when it is a one-line forwarding call. Longer handlers get a name, so the component body stays linear.
- Pass callbacks as props only to children that need them. Do not wrap every handler in `useCallback` by default; use it where a memoized child depends on referential stability.

### PL-REACT-012. Stile rimane vicino al Markup''

- Utility classes (Tailwind CSS) stay in the markup next to the element they style.
- A class string repeated in three or more places becomes a named component or a named constant, not a copy.
- Keep conditional classes readable: compute the class list once in a named constant when it has more than two conditions.

### PL-REACT-013 — Folder Density and Feature Folders

- Componenti di gruppo, ganci e i loro test per funzionalità (`features/sessions/`), non per tipo di file in tutta l'applicazione, quando una funzione ha più di un file...
- Pritivi condivisi (pulsanti, ingressi, layout) vivono in una cartella `components/` o `ui/`...
- Una cartella contiene al massimo i file sorgente mantenuti a mano **10** per impostazione predefinita ([PL-TS-007](typescript.md)).. Soglie di riesame, non limiti duri: split along responsibilities, not into meaningless nested folders.
- A file with several components that share state is cohesive. Keep them together ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014. Routing è un confine

Routes map URLs to screens. Keep route definitions in one place. A route component fetches or receives its data at the boundary and passes plain props down into presentational components. Presentational components do not read the URL themselves.
