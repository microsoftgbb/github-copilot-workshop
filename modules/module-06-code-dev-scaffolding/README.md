# Module 6: Code Dev & Scaffolding

> **Duration:** 60 minutes (20 min demo + 40 min hands-on)
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Use Copilot to write new code and reduce boilerplate through comment-driven and chat-driven development
- Scaffold a complete, multi-file feature (controller, service, repository, DTO/model, tests) in one guided pass
- Use `#codebase` and workspace context so generated code matches existing project conventions
- Build a reusable prompt file that standardizes how your team scaffolds new components
- Recognize when to use inline suggestions vs. Chat vs. Agent mode for code generation tasks

---

## 1. From Boilerplate to Behavior (5 min demo)

### Where Copilot Removes the Grind

Scaffolding, boilerplate, and repetitive setup are exactly the work developers don't enjoy and where mistakes creep in from copy-paste. Copilot can absorb this work at three levels:

| Level | Tool | Best For |
|-------|------|----------|
| **Line/function** | Inline suggestions (Tab) | Getters/setters, constructors, small utility methods |
| **File** | Inline chat (`⌘I` / `Ctrl I`) or Ask/Edit mode | A single new class, DTO, or route handler |
| **Feature (multi-file)** | Agent mode | A new REST resource end-to-end: model, repository, service, controller, tests |

> **Enterprise tip:** The further up this ladder you go, the more your custom instructions and existing codebase conventions matter, because Copilot has more decisions to make on its own.

### Comment-Driven Development Recap

Writing a clear comment before the code you want still produces the fastest, most predictable completions:

```java
// Create a record representing an immutable money amount with currency code,
// using BigDecimal for the value and validating that currency is a 3-letter ISO code
```

```javascript
// Create an async function that retries a fetch call up to 3 times with
// exponential backoff, and throws a RetryExhaustedError after the last attempt
```

---

## 2. Scaffolding a Feature with Agent Mode (10 min demo)

### The Prompt Pattern

A good scaffolding prompt for Agent mode names every layer you expect and any conventions to follow:

```
Add a new "Invoice" resource to the Spring Boot service.

1. Invoice model (record) with: id, customerId, amount (BigDecimal), status (sealed
   interface: Draft, Sent, Paid, Overdue), issuedDate
2. InvoiceRepository interface (Spring Data JPA)
3. InvoiceService with constructor injection, methods: createInvoice, markAsPaid,
   getOverdueInvoices
4. InvoiceController exposing REST endpoints under /api/invoices (GET, POST,
   PATCH /:id/pay)
5. Follow the project's Java standards (Javadoc, Optional over null, SLF4J logging)
6. Generate JUnit 5 + Mockito unit tests for InvoiceService

Use the existing OrderService and OrderController in module-01/module-02 as a
style reference for package layout and error handling.
```

Watch how Agent mode:
1. Reads existing samples for conventions before creating new files
2. Creates each file in a sensible package/folder location
3. Wires the layers together (controller -> service -> repository)
4. Generates tests alongside the implementation
5. Proposes a terminal command to compile/run tests

### Grounding Scaffolding in Existing Conventions

Use `#codebase` to make sure new code doesn't reinvent patterns that already exist:

```
#codebase How do existing controllers in this repo handle validation errors
and structure their responses? Scaffold a new ProductController that follows
the same pattern.
```

> **Enterprise tip:** Without this grounding step, Copilot may introduce a second, inconsistent way of doing something (a new error-handling style, a different response envelope) that later needs to be reconciled across the codebase.

---

## 3. Reusable Scaffolding with Prompt Files (5 min demo)

Scaffolding prompts are worth turning into a `.prompt.md` file once your team lands on a pattern, so every developer scaffolds the same shape of component.

This repo already has one: [`.github/prompts/create-service.prompt.md`](../../.github/prompts/create-service.prompt.md).

