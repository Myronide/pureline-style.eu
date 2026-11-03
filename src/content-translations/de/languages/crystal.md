# Crystal Code Style

[Code-Style-Leitfaden](../README.md) · [Originalspezifikation 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Wende die [gemeinsamen Kernregeln](../README.md#shared-rules) zusammen mit diesem Profil an. Sprachnative Regeln und ausdrückliche Profilausnahmen haben Vorrang vor sprachübergreifenden Syntaxpräferenzen. [Kohäsion vor Größe](../core/structure.md) gilt durchgängig.

## Crystal-Profil {#crystal-profile}

Crystal behält seine eigene Sprachidentität und folgt dabei den Pureline-Prinzipien.

### PL-CR-001 — Idiomatische nachgestellte Guards sind erlaubt {#pl-cr-001--idiomatic-postfix-guards-are-allowed}

Nachgestellte Bedingungen in Crystal sind Pureline-konform, wenn sie einen kurzen, offensichtlichen Guard ausdrücken.

Gut:

```crystal
return unless valid
return if closed
```

Sie passen gut zu Pureline, weil sie die Guard-Logik kompakt halten und einen linearen Happy Path bewahren.

Verwende einen expliziten Block, sobald die Bedingung oder die geschützte Aktion komplexer wird:

```crystal
if session.closed? || session.expired?
  logger.info("Session is no longer usable")
  return
end
```

Die Regel lautet nicht „nachgestellte Bedingungen vermeiden“. Die Regel lautet: die Form verwenden, die die Absicht sofort erkennbar hält.

Bevorzuge die Postfix-Form für eine einzelne kurze Prüfung mit sofortiger Rückgabe.

```text
Block guard                 │ ✓ Pureline
if session.closed?          │ return if session.closed?
  return                    │
end                         │ session.send(packet)
                            │
session.send(packet)        │
```

### PL-CR-002 — `else` vermeiden {#pl-cr-002--avoid-else}

Vermeiden:

```crystal
if valid
  execute
else
  reject
end
```

Bevorzugen:

```crystal
if !valid
  reject
  return
end

execute
```

### PL-CR-003 — Idiomatische Benennung {#pl-cr-003--idiomatic-naming}

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

### PL-CR-004 — Typinferenz bevorzugen {#pl-cr-004--prefer-type-inference}

Bevorzugt:

```crystal
session = create_session(user)
```

Vermeide redundante Annotationen:

```crystal
session : Session = create_session(user)
```

wenn Crystal den Typ eindeutig inferieren kann.

### PL-CR-005 — Explizite nil-Guards {#pl-cr-005--explicit-nil-guards}

Bevorzugt:

```crystal
user = users.find(id)

if user.nil?
  return
end

session = create_session(user)
```

Vermeide es, erwartete nil-Behandlung in tief verschachtelten Ketten zu vergraben.

### PL-CR-006 — Ausnahmen sind für Ausnahmezustände da {#pl-cr-006--exceptions-are-for-exceptional-states}

Erwartete Ergebnisse sollen bevorzugt über normale Domänenmodellierung abgebildet werden, etwa mit `nil`, Union-Typen, Result-ähnlichen Strukturen oder Enums.

Ausnahmen sollen ein außergewöhnliches Scheitern darstellen, nicht gewöhnliche Verzweigungen.

### PL-CR-007 — Makro-Cleverness ohne Not vermeiden {#pl-cr-007--avoid-macro-cleverness-without-need}

Crystal-Makros sind mächtig, aber Pureline vermeidet es, gewöhnliches Verhalten hinter Metaprogrammierung zu verstecken, es sei denn, die Abstraktion bringt einen klaren architektonischen Nutzen.

Generiertes Verhalten soll vorhersehbar und auffindbar bleiben.

---

### PL-CR-008 — Ordnerdichte {#pl-cr-008--folder-density}

Ein Crystal-Quell- oder Namespace-Ordner darf standardmäßig höchstens **10 produktive `.cr`-Dateien** enthalten.

Specs, generierte Dateien, Bindings und reine Metadaten-Dateien zählen nicht.

Wird das Limit überschritten, teile den Namespace nach Verantwortung auf und bewahre dabei die idiomatische Crystal-Struktur.
