# Module 1: Copilot in VS Code - Core Experience

> **Duration:** 60 minutes (20 min demo + 40 min hands-on)  
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Receive and accept inline code suggestions using Tab, partial accept, and next edit suggestions
- Write effective comment-driven prompts that produce accurate code completions
- Navigate alternative suggestions and understand when to accept, modify, or reject them
- Apply Copilot code suggestions to real enterprise tasks: CRUD operations, data transformations, and boilerplate reduction
- Use GitHub Copilot on GitHub.com to generate pull request summaries and request AI-powered code reviews
- Assign issues to the Copilot Coding Agent and review its autonomously generated pull requests

---

## 1. How Inline Suggestions Work (5 min demo)

GitHub Copilot provides **autocomplete-style code suggestions** as you type. Suggestions appear as grayed-out "ghost text" in your editor.

### Triggering Suggestions

Copilot generates suggestions from:
1. **Code context:** The code already in your file and open tabs
2. **Comments:** Natural language descriptions of what you want to build
3. **Function signatures:** Method names and parameter types hint at intended behavior

### Accepting & Navigating Suggestions

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| **Accept full suggestion** | `Tab` | `Tab` |
| **Accept next word** | `⌘ →` | `Ctrl →` |
| **Accept next line** | Custom keybind | Custom keybind |
| **Next suggestion** | `⌥ ]` | `Alt ]` |
| **Previous suggestion** | `⌥ [` | `Alt [` |
| **Show all suggestions in panel** | `Ctrl Enter` | `Ctrl Enter` |
| **Dismiss suggestion** | `Esc` | `Esc` |

### Next Edit Suggestions (NES)

Copilot can predict **where your next edit will be** and suggest a completion for it. Look for the arrow indicator in the gutter - press `Tab` to navigate to it, then `Tab` again to accept the suggestion.

---

## 2. Comment-Driven Development (5 min demo)

Writing descriptive comments before code is one of the most effective ways to get high-quality suggestions.

### JavaScript Example

```javascript
// Calculate the number of business days between two dates
// excluding weekends (Saturday and Sunday) and an optional
// array of holiday dates
function calculateBusinessDays(startDate, endDate, holidays = []) {
  // Copilot will suggest the implementation here
}
```

### Java Example

```java
/**
 * Calculates the number of business days between two dates,
 * excluding weekends (Saturday and Sunday) and an optional
 * list of holiday dates.
 *
 * @param startDate the start date (inclusive)
 * @param endDate   the end date (inclusive)
 * @param holidays  list of holiday dates to exclude
 * @return the number of business days
 */
public static long calculateBusinessDays(LocalDate startDate, LocalDate endDate, List<LocalDate> holidays) {
    // Copilot will suggest the implementation here
}
```

### Tips for Effective Comments

| Tip | Example |
|-----|---------|
| Be specific about inputs/outputs | `// Parse a CSV string into a list of Employee objects with name, department, and salary fields` |
| Mention edge cases | `// Handle null inputs by returning an empty list` |
| Reference enterprise patterns | `// Use the repository pattern to fetch orders from the database` |
| Specify error handling | `// Throw IllegalArgumentException if the date range is invalid` |

---

## 3. Enterprise-Relevant Patterns (5 min demo)

### Data Transfer Object (DTO) Mapping - Java

```java
// Convert a UserEntity JPA entity to a UserDTO
// Map all fields including nested Address entity to AddressDTO
// Null-safe: return null if entity is null
public static UserDTO toDTO(UserEntity entity) {
    // Copilot suggests the full mapping
}
```

### REST API Response Builder - JavaScript

```javascript
// Create a standardized API response envelope
// with status, data, message, and timestamp fields
// following the enterprise API response format
function createApiResponse(status, data, message) {
  // Copilot suggests the response structure
}
```

---

## 4. GitHub Copilot Cloud Interactions (5 min demo)

Copilot is not limited to your local editor. On **GitHub.com**, Copilot is embedded across pull requests, issues, search, and the dashboard — no editor required.

### Pull Request Summaries

When you open a pull request, click the **Copilot** icon in the PR description field to generate an automatic summary. Copilot analyzes the diff and produces:
- An **overview** of what changed and why
- A **file-by-file breakdown** describing each change
- **Review guidance** highlighting what a reviewer should focus on

### Copilot Code Review

Request a review from **Copilot** just like you would from a human reviewer:

1. Open a pull request
2. In the **Reviewers** section, add **Copilot** as a reviewer
3. Copilot posts inline comments with findings and code suggestions

Copilot code review uses the rules in `.github/copilot-instructions.md` to check against your team's coding standards. If this file does not exist, Copilot applies its own general best-practice guidelines.

