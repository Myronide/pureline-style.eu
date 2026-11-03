# Stile del codice TypeScript

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) insieme a questo profilo. Le regole native del linguaggio e le eccezioni esplicite del profilo hanno la precedenza sulle preferenze di sintassi valide tra i linguaggi. [Coesione prima della dimensione](../core/structure.md) vale in ogni caso.

TypeScript eredita anche il [profilo JavaScript](javascript.md).

## Profilo TypeScript {#typescript-profile}

TypeScript eredita tutte le regole di Pureline JavaScript.

### PL-TS-001 — Evitare `any` {#pl-ts-001--avoid-any}

Evita:

```ts
function load(value: any): any {
}
```

Preferisci:

```ts
function load(value: UserId): User {
}
```

Usa `unknown` per i dati davvero sconosciuti:

```ts
function parse(input: unknown): Config {
}
```

### PL-TS-002 — Usare i tipi in modo deliberato {#pl-ts-002--use-types-deliberately}

Sia i tipi locali inferiti sia quelli espliciti sono conformi a Pureline.

```ts
const user = loadUser();
```

è valido quando il tipo inferito è ovvio.

Anche la tipizzazione esplicita è altrettanto valida:

```ts
const user: User = loadUser();
```

Pureline **non** considera un'annotazione esplicita ridondante solo perché TypeScript potrebbe inferirla.

I tipi espliciti sono particolarmente utili quando:

- rendono più chiaro l'intento
- documentano un contratto atteso
- proteggono un confine da un allargamento involontario del tipo
- aumentano la sicurezza nel refactoring
- rendono il codice più facile da capire senza dover seguire un'intera catena di chiamate

L'inferenza dei tipi dovrebbe eliminare il rumore. Non dovrebbe mai diventare una regola contro l'uso del sistema di tipi di TypeScript.

### PL-TS-003 — Nessun prefisso `I` alla Java {#pl-ts-003--no-java-style-i-prefix}

Preferito:

```ts
interface Session {
}
```

Non:

```ts
interface ISession {
}
```

Il prefisso `I` dipende dal profilo: lo usano Java, Emerald ed Emvus; TypeScript no.

### PL-TS-004 — `interface` o `type` {#pl-ts-004--interface-vs-type}

Usa `interface` per i contratti simili a oggetti:

```ts
interface User {
    id: string;
    name: string;
}
```

Usa `type` per unioni, alias e forme richiamabili:

```ts
type SessionState = "ready" | "closed" | "failed";
```

```ts
type Handler = (packet: Packet) => Promise<void>;
```

### PL-TS-005 — Preferire le unioni agli enum, quando opportuno {#pl-ts-005--prefer-union-types-over-enums-when-appropriate}

Preferito:

```ts
type State = "idle" | "ready" | "closed";
```

Usa un enum solo quando un vero costrutto enum porta un valore aggiunto.

### PL-TS-006 — Tipi forti ai confini, libertà all'interno {#pl-ts-006--strong-types-at-boundaries-freedom-internally}

Le API pubbliche, i dati esterni, i confini di persistenza e i payload di rete dovrebbero normalmente esporre tipi chiari.

All'interno di un'implementazione sono validi sia le annotazioni esplicite sia l'inferenza. Scegli la forma che rende il codice più facile da capire. Pureline non giudica una delle due più pulita solo perché contiene meno annotazioni di tipo.

---

### PL-TS-007 — Densità delle cartelle {#pl-ts-007--folder-density}

Una cartella di funzionalità/sorgenti TypeScript può contenere al massimo **10 moduli sorgente di produzione** per impostazione predefinita.

I barrel file come `index.ts`, i file di supporto con sole dichiarazioni, i test, i file generati e i file con soli metadati non contano.

Una divisione dovrebbe rappresentare un reale confine di responsabilità, ad esempio:

```text
session/
session/state/
session/transport/
session/storage/
```
