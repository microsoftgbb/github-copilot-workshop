# Exercise 2: Build a Prompt Library

## Objective

Create reusable `.prompt.md` files that your team can invoke from Copilot Chat, and understand the patterns for making them effective.

---

## Part A: Create a Security Review Prompt

Create the file `.github/prompts/security-review.prompt.md`:

```markdown
---
description: "Security review for API endpoints"
mode: "ask"
---
You are a senior security engineer performing a code audit.

Review the selected code for these OWASP Top 10 categories:
1. **Injection** — SQL injection, command injection, XSS
2. **Broken Authentication** — Missing auth checks, weak session handling
3. **Sensitive Data Exposure** — Logging PII, leaking stack traces
4. **Broken Access Control** — Missing authorization, IDOR vulnerabilities
5. **Security Misconfiguration** — Hardcoded secrets, debug mode enabled

For each finding:
- **Severity**: Critical / High / Medium / Low
- **Location**: File and line reference
- **Issue**: What's wrong
- **Fix**: Concrete code fix

If no issues are found, explicitly state the code passes the review.
```

**Try it:** Open any code file, then invoke this prompt from the Copilot Chat prompt picker.

---

## Part B: Create a Unit Test Generator Prompt

Create the file `.github/prompts/generate-unit-tests.prompt.md`:

```markdown
---
description: "Generate comprehensive unit tests"
mode: "agent"
---
Generate unit tests for the selected code following these rules:

**Framework:**
- JavaScript: Use Jest with `describe`/`it` blocks
- Java: Use JUnit 5 with `@Nested` classes and AssertJ assertions

**Test naming:**
- JavaScript: `should <expected behavior> when <condition>`
- Java: `givenX_whenY_thenZ`

**Coverage requirements:**
- Happy path for each public method
- Edge cases: null/undefined inputs, empty collections, boundary values
- Error paths: expected exceptions with specific error types
- Use AAA pattern (Arrange, Act, Assert) with clear section comments

**Mocking:**
- Mock all external dependencies (database, HTTP, file system)
- Use `jest.fn()` / `jest.spyOn()` for JS, Mockito for Java
- Verify mock interactions where behavior matters

Do not modify the source code. Only create test files.
```

---

## Part C: Create a Migration Plan Prompt

Create `.github/prompts/migration-plan.prompt.md`:

```markdown
---
description: "Generate a technology migration plan"
mode: "ask"
---
Create a detailed migration plan based on the following context.

Analyze the current codebase and generate a plan that includes:

## 1. Current State Assessment
- What technologies, patterns, and dependencies are currently in use?
- What are the risks of the current state?

## 2. Target State
- What is the recommended target architecture?
- What are the key differences from current state?

## 3. Migration Steps
Number each step and include:
- What changes are needed
- Which files are affected
- Estimated complexity (Low/Medium/High)
- Dependencies on other steps

## 4. Risk Mitigation
- What can go wrong at each step?
- What is the rollback strategy?
- What tests validate each step succeeded?

## 5. Validation Checklist
- [ ] All existing tests pass
- [ ] New integration tests cover migrated components
- [ ] Performance benchmarks meet baseline
- [ ] No regressions in dependent services
```

---

## Part D: Parameterized Prompts

Prompt files can use `{{variable}}` placeholders. Create `.github/prompts/api-endpoint.prompt.md`:

```markdown
---
description: "Scaffold a new API endpoint"
mode: "agent"
---
Create a new REST API endpoint with these specifications:

**Endpoint:** {{method}} {{path}}
**Description:** {{description}}

Follow the existing patterns in this codebase:
- Use the same middleware chain as other routes
- Add input validation using the project's validation library
- Include proper error handling with custom error classes
- Add JSDoc/Javadoc comments
- Create a corresponding test file

Reference existing route files for patterns and conventions.
```

**Try it:** When you invoke this prompt, Copilot will ask you to fill in the variables.

---

## Discussion

- Which prompts would be most valuable for your team?
- How would you organize prompts for a team of 20+ developers?
- What governance should exist around prompt file changes (PR reviews, testing)?
