---
name: create-service
description: Scaffold a new enterprise service class with standard patterns
agent: agent
tools: ['edit', 'search', 'read']
---

Create a new service class for the **${input:entityName}** entity.

## Detect the language from context, then:

### If Java (Spring Boot)
1. Create the service in `src/main/java/com/enterprise/demo/service/${input:entityName}Service.java`
2. Use constructor injection for the `${input:entityName}Repository` dependency
3. Include CRUD operations: `findAll`, `findById`, `create`, `update`, `delete`
4. Add `@Transactional` annotations on write operations
5. Use `Optional<T>` for `findById` return type
6. Throw custom `ResourceNotFoundException` when entity is not found
7. Add SLF4J logging for all operations with parameterized messages
8. Add Javadoc comments to all public methods
9. Validate inputs with `Objects.requireNonNull` and throw `IllegalArgumentException`

### If JavaScript (Node.js)
1. Create the service in `src/services/${input:entityName}Service.js`
2. Accept a `database` dependency via constructor injection
3. Include CRUD operations: `getAll`, `getById`, `create`, `update`, `delete`
4. Use `async/await` for all database operations
5. Throw custom error classes (`NotFoundError`, `ValidationError`)
6. Add JSDoc comments to all public methods
7. Use structured logging with operation context
8. Validate inputs and fail fast with descriptive error messages

## Standards
- Follow the project's coding standards from `.github/copilot-instructions.md`
- Use the project's error handling patterns
- Include input validation at the boundary of each method
