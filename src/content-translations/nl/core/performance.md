# Prestaties

[Codestijlgids](../README.md) · [Oorspronkelijke specificatie 1.7](../../../PURELINE_SPECIFICATION_1.7.md)

## Prestaties {#performance}

Pureline geeft standaard voorrang aan leesbaarheid, maar prestatiegevoelige paden moeten bewust worden geschreven.

In hot paths:

- vermijd onnodige allocaties
- vermijd herhaalde reflectie
- cache dure resolutie
- gebruik geschikte collecties
- vermijd verborgen blokkering
- beperk onnodig kopiëren
- houd eigenaarschap duidelijk

Prestatieoptimalisaties moeten begrijpelijk blijven.
