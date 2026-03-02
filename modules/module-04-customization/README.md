# Module 4: Customization - Instructions & Prompt Files

> **Duration:** 60 minutes (20 min demo + 40 min hands-on)  
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Create repository-wide custom instructions (`.github/copilot-instructions.md`) to enforce coding standards
- Build path-specific instruction files (`.instructions.md`) with `applyTo` frontmatter for language/framework-specific rules
- Author reusable prompt files (`.prompt.md`) as slash commands for common enterprise workflows
- Understand the instruction priority hierarchy: personal > repository > organization

---

## 1. Custom Instructions Overview (5 min demo)

Custom instructions provide Copilot with **persistent context** about your project, coding standards, and preferences. Instead of repeating guidelines in every prompt, you encode them once and Copilot applies them automatically.

### Instruction Priority Hierarchy

```
┌─────────────────────────┐
│  Personal Instructions  │  ← Highest priority (user settings)
├─────────────────────────┤
│ Repository Instructions │  ← .github/copilot-instructions.md
├─────────────────────────┤
│   Path-Specific Rules   │  ← .github/instructions/*.instructions.md
├─────────────────────────┤
│Organization Instructions│  ← Lowest priority (org-wide)
└─────────────────────────┘
```

> All applicable instructions are sent to Copilot. Higher-priority instructions take precedence when there are conflicts.

### Three Types of Custom Instructions

| Type | File Location | Scope |
|------|--------------|-------|
| **Repository-wide** | `.github/copilot-instructions.md` | All Copilot requests in this repo |
| **Path-specific** | `.github/instructions/NAME.instructions.md` | Files matching the `applyTo` glob pattern |
| **Agent instructions** | `AGENTS.md` (anywhere in repo) | AI agents working in this repo |

---

## 2. Repository-Wide Instructions (5 min demo)

### Creating the File

Create `.github/copilot-instructions.md` in the root of your repository:

```markdown
# Project Instructions for Copilot

## Project Overview
This is a Spring Boot 3.x microservice using Java 17 and Maven.
The application follows hexagonal architecture with domain, application, and infrastructure layers.

## Coding Standards
- Use Java 17 features: records, sealed interfaces, pattern matching
- Follow Google Java Style Guide for formatting
- All public methods must have Javadoc comments
- Use constructor injection (never field injection with @Autowired)
- Prefer Optional over null returns
- Use SLF4J for logging with parameterized messages: `log.info("Processing order {}", orderId)`

## Testing Standards
- Use JUnit 5 with Mockito for unit tests
- Use AssertJ for assertions (never JUnit assertions)
- Follow Given-When-Then naming: `givenValidOrder_whenCalculateTotal_thenReturnsCorrectAmount`
- Minimum 80% branch coverage for service classes
- Use @ParameterizedTest for methods with multiple valid inputs

## Error Handling
- Create custom exception classes extending RuntimeException
- Use @ControllerAdvice for global exception handling
- Return RFC 7807 Problem Details for all error responses
- Never expose stack traces in API responses

## Security
- Validate all input with Bean Validation (@Valid, @NotNull, @Size)
- Use Spring Security method-level annotations (@PreAuthorize)
- Never log sensitive data (PII, credentials, tokens)
```

### How It Works

- Copilot automatically includes these instructions in every Chat request made within the repository
- You can verify by expanding the **References** list in any Chat response (the instructions file will be listed)
- Instructions are available immediately after saving the file

---

## 3. Path-Specific Instructions (5 min demo)

Path-specific instructions apply **only** when Copilot is working with files that match a glob pattern.

### Example: TypeScript React Components

Create `.github/instructions/react-components.instructions.md`:

```markdown
---
applyTo: "src/components/**/*.tsx,src/components/**/*.ts"
---

# React Component Guidelines

- Use functional components with TypeScript interfaces for props
- Define props interface above the component: `interface Props { ... }`
- Use named exports (not default exports)
- Place styles in a co-located `.module.css` file
- Use React.memo() for components that receive stable props
- Handle loading states with a Skeleton component from our shared library
- Handle error states with our ErrorBoundary component
- All event handlers should be prefixed with `handle`: `handleClick`, `handleSubmit`
```

### Example: Java Test Files

Create `.github/instructions/java-tests.instructions.md`:

```markdown
---
applyTo: "src/test/**/*.java"
---

# Java Testing Standards

- Use JUnit 5 with @ExtendWith(MockitoExtension.class)
- Use AssertJ assertions: assertThat(result).isEqualTo(expected)
- Name tests: givenX_whenY_thenZ
- Use @Nested classes to group tests by method under test
- Use @ParameterizedTest with @CsvSource for data-driven tests
- Always verify no unexpected interactions: verifyNoMoreInteractions(mock)
- Use TestFixtures class for shared test data builders
```

### Example: API Endpoint Files

Create `.github/instructions/api-security.instructions.md`:

```markdown
---
applyTo: "src/main/java/**/controller/**/*.java,src/routes/**/*.js"
---

# API Security Instructions

- All endpoints must have authentication (do not create public endpoints)
- Use @PreAuthorize for role-based access control (Java)
- Validate all request bodies with @Valid (Java) or express-validator (JS)
- Rate limit all endpoints: 100 requests/minute per user
- Log all API calls with request ID, user ID, and response status
- Never return internal IDs in API responses; use UUIDs
```

---

## 4. Reusable Prompt Files (5 min demo)

