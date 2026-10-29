## Working with Schedules

Schedules define recurring patterns for retries, repeats and polling.

Set `onDstOverlap` on `Cron` or `Schedule.cron` when repeated local times matter:
`"earlier"` uses the first occurrence, `"later"` the second, and `"both"` runs
both. The default is `"earlier"`.
