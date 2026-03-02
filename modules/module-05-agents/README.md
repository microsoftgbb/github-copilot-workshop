# Module 5: Agent Mode & Custom Agents

> **Duration:** 75 minutes (25 min demo + 50 min hands-on)  
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Use Agent mode in VS Code for autonomous multi-step tasks with terminal command execution
- Create custom agents (`.agent.md`) with specialized tools, instructions, and model selection
- Implement handoffs between agents for sequential multi-step workflows (e.g., Plan → Implement → Review)
- Understand and configure subagents for parallel task delegation and context isolation
- Build an orchestration pattern using coordinator and worker agents with the `agents` property

---

## 1. Agent Mode in VS Code (10 min demo)

### What Is Agent Mode?

Agent mode enables Copilot to **autonomously** complete complex, multi-step tasks. Unlike Ask mode (read-only) or Edit mode (controlled edits), Agent mode:

- **Determines which files** to create or modify
- **Runs terminal commands** (with your approval)
- **Iterates on errors:** if a build fails, it reads the output and tries to fix it
- **Integrates with MCP servers** for external tool access

### When to Use Agent Mode

| Scenario | Mode |
|----------|------|
| "What does this function do?" | **Ask** |
| "Rename this variable in these 3 files" | **Edit** |
| "Add a caching layer to the user service with Redis and update all tests" | **Agent** |
| "Create a detailed plan for migrating from REST to GraphQL" | **Plan** |

### Agent Mode Demo: Adding a Feature

```
Add a health check endpoint to the Spring Boot application.

Requirements:
- Create a HealthController with GET /api/health endpoint
- Include checks for database connectivity and external service availability
- Return a structured JSON response with status, checks array, and timestamp
- Add unit tests for the controller
- Update the README with the new endpoint documentation
```

Watch Copilot:
1. Analyze the project structure
2. Create the controller file
3. Create the health check service
4. Generate unit tests
5. Suggest running `mvn test` to verify
6. Update the README

> **Enterprise tip:** Each prompt you enter in Agent mode counts as one premium request. Follow-up actions (tool calls, file reads) are **not** charged separately.

---

## 2. Custom Agents (5 min demo)

### What Are Custom Agents?

Custom agents are **specialized AI personas** defined in `.agent.md` files. Each agent has:
- **Instructions:** How the AI should behave
- **Tools:** Which capabilities are available (read, edit, search, terminal, MCP, etc.)
- **Model:** Which AI model to use (optional)
- **Handoffs:** Suggested next steps that transition to another agent

### Agent File Structure

```markdown
---
name: agent-name
description: What this agent does (shown in the dropdown)
tools: ['edit', 'search', 'read', 'terminal']
model: GPT-4o (copilot)
handoffs:
  - label: Next Step
    agent: another-agent
    prompt: Continue with the next phase
    send: false
---

# Agent Instructions

Your detailed instructions go here.
You can reference files: [coding standards](../../.github/copilot-instructions.md)
You can reference tools: #tool:githubRepo
```

### Agent File Locations

| Scope | Location |
|-------|----------|
| Workspace (shared with team) | `.github/agents/NAME.agent.md` |
| User profile (personal) | User profile `agents/` folder |
| Claude-compatible | `.claude/agents/NAME.md` |

---

## 3. Handoffs Between Agents (5 min demo)

Handoffs create **guided sequential workflows** by transitioning between agents with pre-filled prompts.

### How Handoffs Work

1. Agent A completes its task
2. A **handoff button** appears at the bottom of the response
3. User clicks the button to switch to Agent B with context and a pre-filled prompt
4. If `send: true`, Agent B starts automatically

### Enterprise Workflow Example: Feature Development

```
┌─────────────┐     ┌───────────────┐     ┌──────────────┐
│    Plan      │────▶│  Implement    │────▶│   Review     │
│  (read-only) │     │ (full access) │     │ (read-only)  │
└─────────────┘     └───────────────┘     └──────────────┘
    Handoff:            Handoff:
    "Start              "Review the
    Implementation"     Implementation"
```

### Planning Agent with Handoff

