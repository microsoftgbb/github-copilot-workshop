---
name: create-unit-test
description: Generate comprehensive unit tests for the selected code
agent: agent
tools: ['edit', 'read', 'search']
---

Generate comprehensive unit tests for the selected code.

## Requirements

Detect the language and use the appropriate test framework:
- **Java** → JUnit 5 + Mockito + AssertJ
- **JavaScript/TypeScript** → Jest

## Test Coverage

Include tests for:
1. **Happy path** - Normal operation with valid inputs
2. **Edge cases** - Empty collections, boundary values, single-element inputs
3. **Null/invalid inputs** - Null, undefined, empty strings, wrong types
4. **Error scenarios** - Expected exceptions and error conditions
5. **Boundary conditions** - Min/max values, exactly-at-limit values

## Test Structure

- Follow AAA pattern (Arrange-Act-Assert)
- Use descriptive test names that explain the scenario and expected outcome
- Group related tests (Java: @Nested classes, JS: nested describe blocks)
- Mock only external dependencies
- Include a comment header explaining the test coverage strategy

## Code Quality

- Tests must compile and run without modification
- Use the project's standard assertion library (AssertJ for Java, Jest matchers for JS)
- Avoid hardcoded magic values - use descriptive constants or builders
- Each test should independently verify one behavior
