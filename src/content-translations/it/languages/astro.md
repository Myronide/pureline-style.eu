# Stile del codice Astro

[Guida allo stile del codice](../README.md) · [Specifica originale 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

Applica le [regole condivise del core](../README.md#shared-rules) con questo profilo e il [profilo TypeScript](typescript.md) per lo script del frontmatter. Astro renderizza l'HTML sul server o in fase di build e distribuisce JavaScript solo dove serve. Pureline Astro mantiene visibile questo modello: statico per impostazione predefinita, interattivo dove dichiarato. Pureline è compatibile con Astro 5 e successivi.

## Profilo Astro {#astro-profile}

```text
Frontmatter (data, imports, props)
↓
Template (markup and expressions)
↓
Scoped styles
↓
Islands (explicit client directives only)
```

### PL-AS-001 — I componenti sono file `.astro` con nomi in `PascalCase` {#pl-as-001--components-are-astro-files-named-in-pascalcase}

Un componente sta in `src/components/` e prende il nome da ciò che renderizza (`SessionCard.astro`). Una pagina o un layout sta in `src/pages/` o `src/layouts/`. I file di route restano sottili: caricano i dati e compongono i componenti.

### PL-AS-002 — Il frontmatter è lineare e tipizzato {#pl-as-002--frontmatter-is-linear-and-typed}

Il frontmatter (tra i delimitatori `---`) fa quattro cose, in ordine: riceve props tipizzate, carica i dati, calcola i valori derivati e poi renderizza. Dichiara le props con un'`interface Props`. Mantieni il frontmatter privo di markup.

```astro
---
interface Props {
    title: string;
    draft?: boolean;
}

const { title, draft = false } = Astro.props;
if (draft) {
    return Astro.redirect("/drafts");
}
---
<h2>{title}</h2>
```

### PL-AS-003 — Statico per impostazione predefinita, isole per dichiarazione {#pl-as-003--static-by-default-islands-by-declaration}

Renderizza HTML senza JavaScript, a meno che il componente debba rispondere all'utente o cambiare nel tempo. Quando deve, contrassegna l'unico componente interattivo con una direttiva client esplicita: `client:visible` per il contenuto sotto la piega, `client:idle` per i widget non urgenti, `client:load` solo per ciò che serve al primo paint. Un componente senza direttiva non distribuisce mai JavaScript.

### PL-AS-004 — I template restano leggibili {#pl-as-004--templates-stay-readable}

- Condizionali con `&&` o una variabile con nome per un singolo ramo; usa una guardia nel frontmatter per le uscite anticipate.
- Mappe sulle liste con una `key` stabile quando la lista è interattiva.
- Non annidare più di due livelli di espressioni dentro il markup. Sposta la parte interna in un componente.

### PL-AS-005 — Gli stili hanno un ambito {#pl-as-005--styles-are-scoped}

Usa per impostazione predefinita blocchi `<style>` nel componente; Astro ne limita automaticamente l'ambito. Usa `is:global` solo per regole valide su tutto il documento, come il reset o i token del tema, e tienile in un unico foglio di stile globale.

### PL-AS-006 — I dati hanno un'unica fonte {#pl-as-006--data-has-one-source}

Il contenuto sta nelle content collection (`src/content/`) con uno schema (`defineCollection` e zod). Le pagine interrogano la collection; non analizzano esse stesse i file Markdown. I dati remoti vengono caricati una sola volta, nel frontmatter della pagina che ne ha bisogno.

### PL-AS-007 — Le isole di framework seguono il proprio profilo {#pl-as-007--framework-islands-follow-their-own-profile}

Un'isola React, Vue o Svelte segue il profilo di quel framework (per React: [PL-REACT](react.md)). Astro non cambia le regole del componente; decide soltanto dove il componente viene idratato.

### PL-AS-008 — Densità delle cartelle {#pl-as-008--folder-density}

`src/components/` contiene al massimo **10 file** per impostazione predefinita. Raggruppa i componenti per funzionalità (`components/blog/`) quando una funzionalità ha più file.

### PL-AS-009 — Strumenti {#pl-as-009--tooling}

Esegui `astro check` (diagnostiche su tipi e template) e la build nella CI. Usa l'output di `astro build` per verificare che le pagine senza isole non distribuiscano JavaScript.
