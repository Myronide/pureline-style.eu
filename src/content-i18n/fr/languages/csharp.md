# C# Style de code

[Guide de style de code](../README.md) · [Données originales 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Appliquer les [règles de base partagées](../README.md#shared-rules) avec ce profil. C# est un langage géré et basé sur les supports avec un solide soutien de la part des généalogies. Pureline C# cible **.NET 8** ou une version ultérieure.

## C# Profil

### PL-CS-001 — La désignation suit la convention.NET

Utilisez `PascalCase` pour les types, les membres et les années 2004, `camelCase` pour les locaux et les paramètres et `_camelCase` pour les champs privés. Les noms indiquent le rôle d'une valeur, pas son type.

```csharp
public static class SessionRules
{
    public static bool IsExpired(DateTimeOffset lastSeen, TimeSpan maxAge) =>
        DateTimeOffset.UtcNow - lastSeen > maxAge;
}
```

### PL-CS-002 — Les types de référence nullables sont activés

Définissez `<Nullable>enable</Nullable>` dans chaque projet. `string` ne détient jamais de valeur nulle et `string?` déclare qu'elle peut. Ne pas réduire le tien en silence avec `!`; fixer le débit à la place.

```csharp
public sealed class UserProfile
{
    public required string Name { get; init; }
    public string? Nickname { get; init; }
}
```

Préférez `?.` avec `??` lorsque la seule fin de la vérification null est de sélectionner
un retour en arrière. Dans cet exemple, `Name` est non nullable.

```text
− Separate null guard            │ ✓ Pureline
if (user is null) {              │ return user?.Name ?? "Gast";
    return "Gast";               │
}                                │
                                 │
return user.Name;                │
```

### PL-CS-003 — Enregistrements pour les données immuables

Modéliser les données qui se déplacent entre les couches comme un `record`. Derive a changé d'exemplaires avec `with` au lieu de muter. N'utilisez une classe que lorsque l'objet a sa propre identité ou comportement.

```csharp
public sealed record Session(string Id, string Title, bool IsActive);

public static Session Rename(Session session, string title) =>
    session with { Title = title };
```

### PL-CS-004 — Clauses de garde retour précoce

Vérifiez l'entrée invalide en premier et retournez immédiatement, de sorte que le chemin principal reste au niveau de l'indentation externe sans `else`. Voir [écoulement de commande](../core/control-flow.md).

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

### PL-CS-005 — Éliminer avec les déclarations `using`

Utiliser une déclaration `using` pour que l'élimination se fasse à la fin de la portée de l'enclos. Chaque `IDisposable` a un seul propriétaire, et ce propriétaire l'a disposé.

```csharp
public static string ReadFirstLine(string path)
{
    using var reader = new StreamReader(path);
    return reader.ReadLine() ?? string.Empty;
}
```

### PL-CS-006 — Async tout le chemin avec la tâche

Retournez `Task` ou `Task<T>`, suffixez le nom avec `Async`, acceptez un `CancellationToken`, et ne bloquez jamais avec `.Result` ou `.Wait()`. Utilisez `ValueTask` seulement lorsqu'une mesure le justifie.

```csharp
public static async Task<string> LoadBodyAsync(HttpClient client, string url, CancellationToken ct)
{
    using var response = await client.GetAsync(url, ct);
    return await response.Content.ReadAsStringAsync(ct);
}
```

### PL-CS-007 — LINQ seulement quand il lit clairement

Utilisez LINQ pour une transformation linéaire : un filtre, une projection ou une matérialisation. Passez à une boucle `foreach` lorsque la requête a des effets secondaires, des branches ou plus de trois opérateurs enchaînés.

```csharp
public static List<string> ActiveTitles(IEnumerable<Session> sessions) =>
    sessions.Where(s => s.IsActive).Select(s => s.Title).ToList();
```

### PL-CS-008 — Namespace par dossier, densité de dossiers

L'espace de noms reflète le chemin du dossier, donc `Sessions/Views/` utilise `Acme.Sessions.Views`. Un dossier contient au maximum des fichiers source **10 gérés manuellement** par défaut. Grouper par fonction plutôt que par nature, et dépasser la limite seulement lorsque chaque fichier remplit une seule responsabilité (cohésion sur taille, voir [structure](../core/structure.md)).

```csharp
namespace Acme.Sessions.Views;

public sealed class SessionCard
{
    public required string Title { get; init; }
}
```

### PL-CS-009 — Outillage

Exécutez `dotnet format --verify-no-changes` en CI comme matière officielle. Activer les analyseurs Roslyn et ajouter StyleCop.Analyzers pour nommer et commander les règles, garder les avertissements intentionnels et tester le comportement avec xUnit ou NUnit (voir [outil](../tooling.md)).

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```
