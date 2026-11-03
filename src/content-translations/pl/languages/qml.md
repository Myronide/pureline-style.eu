# QML Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. QML jest deklaratywny: plik opisuje drzewo obiektów, ich właściwości i powiązania. JavaScript w QML służy do małych wyrażeń i handlerów, a [profil JavaScript](javascript.md) obowiązuje dla każdego zawartego w nim bloku. Pureline QML dotyczy **Qt 6** z Qt Quick.

## Profil QML {#qml-profile}

```text
Root object
↓
Properties (inputs and bindings)
↓
Child objects (layout)
↓
Handlers (behaviour)
```

### PL-QML-001 — Jeden obiekt główny na plik {#pl-qml-001--one-root-object-per-file}

Każdy plik `.qml` definiuje jeden komponent, którego nazwa jest nazwą pliku (`SessionCard.qml` definiuje `SessionCard`). Zagnieżdżone komponenty pomocnicze umieszczaj w osobnych plikach, gdy są ponownie używane; w linii zostawiaj pomocnika tylko wtedy, gdy nic innego go nie używa.

### PL-QML-002 — Nazewnictwo {#pl-qml-002--naming}

- Pliki komponentów i nazwy typów: `PascalCase`.
- Właściwości, sygnały, funkcje i identyfikatory: `lowerCamelCase`.
- Identyfikatory nazywają rolę obiektu (`titleLabel`, `retryButton`), nigdy jego typ ani pozycję (`text1`, `rect2`).
- Handlery sygnałów podążają za nazwą sygnału: `onClicked`, `onAccepted`.

### PL-QML-003 — Deklaruj interfejsy jawnie {#pl-qml-003--declare-interfaces-explicitly}

Wejścia komponentu deklaruj za pomocą `required property` i typu. Dla wartości, które komponent oblicza, używaj `readonly property`. Włącz `pragma ComponentBehavior: Bound`, aby identyfikatory były rozwiązywane przez jawny zakres.

```qml
pragma ComponentBehavior: Bound

Item {
    id: root

    required property string title
    required property bool active
    readonly property color accent: active ? "#22d3ee" : "#8d8da6"
}
```

### PL-QML-004 — Powiązania zamiast przypisań imperatywnych {#pl-qml-004--bindings-over-imperative-assignment}

Stan wyrażaj jako powiązanie (`visible: user.active`). Nie kopiuj wartości w `Component.onCompleted` ani w handlerach, gdy powiązanie utrzymałoby je poprawne. Przypisuj imperatywnie tylko dla jednorazowej akcji, takiej jak uruchomienie animacji lub wysłanie żądania.

### PL-QML-005 — Guardy to powiązania lub wczesne zwroty {#pl-qml-005--guards-are-bindings-or-early-returns}

Do przełączania gałęzi używaj `visible`, `enabled` i `Loader.active`. W funkcji JavaScript wracaj wcześnie, zamiast zagnieżdżać główną ścieżkę wewnątrz warunku.

```qml
function submit() {
    if (!form.valid) {
        return;
    }

    backend.send(form.payload());
}
```

### PL-QML-006 — Utrzymuj wyrażenia małe {#pl-qml-006--keep-expressions-small}

Powiązanie zawiera jedno wyrażenie z co najwyżej jednym warunkiem i krótkim wywołaniem. Dłuższą logikę przenieś do nazwanej funkcji lub obiektu backendu w C++ / Pythonie. Zagnieżdżone operatory trójargumentowe nie są Pureline.

### PL-QML-007 — Kolejność właściwości grupuje obiekt {#pl-qml-007--property-order-groups-the-object}

Właściwości obiektu zapisuj w tej kolejności, z pustą linią między grupami: tożsamość (`id`), właściwości wymagane i publiczne, powiązania, obiekty potomne, handlery sygnałów, funkcje.

### PL-QML-008 — Layout jest deklaratywny {#pl-qml-008--layout-is-declarative}

Do rozmieszczania używaj typów `Layout` (`RowLayout`, `ColumnLayout`, `GridLayout`) oraz kotwic. Nie koduj na sztywno bezwzględnych wartości `x` i `y` dla treści, która musi dostosowywać się do rozmiaru. Sztywno zakodowane rozmiary należą do tokenów projektowych w singletonie `Theme`.

### PL-QML-009 — Motyw i tokeny w jednym miejscu {#pl-qml-009--theme-and-tokens-in-one-place}

Kolory, odstępy i rozmiary czcionek pochodzą z jednego singletona `Theme` (`pragma Singleton`). Komponenty odczytują tokeny; nigdy nie powtarzają literalnych wartości.

### PL-QML-010 — Gęstość folderów {#pl-qml-010--folder-density}

Folder z komponentami QML zawiera domyślnie co najwyżej **10 plików**. Grupuj komponenty według funkcji (`views/session/`), a wspólne kontrolki trzymaj w jednym folderze `controls/`.

### PL-QML-011 — Narzędzia {#pl-qml-011--tooling}

W CI uruchamiaj `qmllint` (z włączonymi ostrzeżeniami `--unqualified`) oraz narzędzie `qmlformat`. Zachowanie testuj za pomocą `QtTest`, a ostrzeżenia traktuj świadomie.
