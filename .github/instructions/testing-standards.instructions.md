---
applyTo: "src/test/**/*.java,**/*.test.js,**/*.spec.js,**/*.test.ts,**/*.spec.ts"
---

# Testing Standards

## General
- Follow AAA pattern: Arrange (setup), Act (execute), Assert (verify)
- One logical assertion per test (multiple assertThat calls for the same concept are fine)
- Use descriptive test names that explain the scenario and expected outcome
- Test behavior, not implementation details
- Each test must be independent and repeatable

## Mocking
- Mock only external dependencies (databases, APIs, file systems)
- Never mock the class under test
- Verify mock interactions only when the interaction itself is the behavior being tested
- Reset mocks between tests

## Coverage Requirements
- Service classes: minimum 80% branch coverage
- Controller classes: minimum 70% line coverage
- Utility classes: minimum 90% line coverage
- Always test: happy path, error paths, boundary values, null/empty inputs

## Java Specific
- Use @ExtendWith(MockitoExtension.class) with @Mock annotations
- Use @Nested classes to group tests by method
- Use @ParameterizedTest with @CsvSource or @EnumSource for data-driven tests
- Use AssertJ fluent assertions

## JavaScript Specific
- Use jest.fn() and jest.spyOn() for mocking
- Use beforeEach for shared setup; avoid beforeAll for mutable state
- Test async code with async/await (never done callbacks)
- Use jest.useFakeTimers() for time-dependent tests
