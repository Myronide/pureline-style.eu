# Estilo de código C#

[Guía de estilo de código](../README.md) · [Especificación original 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplica las [reglas básicas compartidas](../README.md#shared-rules) con este perfil. C# es un lenguaje gestionado, basado en llaves y con un fuerte respaldo del compilador. Pureline C# está pensado para **.NET 8** o posterior.

## Perfil de C# {#c-profile}

### PL-CS-001 — Los nombres siguen la convención de .NET {#pl-cs-001--naming-follows-the-net-convention}

Usa `PascalCase` para tipos, miembros y constantes, `camelCase` para variables locales y parámetros, y `_camelCase` para los campos privados. Los nombres indican la función de un valor, no su tipo.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Los tipos de referencia anulables están activados {#pl-cs-002--nullable-reference-types-are-on}

Establece `<Nullable>enable</Nullable>` en cada proyecto. `string` nunca contiene null, y `string?` declara que puede hacerlo. No silencies el compilador con `!`; corrige el flujo en su lugar.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

### PL-CS-003 — Records para los datos inmutables {#pl-cs-003--records-for-immutable-data}

Modela como `record` los datos que se mueven entre capas. Obtén copias modificadas con `with` en lugar de mutar. Usa una clase solo cuando el objeto tenga identidad o comportamiento propios.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Las guard clauses retornan pronto {#pl-cs-004--guard-clauses-return-early}

Comprueba primero las entradas inválidas y retorna de inmediato, de modo que el camino principal se mantenga en el nivel de sangría exterior y sin `else`. Consulta el [flujo de control](../core/control-flow.md).

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

### PL-CS-005 — Libera con declaraciones `using` {#pl-cs-005--dispose-with-using-declarations}

Usa una declaración `using` para que la liberación ocurra al final del ámbito que la contiene. Cada `IDisposable` tiene un único dueño, y ese dueño es quien lo libera.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Asíncrono de principio a fin con Task {#pl-cs-006--async-all-the-way-with-task}

Devuelve `Task` o `Task<T>`, añade el sufijo `Async` al nombre, acepta un `CancellationToken` y no bloquees nunca con `.Result` ni `.Wait()`. Usa `ValueTask` solo cuando una medición lo justifique.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ solo cuando se lee con claridad {#pl-cs-007--linq-only-when-it-reads-clearly}

Usa LINQ para una transformación lineal: un filtro, una proyección o una materialización. Cambia a un bucle `foreach` cuando la consulta tenga efectos secundarios, ramificaciones o más de tres operadores encadenados.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Un namespace por carpeta y densidad de carpetas acotada {#pl-cs-008--namespace-per-folder-bounded-folder-density}

El namespace refleja la ruta de la carpeta, así que `Sessions/Views/` usa `Acme.Sessions.Views`. Una carpeta contiene como máximo **10 archivos fuente mantenidos a mano** por defecto. Agrupa por funcionalidad y no por tipo, y supera el límite solo cuando cada archivo sirva a una única responsabilidad (cohesión antes que tamaño, consulta la [estructura](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Herramientas {#pl-cs-009--tooling}

Ejecuta `dotnet format --verify-no-changes` en la CI como formateador oficial. Activa los analizadores de Roslyn y añade StyleCop.Analyzers para las reglas de nombres y de ordenación, mantén las advertencias intencionadas y prueba el comportamiento con xUnit o NUnit (consulta las [herramientas](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