```markdown
---
name: planner
description: Generate implementation plans for features
tools: ['read', 'search']
handoffs:
  - label: Start Implementation
    agent: implementer
    prompt: Implement the plan outlined above. Follow each step carefully.
    send: false
  - label: Export Plan
    agent: agent
    prompt: Save the above plan as a markdown file in docs/plans/
    send: false
---

You are a senior technical architect. When asked about a feature:

1. Research the existing codebase thoroughly using read and search tools
2. Identify all files that will need to change
3. List any new files that need to be created
4. Define the implementation order with dependencies
5. Identify potential risks and edge cases
6. Estimate complexity for each step

Output a structured implementation plan in markdown format.
Do NOT make any code changes. Your role is planning only.
```

---

## 4. Subagents (5 min demo)

### What Are Subagents?

Subagents are **isolated agent instances** that perform focused work within a chat session. They:
- Run in their own context window (clean state)
- Don't clutter the main conversation with intermediate steps
- Return only the final result to the main agent
- Can run **in parallel** for independent tasks

### Why Use Subagents?

| Benefit | Explanation |
|---------|-------------|
| **Context isolation** | Each subagent gets a clean context, preventing overload |
| **Parallel execution** | Multiple subagents can run simultaneously |
| **Focused expertise** | Combine with custom agents for specialized behavior |
| **Token efficiency** | Only the final result enters the main context |

### Invoking Subagents

Subagents can be invoked three ways:

1. **Automatic delegation:** The main agent autonomously decides to use a subagent:
   ```
   Research the best authentication approaches for this microservice, 
   then implement the chosen approach.
   ```

2. **Direct invocation:** Explicitly ask for a subagent:
   ```
   Use the testing subagent to write unit tests for the authentication module.
   ```

3. **Tool reference:** Use the `#runSubagent` tool:
   ```
   Evaluate #file:schema.sql using #runSubagent and generate an optimized migration plan.
   ```

### Enabling Subagents

1. In the Copilot Chat window, click the **tools icon**
2. Enable the `runSubagent` tool
3. For custom agents, add `agent` or `runSubagent` to the `tools` frontmatter

### Running a Custom Agent as a Subagent

Custom agents can be configured for subagent use:

```markdown
---
name: security-scanner
user-invokable: false          # Hidden from dropdown (subagent only)
tools: ['read', 'search']
---

You are a security specialist. Analyze the provided code for:
- OWASP Top 10 vulnerabilities
- Credential exposure
- Injection risks
Return a structured findings report.
```

### Restricting Subagent Access

The `agents` property controls which subagents are available:

```markdown
---
name: Feature Builder
tools: ['agent', 'edit', 'search', 'read']
agents: ['Planner', 'Implementer', 'Reviewer']    # Only these subagents
---
```

- `agents: ['Planner', 'Reviewer']`: Allow only specific agents
- `agents: '*'`: Allow all agents (default)
- `agents: []`: Prevent any subagent use

---

## 5. Orchestration Patterns

### Pattern A: Coordinator and Workers

A coordinator agent manages the overall task and delegates to specialized workers:

```
                    ┌─────────────────┐
                    │   Coordinator   │
                    │  (Feature Dev)  │
                    └────────┬────────┘
                 ┌───────────┼───────────┐
                 ▼           ▼           ▼
          ┌──────────┐ ┌──────────┐ ┌──────────┐
          │ Planner  │ │Implementer│ │ Reviewer │
          │(read-only)│ │(full edit)│ │(read-only)│
          └──────────┘ └──────────┘ └──────────┘
```

### Pattern B: Multi-Perspective Review

Run multiple review perspectives in parallel:

```
              ┌─────────────────────┐
              │  Thorough Reviewer  │
              │    (coordinator)    │
              └──────────┬──────────┘
          ┌──────┬───────┼───────┬──────┐
          ▼      ▼       ▼       ▼      ▼
       ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
       │Corr-││Qual-││Sec- ││Perf-││Arch-│
       │ect- ││ity  ││urity││orm- ││itec-│
       │ness ││     ││     ││ance ││ture │
       └─────┘└─────┘└─────┘└─────┘└─────┘
```

### Pattern C: Test-Driven Development (TDD)

