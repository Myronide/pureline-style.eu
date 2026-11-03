# Reaccionar estilo de código

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [core compartido](../README.md#shared-rules), [JavaScript profile](javascript.md), y [TypeScript profile](typescript.md) junto con este perfil. El perfil de React está dirigido a **React 19 con TypeScript en modo estricto**, junto con Vite y enrutado con react-router. Los componentes son funciones. Pureline lee un componente como un pequeño oleoducto: utilería, guardias, valores derivados, marcado..

## Perfil de reacción

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Los componentes se denominan funciones

- Un componente es una función nombrada en `PascalCase`, declarada con `function` o una función de flecha `const`, y exportada por nombre.
- Un componente es una responsabilidad. Extraer un subcomponente cuando un bloque de marcado tiene su propio estado, sus propios datos o su propio nombre en la cabeza del lector.
- No definir componentes dentro de otros componentes. Un componente creado durante la renderización se vuelve a montar en cada renderizado y pierde su estado.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Cláusulas de protección antes del marcado principal

Maneje primero los estados de carga, error y vacío y regrese temprano. El camino acertado permanece en la sangría de la base.

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

Evite las tumbas anidadas en JSX. Perforar la rama en una constante llamada o devolverla de un guardia. Se permite una sola opción de dos vías en JSX.

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

### PL-REACT-003 — Los ganchos son incondicionales y de alto nivel

- Ganchos de llamada en el nivel superior de un componente o gancho personalizado, en el mismo orden en cada renderizado. Nunca dentro de una condición, asa o función anidada.
- Un gancho personalizado se llama `useX`, vive en una carpeta `hooks/` cuando se comparte, y encapsula una preocupación: una suscripción, un estado, una fuente de datos.
- Un gancho personalizado devuelve un resultado estable y tecleado. Documente con un breve comentario sólo lo que el que llama no puede deducir del nombre y tipo.

### PL-REACT-004 — Los valores derivados se computan, no se almacenan

Si un valor puede ser calculado a partir de props o estado, compórtelo durante la renderización. No copie los accesorios en estado, y no mantenga dos variables de estado que siempre deben estar de acuerdo.

Use `useMemo` sólo cuando un costo medido lo justifique, como un cálculo costoso o un valor referencialmente estable del que depende un niño memoizado. No envuelva todos los valores en `useMemo` por defecto.

### PL-REACT-005 — Efectos sincronizarse con sistemas externos

`useEffect` es para sincronizar con algo fuera de React: un API DOM, un temporizador, una suscripción, una conexión de red. No es para:

- el estado derivado de los elementos de apoyo (computarlo en su lugar, véase PL-REACT-004);
- responder a un evento del usuario (poner la lógica en el controlador del evento);
- La solicitud inicial de un padre puede ser propietaria.

Cada efecto que se suscribe o comienza a trabajar devuelve una función de limpieza que deshace exactamente ese trabajo. Para tiendas externas, prefiera `useSyncExternalStore` sobre un efecto que las copias almacenan valores en estado.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Los bienes se escriben explícitamente

- Declarar accesorios con un `interface` (o un `type` para los sindicatos) directamente por encima del componente. Llámalo `<Component>Props`.
- No utilice `any` para accesorios, estado o contexto. Bajo el modo `strict`, `unknown` plus strancing es el valor predeterminado para valores cuya forma no se conoce todavía ([PL-TS-001](typescript.md)].
- Deestructurar los elementos de apoyo en la lista de parámetros cuando hay pocos de ellos. Con muchos accesorios, tomar un parámetro `props` y desestructurar en las primeras líneas del cuerpo.
- Use tipos de unión para variantes que cambien lo que el componente renderiza (`status: "idle" | "loading" | "done"`) en lugar de un conjunto de booleanos opcionales.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — Contexto solo transporta valores cruzados

Use contexto para valores que muchos componentes necesitan y que raramente cambian: el usuario actual o propietario, tema, localización, un cliente de servicio. No utilice el contexto para pasar datos ordinarios a través de dos o tres niveles; pase props en su lugar, lo que mantiene el flujo de datos visible.

Cuando se necesita un contexto, expóngalo a través de un gancho personalizado que arroja un error claro cuando el proveedor está faltando. Callers then never see `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — Carga de datos tiene un propietario

- Cargar datos de ruta a través del router (cargadores en react-router) donde la aplicación lo utiliza, de modo que la carga y la manipulación de errores viven con la ruta.
- Fuera del router, utilice una biblioteca de datos o un gancho personalizado que maneja la cancelación, las respuestas rancios y el estado de error. No escriba llamadas `fetch` en los efectos sin una señal de interrupción.
- Sigue buscando resultados en un solo lugar. Los componentes leen el resultado; no repiten cada uno la solicitud.

### PL-REACT-009 — Las claves identifican elementos, no posiciones

- Utilice un identificador estable de los datos como el `key` de los elementos de la lista.
- No utilice el índice de array como la clave para las listas que pueden ser reordenadas, filtradas o cambiadas en longitud. Las claves de índice son aceptables sólo para listas estáticas que nunca cambian.

### PL-REACT-010 — Render es puro

Renderizar calcula el marcado de los accesorios y el estado y nada más. No compile props, variables de nivel de módulo o nodos DOM durante la renderización, y no inicie las peticiones de red o suscripciones allí. La aplicación se ejecuta bajo `StrictMode`, que se renderiza dos veces en desarrollo para exponer los renders de calidad. Un componente que se comporta de manera diferente en la segunda render es un bug.

Los efectos secundarios pertenecen a los manipuladores de eventos y a los efectos [[PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)].

### PL-REACT-011 — Manejadores de eventos y dispositivos de llamada de vuelta

- Nombre de los manipuladores dentro de un componente `handleX` (`handleSubmit`) y de los accesorios que los reciben `onX` (`onSubmit`).
- Definir un controlador en línea sólo cuando se trata de una llamada de reenvío de una línea. Los manipuladores más largos obtienen un nombre, por lo que el cuerpo del componente permanece lineal.
- Pase las llamadas como utilería sólo a los niños que las necesitan. No envuelva todos los manejadores en `useCallback` por defecto; utilícelo cuando un niño memoizado depende de la estabilidad referencial.

### PL-REACT-012: El estilo se mantiene cerca del Markup

- Las clases de utilidad (Tailwind CSS) permanecen en el marcado junto al elemento que estilo.
- Una cadena de clase repetida en tres o más lugares se convierte en un componente nombrado o una constante nombrada, no en una copia.
- Mantener clases condicionales legibles: calcular la lista de clases una vez en una constante nombrada cuando tiene más de dos condiciones.

### PL-REACT-013 — Carpetas de densidad y características

- Agrupar componentes, ganchos y sus pruebas por función (`features/sessions/`), no por tipo de archivo en toda la aplicación, cuando una característica tiene más de un archivo.
- Los primitivos compartidos (botones, entradas, diseño) viven en una carpeta `components/` o `ui/`.
- Una carpeta contiene como máximo archivos fuente **10 mantenidos a mano** por defecto ([PL-TS-007](typescript.md)]. Límites de revisión, no límites de dureza: dividir a lo largo de las responsabilidades, no en carpetas sin sentido anidado.
- Un archivo con varios componentes que comparten estado es cohesivo. Manténgalos juntos ([PL-STRUCT-003](../core/structure.md)].

### PL-REACT-014: El enrutamiento es una frontera

Rutas mapean URLs a las pantallas. Mantenga las definiciones de ruta en un solo lugar. Un componente de ruta obtiene o recibe sus datos en el límite y pasa la punta plana hacia abajo en los componentes de presentación. Los componentes de presentación no leen la URL ellos mismos.
