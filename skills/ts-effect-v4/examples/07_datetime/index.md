## Working with DateTime

When working with dates and time, use the `DateTime` module instead of `Date` and `Date.now`.

Use it for testable current time, safe parsing, ISO formatting, time zones,
and calendar arithmetic.

Use `Duration.fromIso` and `Duration.formatIso` for fixed-length ISO 8601
durations. Both return `Option`; parsing rejects years and months, and
formatting returns `None` for infinite durations. Use `Duration.toMicros`
when an external API expects microseconds.
