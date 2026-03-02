# Module 5 Exercises: Agent Mode & Custom Agents

## Exercise Instructions

### Exercise 5A: Agent Mode Multi-Step Task (10 min)

1. Switch to **Agent** mode in Copilot Chat
2. Enter the validation utility prompt (see the [module README](../README.md) for full prompt)
3. Observe how Agent mode:
   - Plans the file structure
   - Creates files in correct locations
   - Proposes terminal commands
   - Iterates on failures

### Exercise 5B: Custom Agents with Handoffs (15 min)

The following agents are pre-configured in `.github/agents/`:

| Agent | File | Purpose | Tools |
|-------|------|---------|-------|
| **Planner** | `planner.agent.md` | Creates implementation plans | read, search |
| **Implementer** | `implementer.agent.md` | Writes code and tests | edit, search, read, terminal |
| **Reviewer** | `reviewer.agent.md` | Reviews code quality and security | read, search |

**Workflow:**

1. Select **planner** from the agents dropdown
2. Ask: `Plan adding a caching layer with TTL support for the user service`
3. Review the plan output
4. Click **Start Implementation** handoff button
5. Watch the implementer work
6. Click **Review Implementation** handoff button
7. Read the review findings

### Exercise 5C: Subagent Orchestration (15 min)

Additional agents for orchestration:

| Agent | File | Purpose |
|-------|------|---------|
| **Feature Builder** | `feature-builder.agent.md` | Coordinator that uses Planner, Implementer, and Reviewer as subagents |
| **Security Scanner** | `security-scanner.agent.md` | Subagent-only security specialist |

**Steps:**

1. Select **feature-builder** from the agents dropdown
2. Ask: `Build a password reset feature for the user service with email notification`
3. Observe:
   - Planner subagent researches and plans
   - Implementer subagent codes the feature
   - Reviewer subagent checks the result
   - Coordinator synthesizes all results

### Exercise 5D: Prompt File with Subagent (10 min)

1. Create `.github/prompts/analyze-and-test.prompt.md` (see the [module README](../README.md))
2. Open a code file from the `module-02-chat-deep-dive/samples/` directory
3. Type `/analyze-and-test` in Chat
4. Observe the subagent execution flow

### Troubleshooting

- **Subagents not working?** Enable the `runSubagent` tool: click the tools icon in Chat → enable `runSubagent`
- **Agent not appearing?** Check Chat → Configure Custom Agents → verify your `.agent.md` files are detected
- **Diagnostics**: Right-click in Chat → Diagnostics to see all loaded agents
