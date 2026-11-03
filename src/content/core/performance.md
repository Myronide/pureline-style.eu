# Performance

[Code style guide](../README.md) · [Original specification 1.6](../../../PURELINE_SPECIFICATION_1.6.md)

## Performance

Pureline prioritizes readability by default, but performance-sensitive paths should be written deliberately.

In hot paths:

- avoid unnecessary allocations
- avoid repeated reflection
- cache expensive resolution
- use appropriate collections
- avoid hidden blocking
- reduce unnecessary copying
- keep ownership clear

Performance optimizations must remain understandable.