```markdown
---
name: create-service
description: Scaffold a new service class following project conventions
tools: ['edit', 'search', 'read']
---

Create a new service class named ${input:serviceName} in the appropriate
package/directory for this project.

Follow project conventions:
- Constructor injection for dependencies (Java) or dependency parameters (JS)
- Proper error handling with custom exceptions
- Logging at key decision points
- Javadoc/JSDoc for all public methods

Also generate a corresponding unit test file with basic test scaffolding.
```

Team scaffolding prompt files typically standardize:
- The layers to generate (model/service/controller, or route/handler/validator)
- Naming and folder conventions
- Whether tests are generated in the same pass
- Which existing file(s) to use as a style reference

---

## 4. Hands-on Exercise (40 min)

### Exercise 6A: Scaffold a Java Feature End-to-End (15 min)

1. Open the workshop repo and locate [`modules/module-02-chat-deep-dive/samples/java/OrderService.java`](../module-02-chat-deep-dive/samples/java/OrderService.java) as a style reference.
2. Switch to **Agent** mode.
3. Enter:

```
Scaffold a new "Discount" feature for the Spring Boot service in
modules/module-06-code-dev-scaffolding/exercises/java/:

1. Discount record: id, code, percentageOff (BigDecimal), expiryDate
2. DiscountService with methods: applyDiscount(order, code), isExpired(discount)
3. A custom DiscountExpiredException
4. JUnit 5 unit tests for DiscountService covering valid, expired, and
   unknown-code scenarios

Follow the same package structure, Javadoc, and logging style as
OrderService.java in module-02.
```

4. Review what Copilot creates. Confirm:
   - BigDecimal is used for the monetary value (never double/float)
   - Constructor injection is used, not field injection
   - The custom exception extends a sensible base class
5. Run `mvn test` (or the project's configured test command) and fix any compile errors with inline chat.

### Exercise 6B: Scaffold a Node/Express Feature (15 min)

1. Open [`modules/module-02-chat-deep-dive/samples/javascript/src/userService.js`](../module-02-chat-deep-dive/samples/javascript/src/userService.js) as a style reference.
2. Switch to **Agent** mode.
3. Enter:

```
Scaffold a new "notifications" feature in
modules/module-06-code-dev-scaffolding/exercises/javascript/:

1. notificationService.js: sendEmail(user, message), sendSms(user, message),
   both async, both throwing a custom NotificationError on failure
2. A notifications router (Express) exposing POST /api/notifications
3. Jest unit tests for notificationService covering success and failure paths,
   with the transport dependency mocked using jest.fn()

Follow the same style as userService.js: ES2022+ features, async/await,
JSDoc comments, custom error classes.
```

4. Review the generated code for `const` usage, async/await (no raw `.then()`), and a proper custom error class.
5. Run the tests (`npm test`) and use inline chat to resolve any missing imports or mock setup issues.

### Exercise 6C: Build Your Own Scaffolding Prompt File (10 min)

1. Create `.github/prompts/scaffold-feature.prompt.md` describing the layers your team scaffolds for a new feature (e.g., model, service, controller/route, tests).
2. Include an `${input:featureName}` variable so the prompt asks for the feature name when invoked.
3. Test it by typing `/scaffold-feature` in Chat and supplying a feature name.
4. Compare the result to Exercise 6A/6B: is it more consistent because the prompt is explicit about conventions?

---

## Key Takeaways

1. **Match the tool to the scope:** inline suggestions for lines, inline chat for a file, Agent mode for a full feature
2. **Ground generation in existing code:** `#codebase` and pointing at reference files keeps new code consistent with what's already there
3. **Comment-driven prompts still matter:** a precise comment produces a precise completion, even inside Agent mode
4. **Turn repeated scaffolding prompts into `.prompt.md` files:** consistency across a team beats one developer's memory of "the right prompt"
5. **Always verify generated boilerplate compiles and passes tests:** scaffolding removes typing, not code review

---

**Next:** [Module 7 - Debugging & Defect RCA →](../module-07-debugging-defect-rca/)