```markdown
---
name: TDD
description: Implement features using test-driven development
tools: ['agent']
agents: ['Red', 'Green', 'Refactor']
---

Implement the following feature using test-driven development:

1. Use the **Red** agent to write failing tests that define the expected behavior
2. Use the **Green** agent to write the minimum code to make tests pass
3. Use the **Refactor** agent to improve code quality while keeping tests green

Iterate until all requirements are met with clean, well-tested code.
```

---

## 6. Hands-on Exercise (50 min)

### Exercise 5A: Use Agent Mode for a Multi-Step Task (10 min)

1. Switch to **Agent** mode in Copilot Chat
2. Enter the following prompt:

```
Create a utility module for input validation with the following:

1. JavaScript (in exercises/javascript/validators.js):
   - validateEmail(email) - RFC 5322 compliant email validation
   - validatePhoneNumber(phone) - supports international formats
   - validateCreditCard(number) - Luhn algorithm validation
   - sanitizeHtml(input) - strip dangerous HTML tags

2. Java (in exercises/java/Validators.java):
   - Same four validators as static methods
   - Use Java 17 features (records for validation results, pattern matching)

3. Write comprehensive unit tests for both:
   - JavaScript tests in exercises/javascript/validators.test.js
   - Java tests in exercises/java/ValidatorsTest.java

4. Run the tests to verify they pass
```

3. Observe how Agent mode:
   - Plans the file structure
   - Creates files in the correct locations
   - Proposes terminal commands to run tests
   - Iterates if tests fail

### Exercise 5B: Create Custom Agents with Handoffs (15 min)

**Step 1:** Create the Planning agent (`.github/agents/planner.agent.md`):

```markdown
---
name: planner
description: Create detailed implementation plans for features
tools: ['read', 'search']
handoffs:
  - label: Start Implementation
    agent: implementer
    prompt: |
      Implement the plan outlined above.
      Follow each step carefully and run tests after each change.
    send: false
---

You are a senior enterprise architect specializing in Java and JavaScript applications.

When asked about a feature or task:

1. **Analyze the codebase:** Use search and read tools to understand the current architecture
2. **Identify impact:** List all files that will change and new files needed
3. **Define the plan:** Create step-by-step implementation instructions
4. **Risk assessment:** Note potential breaking changes, edge cases, and dependencies
5. **Testing strategy:** Define what tests are needed (unit, integration, e2e)

Output format:
- Summary (1-2 sentences)
- Files to modify (with expected changes)
- New files to create
- Implementation steps (ordered, with dependencies noted)
- Test plan
- Risks and mitigations

IMPORTANT: Do NOT modify any files. You are a planner, not an implementer.
```

**Step 2:** Create the Implementation agent (`.github/agents/implementer.agent.md`):

```markdown
---
name: implementer
description: Implement features following a plan
tools: ['edit', 'search', 'read', 'terminal', 'runSubagent']
handoffs:
  - label: Review Code
    agent: reviewer
    prompt: |
      Review the implementation above for quality, security, and correctness.
    send: false
---

You are a senior enterprise developer. Implement features following these principles:

1. **Follow the plan:** If a plan is provided, follow it step by step
2. **Test-driven:** Write or update tests alongside implementation
3. **Run tests:** Execute tests after each significant change
4. **Enterprise patterns:** Use proper error handling, logging, and validation
5. **Clean code:** Follow SOLID principles and the project's coding standards

For each change:
- Explain what you're doing and why
- Show the code changes
- Run relevant tests
- Fix any failures before moving on
```

**Step 3:** Create the Review agent (`.github/agents/reviewer.agent.md`):

```markdown
---
name: reviewer
description: Review code for quality, security, and correctness
tools: ['read', 'search']
---

You are a senior code reviewer focusing on enterprise Java and JavaScript applications.

Review the code changes for:

## Quality
- Clean code principles (DRY, SRP, KISS)
- Appropriate design patterns
- Meaningful naming conventions
- Adequate error handling

## Security
- Input validation on all external data
- No hardcoded credentials or secrets
- SQL injection prevention
- XSS prevention
- Proper authentication/authorization checks

## Correctness
- Logic errors and off-by-one mistakes
- Null/undefined safety
- Concurrency issues
- Resource leaks (connections, streams, handles)

## Testing
- Adequate test coverage
- Meaningful assertions (not just "it doesn't throw")
- Edge case coverage
- Mock setup correctness

Output format:
- **Must Fix**: Critical issues
- **Should Fix**: Important improvements
- **Consider**: Nice-to-have suggestions
- **Good**: Things done well
```

