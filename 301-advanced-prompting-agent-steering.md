# GitHub Copilot: Learning Series 301

## Engineering with Intelligence – Advanced Prompting & Agent Steering

**Format:** Open Office Hours (1.5 hrs)
**Audience:** Developers and engineering leads already using GitHub Copilot
**Prerequisites:** Familiarity with GitHub Copilot basics (completions, chat, agent mode)

---

## Session Agenda

| Time | Module | Duration | Format |
|------|--------|----------:|--------|
| 0:00 – 0:05 | Welcome & Session Overview | 5 min | Discussion |
| 0:05 – 0:20 | Module 1: Prompt Engineering Techniques | 15 min | Demo + Discussion |
| 0:20 – 0:35 | Module 2: Role-Based & Reusable Prompting | 15 min | Demo + Discussion |
| 0:35 – 0:50 | Module 3: Agentic Workflows & Agent Steering | 15 min | Demo + Discussion |
| 0:50 – 1:05 | Module 4: System-Level Understanding | 15 min | Demo + Discussion |
| 1:05 – 1:15 | Module 5: Copilot Advanced Capabilities | 10 min | Demo + Discussion |
| 1:15 – 1:30 | Q&A, Open Discussion & Wrap-up | 15 min | Open Q&A |

> **Note:** This is an open office hours format — encourage questions throughout. The 15-minute buffer at the end accommodates overflow and ad-hoc deep dives.

---

## Welcome & Session Overview (5 min)

- Brief introductions and ground rules
- This is a **301-level** session — assumes working knowledge of Copilot basics
- Today's focus: moving from "using Copilot" to **engineering with Copilot**
- Framing: treat Copilot as a collaborator, not a search engine — your prompt quality directly shapes output quality

---

## Module 1: Prompt Engineering Techniques (15 min)

### Prompt Chaining and Iterative Refinement

The difference between a single prompt and a **prompt chain** is the difference between asking one question and having a conversation. Advanced Copilot users break complex problems into sequential steps, where each response feeds the next prompt.

**Key Concepts:**

- **Single-shot vs. multi-turn prompting** — A single prompt ("write a REST API") produces generic output. A prompt chain ("first, define the data model for an order system" → "now create the repository layer" → "now add the API controller using that repository") produces coherent, contextual code.
- **Iterative refinement pattern** — Start broad, then narrow:
  1. Ask Copilot for a high-level approach
  2. Critique or constrain the output ("make this thread-safe", "use the repository pattern")
  3. Ask for edge case handling
  4. Request tests for the final implementation
- **Context anchoring** — Reference previous outputs explicitly: "Using the `OrderService` class you just created, add a method that..."
- **Decomposition prompts** — Ask Copilot to break down the problem *before* solving it: "What are the steps needed to implement a retry mechanism with exponential backoff?" Then walk through each step.

**Demo Ideas:**

- Take a complex feature request (e.g., "build a caching layer with TTL and LRU eviction") and show the difference between a single prompt vs. a 4-step chain
- Show how adding constraints in follow-up prompts ("now make this generic over any key type", "add thread safety") progressively improves the output

### Code Completion for Complex Logic

Copilot's inline completions become significantly more powerful when you guide them with structure and intent.

**Key Concepts:**

- **Signature-first development** — Write the function signature, parameters, and return type first. Copilot infers implementation from well-named signatures.
  ```python
  def calculate_compound_interest(
      principal: float,
      annual_rate: float,
      times_compounded: int,
      years: int
  ) -> float:
  ```
- **Comment-driven completion** — Write a step-by-step comment block before the code. Copilot completes each step:
  ```python
  # 1. Validate inputs are positive numbers
  # 2. Convert annual rate to decimal
  # 3. Apply compound interest formula: A = P(1 + r/n)^(nt)
  # 4. Round to 2 decimal places
  ```
- **Example-driven completion** — Provide one or two examples in comments, and Copilot generalizes the pattern for more complex cases.
- **Strategic file ordering** — Open related files as tabs so Copilot can cross-reference types, interfaces, and patterns from your codebase.

**Demo Ideas:**

- Write a complex algorithm (e.g., graph traversal, state machine) using comment-driven completion
- Show how renaming parameters from `a`, `b`, `c` to descriptive names dramatically changes completion quality

---

## Module 2: Role-Based & Reusable Prompting (15 min)

### Role-Based Prompt Templates (DevOps, QA, Architecture)

Copilot Chat responds differently based on the persona and context you establish. **Role prompts** set the frame for the type of output you want.

**Key Concepts:**

- **Persona framing** — Start prompts with a role to shift Copilot's focus:
  - *DevOps:* "You are a senior DevOps engineer. Review this Dockerfile for production readiness, security, and image size optimization."
  - *QA:* "You are a QA architect. Generate a comprehensive test plan for this authentication module including unit, integration, and edge case tests."
  - *Architecture:* "You are a solutions architect. Evaluate this design for scalability, identify single points of failure, and suggest improvements."
  - *Security:* "You are a security engineer. Audit this code for OWASP Top 10 vulnerabilities."
