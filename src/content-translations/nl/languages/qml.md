# QML-codestijl

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Pas de [gedeelde kernregels](../README.md#shared-rules) samen met dit profiel toe. QML is declaratief: een bestand beschrijft een objectboom, de properties en de bindings ervan. JavaScript binnen QML is bedoeld voor kleine expressies en handlers, en het [JavaScript-profiel](javascript.md) geldt voor elk blok daarin. Pureline QML richt zich op **Qt 6** met Qt Quick.

## QML-profiel {#qml-profile}

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Eén rootobject per bestand {#pl-qml-001--one-root-object-per-file}

Elk `.qml`-bestand definieert één component waarvan de naam de bestandsnaam is (`SessionCard.qml` definieert `SessionCard`). Zet geneste hulpcomponenten in eigen bestanden wanneer ze hergebruikt worden; laat een hulpcomponent alleen inline staan wanneer niets anders hem gebruikt.

### PL-QML-002 — Naamgeving {#pl-qml-002--naming}

- Componentbestanden en typenamen: `PascalCase`.
- Properties, signals, functies en id's: `lowerCamelCase`.
- Id's benoemen de rol van het object (`titleLabel`, `retryButton`), nooit het type of de positie (`text1`, `rect2`).
- Signal handlers volgen de signaalnaam: `onClicked`, `onAccepted`.

### PL-QML-003 — Declareer interfaces expliciet {#pl-qml-003--declare-interfaces-explicitly}

Declareer de invoer van een component met `required property` en een type. Gebruik `readonly property` voor waarden die de component zelf berekent. Schakel `pragma ComponentBehavior: Bound` in, zodat id's via expliciete scope worden opgelost.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Bindings boven imperatieve toewijzing {#pl-qml-004--bindings-over-imperative-assignment}

Druk toestand uit als binding (`visible: user.active`). Kopieer waarden niet in `Component.onCompleted` of in handlers wanneer een binding ze correct zou houden. Wijs alleen imperatief toe voor een eenmalige actie, zoals het starten van een animatie of het versturen van een verzoek.

### PL-QML-005 — Guards zijn bindings of vroege returns {#pl-qml-005--guards-are-bindings-or-early-returns}

Gebruik `visible`, `enabled` en `Loader.active` om tussen takken te schakelen. Keer in een JavaScript-functie vroeg terug in plaats van het hoofdpad in een voorwaarde te nesten.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Houd expressies klein {#pl-qml-006--keep-expressions-small}

Een binding bevat één expressie met hooguit één voorwaarde en een korte aanroep. Verplaats langere logica naar een benoemde functie of een backendobject in C++ / Python. Geneste ternaire expressies zijn geen Pureline.

### PL-QML-007 — De volgorde van properties groepeert het object {#pl-qml-007--property-order-groups-the-object}

Schrijf de properties van een object in deze volgorde, met een lege regel tussen de groepen: identiteit (`id`), vereiste en publieke properties, bindings, kindobjecten, signal handlers, functies.

### PL-QML-008 — Layout is declaratief {#pl-qml-008--layout-is-declarative}

Gebruik `Layout`-typen (`RowLayout`, `ColumnLayout`, `GridLayout`) en anchors voor plaatsing. Codeer geen absolute `x`- en `y`-waarden hard voor inhoud die zich aan de grootte moet aanpassen. Hardgecodeerde afmetingen horen thuis in designtokens in een `Theme`-singleton.

### PL-QML-009 — Thema en tokens op één plek {#pl-qml-009--theme-and-tokens-in-one-place}

Kleuren, spaties en lettergroottes komen uit één `Theme`-singleton (`pragma Singleton`). Componenten lezen tokens; ze herhalen nooit letterlijke waarden.

### PL-QML-010 — Mapdichtheid {#pl-qml-010--folder-density}

Een map met QML-componenten bevat standaard maximaal **10 bestanden**. Groepeer componenten per feature (`views/session/`) en houd gedeelde besturingselementen in één map `controls/`.

### PL-QML-011 — Tooling {#pl-qml-011--tooling}

Voer in CI `qmllint` (met `--unqualified`-waarschuwingen ingeschakeld) en de tool `qmlformat` uit. Test gedrag met `QtTest` en houd waarschuwingen bewust.
