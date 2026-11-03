# Wydajność

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Wydajność {#performance}

Domyślnie Pureline stawia czytelność na pierwszym miejscu, ale ścieżki wrażliwe na wydajność należy pisać świadomie.

W gorących ścieżkach:

- unikaj zbędnych alokacji
- unikaj wielokrotnej refleksji
- buforuj kosztowne rozwiązywanie zależności i symboli
- używaj odpowiednich kolekcji
- unikaj ukrytego blokowania
- ograniczaj zbędne kopiowanie
- utrzymuj jasną własność

Optymalizacje wydajności muszą pozostać zrozumiałe.
