---
name: discovery
description: Use for deep design discovery and problem understanding before planning or implementation. Trigger when the user wants to think deeply, build knowledge, surface edge-cases, ask many questions, or explore the problem space without producing plans or code.
---

# Discovery

## Overview

Build a shared, rigorous understanding of the problem space. Focus on deep thinking, comprehensive questioning, and edge-case discovery without planning or implementation.

## Workflow

### 1) Front-load questions
Ask many questions at once to reduce back-and-forth. Prefer breadth over minimalism.

Capture:
- Goal/outcome (what success looks like)
- Audience/user and context
- Constraints (time, budget, tech, tone, scope)
- Current state (what exists today, what to avoid)
- Known pain points and failure modes
- Key assumptions and unknowns

### 2) Build the knowledge map
Structure the domain into key entities, flows, constraints, and risk areas. Prefer explicit lists over prose.

### 3) Stress the edges
Enumerate edge-cases, abuse cases, and ambiguous scenarios. Call out where requirements are underspecified.

### 4) Synthesize the design frame
Summarize the problem boundaries, decision criteria, and open questions without proposing plans or implementation.

## Output Formats

Choose the format that fits the request:
- **Question dump**: 15–40 questions grouped by theme
- **Knowledge map**: Entities, flows, constraints, risks, and assumptions
- **Edge-case inventory**: Scenario list with why each matters
- **Design frame**: Boundaries, criteria, risks, and open questions

## Interaction Notes

- Prefer depth over speed; avoid ideation and solutioning.
- Ask many questions in a single message if it improves clarity.
- Do not create plans, roadmaps, or implementation details.
- If the user asks for a plan or code, pause and confirm whether to switch out of design discovery.
