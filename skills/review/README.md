# Review skill

## Design notes

The review skill is a judge. The judge owns scope, worker selection,
prompts, aggregation, severity normalization, and artifact writing. Workers
own one review type and report findings inline. See `SKILL.md`.

## Potential improvements

### Worker disagreement protocol

Today the judge deduplicates worker output and otherwise keeps findings
as-is. If two workers reach opposite conclusions on the same code, the
divergence collapses into one finding and the signal is lost.

A future improvement: spawn an independent IV&V worker (different model,
fresh context) to break ties. See the parent repo `README.md`
"Verification" section for IV&V rules.
