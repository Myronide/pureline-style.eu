# Estilo de código QML

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [compartidas](../README.md#shared-rules) con este perfil. El LMC es de carácter declarativo: un archivo describe un árbol de objetos, sus propiedades y sus enlaces. El JavaScript dentro de QML es para pequeñas expresiones y manejadores, y el [perfil de JavaScript](javascript.md) se aplica a cada bloque en él. Pureline QML se dirige a **Qt 6** con Qt Quick.

## Perfil QML

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Un objeto raíz por archivo

Cada archivo `.qml` define un componente cuyo nombre es el nombre del archivo (`SessionCard.qml` define `SessionCard`). Coloca componentes de ayuda anidados en sus propios archivos cuando se reutilicen; mantén un ayudante en línea sólo cuando nada más lo use.

### PL-QML-002 — Denominación

- Archivos de componentes y nombres de tipo: `PascalCase`.
- Propiedades, señales, funciones e ids: `lowerCamelCase`.
- Los Ids nombran el papel del objeto (`titleLabel`, `retryButton`), nunca su tipo o posición (`text1`, `rect2`).
- Los controladores de señal siguen el nombre de la señal: `onClicked`, `onAccepted`.

### PL-QML-003 — Declarar interfaces explícitamente

Declarar las entradas de un componente con `required property` y un tipo. Utilice `readonly property` para valores que el componente calcula. Habilitar `pragma ComponentBehavior: Bound` para que los ids se resuelvan a través de un alcance explícito.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Encuadernaciones sobre asignación imperativa

Estado expreso como enlace (`visible: user.active`). No copie valores en `Component.onCompleted` o en los manejadores cuando una unión los mantendría correctos. Asignar imperativamente sólo para una acción única, como iniciar una animación o enviar una solicitud.

### PL-QML-005 — Los guardias son enlaces o retornos tempranos

Utilice `visible`, `enabled` y `Loader.active` para cambiar de rama. En una función JavaScript, regrese temprano en lugar de anidar la ruta principal dentro de una condición.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006: mantener pequeñas las expresiones

Una unión tiene una expresión de a lo sumo una condicional y una llamada corta. Mover la lógica más larga a una función con nombre o un objeto de motor C++ / Python. Nested ternaries are not Pureline.

Keep a short binding on the property that uses it. Name the condition
when multiple controls share it.

```text
Named property                          │ ✓ Pureline
Item {                                  │ Item {
    id: root                            │     id: root
                                        │
    readonly property bool canSave:     │     Button {
        form.valid && !form.saving      │         text: qsTr("Save")
                                        │         enabled: form.valid
    Button {                            │             && !form.saving
        text: qsTr("Save")              │     }
        enabled: root.canSave           │ }
    }                                   │
}                                       │
```

### PL-QML-007 — Orden de propiedad agrupa el objeto

Escriba las propiedades de un objeto en este orden, con una línea en blanco entre grupos: identidad (`id`), propiedades requeridas y públicas, fijaciones, objetos hijos, manejadores de señales, funciones.

### PL-QML-008 — La disposición es Útil

Utilice tipos `Layout` (`RowLayout`, `ColumnLayout`, `GridLayout`) y anclajes para su colocación. No codifique valores absolutos de `x` y `y` para contenidos que deben adaptarse al tamaño. Los tamaños codificados en formato duro pertenecen a los tokens de diseño en un singleton `Theme`.

### PL-QML-009: tema y temas en un solo lugar

Los colores, espaciados y tamaños de fuentes provienen de un solotón `Theme` (`pragma Singleton`). Los componentes leen fichas; nunca repiten valores literales.

### PL-QML-010 — Densidad de la carpeta

Una carpeta de componentes QML contiene como máximo archivos **10** por defecto. Agrupe los componentes por función (`views/session/`), y mantenga los controles compartidos en una carpeta `controls/`.

### PL-QML-011 — Herramientas

Ejecute `qmllint` (con las advertencias `--unqualified` habilitadas) y la herramienta `qmlformat` en CI. Prueba el comportamiento con `QtTest` y mantén las advertencias intencionales.
