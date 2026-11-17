# Parse each message within its declared bytes

Give each nested parser only the bytes assigned to its value by the enclosing format.
Before reporting success for a complete message, check that every byte was consumed.

This example format has a one-byte payload length followed by a two-byte count in big-endian order.
The complete frame must contain exactly those bytes.

## Bad

```rust
enum ParseError { Truncated }

fn parse_frame(input: &[u8]) -> Result<u16, ParseError> {
    let bytes = input.get(1..3).ok_or(ParseError::Truncated)?;
    Ok(u16::from_be_bytes([bytes[0], bytes[1]]))
}
```

This ignores the declared length and accepts trailing data.
A nested parser given the whole remaining buffer can consume bytes belonging to the next field.

## Good

```rust
#[derive(Debug, PartialEq, Eq)]
enum ParseError { Truncated, TrailingData, InvalidLength }

fn parse_frame(input: &[u8]) -> Result<u16, ParseError> {
    let (&length, rest) = input.split_first().ok_or(ParseError::Truncated)?;
    let length = usize::from(length);
    if rest.len() < length {
        return Err(ParseError::Truncated);
    }
    let (payload, trailing) = rest.split_at(length);
    if !trailing.is_empty() {
        return Err(ParseError::TrailingData);
    }
    parse_count(payload)
}

fn parse_count(payload: &[u8]) -> Result<u16, ParseError> {
    let bytes = payload.try_into().map_err(|_| ParseError::InvalidLength)?;
    Ok(u16::from_be_bytes(bytes))
}

assert_eq!(parse_frame(&[2, 0, 42]), Ok(42));
assert_eq!(parse_frame(&[1, 42]), Err(ParseError::InvalidLength));
assert_eq!(parse_frame(&[2, 0, 42, 99]), Err(ParseError::TrailingData));
```

The outer parser limits the payload slice. The inner parser requires exactly two bytes.
For parsers that accept a prefix, follow [the unused-input contract](./text.md#keep-unused-input-visible).
Keep [input size limits](./streams.md#keep-buffering-and-input-limits-clear) at the read and allocation boundaries.

## Finish validation before reporting success

An iterator that parses on demand validates only the items it visits.
`find`, `any`, or `take` can leave an invalid tail unchecked.
When the whole sequence must be valid, reach its end before reporting success. Propagate the first error.
Keep a matching item while checking the rest, or collect into `Result<Vec<_>, _>` when the caller needs stored results.

Test truncated lengths and payloads. Check trailing data and a valid prefix followed by an invalid element.
