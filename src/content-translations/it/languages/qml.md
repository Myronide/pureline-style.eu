# Stile del codice QML

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) con questo profilo. QML è dichiarativo: un file descrive un albero di oggetti, le sue proprietà e i suoi binding. Il JavaScript dentro QML serve per piccole espressioni e gestori, e il [profilo JavaScript](javascript.md) si applica a ogni blocco al suo interno. Pureline QML ha come obiettivo **Qt 6** con Qt Quick.

## Profilo QML {#qml-profile}

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Un oggetto radice per file {#pl-qml-001--one-root-object-per-file}

Ogni file `.qml` definisce un componente il cui nome è il nome del file (`SessionCard.qml` definisce `SessionCard`). Metti i componenti di supporto annidati nei loro file quando vengono riutilizzati; tienili in linea solo quando nient'altro li usa.

### PL-QML-002 — Nomi {#pl-qml-002--naming}

- File dei componenti e nomi dei tipi: `PascalCase`.
- Proprietà, segnali, funzioni e id: `lowerCamelCase`.
- Gli id nominano il ruolo dell'oggetto (`titleLabel`, `retryButton`), mai il suo tipo o la sua posizione (`text1`, `rect2`).
- I gestori dei segnali seguono il nome del segnale: `onClicked`, `onAccepted`.

### PL-QML-003 — Dichiarare le interfacce in modo esplicito {#pl-qml-003--declare-interfaces-explicitly}

Dichiara gli input di un componente con `required property` e un tipo. Usa `readonly property` per i valori che il componente calcola. Abilita `pragma ComponentBehavior: Bound`, così gli id si risolvono tramite un ambito esplicito.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Binding al posto dell'assegnazione imperativa {#pl-qml-004--bindings-over-imperative-assignment}

Esprimi lo stato come binding (`visible: user.active`). Non copiare i valori in `Component.onCompleted` o nei gestori quando un binding li manterrebbe corretti. Assegna in modo imperativo solo per un'azione una tantum, come avviare un'animazione o inviare una richiesta.

### PL-QML-005 — Le guardie sono binding o ritorni anticipati {#pl-qml-005--guards-are-bindings-or-early-returns}

Usa `visible`, `enabled` e `Loader.active` per scegliere tra i rami. In una funzione JavaScript, ritorna subito invece di annidare il percorso principale dentro una condizione.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Mantenere piccole le espressioni {#pl-qml-006--keep-expressions-small}

Un binding contiene una sola espressione con al massimo una condizione e una breve chiamata. Sposta la logica più lunga in una funzione con nome o in un oggetto backend C++ / Python. I ternari annidati non sono Pureline.

### PL-QML-007 — L'ordine delle proprietà raggruppa l'oggetto {#pl-qml-007--property-order-groups-the-object}

Scrivi le proprietà di un oggetto in quest'ordine, con una riga vuota tra i gruppi: identità (`id`), proprietà obbligatorie e pubbliche, binding, oggetti figli, gestori dei segnali, funzioni.

### PL-QML-008 — Il layout è dichiarativo {#pl-qml-008--layout-is-declarative}

Usa i tipi `Layout` (`RowLayout`, `ColumnLayout`, `GridLayout`) e le ancore per il posizionamento. Non scrivere nel codice valori assoluti di `x` e `y` per contenuti che devono adattarsi alla dimensione. Le dimensioni fisse appartengono ai design token in un singleton `Theme`.

### PL-QML-009 — Tema e token in un unico posto {#pl-qml-009--theme-and-tokens-in-one-place}

Colori, spaziature e dimensioni dei font provengono da un unico singleton `Theme` (`pragma Singleton`). I componenti leggono i token; non ripetono mai valori letterali.

### PL-QML-010 — Densità delle cartelle {#pl-qml-010--folder-density}

Una cartella di componenti QML contiene al massimo **10 file** per impostazione predefinita. Raggruppa i componenti per funzionalità (`views/session/`) e tieni i controlli condivisi in un'unica cartella `controls/`.

### PL-QML-011 — Strumenti {#pl-qml-011--tooling}

Esegui `qmllint` (con gli avvisi `--unqualified` abilitati) e lo strumento `qmlformat` nella CI. Testa il comportamento con `QtTest` e mantieni intenzionali gli avvisi.
