# Serialization

The examples use Serde with its derive support. JSON examples also need `serde_json`.
Keep the external data format and the internal type's validity rules explicit.

| Need | Read |
| --- | --- |
| Choose field names, enum tags, or compatibility defaults | [Wire format](./format.md) |
| Enforce constructors while deserializing | [Validation](./validation.md) |
