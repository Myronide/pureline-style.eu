# Stile codice QML

[Code style guide](../README.md) · [Original specification 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Apply the [shared core rules](../README.md#shared-rules) with this profile. QML è dichiarativo: a file describes an object tree, its properties, and its bindings. JavaScript all'interno di QML è per piccole espressioni e gestori, e il [JavaScript profile](javascript.md) si applica a ogni blocco in esso. Pureline QML punta a **Qt 6** con Qt Quick.

## Profilo QML

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001. Un oggetto radice per file

Ogni file `.qml` definisce un componente il cui nome è il nome del file (`SessionCard.qml` definisce `SessionCard`).. Mettere componenti helper nested nei loro file quando vengono riutilizzati; mantenere un helper in linea solo quando nient'altro lo usa.

### PL-QML-002. Naming

- File dei componenti e nomi di tipo: `PascalCase`.
- Proprietà, segnali, funzioni e ids: `lowerCamelCase`.
- Gli ID indicano il ruolo dell'oggetto (`titleLabel`, `retryButton`), mai il suo tipo o posizione (`text1`, `rect2`).
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

### PL-QML-004. Legature per assegnazione obbligatoria

Express state as a binding (`visible: user.active`). Do not copy values in `Component.onCompleted` or in handlers when a binding would keep them correct. Assign imperatively only for a one-time action, such as starting an animation or sending a request.

### PL-QML-005. Le guardie sono rilegature o ritorni precoci ''.

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

### PL-QML-007. L'ordine di proprietà raggruppa l'oggetto

Scrivi le proprietà di un oggetto in questo ordine, con una linea vuota tra i gruppi: identità (`id`), proprietà richieste e pubbliche, legami, oggetti minori, gestori di segnali, funzioni.

### PL-QML-008. Layout è dichiarativo

Usare tipi di `Layout` (`RowLayout`, `ColumnLayout`, `GridLayout`) e ancoraggi per il posizionamento.. Do not hard-code absolute `x` and `y` values for content that must adapt to size. Hard-coded sizes belong to design tokens in a `Theme` singleton.

### PL-QML-009. Tema e segni in un unico posto

Colours, spacing, and font sizes come from one `Theme` singleton (`pragma Singleton`). Components read tokens; they never repeat literal values.

### Densità della cartella PL-QML-010

A folder of QML components holds at most **10 files** by default. Group components by feature (`views/session/`), and keep shared controls in one `controls/` folder.

### PL-QML-011. Troppo,, p.., p...

Run `qmllint` (with `--unqualified` warnings enabled) and the `qmlformat` tool in CI. Test behaviour with `QtTest`, and keep warnings intentional.