| Review Category | What Copilot Checks |
|-----------------|---------------------|
| **Security** | Injection risks, credential exposure, OWASP Top 10 |
| **Code quality** | Duplicate code, missing error handling, complexity |
| **Standards** | Team-defined rules from custom instructions |
| **Performance** | N+1 queries, missing caching, unnecessary allocations |

### Copilot Coding Agent

The Copilot coding agent lets you assign a GitHub issue to Copilot and have it autonomously implement the fix or feature:

1. **Assign an issue to Copilot** — Copilot creates a branch and starts working
2. **Copilot opens a pull request** — Review the proposed changes as you would any PR
3. **Iterate via PR comments** — Leave feedback; Copilot revises and pushes updates

> **Enterprise note:** The coding agent respects `.github/copilot-instructions.md` and runs CI/CD pipelines to validate its own changes.

---

## 5. Hands-on Exercise (40 min)

### Exercise 1A: Complete the Order Service (JavaScript)

Open [`exercises/orderService.js`](exercises/orderService.js) and use Copilot to complete the functions.

**Goals:**
- Let Copilot generate implementations from the comments
- Practice accepting, rejecting, and navigating between suggestions
- Use partial accept (`⌘ →`) to take a suggestion word by word

### Exercise 1B: Complete the Order Service (Java)

Open [`exercises/OrderService.java`](exercises/OrderService.java) and use Copilot to complete the methods.

**Goals:**
- Use Copilot to implement enterprise patterns like validation, filtering, and aggregation
- Observe how Copilot uses Java type information to provide better suggestions
- Practice showing alternative suggestions with `⌥ ]` / `⌥ [`

### Exercise 1C: Rapid Boilerplate Generation

Open a new file and write the following comment, then let Copilot generate the code:

**JavaScript:**
```javascript
// Express.js REST controller for a Product resource
// with CRUD endpoints: GET all, GET by id, POST, PUT, DELETE
// Include input validation and error handling middleware
// Use async/await pattern
```

**Java:**
```java
/**
 * Spring Boot REST controller for a Product resource.
 * CRUD endpoints: GET all, GET by id, POST, PUT, DELETE.
 * Include request validation with @Valid annotation.
 * Use ResponseEntity for proper HTTP status codes.
 */
```

### Exercise 1D: GitHub Copilot Cloud Interactions (10 min)

#### Part 1: Generate a Pull Request Summary

1. Create a new branch in this repository and make a small, meaningful code change (e.g., add a utility method to `exercises/orderService.js` or add input validation to `exercises/OrderService.java`)
2. Push the branch and open a pull request on GitHub.com
3. In the PR description field, click the **Copilot** icon (or the "Generate summary" button)
4. Review the generated summary:
   - Does the "what changed" section accurately reflect your change?
   - Would a reviewer find this summary useful?
5. Edit the summary to add any context Copilot missed

#### Part 2: Request a Copilot Code Review

1. On the same pull request, go to the **Reviewers** section on the right sidebar
2. Add **Copilot** as a reviewer
3. Wait for Copilot to analyze the PR and post review comments
4. Review Copilot's feedback:
   - Are the suggestions relevant to your change?
   - Did it flag anything against the standards in `.github/copilot-instructions.md`?
   - How does it compare to what a human reviewer would say?

#### Part 3: Explore the Copilot Coding Agent (Bonus)

1. Navigate to the **Issues** tab of the repository
2. Open or create a small, well-described issue (e.g., "Add input validation to orderService.js")
3. In the **Assignees** section, assign the issue to **Copilot**
4. Watch Copilot create a branch and open a pull request
5. Review the pull request and leave a comment to request a change; observe how Copilot revises

---

## Key Takeaways

1. **Copilot is a pair programmer, not autopilot:** Always review suggestions before accepting
2. **Better context = better suggestions:** Descriptive comments, type hints, and existing code all improve completion quality
3. **Partial acceptance is powerful:** Use `⌘ →` to accept word-by-word when a suggestion is mostly right
4. **Next Edit Suggestions save navigation time:** Let Copilot predict where you need to edit next
5. **Enterprise patterns are well-supported:** DTOs, repository patterns, API envelopes, and validation logic all generate reliably
6. **Copilot extends beyond the IDE:** PR summaries, AI code review, and the coding agent work directly on GitHub.com — no editor required
7. **The coding agent is an autonomous team member:** Assign an issue to Copilot and it will create a branch, implement the change, and open a PR for your review

---

**Next:** [Module 2 - Copilot Chat: Deep Dive](../module-02-chat-deep-dive/)
