# Module 01: Prompt Engineering Techniques

## Overview

This module covers two core techniques that separate basic Copilot usage from advanced engineering with Copilot:

1. **Prompt chaining & iterative refinement** — Breaking complex requests into sequential, context-building steps
2. **Code completion for complex logic** — Guiding inline completions with signatures, comments, and examples

## Key Concepts

### Prompt Chaining

Instead of one big ask, break work into a **chain** of prompts where each builds on the last:

```
Step 1: "Define a data model for an order system with Order, LineItem, and Customer"
Step 2: "Create a repository layer for the Order model with CRUD operations"
Step 3: "Add an OrderService that uses the repository and calculates order totals"
Step 4: "Write unit tests for the OrderService using the patterns from step 3"
```

### Iterative Refinement

Start broad, then constrain:

1. Get a first draft
2. Add constraints: *"make this thread-safe"*, *"use the repository pattern"*
3. Handle edge cases: *"what happens if the inventory is insufficient?"*
4. Request tests: *"write tests covering the happy path and the insufficient inventory case"*

### Code Completion Techniques

| Technique | How It Works |
|-----------|-------------|
| **Signature-first** | Write the full function signature with descriptive names and types — Copilot infers the body |
| **Comment-driven** | Write step-by-step comments, then let Copilot fill in each step |
| **Example-driven** | Provide 1–2 examples in comments, Copilot generalizes the pattern |
| **Strategic file ordering** | Open related files as tabs so Copilot cross-references types and patterns |

## Exercises

### Exercise 1: Single Prompt vs. Prompt Chain

Compare the output of a single prompt against a 4-step chain.

**File:** [exercises/exercise-01-prompt-chain.md](exercises/exercise-01-prompt-chain.md)

### Exercise 2: Comment-Driven Completion

Use structured comments to guide Copilot through a complex algorithm.

**File:** [exercises/exercise-02-comment-driven.md](exercises/exercise-02-comment-driven.md)

## Demo Tips

- Show the single-prompt result first so the audience sees the difference a chain makes
- Use a live editor — don't use slides for this module
- Rename variables from `a`, `b`, `c` to descriptive names mid-demo to show how completion quality changes instantly