- **Using `.github/copilot-instructions.md`** — Set organization-wide defaults that automatically inject role context:
  ```markdown
  When reviewing infrastructure code, always check for:
  - Hardcoded secrets or credentials
  - Missing resource limits and quotas
  - Lack of health checks or readiness probes
  - Non-parameterized environment-specific values
  ```
- **Prompt files (`.prompt.md`)** — Create reusable prompt templates that team members can invoke:
  ```markdown
  ---
  description: "Security review for API endpoints"
  mode: "ask"
  ---
  Review the following code as a security engineer. Check for:
  - Input validation and sanitization
  - Authentication and authorization gaps
  - SQL injection, XSS, and CSRF vulnerabilities
  - Proper error handling (no stack traces leaked)
  - Secrets management
  ```

**Demo Ideas:**

- Show the same code reviewed with different role prompts (DevOps vs. QA vs. Architect) and compare the outputs
- Walk through creating a `.prompt.md` file and invoking it

### Prompt Library Creation and Reuse Patterns

**Key Concepts:**

- **Building a team prompt library** — Store prompt files in your repo under `.github/prompts/` so the entire team benefits:
  ```
  .github/
  └── prompts/
      ├── code-review-security.prompt.md
      ├── generate-unit-tests.prompt.md
      ├── api-design-review.prompt.md
      ├── migration-plan.prompt.md
      └── incident-postmortem.prompt.md
  ```
- **Parameterized prompts** — Use variables in prompt files to make them reusable across contexts:
  ```markdown
  ---
  description: "Generate migration plan"
  mode: "agent"
  ---
  Create a migration plan for moving from {{source_technology}} to {{target_technology}}.
  Include: timeline, risks, rollback strategy, and validation steps.
  ```
- **Composable prompts** — Reference other instruction or prompt files to build layered context
- **Versioning prompts** — Treat prompt files like code: review them in PRs, track changes, measure effectiveness over time

**Demo Ideas:**

- Create 2–3 prompt files live and show how different team members would use them
- Show how prompt files can reference workspace context with `#file` references

---

## Module 3: Agentic Workflows & Agent Steering (15 min)

### Agent Steering Techniques

Agent mode in Copilot can autonomously plan and execute multi-step tasks. **Steering** is how you keep it on track and aligned with your architecture and standards.

**Key Concepts:**

- **Task decomposition prompts** — Give the agent a well-structured, scoped task:
  - ❌ "Add authentication to the app"
  - ✅ "Add JWT-based authentication to the Express API. Create an auth middleware in `src/middleware/auth.ts` that validates tokens using the `jsonwebtoken` library. Add login and register endpoints in `src/routes/auth.ts`. Use bcrypt for password hashing. Follow the existing patterns in `src/routes/users.ts`."
- **Constraint-based steering** — Tell the agent what NOT to do:
  - "Do not modify existing test files"
  - "Do not install new dependencies — use only what's in package.json"
  - "Do not change the database schema"
- **Using `.instructions.md` files** — Scope instructions to specific file patterns:
  ```markdown
  ---
  applyTo: "src/api/**"
  ---
  All API route handlers must:
  - Use the `asyncHandler` wrapper for error handling
  - Validate request bodies using Zod schemas
  - Return standardized response objects from `src/utils/response.ts`
  - Include OpenAPI JSDoc comments
  ```
- **Custom agents (`.agent.md`)** — Define specialized agents for recurring workflows:
  ```markdown
  ---
  description: "Database migration agent"
  tools: ["run_in_terminal", "read_file", "create_file"]
  ---
  You are a database migration specialist. When asked to create a migration:
  1. Read the current schema from `prisma/schema.prisma`
  2. Generate the migration SQL
  3. Create the migration file in `prisma/migrations/`
  4. Run `npx prisma migrate dev` to validate
  5. Update seed data if affected
  ```
- **Guardrails with tool restrictions** — Limit which tools an agent can use to prevent unintended side effects (e.g., no terminal access for agents that should only read/write files)

**Demo Ideas:**

- Run an agent task with vague instructions, then rerun with structured constraints — compare outcomes
- Create a custom `.agent.md` file and demonstrate invoking it for a specific workflow
- Show how `.instructions.md` with `applyTo` automatically scopes behavior per file type

---

## Module 4: System-Level Understanding (15 min)

### Building Context Across Distributed Microservices

One of Copilot's biggest challenges in enterprise environments is understanding how services interact. These techniques help Copilot reason across service boundaries.

**Key Concepts:**

- **Architecture-as-context** — Create a `ARCHITECTURE.md` or `CODEBASE.md` file at the repo root that describes your system:
  ```markdown
  # System Architecture

  ## Services
  - **order-service** (Node.js/Express): Handles order lifecycle, publishes events to Kafka
  - **inventory-service** (Python/FastAPI): Manages stock levels, subscribes to order events
  - **notification-service** (Go): Sends emails/SMS, subscribes to order and inventory events

  ## Communication Patterns
  - Synchronous: REST APIs between gateway and services
  - Asynchronous: Kafka for inter-service events (topic: `orders`, `inventory-updates`)

  ## Data Stores
  - order-service: PostgreSQL (orders, line_items)
  - inventory-service: PostgreSQL (products, stock_levels)
  - notification-service: Redis (notification queue, delivery status)
  ```
