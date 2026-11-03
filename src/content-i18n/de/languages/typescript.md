# TypScript-Codestil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

TypeScript erbt auch das [JavaScript-Profil](javascript.md).

## TypScript-Profil

TypeScript erbt alle JavaScript-Regeln von Pureline.

### PL-TS-001 — Avoid `any`

Avoid:

```ts
function load(value: any): any {
}
```

Prefer:

```ts
function load(value: UserId): User {
}
```

Verwenden Sie `unknown` für wirklich unbekannte Daten:

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Use Types Deliberately

Sowohl abgeleitete als auch explizite lokale Typen sind Pureline-konform.

```ts
const user = loadUser();
```

ist gültig, wenn der abgeleitete Typ offensichtlich ist.

Die explizite Eingabe ist gleichermaßen gültig:

```ts
const user: User = loadUser();
```

Pureline behandelt eine explizite Anmerkung von **not** nur deshalb als überflüssig, weil TypeScript sie ableiten konnte.

Explizite Typen sind besonders nützlich, wenn sie:

- die Absicht klarer machen
- einen erwarteten Vertrag dokumentieren
- Schutz einer Grenze vor unbeabsichtigter Erweiterung
- Verbesserung des Vertrauens in die Refaktorisierung
- Code leichter verständlich machen, ohne einer gesamten Anrufkette zu folgen

Typ-Ableitung sollte Geräusche entfernen. Es sollte nie eine Regel gegen TypeScripts Type System werden.

### PL-TS-003 — Kein Java-Style `I`-Präfix

Preferred:

```ts
interface Session {
}
```

Nicht:

```ts
interface ISession {
}
```

Das `I`-Präfix ist profilspezifisch: Java, Emerald und Emvus verwenden es; TypeScript nicht.

### PL-TS-004 — `interface` gegen `type`

`interface` für objektähnliche Verträge verwenden:

```ts
interface User {
    id: string;
    name: string;
}
```

Verwenden Sie `type` für Gewerkschaften, Aliases und rufbare Formen:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005 — Vorzugs-Unionstypen gegenüber Enums, wenn dies angemessen ist

Preferred:

```ts
type State = "idle" | "ready" | "closed";
```

Verwenden Sie ein Enum nur, wenn ein tatsächliches Enumkonstrukt Wert liefert.

### PL-TS-006 — Starke Typen an den Boundarien, Freiheit intern

Öffentliche APIs, externe Daten, Persistenzgrenzen und Netzwerk-Payloads sollten normalerweise klare Typen aufdecken.

Innerhalb einer Implementierung sind sowohl explizite Anmerkungen als auch Schlussfolgerungen gültig. Wählen Sie das Formular, das den Code am einfachsten zu verstehen macht. Pureline punktet nicht als Reiniger, nur weil es weniger Typnotationen enthält.

---

### PL-TS-007 — Ordnerdichte

Ein TypeScript Feature/Source Ordner kann standardmäßig höchstens **10 Produktionsquellenmodule** enthalten.

Fässer wie `index.ts`, deklarationsgeschützte Supportdateien, Tests, generierte Dateien und Metadaten-nur-Dateien zählen nicht.

Eine Spaltung sollte eine echte Verantwortungsgrenze darstellen, wie z.B.:

```text
session/
session/state/
session/transport/
session/storage/
```
