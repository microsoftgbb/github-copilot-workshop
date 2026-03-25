# Module 03: Agentic Workflows & Agent Steering

## Overview

Agent mode gives Copilot autonomy to plan and execute multi-step tasks — reading files, writing code, running terminal commands. **Steering** is how you keep the agent aligned with your architecture, standards, and intent.

1. **Task decomposition** — Structure prompts so the agent works in scoped, predictable steps
2. **Constraint-based steering** — Tell the agent what NOT to do
3. **Custom agents** — Define specialized `.agent.md` files for recurring workflows
4. **Guardrails** — Restrict tools and scope to prevent unintended side effects

## Key Concepts

### Good vs. Bad Agent Prompts

| Quality | Prompt |
|---------|--------|
| ❌ Vague | "Add authentication to the app" |
| ✅ Scoped | "Add JWT auth middleware in `src/middleware/auth.ts`. Use `jsonwebtoken`. Add login/register routes in `src/routes/auth.ts`. Use bcrypt. Follow patterns from `src/routes/users.ts`." |

### Steering Mechanisms

| Mechanism | File | Scope |
|-----------|------|-------|
| **Instructions** | `.instructions.md` | Applied per file pattern via `applyTo` |
| **Custom Agents** | `.agent.md` | Invoked by name, with specific tools and persona |
| **Copilot Instructions** | `copilot-instructions.md` | Global defaults for all interactions |
| **Constraints in prompt** | (inline) | One-off constraints in the chat message |

## Exercises

### Exercise 1: Vague vs. Structured Agent Tasks

Compare agent outcomes with vague vs. well-structured prompts.

**File:** [exercises/exercise-01-agent-steering.md](exercises/exercise-01-agent-steering.md)

### Exercise 2: Custom Agent Creation

Build a custom `.agent.md` file for a specific workflow.

**File:** [exercises/exercise-02-custom-agents.md](exercises/exercise-02-custom-agents.md)

### Sample Agents

Ready-to-use agent definitions are in the [agents/](agents/) directory.

## Demo Tips

- Run the vague prompt first, let the agent go — then show the mess
- Rerun with structured constraints and show the dramatically better outcome
- Create a custom agent live and invoke it by name