- **Cross-repo context via `#file` and workspace references** — Open related service repos in a multi-root workspace so Copilot can see contracts, shared types, and API specs across services.
- **API contract files as context** — Keep OpenAPI specs, Protobuf definitions, or AsyncAPI specs in the repo. Reference them in prompts:
  - "Using the OpenAPI spec in `docs/api-spec.yaml`, generate a client SDK for the order service"
  - "Based on the Protobuf definitions in `proto/`, create the gRPC service implementation"
- **Dependency mapping in instructions** — Use `copilot-instructions.md` to tell Copilot about cross-service dependencies:
  ```markdown
  This service (order-service) depends on:
  - inventory-service: POST /api/inventory/reserve (reserves stock)
  - notification-service: Kafka topic "order-events" (publishes order status changes)

  When modifying order processing logic, consider impacts on downstream consumers.
  ```
- **Workspace-level instruction files** — Use `.instructions.md` at the workspace root to provide system-wide context that applies regardless of which file is being edited.

**Demo Ideas:**

- Show how adding an `ARCHITECTURE.md` file changes Copilot's suggestions when working on inter-service code
- Demonstrate a multi-root workspace with 2–3 services and show Copilot reasoning across boundaries
- Ask Copilot to trace a request flow across services using architecture context

---

## Module 5: Copilot Advanced Capabilities (10 min)

### Leveraging Copilot SDK

- **Copilot Extensions** — Build custom Copilot extensions that integrate domain-specific tools and knowledge:
  - Connect internal APIs, databases, or documentation systems
  - Create slash commands for team-specific workflows
  - Surface internal knowledge bases directly in the Copilot chat experience
- **Copilot in GitHub Actions** — Use Copilot to generate and review CI/CD workflows:
  - Generate workflow files from natural language descriptions
  - Review existing workflows for best practices and security
- **Copilot API (Public Preview)** — Programmatic access to Copilot capabilities:
  - Integrate Copilot into custom developer tools and internal platforms
  - Build automated code review pipelines
  - Create custom IDE integrations beyond VS Code

### Chat Hooks and Diagnostics

- **Pre- and post-chat hooks** — Intercept and augment Copilot interactions:
  - Automatically inject project context before every chat prompt
  - Post-process responses to enforce team coding standards
  - Log interactions for compliance or quality tracking
- **Diagnostic integration** — Copilot surfaces and uses IDE diagnostics:
  - Copilot reads compiler errors, linter warnings, and test failures from your IDE
  - Use `/fix` with diagnostics to let Copilot auto-resolve issues
  - Custom diagnostic providers can feed domain-specific feedback to Copilot
- **Monitoring Copilot effectiveness** — Use GitHub Copilot metrics:
  - Track acceptance rates, languages, and usage patterns via the Copilot dashboard
  - Identify teams or repos where adoption could improve
  - Measure productivity impact with before/after metrics

**Demo Ideas:**

- Show Copilot reading diagnostic errors and auto-fixing them
- Walk through the Copilot metrics dashboard and what signals to look for
- Demo a Copilot extension or describe the architecture for building one

---

## Q&A, Open Discussion & Wrap-up (15 min)

### Suggested Discussion Topics

- "What's the most complex task you've tried with Copilot? Let's workshop a better prompt for it."
- "How is your team currently sharing Copilot knowledge? Let's talk about prompt libraries."
- "What guardrails or governance do you have around Copilot usage?"
- Common pitfalls and anti-patterns participants have encountered

### Resources & Next Steps

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Prompt Engineering Guide for Copilot](https://docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot)
- [Customizing Copilot with Instructions](https://docs.github.com/en/copilot/customizing-copilot)
- [GitHub Copilot Extensions](https://docs.github.com/en/copilot/building-copilot-extensions)
- [VS Code Copilot Chat Documentation](https://code.visualstudio.com/docs/copilot/overview)

---

## Facilitator Notes

### Preparation Checklist

- [ ] Prepare a sample multi-file project for Modules 1, 3, and 4 demos
- [ ] Create example `.prompt.md`, `.instructions.md`, and `.agent.md` files
- [ ] Set up a multi-root workspace with 2+ service repos for Module 4
- [ ] Have the Copilot metrics dashboard ready (if customer has GHEC)
- [ ] Test all demos with current Copilot version — features evolve quickly

### Facilitation Tips

- **Open office hours format:** Pause after each module for questions — don't wait until the end
- **Read the room:** If a module sparks heavy discussion, it's okay to spend more time there and abbreviate a later module
- **Bring real code:** If possible, use the customer's actual codebase for demos (with permission) — this creates far more engagement than generic samples
- **Capture follow-ups:** Note questions you can't answer live and follow up afterward
