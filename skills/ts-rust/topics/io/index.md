# Text and I/O

Choose the data's representation before reading, slicing, or writing it.
Handle short reads and writes as normal parts of stream I/O.

| Need | Read |
| --- | --- |
| Slice UTF-8 text, decode bytes, or parse a prefix | [Text](./text.md) |
| Build paths or open files without a separate existence check | [Paths](./paths.md) |
| Read records, write all bytes, or return borrowed results | [Streams](./streams.md) |
| Parse bounded messages and reject unchecked trailing data | [Parsing](./parsing.md) |

For async I/O, read [execution](../async/execution.md) and [cancellation](../async/cancellation.md).
For write completion and durability, read [resources](../memory/resources.md).
