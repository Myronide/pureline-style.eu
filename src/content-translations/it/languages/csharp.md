# Stile del codice C#

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) con questo profilo. C# è un linguaggio gestito, basato su parentesi graffe, con un forte supporto del compilatore. Pureline C# ha come obiettivo **.NET 8** o successivo.

## Profilo C# {#c-profile}

### PL-CS-001 — I nomi seguono la convenzione .NET {#pl-cs-001--naming-follows-the-net-convention}

Usa `PascalCase` per tipi, membri e costanti, `camelCase` per variabili locali e parametri, e `_camelCase` per i campi privati. I nomi indicano il ruolo di un valore, non il suo tipo.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — I tipi riferimento nullable sono attivi {#pl-cs-002--nullable-reference-types-are-on}

Imposta `<Nullable>enable</Nullable>` in ogni progetto. `string` non contiene mai null e `string?` dichiara che può contenerlo. Non zittire il compilatore con `!`; correggi invece il flusso.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

### PL-CS-003 — Record per i dati immutabili {#pl-cs-003--records-for-immutable-data}

Modella con un `record` i dati che si spostano tra i livelli. Ricava le copie modificate con `with` invece di mutare. Usa una classe solo quando l'oggetto ha un'identità o un comportamento proprio.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Le guard clause ritornano subito {#pl-cs-004--guard-clauses-return-early}

Controlla per prima cosa l'input non valido e ritorna immediatamente, così il percorso principale resta al livello di indentazione più esterno, senza `else`. Vedi il [controllo di flusso](../core/control-flow.md).

```csharp
public static decimal Discount(decimal total)
{
    if (total <= 0)
    {
        return 0;
    }

    return total * 0.1m;
}
```

### PL-CS-005 — Rilasciare con le dichiarazioni `using` {#pl-cs-005--dispose-with-using-declarations}

Usa una dichiarazione `using`, così il rilascio avviene alla fine dell'ambito che la contiene. Ogni `IDisposable` ha un solo proprietario, e quel proprietario lo rilascia.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Async fino in fondo con Task {#pl-cs-006--async-all-the-way-with-task}

Restituisci `Task` o `Task<T>`, aggiungi il suffisso `Async` al nome, accetta un `CancellationToken` e non bloccare mai con `.Result` o `.Wait()`. Usa `ValueTask` solo dove lo giustifica una misurazione.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ solo quando si legge con chiarezza {#pl-cs-007--linq-only-when-it-reads-clearly}

Usa LINQ per una sola trasformazione lineare: un filtro, una proiezione o una materializzazione. Passa a un ciclo `foreach` quando la query ha effetti collaterali, ramificazioni o più di tre operatori concatenati.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Un namespace per cartella, densità delle cartelle limitata {#pl-cs-008--namespace-per-folder-bounded-folder-density}

Il namespace rispecchia il percorso della cartella, quindi `Sessions/Views/` usa `Acme.Sessions.Views`. Una cartella contiene al massimo **10 file sorgente mantenuti a mano** per impostazione predefinita. Raggruppa per funzionalità anziché per tipo e supera il limite solo quando ogni file serve un'unica responsabilità (coesione prima della dimensione, vedi la [struttura](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Strumenti {#pl-cs-009--tooling}

Esegui `dotnet format --verify-no-changes` nella CI come formatter ufficiale. Abilita gli analyzer Roslyn e aggiungi StyleCop.Analyzers per le regole su nomi e ordinamento, mantieni intenzionali gli avvisi e testa il comportamento con xUnit o NUnit (vedi gli [strumenti](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
