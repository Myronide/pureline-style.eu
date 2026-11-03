# Flutter Code Style

[Przewodnik po stylu kodu](../README.md) · [Oryginalna specyfikacja 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Stosuj [reguły wspólne](../README.md#shared-rules) razem z tym profilem. Profil Flutter dotyczy **Dart 3 z Flutter 3.x** i solidnej null safety. Pod spodem obowiązują reguły języka Dart: domyślnie `final` oraz typy sealed tam, gdzie modelują zamknięty zbiór stanów. Widżet jest funkcją swojej konfiguracji i stanu: konfiguracja na wejściu, guardy, wartości pochodne, drzewo widżetów na wyjściu.

## Profil Flutter {#flutter-profile}

### PL-FLUT-001 — Metody build są małe i wolne od efektów ubocznych {#pl-flut-001--build-methods-are-small-and-free-of-side-effects}

`build` oblicza drzewo widżetów z jego wejść i niczego więcej. Nie uruchamia żądań, nie zapisuje do magazynu, nie nawiguje ani nie modyfikuje pól. Gdy drzewo urośnie ponad jeden ekran zagnieżdżeń, wydziel blok ([PL-FLUT-002](#pl-flut-002--extract-growing-widgets-into-const-classes)). Efekty uboczne należą do handlerów zdarzeń i warstwy stanu ([stan i efekty uboczne](../core/state-and-side-effects.md)).

### PL-FLUT-002 — Wydzielaj rosnące widżety do klas const {#pl-flut-002--extract-growing-widgets-into-const-classes}

Wydziel blok do własnego `StatelessWidget`, gdy ma własną nazwę, dane lub stan. Nie wydzielaj metod pomocniczych zwracających widżety: nie mogą być `const` i ukrywają granicę widżetu przed Flutterem.

```dart
class SessionHeader extends StatelessWidget {
  const SessionHeader({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Text(title, style: Theme.of(context).textTheme.titleLarge),
    );
  }
}
```

### PL-FLUT-003 — Konstruktory const, gdzie tylko się da {#pl-flut-003--const-constructors-wherever-possible}

Oznaczaj konstruktory jako `const`, gdy wszystkie pola są final, i pisz `const` w każdym miejscu wywołania, którego wartość jest stała w czasie kompilacji.

```dart
return const Padding(
  padding: EdgeInsets.all(16),
  child: Icon(Icons.check),
);
```

### PL-FLUT-004 — Jedno podejście do zarządzania stanem na aplikację {#pl-flut-004--one-state-management-approach-per-app}

Wybierz jedno podejście dla całej aplikacji i nazwij je w README projektu: Riverpod albo `ChangeNotifier` z `provider` dla mniejszych aplikacji. Stosuj je konsekwentnie. `setState` jest w porządku dla czysto lokalnego stanu UI, takiego jak przełącznik czy flaga rozwinięcia. Stan biznesowy mieszka w providerach lub notifierach, a nie w widżetach.

```dart
final sessionsProvider = FutureProvider<List<Session>>((ref) {
  return ref.watch(sessionRepositoryProvider).fetchAll();
});
```

### PL-FLUT-005 — Żadnych wywołań sieci ani magazynu wewnątrz build {#pl-flut-005--no-network-or-storage-calls-inside-build}

`build` działa przy każdej przebudowie, więc umieszczone tam żądanie powtarza się w nieprzewidywalny sposób. Dane ładuj w warstwie stanu; widżety renderują wynik.

### PL-FLUT-006 — Guard clauses przed głównym drzewem {#pl-flut-006--guard-clauses-before-the-main-tree}

Najpierw obsłuż stany ładowania, błędu i pusty, i wróć wcześnie. Poprawny układ pozostaje na bazowym poziomie wcięcia.

```dart
@override
Widget build(BuildContext context) {
  final error = state.error;
  if (state.isLoading) {
    return const LoadingView();
  }
  if (error != null) {
    return ErrorView(message: error);
  }
  return ProfileDetails(user: state.user);
}
``` Unikaj zagnieżdżonych warunków w drzewach widżetów.

### PL-FLUT-007 — Klucze tylko tam, gdzie liczy się tożsamość elementu listy {#pl-flut-007--keys-only-where-list-identity-matters}

Nadaj klucz tylko wtedy, gdy tożsamość widżetu musi przetrwać zmianę kolejności lub usunięcie, jak w stateful elementach listy lub w `Dismissible`. Używaj stabilnego identyfikatora z danych, nigdy indeksu listy.

```dart
ListView.builder(
  itemCount: sessions.length,
  itemBuilder: (context, index) {
    final session = sessions[index];
    return SessionTile(key: ValueKey(session.id), session: session);
  },
);
```

### PL-FLUT-008 — BuildContext po await wymaga sprawdzenia mounted {#pl-flut-008--buildcontext-after-await-needs-a-mounted-check}

`BuildContext` może należeć do widżetu usuniętego w czasie oczekiwania na `await`. Przed użyciem go po `await` sprawdź, czy nadal jest zamontowany.

```dart
Future<void> handleSave() async {
  await repository.save(draft);
  if (!context.mounted) {
    return;
  }
  Navigator.of(context).pop();
}
```

Wewnątrz podklasy `State` sprawdzaj zamiast tego `mounted`.

### PL-FLUT-009 — Foldery funkcji i gęstość folderów {#pl-flut-009--feature-folders-and-folder-density}

Widżety, providery i testy grupuj według funkcji (`lib/features/sessions/`), a nie według rodzaju pliku w całej aplikacji. Folder domyślnie zawiera co najwyżej **10 ręcznie utrzymywanych plików źródłowych**. To próg przeglądowy: dziel według odpowiedzialności, a nie na bezsensowne zagnieżdżone foldery ([struktura](../core/structure.md)).

### PL-FLUT-010 — Narzędzia strzegą każdej zmiany {#pl-flut-010--tooling-gates-every-change}

Każda zmiana przechodzi formatter i analizatory przed przeglądem:

```text
dart format --set-exit-if-changed .
dart analyze
flutter analyze
```

`dart format` rozstrzyga układ, więc spory o formatowanie nigdy nie trafiają do przeglądu. Ostrzeżenia nie są opcjonalne: wyłączona reguła lintera wymaga uzasadnienia w `analysis_options.yaml`.
