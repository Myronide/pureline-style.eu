# Estilo de código QML

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) con este perfil. QML es declarativo: un archivo describe un árbol de objetos, sus propiedades y sus bindings. El JavaScript dentro de QML es para expresiones y manejadores pequeños, y el [perfil de JavaScript](javascript.md) se aplica a cada bloque de JavaScript que contenga. Pureline QML está pensado para **Qt 6** con Qt Quick.

## Perfil de QML {#qml-profile}

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Un objeto raíz por archivo {#pl-qml-001--one-root-object-per-file}

Cada archivo `.qml` define un componente cuyo nombre es el del archivo (`SessionCard.qml` define `SessionCard`). Pon los componentes auxiliares anidados en sus propios archivos cuando se reutilicen; mantén un auxiliar en línea solo cuando nada más lo use.

### PL-QML-002 — Nombres {#pl-qml-002--naming}

- Archivos de componentes y nombres de tipos: `PascalCase`.
- Propiedades, señales, funciones e ids: `lowerCamelCase`.
- Los ids nombran el papel del objeto (`titleLabel`, `retryButton`), nunca su tipo ni su posición (`text1`, `rect2`).
- Los manejadores de señales siguen el nombre de la señal: `onClicked`, `onAccepted`.

### PL-QML-003 — Declara las interfaces de forma explícita {#pl-qml-003--declare-interfaces-explicitly}

Declara las entradas de un componente con `required property` y un tipo. Usa `readonly property` para los valores que calcula el propio componente. Activa `pragma ComponentBehavior: Bound` para que los ids se resuelvan mediante un ámbito explícito.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Bindings en lugar de asignación imperativa {#pl-qml-004--bindings-over-imperative-assignment}

Expresa el estado como un binding (`visible: user.active`). No copies valores en `Component.onCompleted` ni en los manejadores cuando un binding los mantendría correctos. Asigna de forma imperativa solo para una acción puntual, como iniciar una animación o enviar una petición.

### PL-QML-005 — Las guardas son bindings o retornos tempranos {#pl-qml-005--guards-are-bindings-or-early-returns}

Usa `visible`, `enabled` y `Loader.active` para alternar entre ramas. En una función de JavaScript, retorna pronto en lugar de anidar el camino principal dentro de una condición.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Mantén pequeñas las expresiones {#pl-qml-006--keep-expressions-small}

Un binding contiene una expresión con, como máximo, un condicional y una llamada corta. Traslada la lógica más larga a una función con nombre o a un objeto de backend en C++ / Python. Los ternarios anidados no son Pureline.

### PL-QML-007 — El orden de las propiedades agrupa el objeto {#pl-qml-007--property-order-groups-the-object}

Escribe las propiedades de un objeto en este orden, con una línea en blanco entre grupos: identidad (`id`), propiedades obligatorias y públicas, bindings, objetos hijos, manejadores de señales, funciones.

### PL-QML-008 — El layout es declarativo {#pl-qml-008--layout-is-declarative}

Usa los tipos `Layout` (`RowLayout`, `ColumnLayout`, `GridLayout`) y los anchors para la colocación. No fijes valores absolutos de `x` e `y` en el código para contenido que deba adaptarse al tamaño. Los tamaños fijos pertenecen a los tokens de diseño de un singleton `Theme`.

### PL-QML-009 — El tema y los tokens, en un solo lugar {#pl-qml-009--theme-and-tokens-in-one-place}

Los colores, los espaciados y los tamaños de fuente proceden de un único singleton `Theme` (`pragma Singleton`). Los componentes leen los tokens; nunca repiten valores literales.

### PL-QML-010 — Densidad de carpetas {#pl-qml-010--folder-density}

Una carpeta de componentes QML contiene como máximo **10 archivos** por defecto. Agrupa los componentes por funcionalidad (`views/session/`) y mantén los controles compartidos en una única carpeta `controls/`.

### PL-QML-011 — Herramientas {#pl-qml-011--tooling}

Ejecuta `qmllint` (con las advertencias `--unqualified` activadas) y la herramienta `qmlformat` en la CI. Prueba el comportamiento con `QtTest` y mantén las advertencias intencionadas.
