# QML-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) mit diesem Profil an. QML ist deklarativ: eine Datei beschreibt einen Objektbaum, seine Eigenschaften und seine Bindungen. JavaScript inside QML ist für kleine Ausdrücke und Handler, und das [JavaScript-Profil](javascript.md) gilt für jeden Block in ihm. Pureline QML zielt mit Qt Quick auf **Qt 6** ab.

## QML-Profil

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Ein Root-Objekt pro Datei

Jede `.qml`-Datei definiert eine Komponente, deren Name der Dateiname ist (`SessionCard.qml` definiert `SessionCard`). Setzen Sie verschachtelte Helfer-Komponenten in ihre eigenen Dateien, wenn sie wiederverwendet werden; halten Sie einen Helfer inline nur, wenn nichts anderes es verwendet.

### PL-QML-002 — Benennung

- Komponentendateien und Typnamen: `PascalCase`.
- Eigenschaften, Signale, Funktionen und ids: `lowerCamelCase`.
- Die Rolle des Objekts (`titleLabel`, `retryButton`), niemals sein Typ oder seine Position (`text1`, `rect2`) nennen.
- Signalhandler folgen dem Signalnamen: `onClicked`, `onAccepted`.

### PL-QML-003 — Schnittstellen explizit erklären

Geben Sie die Eingaben einer Komponente mit `required property` und einem Typ an. Verwenden Sie `readonly property` für Werte, die die Komponente berechnet. Aktivieren Sie `pragma ComponentBehavior: Bound`, so dass ids durch expliziten Umfang lösen.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Bindungen über die imperative Zuweisung

Expresszustand als Bindung (`visible: user.active`). Kopieren Sie keine Werte in `Component.onCompleted` oder in Handlern, wenn eine Bindung sie korrekt halten würde. Zuweisen imperativ nur für eine einmalige Aktion, wie zum Beispiel Starten einer Animation oder Senden einer Anfrage.

### PL-QML-005 — Wachen sind Bindungen oder vorzeitige Rückkehr

Verwenden Sie `visible`, `enabled` und `Loader.active`, um Zweige zu wechseln. In einer JavaScript-Funktion, Rückkehr früh statt Nesting der Hauptpfad in einem Zustand.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Bewahren Sie die Ausdrücke klein auf

Eine Bindung hält höchstens einen Ausdruck von bedingtem und kurzer Anruf. Längere Logik in eine benannte Funktion oder ein C++ / Python Backend Objekt verschieben. Verschachtelte Tenarien sind nicht Pureline.

Halten Sie eine kurze Bindung an das Eigentum, das es verwendet... Bezeichnung der Bedingung
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

### PL-QML-009 — Thema und Zeichen an einem Ort

Farben, Abstand und Schriftgrößen stammen aus einem `Theme` Singleton (`pragma Singleton`). Komponenten lesen Tokens; sie wiederholen niemals wörtliche Werte.

### PL-QML-010 — Ordnerdichte

Ein Ordner von QML-Komponenten enthält standardmäßig höchstens **10-Dateien**.. Gruppenkomponenten nach Feature (`views/session/`) und behalten gemeinsam genutzte Steuerungen in einem `controls/`-Ordner.

### PL-QML-011 — Werkzeugbau

Führen Sie `qmllint` (mit aktivierten `--unqualified`-Warnungen) und das `qmlformat`-Tool in CI aus. Prüfverhalten mit `QtTest` und halten Warnungen absichtlich.
