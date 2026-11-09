# C# Estilo de código

[Guía de estilo del código](../README.md) · [Especificaciones originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Aplicar las reglas [compartidas](../README.md#shared-rules) con este perfil. C# es un lenguaje gestionado basado en ortodoncia con un fuerte soporte de compilador. Pureline C# se dirige a **.NET 8** o posterior.

## Perfil C#

### PL-CS-001 — La designación sigue el Convenio.NET

Utilice `PascalCase` para tipos, miembros y constantes, `camelCase` para locales y parámetros y `_camelCase` para campos privados. Los nombres indican el papel de un valor, no su tipo.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Tipos de referencia anulables están activados

Establecer `<Nullable>enable</Nullable>` en cada proyecto. `string` nunca mantiene nula, y `string?` declara que puede. No acalle el compilador con `!`; en su lugar, arregle el flujo.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

Prefiere `?.` con `??` cuando el único propósito de la comprobación de null es seleccionar
Una copia. En este ejemplo, `Name` no es anulable.

```text
− Separate null guard            │ ✓ Pureline
if (user is null) {              │ return user?.Name ?? "Gast";
    return "Gast";               │
}                                │
                                 │
return user.Name;                │
```

### PL-CS-003 — Registros de datos inmutables

Modele datos que se muevan entre capas como `record`. Derive cambió las copias con `with` en lugar de la gata. Use una clase sólo cuando el objeto tenga identidad o comportamiento propio.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Las cláusulas de guardia regresan temprano

Compruebe la entrada inválida primero y vuelva inmediatamente, por lo que la ruta principal permanece en el nivel de sangrado exterior sin `else`. Véase [flujo de control](../core/control-flow.md).

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

### PL-CS-005 — Deseche con declaraciones de `using`

Utilice una declaración `using` para que la eliminación ocurra al final del alcance de la inclusión. Cada `IDisposable` tiene un propietario, y ese dueño lo dispone.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Async Todo el camino con la tarea

Devuelve `Task` o `Task<T>`, sufríe el nombre con `Async`, acepta un `CancellationToken` y nunca bloquee con `.Result` o `.Wait()`. Utilice `ValueTask` sólo cuando una medición lo justifique.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ sólo cuando se lee claramente

Usar LINQ para una transformación lineal: un filtro, una proyección o una materialización. Cambie a un bucle `foreach` cuando la consulta tenga efectos secundarios, ramas o más de tres operadores encadenados.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Espacio de nombres por carpeta, densidad de carpeta limitada

El espacio de nombres refleja la ruta de la carpeta, por lo que `Sessions/Views/` utiliza `Acme.Sessions.Views`. Una carpeta contiene como máximo archivos fuente **10 mantenidos a mano** por defecto. Agrupar por función en lugar de por tipo, y superar el límite sólo cuando cada archivo sirve una responsabilidad (cohesión sobre tamaño, ver [estructura](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Herramientas

Ejecutar `dotnet format --verify-no-changes` en CI como el oficial de forma. Habilitar los analizadores Roslyn y añadir StyleCop.Analizadores para nombrar y ordenar reglas, mantener las advertencias intencionales y probar el comportamiento con xUnit o NUnit (ver [herramienta](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
