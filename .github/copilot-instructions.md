# Project Instructions for Copilot

## Project Overview

This is a GitHub Copilot workshop repository with enterprise code samples in Java 17 (Spring Boot 3.x, Maven) and JavaScript (Node.js 18+, Express).

## Coding Standards

### Java
- Use Java 17 features: records, sealed interfaces, pattern matching, text blocks
- Follow Google Java Style Guide for formatting
- All public methods must have Javadoc comments
- Use constructor injection (never field injection with @Autowired)
- Prefer Optional over null returns
- Use SLF4J for logging with parameterized messages: `log.info("Processing order {}", orderId)`
- Use BigDecimal for all monetary calculations (never double or float)

### JavaScript
- Use ES2022+ features: optional chaining, nullish coalescing, private class fields
- Prefer `const` over `let`; never use `var`
- Use `async/await` (never raw Promises with `.then()`)
- Use arrow functions for callbacks
- All classes should have JSDoc comments
- Use structured error classes extending Error

## Testing Standards

### Java
- Use JUnit 5 with Mockito and AssertJ
- Name tests: `givenX_whenY_thenZ`
- Use `@ParameterizedTest` for data-driven tests
- Use `@Nested` classes to group tests by method under test
- Minimum 80% branch coverage for service classes

### JavaScript
- Use Jest as the test framework
- Follow AAA pattern (Arrange, Act, Assert) in each test
- Use `jest.fn()` and `jest.spyOn()` for mocking
- Use descriptive test names: `should throw UserNotFoundError when user does not exist`

## Error Handling
- Create custom exception/error classes for domain-specific errors
- Never expose stack traces in API responses
- Log errors with sufficient context for debugging
- Use appropriate HTTP status codes in controllers

## Security
- Validate all inputs at the boundary (controllers, API handlers)
- Never log sensitive data (PII, credentials, tokens, passwords)
- Use parameterized queries (never string concatenation for SQL)
- Sanitize user input before rendering in templates
