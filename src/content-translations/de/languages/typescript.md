# TypeScript Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

TypeScript erbt außerdem das [JavaScript-Profil](javascript.md).

## TypeScript-Profil {#typescript-profile}

TypeScript erbt alle Pureline-JavaScript-Regeln.

### PL-TS-001 — `any` vermeiden {#pl-ts-001--avoid-any}

Vermeide:

```ts
function load(value: any): any {
}
```

Bevorzuge:

```ts
function load(value: UserId): User {
}
```

Verwende `unknown` für wirklich unbekannte Daten:

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Typen bewusst einsetzen {#pl-ts-002--use-types-deliberately}

Sowohl inferierte als auch explizite lokale Typen sind Pureline-konform.

```ts
const user = loadUser();
```

ist gültig, wenn der inferierte Typ offensichtlich ist.

Explizite Typisierung ist ebenso gültig:

```ts
const user: User = loadUser();
```

Pureline betrachtet eine explizite Annotation **nicht** schon deshalb als überflüssig, weil TypeScript sie inferieren könnte.

Explizite Typen sind besonders nützlich, wenn sie:

- die Absicht klarer machen
- einen erwarteten Vertrag dokumentieren
- eine Grenze vor unbeabsichtigter Aufweitung schützen
- das Vertrauen beim Refactoring erhöhen
- den Code verständlicher machen, ohne dass man einer ganzen Aufrufkette folgen muss

Typinferenz soll Lärm entfernen. Sie darf nie zu einer Regel gegen die Nutzung des TypeScript-Typsystems werden.

### PL-TS-003 — Kein `I`-Präfix im Java-Stil {#pl-ts-003--no-java-style-i-prefix}

Bevorzugt:

```ts
interface Session {
}
```

Nicht:

```ts
interface ISession {
}
```

Das `I`-Präfix ist profilspezifisch: Java, Emerald und Emvus verwenden es, TypeScript nicht.

### PL-TS-004 — `interface` oder `type` {#pl-ts-004--interface-vs-type}

Verwende `interface` für objektartige Verträge:

```ts
interface User {
    id: string;
    name: string;
}
```

Verwende `type` für Unions, Aliasse und aufrufbare Formen:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005 — Union-Typen statt Enums bevorzugen, wo es passt {#pl-ts-005--prefer-union-types-over-enums-when-appropriate}

Bevorzugt:

```ts
type State = "idle" | "ready" | "closed";
```

Verwende ein Enum nur, wenn ein echtes Enum-Konstrukt einen Mehrwert bringt.

### PL-TS-006 — Starke Typen an den Grenzen, Freiheit im Inneren {#pl-ts-006--strong-types-at-boundaries-freedom-internally}

Öffentliche APIs, externe Daten, Persistenzgrenzen und Netzwerk-Payloads sollen normalerweise klare Typen bereitstellen.

Innerhalb einer Implementierung sind explizite Annotationen und Inferenz gleichermaßen gültig. Wähle die Form, die den Code am leichtesten verständlich macht. Pureline bewertet eine Variante nicht allein deshalb als sauberer, weil sie weniger Typannotationen enthält.

---

### PL-TS-007 — Ordnerdichte {#pl-ts-007--folder-density}

Ein TypeScript-Feature-/Quellordner darf standardmäßig höchstens **10 produktive Quellmodule** enthalten.

Barrel-Dateien wie `index.ts`, reine Deklarations-Hilfsdateien, Tests, generierte Dateien und reine Metadaten-Dateien zählen nicht.

Eine Aufteilung soll eine echte Verantwortungsgrenze abbilden, etwa:

```text
session/
session/state/
session/transport/
session/storage/
```
