# Module 02: Role-Based & Reusable Prompting

## Overview

This module covers how to get fundamentally different outputs from Copilot by **framing prompts with a role** and how to scale that across a team using **reusable prompt files**.

1. **Role-based prompt templates** — Shift Copilot's perspective to DevOps, QA, Architecture, or Security
2. **Prompt library creation** — Build a shared library of `.prompt.md` files your whole team can invoke

## Key Concepts

### Role Prompts

The same code reviewed through different lenses produces different insights:

| Role | Focus Areas |
|------|------------|
| **DevOps Engineer** | Dockerfile best practices, image size, security, CI/CD readiness |
| **QA Architect** | Test coverage, edge cases, test types (unit/integration/e2e) |
| **Solutions Architect** | Scalability, failure modes, coupling, data flow |
| **Security Engineer** | OWASP Top 10, input validation, secrets, auth gaps |

### Prompt Files (`.prompt.md`)

Reusable prompt templates stored in `.github/prompts/`:

```
.github/
└── prompts/
    ├── security-review.prompt.md
    ├── create-unit-test.prompt.md
    ├── create-service.prompt.md
    └── migration-plan.prompt.md
```

Each file has YAML frontmatter (`description`, `mode`) and a body that defines the prompt template.

## Exercises

### Exercise 1: Role-Based Code Review

Review the same code through 4 different role lenses.

**File:** [exercises/exercise-01-role-review.md](exercises/exercise-01-role-review.md)

### Exercise 2: Build a Prompt Library

Create reusable `.prompt.md` files for your team.

**File:** [exercises/exercise-02-prompt-library.md](exercises/exercise-02-prompt-library.md)

### Sample Prompt Files

Ready-to-use prompt templates are in the [prompts/](prompts/) directory.

## Demo Tips

- Show the same Dockerfile or API controller reviewed with 3 different role prompts side-by-side
- Create a `.prompt.md` file live and invoke it immediately — this lands well with audiences
