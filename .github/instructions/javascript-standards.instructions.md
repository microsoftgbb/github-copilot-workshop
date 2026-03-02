---
applyTo: "**/*.js,**/*.ts,**/*.mjs"
---

# JavaScript/TypeScript Coding Standards

- Use ES2022+ features: optional chaining (?.), nullish coalescing (??), private class fields (#)
- Prefer const over let; never use var
- Use async/await for all asynchronous operations (never .then() chains)
- Use arrow functions for callbacks and anonymous functions
- All classes and public functions must have JSDoc comments
- Create custom error classes extending Error for domain-specific errors
- Use structured logging with correlation IDs for traceability
- Validate all function inputs at the boundary; fail fast with descriptive errors
- Export named exports (avoid default exports for better refactoring)
- Use jest.fn() for mocks, follow AAA (Arrange-Act-Assert) in tests
- Prefer descriptive test names: "should throw UserNotFoundError when user does not exist"
