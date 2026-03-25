# Exercise 1: Agent Steering — Vague vs. Structured

## Objective

Experience firsthand how prompt structure determines agent output quality.

---

## Part A: The Vague Prompt (Let It Fail)

Switch Copilot Chat to **Agent mode** and send:

```
Add a user management feature to this project
```

**Observe what happens:**
- Does the agent ask clarifying questions or just start building?
- Where does it put the files?
- Does it follow existing project patterns?
- Does it install unexpected dependencies?
- Does it modify files you didn't want changed?

**Don't accept the changes.** Discard them.

---

## Part B: The Structured Prompt

Now send this well-structured prompt:

```
Add a user management feature to the Express API with the following requirements:

1. Create a User model in `src/models/user.js` with fields:
   - id (UUID, auto-generated)
   - email (string, unique, required)
   - name (string, required)
   - role (enum: 'admin' | 'user' | 'viewer', default: 'user')
   - createdAt, updatedAt (timestamps)

2. Create a UserService in `src/services/userService.js` with methods:
   - createUser(data): validates email uniqueness, hashes password
   - getUserById(id): returns user without password field
   - updateUser(id, data): partial update, validates email uniqueness
   - deleteUser(id): soft delete (set deletedAt timestamp)
   - listUsers(filters): paginated list with role filtering

3. Create routes in `src/routes/users.js`:
   - POST /api/users — create user (admin only)
   - GET /api/users/:id — get user by ID
   - PATCH /api/users/:id — update user
   - DELETE /api/users/:id — soft delete (admin only)
   - GET /api/users — list users with pagination

4. Follow the existing patterns in `src/routes/orders.js` for middleware, error handling, and response format.

Constraints:
- Do NOT install any new npm packages — use what's in package.json
- Do NOT modify any existing files
- Do NOT create migration files — just the application code
- Use the custom error classes from `src/errors/`
```

**Compare:** How does this output differ from Part A?

---

## Part C: Adding Constraints Mid-Stream

After the agent produces the code from Part B, add constraints incrementally:

```
Now add input validation to the user routes using Zod schemas.
Create the schemas in `src/schemas/userSchemas.js`.
Do not modify the route files — create a validation middleware instead.
```

Then:

```
Add unit tests for UserService in `src/services/__tests__/userService.test.js`.
Use Jest with jest.fn() for database mocks.
Follow the AAA pattern. Include tests for the soft delete behavior.
Do not modify the service code.
```

---

## Part D: Using `.instructions.md` for Automatic Steering

Create a file `.github/instructions/api-routes.instructions.md`:

```markdown
---
applyTo: "src/routes/**"
---
All API route handlers in this project must:

- Use the `asyncHandler` wrapper from `src/middleware/asyncHandler.js`
- Validate request bodies using Zod schemas from `src/schemas/`
- Return responses using `ApiResponse.success()` or `ApiResponse.error()` from `src/utils/response.js`
- Include JSDoc comments with @route, @method, @access annotations
- Never catch errors directly — let the global error handler manage them
- Use destructured request fields: `const { body, params, query } = req`
```

Now ask the agent to create a new route — does it follow the instructions automatically?

---

## Discussion

- How much did the constraints reduce unwanted side effects?
- What constraints do you wish you could enforce automatically for your team?
- When should you use inline constraints vs. `.instructions.md` files?
