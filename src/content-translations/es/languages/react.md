# Estilo de código React

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules), el [perfil de JavaScript](javascript.md) y el [perfil de TypeScript](typescript.md) junto con este perfil. El perfil de React está pensado para **React 19 con TypeScript en modo estricto**, empaquetado con Vite y con enrutamiento mediante react-router. Los componentes son funciones. Pureline lee un componente como un pequeño pipeline: entran las props, después las guardas, los valores derivados y, por último, sale el marcado.

## Perfil de React {#react-profile}

```text
Props
↓
Guards (loading, error, empty)
↓
Derived values
↓
Markup
```

### PL-REACT-001 — Los componentes son funciones con nombre {#pl-react-001--components-are-named-functions}

- Un componente es una función con nombre en `PascalCase`, declarada con `function` o con una función flecha `const`, y exportada por su nombre.
- Un componente es una responsabilidad. Extrae un subcomponente cuando un bloque de marcado tenga su propio estado, sus propios datos o su propio nombre en la cabeza de quien lee.
- No definas componentes dentro de otros componentes. Un componente creado durante el renderizado se vuelve a montar en cada renderizado y pierde su estado.

```tsx
export function SessionCard({ session }: SessionCardProps) {
    if (!session) {
        return null;
    }

    return <Card title={session.name} />;
}
```

### PL-REACT-002 — Guard clauses antes del marcado principal {#pl-react-002--guard-clauses-before-the-main-markup}

Trata primero los estados de carga, de error y de vacío, y retorna pronto. El camino correcto se queda en la sangría base.

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

Evita los ternarios anidados en JSX. Calcula la rama en una constante con nombre o devuélvela desde una guarda. Se permite un único ternario para una elección simple entre dos opciones dentro del JSX.

### PL-REACT-003 — Los hooks son incondicionales y de nivel superior {#pl-react-003--hooks-are-unconditional-and-top-level}

- Llama a los hooks en el nivel superior de un componente o de un hook personalizado, en el mismo orden en cada renderizado. Nunca dentro de una condición, un bucle o una función anidada.
- Un hook personalizado se llama `useX`, vive en una carpeta `hooks/` cuando se comparte y encapsula una única responsabilidad: una suscripción, una pieza de estado, una fuente de datos.
- Un hook personalizado devuelve un resultado estable y tipado. Documenta con un comentario breve solo lo que quien llama no pueda deducir del nombre y del tipo.

### PL-REACT-004 — Los valores derivados se calculan, no se almacenan {#pl-react-004--derived-values-are-computed-not-stored}

Si un valor puede calcularse a partir de las props o del estado, calcúlalo durante el renderizado. No copies las props al estado ni mantengas dos variables de estado que siempre deban coincidir.

Usa `useMemo` solo donde un coste medido lo justifique, como un cálculo costoso o un valor referencialmente estable del que dependa un hijo memoizado. No envuelvas todos los valores en `useMemo` por defecto.

### PL-REACT-005 — Los efectos se sincronizan con sistemas externos {#pl-react-005--effects-synchronise-with-external-systems}

`useEffect` sirve para sincronizarse con algo ajeno a React: una API del DOM, un temporizador, una suscripción, una conexión de red. No sirve para:

- derivar estado a partir de las props (calcúlalo en su lugar, consulta PL-REACT-004);
- responder a un evento del usuario (pon la lógica en el manejador del evento);
- inicializar un estado de la aplicación que pueda pertenecer a un componente padre.

Todo efecto que se suscriba o inicie trabajo devuelve una función de limpieza que deshace exactamente ese trabajo. Para los stores externos, prefiere `useSyncExternalStore` a un efecto que copie los valores del store al estado.

```tsx
export function useWindowWidth(): number {
    return useSyncExternalStore(subscribeToResize, readWindowWidth);
}
```

### PL-REACT-006 — Las props se tipan de forma explícita {#pl-react-006--props-are-typed-explicitly}

- Declara las props con una `interface` (o un `type` para las uniones) justo encima del componente. Llámala `<Component>Props`.
- No uses `any` para las props, el estado ni el contexto. En modo `strict`, `unknown` más el estrechamiento de tipos es la opción por defecto para los valores cuya forma aún no se conoce ([PL-TS-001](typescript.md)).
- Desestructura las props en la lista de parámetros cuando sean pocas. Con muchas props, toma un único parámetro `props` y desestructura en las primeras líneas del cuerpo.
- Usa tipos de unión para las variantes que cambian lo que renderiza el componente (`status: "idle" | "loading" | "done"`) en lugar de un conjunto de booleanos opcionales.

```tsx
interface StatusBadgeProps {
    status: "idle" | "loading" | "done";
}
```

