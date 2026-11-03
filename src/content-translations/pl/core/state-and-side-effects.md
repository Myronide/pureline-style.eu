# Efekty uboczne i niezmienność

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Efekty uboczne {#side-effects}

Ważne efekty uboczne powinny pozostać widoczne.

Zalecane:

```java
var user = users.load(id);
var session = sessions.create(user);

sessions.save(session);
events.publish(new SessionCreated(session.id()));
```

Potencjalnie mylące:

```java
sessions.createAndPersistAndNotify(user);
```

jeśli zapis i publikacja zdarzenia są ważnymi, obserwowalnymi z zewnątrz działaniami.

Pureline nie wymaga ujawniania każdej operacji wewnętrznej. Wymaga unikania zaskakującego, ukrytego zachowania.

---

## Niezmienność {#immutability}

Domyślnie preferuj wartości niezmienne.

Mutacja powinna być zamierzona, lokalna i łatwa do zauważenia.

Zalecane przykłady to rekordy w Javie, dane readonly w TypeScript, `const` w JavaScript, niezmienne obiekty wartości oraz krótkotrwały, modyfikowalny stan lokalny.

Tam, gdzie to praktyczne, unikaj współdzielonego stanu modyfikowalnego.
