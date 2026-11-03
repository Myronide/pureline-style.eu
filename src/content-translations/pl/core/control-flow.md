# Przepływ sterowania

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Przepływ sterowania {#control-flow}

Przepływ sterowania to jedna z najważniejszych części Pureline.

Pureline standaryzuje **czytelność i strukturę, a nie identyczną składnię we wszystkich językach**. Java, JavaScript, TypeScript, Go, Emerald i Emvus używają jawnych bloków do sterowania przepływem. Języki z ugruntowanym, czytelnym skrótem, takie jak guardy przyrostkowe w Crystal, mogą go stosować, dopóki warunek i akcja pozostają proste.

### PL-CF-001 — Preferuj guard clauses {#pl-cf-001--prefer-guard-clauses}

Zalecane:

```java
if (request == null) {
    return Result.empty();
}

if (!request.valid()) {
    return Result.invalid();
}

var session = sessions.create(request.user());
return executor.execute(session, request);
```

Unikaj:

```java
if (request != null) {
    if (request.valid()) {
        var session = sessions.create(request.user());
        return executor.execute(session, request);
    } else {
        return Result.invalid();
    }
}

return Result.empty();
```

Główna ścieżka powinna pozostać jak najbliżej bazowego poziomu wcięcia.

### PL-CF-002 — Unikaj `else` {#pl-cf-002--avoid-else}

Unikaj:

```java
if (valid) {
    execute();
} else {
    reject();
}
```

Preferuj:

```java
if (!valid) {
    reject();
    return;
}

execute();
```

Wyrażenie trójargumentowe można stosować do prostego wyboru wartości:

```java
var state = valid ? State.READY : State.INVALID;
```

Złożone, zagnieżdżone wyrażenia trójargumentowe nie są Pureline.

### PL-CF-003 — Jawne bloki w językach z nawiasami klamrowymi {#pl-cf-003--explicit-blocks-in-brace-based-languages}

W Javie, JavaScript, TypeScript, Go i innych językach z nawiasami klamrowymi ciała instrukcji sterujących używają jawnych bloków.

To nie jest Pureline:

```java
if (!valid) return;
```

To również nie jest Pureline:

```java
if (!valid)
    return;
```

Pureline:

```java
if (!valid) {
    return;
}
```

Ta sama zasada dotyczy `for`, `while` i porównywalnych konstrukcji sterujących.

Ta reguła **nie** zakazuje idiomatycznych skrótów w językach, w których taki skrót jest normalną, czytelną częścią języka. Guardy przyrostkowe w Crystal, takie jak `return unless valid`, są zgodne z Pureline, o ile pozostają proste.
