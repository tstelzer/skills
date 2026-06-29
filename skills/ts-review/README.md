# Review skill

## Design notes

The `ts-review` skill is a judge. The judge owns scope, worker selection,
prompts, aggregation, severity normalization, and artifact writing. Workers
own one review type and report findings inline. See `SKILL.md`.

## Worker Models

Worker model classes follow provider/model availability in this order:

1. OpenAI `gpt` latest, reasoning `xhigh`
2. Anthropic `opus` latest, reasoning `xhigh`
3. OpenRouter `glm` latest, reasoning `xhigh`
4. OpenRouter `gemini flash` latest, reasoning `high`
5. OpenRouter `deepseek v4 pro` latest, reasoning `high`

The judge should spawn two workers per selected review type when two model
classes are available. Use different model classes for those workers. If two
workers of the same type directly conflict on a finding, the judge may spawn a
third worker on the next available model class. If no third model class is
available, the judge resolves the conflict directly.
