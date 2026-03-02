# Module 1: Copilot in VS Code - Core Experience

> **Duration:** 45 minutes (15 min demo + 30 min hands-on)  
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Receive and accept inline code suggestions using Tab, partial accept, and next edit suggestions
- Write effective comment-driven prompts that produce accurate code completions
- Navigate alternative suggestions and understand when to accept, modify, or reject them
- Apply Copilot code suggestions to real enterprise tasks: CRUD operations, data transformations, and boilerplate reduction

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

## 4. Hands-on Exercise (30 min)

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

---

## Key Takeaways

1. **Copilot is a pair programmer, not autopilot:** Always review suggestions before accepting
2. **Better context = better suggestions:** Descriptive comments, type hints, and existing code all improve completion quality
3. **Partial acceptance is powerful:** Use `⌘ →` to accept word-by-word when a suggestion is mostly right
4. **Next Edit Suggestions save navigation time:** Let Copilot predict where you need to edit next
5. **Enterprise patterns are well-supported:** DTOs, repository patterns, API envelopes, and validation logic all generate reliably

---

**Next:** [Module 2 - Copilot Chat: Deep Dive](../module-02-chat-deep-dive/)
