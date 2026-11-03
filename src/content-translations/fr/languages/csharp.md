# Style de code C#

[Guide de style de code](../README.md) · [Spécification originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquez les [règles communes du noyau](../README.md#shared-rules) avec ce profil. C# est un langage managé à accolades, avec un solide support du compilateur. Pureline C# cible **.NET 8** ou une version ultérieure.

## Profil C# {#c-profile}

### PL-CS-001 — Le nommage suit la convention .NET {#pl-cs-001--naming-follows-the-net-convention}

Utilisez `PascalCase` pour les types, les membres et les constantes, `camelCase` pour les variables locales et les paramètres, et `_camelCase` pour les champs privés. Les noms énoncent le rôle d'une valeur, pas son type.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Les types référence nullables sont activés {#pl-cs-002--nullable-reference-types-are-on}

Définissez `<Nullable>enable</Nullable>` dans chaque projet. `string` ne contient jamais null, et `string?` déclare qu'il le peut. Ne faites pas taire le compilateur avec `!` ; corrigez plutôt le flux.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

### PL-CS-003 — Des records pour les données immuables {#pl-cs-003--records-for-immutable-data}

Modélisez les données qui circulent entre les couches sous forme de `record`. Dérivez les copies modifiées avec `with` plutôt que de muter. N'utilisez une classe que lorsque l'objet a une identité ou un comportement propre.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Les guard clauses retournent tôt {#pl-cs-004--guard-clauses-return-early}

Vérifiez d'abord les entrées invalides et retournez immédiatement, afin que le chemin principal reste au niveau d'indentation extérieur, sans `else`. Voir le [flux de contrôle](../core/control-flow.md).

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

### PL-CS-005 — Libérer avec des déclarations `using` {#pl-cs-005--dispose-with-using-declarations}

Utilisez une déclaration `using` pour que la libération ait lieu à la fin de la portée englobante. Chaque `IDisposable` a un seul propriétaire, et c'est ce propriétaire qui le libère.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Async de bout en bout avec Task {#pl-cs-006--async-all-the-way-with-task}

Retournez `Task` ou `Task<T>`, suffixez le nom par `Async`, acceptez un `CancellationToken`, et ne bloquez jamais avec `.Result` ou `.Wait()`. N'utilisez `ValueTask` que là où une mesure le justifie.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ seulement quand il se lit clairement {#pl-cs-007--linq-only-when-it-reads-clearly}

Utilisez LINQ pour une transformation linéaire : un filtre, une projection ou une matérialisation. Passez à une boucle `foreach` lorsque la requête a des effets de bord, des branches ou plus de trois opérateurs enchaînés.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Un namespace par dossier, densité de dossier bornée {#pl-cs-008--namespace-per-folder-bounded-folder-density}

Le namespace reflète le chemin du dossier ; ainsi `Sessions/Views/` utilise `Acme.Sessions.Views`. Un dossier contient au maximum **10 fichiers sources maintenus à la main** par défaut. Regroupez par fonctionnalité plutôt que par type, et ne dépassez la limite que lorsque chaque fichier sert une seule responsabilité (cohésion avant la taille, voir [structure](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Outillage {#pl-cs-009--tooling}

Exécutez `dotnet format --verify-no-changes` en CI comme formateur officiel. Activez les analyseurs Roslyn et ajoutez StyleCop.Analyzers pour les règles de nommage et d'ordre, gardez les avertissements intentionnels, et testez le comportement avec xUnit ou NUnit (voir [outillage](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
