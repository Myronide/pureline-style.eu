# QML Code Style

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) with this profile. QML is declarative: a file describes an object tree, its properties, and its bindings. JavaScript inside QML is for small expressions and handlers, and the [JavaScript profile](javascript.md) applies to every block in it. Pureline QML targets **Qt 6** with Qt Quick.

## QML Profile

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — One Root Object per File

Each `.qml` file defines one component whose name is the file name (`SessionCard.qml` defines `SessionCard`). Put nested helper components in their own files when they are reused; keep a helper inline only when nothing else uses it.

### PL-QML-002 — Naming

- Component files and type names: `PascalCase`.
- Properties, signals, functions, and ids: `lowerCamelCase`.
- Ids name the role of the object (`titleLabel`, `retryButton`), never its type or position (`text1`, `rect2`).
- Signal handlers follow the signal name: `onClicked`, `onAccepted`.

### PL-QML-003 — Declare Interfaces Explicitly

Declare the inputs of a component with `required property` and a type. Use `readonly property` for values the component computes. Enable `pragma ComponentBehavior: Bound` so that ids resolve through explicit scope.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Bindings Over Imperative Assignment

Express state as a binding (`visible: user.active`). Do not copy values in `Component.onCompleted` or in handlers when a binding would keep them correct. Assign imperatively only for a one-time action, such as starting an animation or sending a request.

### PL-QML-005 — Guards Are Bindings or Early Returns

Use `visible`, `enabled`, and `Loader.active` to switch branches. In a JavaScript function, return early instead of nesting the main path inside a condition.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Keep Expressions Small

A binding holds one expression of at most one conditional and a short call. Move longer logic into a named function or a C++ / Python backend object. Nested ternaries are not Pureline.

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

### PL-QML-007 — Property Order Groups the Object

Write the properties of an object in this order, with a blank line between groups: identity (`id`), required and public properties, bindings, child objects, signal handlers, functions.

### PL-QML-008 — Layout Is Declarative

Use `Layout` types (`RowLayout`, `ColumnLayout`, `GridLayout`) and anchors for placement. Do not hard-code absolute `x` and `y` values for content that must adapt to size. Hard-coded sizes belong to design tokens in a `Theme` singleton.

### PL-QML-009 — Theme and Tokens in One Place

Colours, spacing, and font sizes come from one `Theme` singleton (`pragma Singleton`). Components read tokens; they never repeat literal values.

### PL-QML-010 — Folder Density

A folder of QML components holds at most **10 files** by default. Group components by feature (`views/session/`), and keep shared controls in one `controls/` folder.

### PL-QML-011 — Tooling

Run `qmllint` (with `--unqualified` warnings enabled) and the `qmlformat` tool in CI. Test behaviour with `QtTest`, and keep warnings intentional.
