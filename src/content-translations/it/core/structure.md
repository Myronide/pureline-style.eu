# Classi, moduli e densità delle cartelle

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Classi e moduli {#classes-and-modules}

### PL-STRUCT-001 — Una responsabilità chiara {#pl-struct-001--one-clear-responsibility}

Evita strutture come:

```text
ServerManager
 ├─ database
 ├─ players
 ├─ packets
 ├─ commands
 ├─ configuration
 ├─ HTTP
 └─ logging
```

Preferisci:

```text
server/
    ServerRuntime

network/
    Connection
    PacketRegistry
    PacketDispatcher

session/
    Session
    SessionService

storage/
    UserStorage
    SessionStorage
```

Una classe ha una responsabilità chiara quando i suoi membri e il suo stato interno contribuiscono a un'unica questione coesa. **Il numero di righe da solo non determina se una classe sia ben progettata.** Per le indicazioni sulle dimensioni vedi `PL-STRUCT-003`.

---

## Densità di pacchetti e cartelle {#package-and-folder-density}

### PL-STRUCT-002 — Mantenere i namespace abbastanza piccoli da scorrerli a colpo d'occhio {#pl-struct-002--keep-namespaces-small-enough-to-scan}

Pureline considera la densità di file e tipi parte della leggibilità del codice.

Un pacchetto o una cartella sorgente dovrebbe essere abbastanza piccolo da permettere a chi sviluppa di capirne il contenuto a colpo d'occhio, senza dover cercare in un lungo elenco piatto di file non correlati.

Quando il limite viene superato, dividi il pacchetto o la cartella per responsabilità, invece di lasciare che diventi una discarica.

#### Limiti predefiniti {#default-limits}

| Linguaggio | Valore predefinito di Pureline |
|---|---|
| Java | Massimo 8 tipi di primo livello / file sorgente di produzione per pacchetto |
| Emerald | Massimo 8 file sorgente `.ems` di produzione per cartella sorgente/namespace |
| Emvus | Massimo 8 file sorgente `.ev` di produzione per pacchetto/cartella sorgente |
| JavaScript | Massimo 10 moduli sorgente di produzione per funzionalità/cartella sorgente |
| TypeScript | Massimo 10 moduli sorgente di produzione per funzionalità/cartella sorgente |
| Go | Massimo 12 file `.go` non di test e non generati per directory di pacchetto |
| Crystal | Massimo 10 file `.cr` di produzione per cartella sorgente/namespace |
| Rust | Massimo 10 file `.rs` di produzione mantenuti a mano per funzionalità/cartella sorgente |

Questi file non contano ai fini del limite:

- test e specifiche
- file sorgente generati
- file con soli metadati
- `package-info.java`
- `module-info.java`
- barrel file di JavaScript/TypeScript come `index.ts` o `index.js`
- binding generati o output di protocolli
- snapshot di migrazione e artefatti analoghi generati automaticamente

Lo scopo di questa regola non è imporre un annidamento arbitrario delle cartelle. Una divisione deve introdurre un reale confine di responsabilità.

Sbagliato:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java
    PacketHandler.java
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Preferito:

```text
network/
    Connection.java
    ConnectionFactory.java
    ConnectionState.java

network/packet/
    Packet.java
    PacketCodec.java
    PacketDecoder.java
    PacketEncoder.java
    PacketRegistry.java
    PacketDispatcher.java

network/runtime/
    PacketQueue.java
    PacketMetrics.java
    SocketConfig.java
    SocketRuntime.java
```

Un progetto potrà modificare queste soglie tramite un futuro file di configurazione di Pureline, ma la regola predefinita deve restare volutamente rigorosa.

---

## Coesione prima della dimensione {#cohesion-over-size}

### PL-STRUCT-003 — Coesione prima della dimensione (Zusammengehörigkeit vor Zeilenbegrenzung) {#pl-struct-003--cohesion-over-size-zusammengehörigkeit-vor-zeilenbegrenzung}

> **Coesione prima della dimensione — Zusammengehörigkeit vor Zeilenbegrenzung.**

La dimensione massima preferita per una classe è **un'indicazione, mai un limite rigido**. Tieni insieme la logica fortemente correlata quando dividerla renderebbe il codice più difficile da leggere, mantenere, testare o comprendere. Una classe più grande ma coesa è preferibile a più classi artificiali collegate da una delega superflua.

#### Indicazioni sulla dimensione delle classi {#class-size-guidance}

| Dimensione della classe | Raccomandazione di Pureline |
|---|---|
| Fino a 200 righe | Caso normale preferito |
| 201–400 righe | Nessun problema se la classe ha una responsabilità chiara |
| 401–600 righe | Decisione architetturale deliberata; mantieni comprensibile la sua coesione |
| Più di 600 righe | Revisione consigliata, **non vietata** |

Gli intervalli sono **euristiche, non limiti rigidi**. Superare una soglia non deve, da sola, produrre una violazione di stile né richiedere una divisione.

#### Quando le classi più grandi sono giustificate {#when-larger-classes-are-justified}

- **Parser e lexer:** una macchina a stati coesa può diventare più complicata quando i suoi stati e le sue transizioni vengono sparpagliati su astrazioni artificiali.
- **Algoritmi:** le fasi di elaborazione strettamente accoppiate possono essere più facili da capire e da ottimizzare se restano insieme.
- **Strutture dati centrali:** i metodi che condividono le stesse invarianti e lo stesso stato interno possono appartenere a un'unica classe.
- **Logica complessa ma coesa:** dividere è controproducente quando aggiunge indirezione, deleghe superflue o più coordinamento che chiarezza.

#### Quando dividere comunque {#when-to-split-anyway}

Dividi in base ai **reali confini di responsabilità**, non al numero di righe. Sono indizi: sottosistemi distinti che evolvono in modo indipendente, motivi di modifica non correlati, un accoppiamento debole tra gruppi di metodi o cicli di vita separati che una sola classe nasconde.

**Regola per gli strumenti:** Pureline Checker e le ispezioni degli IDE possono mostrare un avviso informativo sulla dimensione con un suggerimento di revisione della coesione, in particolare oltre le 600 righe. Non devono considerare il numero di righe una prova sufficiente di violazione, estrarre classi automaticamente o richiedere soppressioni solo per mantenere intatta una classe coesa.

Questo principio si applica a **tutti i profili di linguaggio di Pureline**, inclusi Java, JavaScript, TypeScript, Go, Crystal, Rust, Emerald ed Emvus. La sintassi e gli idiomi specifici del linguaggio continuano ad avere la precedenza.
