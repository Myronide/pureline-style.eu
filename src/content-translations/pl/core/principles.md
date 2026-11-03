# Zasady podstawowe

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Rdzeń Pureline {#pureline-core}

Poniższe reguły dotyczą wszystkich obsługiwanych języków, o ile język pozwala je zastosować w naturalny sposób.

| ID | Reguła |
|---|---|
| PL-CORE-001 | Przepływ sterowania powinien być możliwie liniowy |
| PL-CORE-002 | Unikaj `else` |
| PL-CORE-003 | Preferuj guard clauses |
| PL-CORE-004 | Używaj najczytelniejszej formy sterowania przepływem dla danego języka; języki z nawiasami klamrowymi używają jawnych bloków |
| PL-CORE-005 | Idiomatyczne skróty właściwe językowi są dozwolone, o ile pozostają natychmiast czytelne |
| PL-CORE-006 | Funkcje powinny być małe i skupione na jednym zadaniu |
| PL-CORE-007 | Nazwy muszą nieść znaczenie |
| PL-CORE-008 | Unikaj zbędnych abstrakcji |
| PL-CORE-009 | Unikaj God Classes i God Modules |
| PL-CORE-010 | Preferuj stan niezmienny |
| PL-CORE-011 | Preferuj nowoczesne cechy języka tam, gdzie poprawiają czytelność |
| PL-CORE-012 | Unikaj zbędnego formatowania w pionie |
| PL-CORE-013 | Komentarze nie mogą kompensować niejasnego kodu |
| PL-CORE-014 | Obsługuj stany niepoprawne i błędy możliwie wcześnie |
| PL-CORE-015 | Utrzymuj ważne efekty uboczne na widoku |
| PL-CORE-016 | Zasoby muszą mieć jasny cykl życia |
| PL-CORE-017 | Preferuj API natywne dla frameworka |
| PL-CORE-018 | Unikaj magicznych wartości |
| PL-CORE-019 | Jawnie określaj zależności |
| PL-CORE-020 | Optymalizuj gorące ścieżki świadomie, nie przypadkiem |
| PL-CORE-021 | Utrzymuj pakiety i foldery źródłowe na tyle małe, by dało się je ogarnąć jednym spojrzeniem |
| PL-CORE-022 | Spójność ponad rozmiar: preferuj jedną spójną odpowiedzialność zamiast dowolnych limitów linii w klasie |