Prompt files encode **common tasks** as reusable slash commands. They live in `.github/prompts/` and use the `.prompt.md` extension.

### Prompt File Format

```markdown
---
name: create-service
description: Scaffold a new Spring Boot service class with standard patterns
agent: agent
tools: ['edit', 'search', 'read']
---

Create a new Spring Boot service class for the ${input:entityName} entity.

Follow these requirements:
1. Place the file in src/main/java/com/enterprise/demo/service/
2. Use constructor injection for the ${input:entityName}Repository dependency
3. Include CRUD operations: findAll, findById, create, update, delete
4. Add @Transactional annotations where appropriate
5. Include SLF4J logging for all operations
6. Use Optional for findById return type
7. Throw custom ResourceNotFoundException when entity is not found
8. Add Javadoc comments to all public methods
```

### Using Prompt Files

1. Type `/` in the Chat input to see available prompts
2. Select the prompt (e.g., `/create-service`)
3. Fill in any input variables when prompted
4. Copilot executes the prompt with the specified agent and tools

### Enterprise Prompt File Examples

| Prompt | Purpose |
|--------|---------|
| `/create-service` | Scaffold a new service class with standard patterns |
| `/create-test` | Generate test class for a selected service |
| `/pr-checklist` | Generate a PR checklist based on team standards |
| `/security-review` | Run a security-focused review of selected code |
| `/api-docs` | Generate OpenAPI documentation for a controller |

---

## 5. Hands-on Exercise (40 min)

### Exercise 4A: Create Repository-Wide Instructions (10 min)

1. Open the file `.github/copilot-instructions.md` (already created in this workshop repo)
2. Review the example instructions provided
3. **Customize the instructions** for your team's stack. Modify the file to include:
   - Your team's programming language and framework
   - Your coding standards (naming conventions, error handling patterns)
   - Your testing requirements (framework, coverage expectations, patterns)
   - Any security or compliance requirements specific to your organization
4. **Test the instructions**: Open Copilot Chat and ask:
   ```
   Create a utility function that validates an email address
   ```
   Verify that Copilot follows your custom instructions in its response.

### Exercise 4B: Create Path-Specific Instructions (10 min)

1. Create a new file: `.github/instructions/javascript-standards.instructions.md`
2. Add the following content and customize it:

```markdown
---
applyTo: "**/*.js,**/*.ts"
---

# JavaScript/TypeScript Standards

- Use ES2022+ features: optional chaining, nullish coalescing, top-level await
- Prefer const over let; never use var
- Use arrow functions for callbacks
- Use async/await (never raw Promises with .then())
- Error handling: always catch async errors, use custom error classes
- Logging: use structured JSON logging with correlation IDs
```

3. Create another file: `.github/instructions/java-standards.instructions.md`
4. Add Java-specific instructions with `applyTo: "**/*.java"`
5. **Test both**: Open a `.js` file and ask Copilot a question, then verify JS instructions are applied. Then open a `.java` file and verify Java instructions are applied.

### Exercise 4C: Create Reusable Prompt Files (20 min)

**Prompt 1:** Create `.github/prompts/create-unit-test.prompt.md`:

```markdown
---
name: create-unit-test
description: Generate comprehensive unit tests for the selected code
agent: agent
tools: ['edit', 'read', 'search']
---

Generate comprehensive unit tests for the selected code.

Requirements:
- Detect the language and use the appropriate test framework:
  - Java → JUnit 5 + Mockito + AssertJ
  - JavaScript/TypeScript → Jest
- Follow the AAA (Arrange-Act-Assert) pattern
- Include tests for:
  - Normal/happy path scenarios
  - Edge cases (null, empty, boundary values)
  - Error scenarios (exceptions, invalid input)
- Use descriptive test names that explain the scenario
- Mock external dependencies appropriately
- Add a comment block at the top explaining test coverage
```

**Prompt 2:** Create `.github/prompts/security-review.prompt.md`:

```markdown
---
name: security-review
description: Perform a security-focused code review
agent: ask
tools: ['read', 'search']
---

Perform a thorough security review of the code in ${file}.

Check for:
1. **Input Validation**: Missing or insufficient validation of user input
2. **Injection Risks**: SQL injection, XSS, command injection, LDAP injection
3. **Authentication & Authorization**: Missing auth checks, privilege escalation
4. **Data Exposure**: Sensitive data in logs, responses, or error messages
5. **Cryptography**: Weak algorithms, hardcoded keys, missing encryption
6. **Dependencies**: Known vulnerable patterns or library misuse

Format the output as:
- **Critical**: Issues that must be fixed before merging
- **Warning**: Issues that should be addressed soon
- **Info**: Best practice recommendations

For each finding, provide the specific line, the risk, and a remediation example.
```

**Test your prompts:**
1. Open a code file
2. Type `/create-unit-test` in Chat and run it
3. Type `/security-review` in Chat and run it
4. Verify the outputs follow your prompt instructions

---

## Key Takeaways

1. **Custom instructions eliminate repetitive prompting:** Encode your standards once, apply them automatically
2. **Path-specific instructions give granular control:** Different rules for different parts of your codebase
3. **Prompt files standardize team workflows:** Common tasks become consistent, repeatable slash commands
4. **Priority hierarchy prevents conflicts:** Personal > Repository > Organization ensures the most specific instructions win
5. **Instructions + Prompts = Team Productivity:** Combine both to create a customized Copilot experience for your entire team

---

**Next:** [Module 5 - Agent Mode & Custom Agents](../module-05-agents/)
