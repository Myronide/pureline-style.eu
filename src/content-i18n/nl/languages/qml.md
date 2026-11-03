# QML Code Style

[Code stijl gids](../README.md) · [Original specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) toe met dit profiel. QML is declaratief: een bestand beschrijft een objectboom, zijn eigenschappen en zijn bindingen. JavaScript binnen QML is voor kleine expressies en handlers, en het [JavaScript profiel](javascript.md) is van toepassing op elk blok erin. Pureline QML richt zich op **Qt 6** met Qt Quick.

## QML-profiel

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001. Eén root-object per bestand

Elk `.qml`-bestand definieert één component waarvan de naam de bestandsnaam is (`SessionCard.qml` definieert `SessionCard`). Zet nested helper componenten in hun eigen bestanden wanneer ze worden hergebruikt; houd een helper inline alleen als niets anders gebruikt.

### PL-QML-002. Naamgeving

- Bestanden en typenamen van componenten: `PascalCase`.
- Eigenschappen, signalen, functies en id's: `lowerCamelCase`.
- Ids noemen de rol van het object (`titleLabel`, `retryButton`), nooit het type of de positie (`text1`, `rect2`).
- Signaalverwerkers volgen de signaalnaam: `onClicked`, `onAccepted`.

### PL-QML-003. Interfaces expliciet aangeven

Geef de ingangen aan van een component met `required property` en een type. Gebruik `readonly property` voor waarden die het onderdeel berekent. `pragma ComponentBehavior: Bound` inschakelen zodat id's door een expliciete scope worden opgelost.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004. Bindingen boven imperatieve toewijzing

Express state as binding (`visible: user.active`). Kopieer waarden in `Component.onCompleted` of in handlers niet wanneer een binding deze correct zou houden. Alleen toewijzen voor een eenmalige actie, zoals het starten van een animatie of het verzenden van een verzoek.

### PL-QML-005. Bewakers zijn bindingen of vroege terugkeers

Gebruik `visible`, `enabled` en `Loader.active` om van branches te wisselen. In een JavaScript functie, keer vroeg terug in plaats van het hoofdpad in een conditie te nestelen.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006. Uitdrukkingen klein houden

Een binding houdt één uitdrukking van ten hoogste één voorwaardelijke en een korte oproep. Verplaats langere logica naar een genoemde functie of een C++ / Python backend object. Genesteerde sternen zijn geen Pureline.

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

### PL-QML-007. Objectvolgorde groepen het object

Schrijf de eigenschappen van een object in deze volgorde, met een lege regel tussen groepen: identiteit (`id`), vereiste en publieke eigenschappen, bindingen, kind objecten, signaalverwerkers, functies.

### PL-QML-008. Indeling is declaratief

Gebruik `Layout`-types (`RowLayout`, `ColumnLayout`, `GridLayout`) en ankers voor plaatsing. Niet hardcoderen van absolute `x`- en `y`-waarden voor inhoud die moet worden aangepast aan grootte. Hard gecodeerde maten behoren tot ontwerp tot dekens in een `Theme` singleton.

### PL-QML-009. Thema en Tokens op één plaats

Kleuren, afstand en font-maten zijn afkomstig van één `Theme` singleton (`pragma Singleton`). Componenten lezen tot en metkens; ze herhalen nooit literale waarden.

### PL-QML-010. Map Density

Een map met QML-componenten bevat hooguit **10 bestanden** standaard. Groepscomponenten per functie (`views/session/`), en houd gedeelde controles in één `controls/`-map.

### PL-QML-011. Gereedschape

Run `qmllint` (met `--unqualified` waarschuwingen ingeschakeld) en het `qmlformat` gereedschap in CI. Test gedrag met `QtTest`, en houd waarschuwingen opzettelijk.