### PL-REACT-007 — El contexto transporta solo valores transversales {#pl-react-007--context-carries-cross-cutting-values-only}

Usa el contexto para los valores que muchos componentes necesitan y que cambian poco: el usuario o propietario actual, el tema, la configuración regional, un cliente de servicio. No uses el contexto para pasar datos ordinarios a través de dos o tres niveles; pasa props en su lugar, lo que mantiene visible el flujo de datos.

Cuando necesites un contexto, exponlo mediante un hook personalizado que lance un error claro si falta el proveedor. Así, quien llama nunca ve `undefined`.

```tsx
export function useOwner(): Owner {
    const owner = useContext(OwnerContext);
    if (!owner) {
        throw new Error("useOwner must be used inside OwnerProvider");
    }
    return owner;
}
```

### PL-REACT-008 — La carga de datos tiene un dueño {#pl-react-008--data-loading-has-an-owner}

- Carga los datos de las rutas a través del router (los loaders de react-router) cuando la aplicación lo use, de modo que la carga y el tratamiento de errores vivan junto a la ruta.
- Fuera del router, usa una biblioteca de datos o un hook personalizado que gestione la cancelación, las respuestas obsoletas y el estado de error. No escribas llamadas `fetch` sueltas en los efectos sin una señal de aborto.
- Guarda los resultados de las peticiones en un único lugar. Los componentes leen el resultado; no repiten cada uno la petición.

### PL-REACT-009 — Las keys identifican elementos, no posiciones {#pl-react-009--keys-identify-items-not-positions}

- Usa un identificador estable procedente de los datos como `key` de los elementos de una lista.
- No uses el índice del array como key en listas que puedan reordenarse, filtrarse o cambiar de longitud. Las keys basadas en el índice solo son aceptables en listas estáticas que nunca cambian.

### PL-REACT-010 — El renderizado es puro {#pl-react-010--render-is-pure}

El renderizado calcula el marcado a partir de las props y el estado, y nada más. No mutes props, variables de nivel de módulo ni nodos del DOM durante el renderizado, y no inicies allí peticiones de red ni suscripciones. La aplicación se ejecuta bajo `StrictMode`, que renderiza dos veces en desarrollo para sacar a la luz los renderizados impuros. Un componente que se comporta de forma distinta en el segundo renderizado tiene un error.

Los efectos secundarios pertenecen a los manejadores de eventos y a los efectos ([PL-REACT-005](#pl-react-005--effects-synchronise-with-external-systems)).

### PL-REACT-011 — Manejadores de eventos y props de callback {#pl-react-011--event-handlers-and-callback-props}

- Llama a los manejadores dentro de un componente `handleX` (`handleSubmit`) y a las props que los reciben `onX` (`onSubmit`).
- Define un manejador en línea solo cuando sea una llamada de reenvío de una línea. Los manejadores más largos reciben un nombre, para que el cuerpo del componente siga siendo lineal.
- Pasa callbacks como props solo a los hijos que los necesiten. No envuelvas todos los manejadores en `useCallback` por defecto; úsalo donde un hijo memoizado dependa de la estabilidad referencial.

### PL-REACT-012 — Los estilos se mantienen cerca del marcado {#pl-react-012--styling-stays-close-to-the-markup}

- Las clases de utilidad (Tailwind CSS) se quedan en el marcado, junto al elemento al que dan estilo.
- Una cadena de clases que se repite en tres o más lugares se convierte en un componente con nombre o en una constante con nombre, no en una copia.
- Mantén legibles las clases condicionales: calcula la lista de clases una sola vez en una constante con nombre cuando haya más de dos condiciones.

### PL-REACT-013 — Densidad de carpetas y carpetas por funcionalidad {#pl-react-013--folder-density-and-feature-folders}

- Agrupa los componentes, los hooks y sus tests por funcionalidad (`features/sessions/`), y no por tipo de archivo en toda la aplicación, cuando una funcionalidad tenga más de un archivo.
- Las primitivas compartidas (botones, campos de entrada, layout) viven en una única carpeta `components/` o `ui/`.
- Una carpeta contiene como máximo **10 archivos fuente mantenidos a mano** por defecto ([PL-TS-007](typescript.md)). Son umbrales de revisión, no límites estrictos: divide según las responsabilidades, no en carpetas anidadas sin sentido.
- Un archivo con varios componentes que comparten estado es cohesivo. Mantenlos juntos ([PL-STRUCT-003](../core/structure.md)).

### PL-REACT-014 — El enrutamiento es un límite {#pl-react-014--routing-is-a-boundary}

Las rutas asocian URL con pantallas. Mantén las definiciones de rutas en un único lugar. Un componente de ruta obtiene o recibe sus datos en el límite y pasa props simples a los componentes de presentación. Los componentes de presentación no leen la URL por sí mismos.
