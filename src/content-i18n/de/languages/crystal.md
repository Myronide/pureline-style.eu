# Kristall-Code-Stil

[Code-Stil-Führer](../README.md) · [Original-Spezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wenden Sie die [shared core rules](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachen-native Regeln und explizite Profilausnahmen haben Vorrang vor sprachenübergreifenden Syntaxeinstellungen. [Kohäsion über Größe](../core/structure.md) gilt in allen Bereichen.

## Kristallprofil

Crystal behält seine eigene Sprachidentität bei der Einhaltung der Pureline Prinzipien.

### PL-CR-001 — Idiomatische Postfix-Bewacher sind zulässig

Kristallpostfix-Bedingungen sind Pureline-konform, wenn sie eine kurze, offensichtliche Wache ausdrücken.

Good:

```crystal
return unless valid
return if closed
```

Sie passen gut zu Pureline, weil sie die Wachlogik kompakt halten und einen linearen glücklichen Pfad bewahren können.

Verwenden Sie einen expliziten Block, wenn entweder die Bedingung oder die geschützte Aktion komplexer wird:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

Die Regel ist nicht "vermeiden Postfix Bedingungen." Die Regel ist: die Form zu benutzen, die die Absicht sofort offensichtlich hält..

### PL-CR-002 — Avoid `else`

Avoid:

```crystal
if valid
  execute
else
  reject
end
```

Prefer:

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003 — Idiomatische Bezeichnung

Variablen und Methoden verwenden `snake_case`:

```crystal
session_service
packet_registry
load_user
create_session
```

Typen verwenden PascalCase:

```crystal
SessionService
PacketRegistry
UserStorage
```

### PL-CR-004 — Präferenzart-Schlussfolgerung

Preferred:

```crystal
session = create_session(user)
```

Redundante Anmerkungen vermeiden:

```crystal
session : Session = create_session(user)
```

wenn Crystal den Typ deutlich ableiten kann...

### PL-CR-005 — explizite Nilgarden

Preferred:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Vermeiden Sie die erwartete Nullbearbeitung innerhalb tief verschachtelter Ketten...

### PL-CR-006 — Ausnahmen sind für Ausnahmestaaten

Erwartete Ergebnisse sollten vorzugsweise normale Domänenmodellierungen wie `nil`, Unionstypen, ergebnisartige Strukturen oder Enums verwenden.

Ausnahmen sollten außergewöhnliches Versagen darstellen, nicht gewöhnliche Verzweigungen.

### PL-CR-007 — Makroklugheit ohne Notwendigkeit vermeiden

Kristallmakros sind mächtig, aber Pureline vermeidet das Verbergen gewöhnlicher Verhalten hinter Metaprogrammierung, es sei denn, die Abstraktion bringt einen klaren architektonischen Nutzen.

Generiertes Verhalten sollte vorhersehbar und auffindbar bleiben.

---

### PL-CR-008 — Ordnerdichte

Ein Crystal Source oder Namespace Ordner kann standardmäßig höchstens **10 Produktion `.cr` Dateien** enthalten.

Daten, generierte Dateien, Bindungen und Metadaten-nur Dateien zählen nicht.

Wenn die Grenze überschritten wird, teilen Sie den Namensraum durch Verantwortung und bewahren Sie die Struktur des idiomatischen Kristalls.
