# Module 2: Copilot Chat - Deep Dive

> **Duration:** 60 minutes (20 min demo + 40 min hands-on)  
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Use Chat participants (`@workspace`, `@terminal`, `@github`), slash commands, and chat variables to craft precise prompts
- Distinguish between Ask, Edit, Agent, and Plan modes and select the right one for a given task
- Generate, explain, and fix code using Copilot Chat with enterprise-grade examples
- Write unit tests for existing code using Copilot Chat in both Java and JavaScript

---

## 1. Chat Interface Overview (5 min demo)

### Opening Copilot Chat

| Method | Shortcut (macOS) | Shortcut (Win/Linux) |
|--------|-------------------|----------------------|
| Chat panel | Click Copilot icon in title bar | Click Copilot icon in title bar |
| Quick chat | `⇧ ⌥ ⌘ L` | `Ctrl Shift Alt L` |
| Inline chat | `⌘ I` | `Ctrl I` |
| Smart actions | Right-click → Copilot | Right-click → Copilot |

### Chat Modes

| Mode | Best For | How It Works |
|------|----------|-------------|
| **Ask** | Questions about code, concepts, and guidance | Read-only; provides answers and code snippets but doesn't modify files |
| **Edit** | Controlled edits to a specific set of files | You select the working set of files; Copilot proposes diffs you accept or discard |
| **Agent** | Complex multi-step tasks with autonomous execution | Copilot determines files to change, runs terminal commands, and iterates to completion |
| **Plan** | Creating detailed implementation plans before coding | Research-first approach; produces a plan you review before handing off to Agent mode |

> **Enterprise tip:** Use **Plan mode** for complex features to align on an approach before committing to implementation. This supports team review processes.

---

## 2. Keywords & Context (5 min demo)

### Chat Participants

Chat participants are domain experts that scope your prompt to a specific area:

| Participant | Purpose | Example |
|-------------|---------|---------|
| `@workspace` | Questions about your entire codebase | `@workspace Where is authentication implemented?` |
| `@terminal` | Terminal and shell command help | `@terminal How do I find all Java files modified in the last week?` |
| `@github` | GitHub-specific skills (search, web, issues, PRs) | `@github What are the open issues labeled 'bug' in this repo?` |

> Copilot can **automatically infer** the right participant from your natural language prompt, so explicit `@` mention is optional but useful for precision.

### Slash Commands

| Command | Purpose |
|---------|---------|
| `/explain` | Explain selected code |
| `/fix` | Propose a fix for problems in selected code |
| `/tests` | Generate unit tests for selected code |
| `/doc` | Generate documentation for selected code |
| `/clear` | Clear the chat session |

### Chat Variables

| Variable | Purpose |
|----------|---------|
| `#file` | Reference a specific file |
| `#selection` | Reference the current editor selection |
| `#codebase` | Search across the entire codebase for context |
| `#web` | Include web search results |
| `#terminalLastCommand` | Reference the last terminal command output |

### Example: Combining Keywords

```
@workspace /explain #file:src/auth/tokenService.js

How does the token refresh logic work? What happens when the refresh token is expired?
```

---

## 3. Enterprise Use Cases (10 min demo)

### Use Case A: Generating Unit Tests

Select the `OrderService` class and ask:

```
/tests Generate comprehensive JUnit 5 tests for this class.
Include tests for:
- Normal flow with valid orders
- Edge cases: empty list, null inputs
- Boundary conditions: orders at exactly the minimum amount
- Use @MockBean for the repository dependency
```

### Use Case B: Explaining Legacy Code

```
@workspace /explain #file:src/legacy/PaymentProcessor.java

Explain this payment processing logic. Identify any potential 
security vulnerabilities or race conditions. Suggest modernization 
improvements using current Java best practices.
```

### Use Case C: Fixing Build Errors

After a failed build, use:

```
@terminal #terminalLastCommand

Fix the compilation errors shown in the terminal output.
Explain each fix.
```

### Use Case D: Code Review Assistance

```
Review this method for:
1. OWASP Top 10 security issues
2. Missing input validation
3. Error handling gaps
4. Performance concerns with large datasets
```

---

## 4. Hands-on Exercise: Unit Test Generation (40 min)

### Exercise 2A: JavaScript Unit Tests with Jest (20 min)

Open [`samples/javascript/src/userService.js`](samples/javascript/src/userService.js) and the test file [`samples/javascript/test/userService.test.js`](samples/javascript/test/userService.test.js).

**Step 1:** Select the `UserService` class in the editor.

**Step 2:** Open Copilot Chat and enter:
```
/tests Generate comprehensive Jest tests for the selected UserService class.
Include:
- Tests for getAllUsers, getUserById, createUser, updateUser, deleteUser
- Mock the database dependency using jest.fn()
- Test error cases: user not found, duplicate email, invalid input
- Test edge cases: empty strings, very long names, special characters
- Follow AAA pattern (Arrange, Act, Assert)
```

**Step 3:** Review the generated tests. Check that:
- All public methods are covered
- Mock setup is correct
- Assertions are meaningful (not just testing that functions exist)

**Step 4:** Run the tests in the terminal to verify they pass.

### Exercise 2B: Java Unit Tests with JUnit 5 (20 min)

Open [`samples/java/OrderService.java`](samples/java/OrderService.java) and the test file.

**Step 1:** Select the `OrderService` class.

**Step 2:** Open Copilot Chat and enter:
```
/tests Generate comprehensive JUnit 5 tests for this OrderService class.
Include:
- Use @ExtendWith(MockitoExtension.class) and @Mock for dependencies
- Tests for calculateOrderTotal, filterOrdersByStatus, getOrdersByDateRange
- Parameterized tests for multiple status values using @ParameterizedTest
- Test null safety and empty collection handling
- Use AssertJ assertions for readable assertions
- Follow the Given-When-Then pattern in test names
```

**Step 3:** Review the generated tests for:
- Proper use of Mockito mocks
- Meaningful test data (not just `"test"` strings)
- Edge case coverage

**Step 4:** If the test references missing dependencies, use inline chat (`⌘ I`) to ask Copilot to fix the imports.

### Exercise 2C: Explain & Refactor (Bonus)

Select any complex method from the sample code and ask:
```
/explain Explain this method step by step, then refactor it to:
1. Reduce cyclomatic complexity
2. Extract magic numbers into named constants
3. Improve null safety
4. Add proper logging with SLF4J
```

---

## Key Takeaways

1. **Ask mode for learning, Edit mode for precision, Agent mode for autonomy:** Choose the mode that matches your task
2. **Chat participants provide domain expertise:** `@workspace` knows your code, `@github` knows your repo, `@terminal` knows your shell
3. **Slash commands are shortcuts:** `/tests`, `/fix`, `/explain`, `/doc` save time on common tasks
4. **Be specific in test generation prompts:** Mention the test framework, patterns, edge cases, and mock strategies you want
5. **Copilot Chat is context-aware:** It automatically reads your open files, selections, and terminal output

---

**Next:** [Module 3 - Copilot on GitHub.com](../module-03-copilot-on-github/)
