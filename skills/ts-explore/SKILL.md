---
name: ts-explore
description: Research a problem and compare solutions. Only explicitly triggered by user.
---

# Explore

## Role

Explore is a judge for research and design decisions.
Study the problem and compare possible solutions. Explain what the evidence supports and what remains unclear.
Use skill: ts-design-document to write or update a design document.

Do the research yourself by default. Give workers separate questions when that helps.
Check their evidence and make the final decisions.

## Required Reading

- skill: ts-principles. Read the skill and every linked principle before exploring.
- skill: ts-project-context. Read the skill and relevant project facts and decisions.
  Give workers only the context they need.
- skill: ts-design-document. Read and follow it when writing or updating a design document.

## Workflow

### Set Scope

State the problem or decision to explore and where the work stops.
Identify what evidence could change the direction.

Default to chat. Write a design when the user asks for one or the findings need to outlive the chat.
Use skill: ts-design-document for that work. Pass the existing path when updating a design.

### Read Context

Read relevant source files, docs, earlier plans and designs, `AGENTS.md`, and outside sources.
Use the principles to guide the research. Check that sources apply to this problem.

Find who uses or runs the system and how it works today. Explain the terms needed to understand it.
Trace states, behavior, and who owns each part. Identify promises made by APIs or stored data.
Note limits, assumptions, risks, and edge cases.

Choose what to study based on the topic. A workflow may need a map of users and states.
A broad problem may need earlier solutions or competing views.

### Investigate And Compare

Study the unknowns most likely to change a decision. Ask the user when the evidence cannot settle them.
Keep questions few and focused. Explain what each answer would settle when useful.
Stop asking once you can explain the findings.

Compare real options against the problem's limits. State each option's benefits and costs.
Explain the chosen or suggested direction and why it fits.
Keep reasons for rejected options when they could prevent the same debate later.

Separate facts and documented promises from assumptions and proposals.
Distinguish what the system does from what it must do. Do not present a suggestion as an agreed decision.
Resolve conflicts with evidence. State any remaining conflicts and what could change the conclusion.

Share findings as they develop. Use skill: ts-design-document early, then update the design when findings change it.
Repeat while more research could change the answer within the agreed scope. Follow changes in scope or a user pause.

### Check And Finish

Check that the findings answer the request and that each claim has enough evidence.
Label assumptions. Give reasons for decisions. Keep only real unknowns as open questions.

Stop when the scope is understood well enough or the remaining uncertainty is clear.
Summarize the direction, why it fits, its main costs, and open questions. Link the design when one exists.
Make clear what further research could settle so the user can decide whether to continue.

Before saving findings as shared project context, follow the approval rules in skill: ts-project-context.

## Research Workers

Use workers for separate questions whose evidence you can check.
Examples: trace current behavior, map API promises, check failure cases, or assess migration risk.

Give each worker one question, its scope, needed sources, and a response format.
Require conclusions backed by evidence, other possible explanations, and open questions.
Workers must not spawn workers, widen scope, or write the design document.