**Step 4:** Test the handoff workflow:
1. Select the **planner** agent from the dropdown
2. Ask: `Plan adding a caching layer with TTL support for the user service`
3. Review the plan
4. Click **Start Implementation** handoff button
5. Review the implementation
6. Click **Review Code** handoff button
7. Review the findings

### Exercise 5C: Build a Subagent Orchestration (15 min)

**Step 1:** Create a coordinator agent (`.github/agents/feature-builder.agent.md`):

```markdown
---
name: feature-builder
description: Build features using coordinated subagents
tools: ['agent', 'edit', 'search', 'read', 'terminal']
agents: ['planner', 'implementer', 'reviewer']
---

You are a feature development coordinator for enterprise applications.

For each feature request, follow this process:

1. **Plan Phase**: Use the Planner agent as a subagent to analyze the codebase and create an implementation plan. Wait for the plan before proceeding.

2. **Implementation Phase**: Use the Implementer agent as a subagent to write the code following the plan. The implementer should also write tests.

3. **Review Phase**: Use the Reviewer agent as a subagent to check the implementation for quality, security, and correctness.

4. **Resolution**: If the reviewer finds critical issues, use the Implementer again to fix them.

Present a final summary of:
- What was built
- Files created/modified
- Test results
- Review findings and resolutions
```

**Step 2:** Create a subagent-only security scanner (`.github/agents/security-scanner.agent.md`):

```markdown
---
name: security-scanner
description: Specialized security analysis agent
user-invokable: false
tools: ['read', 'search']
---

You are a security specialist. Analyze the provided code files for:

1. OWASP Top 10 vulnerabilities
2. Hardcoded credentials or secrets
3. Insufficient input validation
4. Insecure data handling
5. Missing authentication/authorization
6. Vulnerable dependency patterns

Return a structured report:
- **Severity**: Critical / High / Medium / Low
- **Location**: File and line reference
- **Finding**: Description of the issue
- **Impact**: What could go wrong
- **Remediation**: Specific fix with code example
```

**Step 3:** Test the orchestration:
1. Select the **feature-builder** agent
2. Ask: `Build a password reset feature for the user service with email notification`
3. Observe how subagents are invoked, work in isolation, and return results to the coordinator

### Exercise 5D: Prompt File with Subagent (10 min)

Create `.github/prompts/analyze-and-test.prompt.md`:

```markdown
---
name: analyze-and-test
description: Analyze code quality and generate tests using subagents
tools: ['agent', 'read', 'search', 'edit']
---

For the file ${file}:

1. Run a subagent to analyze the code for:
   - Code complexity and maintainability issues
   - Missing error handling
   - Potential performance bottlenecks
   Return only critical findings.

2. Run a subagent to generate comprehensive unit tests based on the findings.
   Focus test coverage on the areas identified as risky.

3. Synthesize the results:
   - List of findings with severity
   - Generated tests with explanation of what each test validates
   - Recommendations for refactoring
```

Test it:
1. Open any code file in the samples
2. Type `/analyze-and-test` in Chat
3. Observe the subagent execution flow

---

## Key Takeaways

1. **Agent mode is for autonomous, complex tasks:** Let Copilot determine files, commands, and iteration
2. **Custom agents enable specialized personas:** Give each agent the right tools and instructions for its role
3. **Handoffs create guided workflows:** Transition between agents (Plan -> Implement -> Review) with context preserved
4. **Subagents provide context isolation:** Offload research, analysis, or implementation without cluttering the main session
5. **Orchestration patterns scale:** Coordinator/worker and multi-perspective review patterns handle enterprise complexity
6. **`agents` property controls delegation:** Restrict which subagents are available to prevent unintended behavior

---

**Next:** [Wrap-up, Q&A & Next Steps →](../module-06-wrapup/)
