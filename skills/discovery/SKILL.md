---
name: discovery
description: Use for deep design discovery and problem understanding before planning or implementation. Trigger when the user wants to think deeply, build knowledge, surface edge-cases, ask many questions, or explore the problem space without producing plans or code; save a design artifact only when durable context is requested or clearly useful.
---

# Discovery

## Overview

Let's get on the same page about the problem before we jump into plans or code. This is where we slow down, ask good questions, and poke at edge cases so we don't miss anything important.

Start by choosing the interaction depth:

- Lightweight discovery: use for informal exploration, question-only requests, or cases where a durable artifact would be overhead. Ask the 1-3 highest-leverage questions, or synthesize what is already known when questions are not needed. End with a concise chat summary and any open questions.
- Full discovery: use when the topic is complex, the answers will feed future planning or implementation, or the user asks for durable design context. Ask a focused batch of 3-7 questions, iterate as needed, and write a standalone design artifact at the end.

Ask questions only when the answers materially affect the design understanding. Keep each batch answerable, never more than 7 questions at once. Prioritize questions based on importance. Start high-level, go deeper when necessary.

Possible Themes (no need to be exhaustive, pick whichever make sense):
- Goal/outcome (what success looks like)
- Audience/user and context
- Constraints (time, budget, tech, tone, scope)
- Current state (what exists today, what to avoid)
- Known pain points and failure modes
- Key assumptions and unknowns

Call out edge cases, abuse cases, and fuzzy scenarios. Point out places where the requirements feel squishy or underspecified.

At the end of discovery, decide whether persistence is warranted:

- Write a standalone design artifact when the user asks for one, the discovery produced decisions or constraints that should not be lost, or future planning/implementation is likely to depend on the learned context.
- Otherwise, summarize the useful conclusions in chat and do not write a file.

**Announce at start:** "I'm using the discovery skill to understand the design space."

## Design Artifact

The artifact is a design document, not a plan or a review.

- A design records the problem understanding, goals, constraints, decisions, options, tradeoffs, ruled-out approaches, risks, edge cases, and open questions.
- A plan gives concrete implementation steps for building part of a design.
- A review lists findings about an artifact, such as an implementation, plan, or design.

**Save designs to:** `<repository-root>/designs/YYYY-MM-DD_HH:MM_<design-name>.md`

Create `designs/` if it does not exist.

Use this structure as the default, but adapt section names and add/remove sections when the topic needs it:

```markdown
# Design: <Name>

## Summary
<1-3 sentences describing the problem, intended outcome, and current design understanding.>

## Context
<Relevant background, users/audience, existing state, constraints, and why this matters.>

## Goals
<Bulleted outcomes this design should support.>

## Non-Goals
<Bulleted boundaries for what this design is not trying to solve. Skip if not useful.>

## What We Learned
<Important discoveries, domain facts, user needs, constraints, assumptions, and edge cases.>

## Design Shape
<Current conceptual model, requirements, principles, interfaces, UX shape, system behavior, or other design-relevant structure. Keep this at design level, not implementation-task level.>

## Options Considered
<Candidate approaches, including approaches ruled out. Capture why they matter and why they were accepted, rejected, or deferred.>

## Risks and Edge Cases
<Known failure modes, abuse cases, fuzzy scenarios, and places where the design may break down.>

## Open Questions
<Unresolved decisions or unknowns that future discovery, planning, or review should address. Skip only if none remain.>
```

## Artifact Rules

- Write a design artifact only at the end of discovery and only when persistence is warranted, unless the user explicitly asks to continue discovery instead.
- Do not write a design artifact when the user asks not to write files or only wants a lightweight discussion.
- When not writing an artifact, end with a concise chat summary of the current understanding, important tradeoffs, and open questions.
- The design MUST be standalone; do not rely on the prior chat.
- Preserve learnings that are likely to matter later, especially constraints, rejected approaches, and unresolved questions.
- Do not include ordered implementation tasks, file-level change lists, verification commands, or roadmaps.
- Do not force every section when it would add noise; keep the artifact useful as durable design memory.
- If the user asks to move from discovery into planning or implementation, offer to persist a design artifact first only when important context would otherwise be lost.

## Interaction Notes

- Embrace depth.
- Do not create plans, roadmaps, implementation steps, or code.
- If the user asks for a plan or code, switch out of discovery when enough context exists. If the design context is substantial and not yet captured, ask whether to save it before switching.
