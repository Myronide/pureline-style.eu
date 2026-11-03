# Komentarze

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Komentarze {#comments}

### PL-DOC-001 — Komentarze wyjaśniają dlaczego, nie co {#pl-doc-001--comments-explain-why-not-what}

Unikaj:

```java
// Check if the player exists
if (player == null) {
    return;
}
```

Przydatne komentarze wyjaśniają na przykład ograniczenia protokołu, obejścia problemów, błędy w zewnętrznych komponentach, nieoczywiste zachowanie matematyczne lub nietypowe ograniczenia wydajnościowe.

Kod powinien wyjaśniać, **co** się dzieje. Komentarze powinny wyjaśniać, **dlaczego** coś nietypowego jest konieczne.
