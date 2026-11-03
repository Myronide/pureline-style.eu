# QML Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) mit diesem Profil an. QML ist deklarativ: Eine Datei beschreibt einen Objektbaum, seine Properties und seine Bindings. JavaScript innerhalb von QML ist für kleine Ausdrücke und Handler gedacht, und das [JavaScript-Profil](javascript.md) gilt für jeden Block darin. Pureline QML zielt auf **Qt 6** mit Qt Quick.

## QML-Profil {#qml-profile}

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Ein Wurzelobjekt pro Datei {#pl-qml-001--one-root-object-per-file}

Jede `.qml`-Datei definiert eine Komponente, deren Name der Dateiname ist (`SessionCard.qml` definiert `SessionCard`). Lege verschachtelte Hilfskomponenten in eigene Dateien, wenn sie wiederverwendet werden; halte eine Hilfskomponente nur dann inline, wenn sie sonst niemand verwendet.

### PL-QML-002 — Benennung {#pl-qml-002--naming}

- Komponentendateien und Typnamen: `PascalCase`.
- Properties, Signale, Funktionen und IDs: `lowerCamelCase`.
- IDs benennen die Rolle des Objekts (`titleLabel`, `retryButton`), niemals seinen Typ oder seine Position (`text1`, `rect2`).
- Signal-Handler folgen dem Signalnamen: `onClicked`, `onAccepted`.

### PL-QML-003 — Schnittstellen explizit deklarieren {#pl-qml-003--declare-interfaces-explicitly}

Deklariere die Eingaben einer Komponente mit `required property` und einem Typ. Verwende `readonly property` für Werte, die die Komponente berechnet. Aktiviere `pragma ComponentBehavior: Bound`, damit IDs über einen expliziten Scope aufgelöst werden.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Bindings statt imperativer Zuweisung {#pl-qml-004--bindings-over-imperative-assignment}

Drücke Zustand als Binding aus (`visible: user.active`). Kopiere Werte nicht in `Component.onCompleted` oder in Handlern, wenn ein Binding sie korrekt halten würde. Weise nur für eine einmalige Aktion imperativ zu, etwa um eine Animation zu starten oder eine Anfrage zu senden.

### PL-QML-005 — Guards sind Bindings oder frühe Rückgaben {#pl-qml-005--guards-are-bindings-or-early-returns}

Verwende `visible`, `enabled` und `Loader.active`, um Zweige umzuschalten. Kehre in einer JavaScript-Funktion früh zurück, statt den Hauptpfad in einer Bedingung zu verschachteln.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Ausdrücke klein halten {#pl-qml-006--keep-expressions-small}

Ein Binding enthält einen Ausdruck mit höchstens einer Bedingung und einem kurzen Aufruf. Verlagere längere Logik in eine benannte Funktion oder ein C++- / Python-Backend-Objekt. Verschachtelte Ternaries sind nicht Pureline.

Schreibe eine kurze Bindung direkt an die Property, die sie verwendet.
Gib der Bedingung einen Namen, wenn mehrere Steuerelemente sie teilen.

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

### PL-QML-007 — Die Reihenfolge der Properties gruppiert das Objekt {#pl-qml-007--property-order-groups-the-object}

Schreibe die Properties eines Objekts in dieser Reihenfolge, mit einer Leerzeile zwischen den Gruppen: Identität (`id`), erforderliche und öffentliche Properties, Bindings, Kindobjekte, Signal-Handler, Funktionen.

### PL-QML-008 — Layout ist deklarativ {#pl-qml-008--layout-is-declarative}

Verwende `Layout`-Typen (`RowLayout`, `ColumnLayout`, `GridLayout`) und Anker für die Platzierung. Verwende keine fest codierten absoluten `x`- und `y`-Werte für Inhalte, die sich an die Größe anpassen müssen. Fest codierte Größen gehören als Design-Tokens in ein `Theme`-Singleton.

### PL-QML-009 — Theme und Tokens an einem Ort {#pl-qml-009--theme-and-tokens-in-one-place}

Farben, Abstände und Schriftgrößen stammen aus einem einzigen `Theme`-Singleton (`pragma Singleton`). Komponenten lesen Tokens; sie wiederholen nie Literalwerte.

### PL-QML-010 — Ordnerdichte {#pl-qml-010--folder-density}

Ein Ordner mit QML-Komponenten enthält standardmäßig höchstens **10 Dateien**. Gruppiere Komponenten nach Feature (`views/session/`) und halte gemeinsame Controls in einem einzigen Ordner `controls/`.

### PL-QML-011 — Tooling {#pl-qml-011--tooling}

Führe in der CI `qmllint` (mit aktivierten `--unqualified`-Warnungen) und das Werkzeug `qmlformat` aus. Teste das Verhalten mit `QtTest` und halte Warnungen bewusst.
