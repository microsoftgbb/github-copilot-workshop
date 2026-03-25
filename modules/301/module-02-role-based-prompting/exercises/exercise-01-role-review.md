# Exercise 1: Role-Based Code Review

## Objective

See how framing Copilot with different roles produces fundamentally different review feedback on the same code.

---

## Target Code

Use this Express API controller as the code to review. Copy it into a file called `orderController.js`:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/orders', async (req, res) => {
  try {
    const { customerId, items, discount } = req.body;

    let total = 0;
    for (const item of items) {
      const product = await db.query(`SELECT price FROM products WHERE id = '${item.productId}'`);
      total += product.rows[0].price * item.quantity;
    }

    if (discount) {
      total = total - (total * discount / 100);
    }

    const order = await db.query(
      `INSERT INTO orders (customer_id, total, status) VALUES ('${customerId}', ${total}, 'pending') RETURNING *`
    );

    for (const item of items) {
      await db.query(`UPDATE products SET stock = stock - ${item.quantity} WHERE id = '${item.productId}'`);
    }

    res.json({ order: order.rows[0], total: total });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

module.exports = router;
```

---

## Part A: Security Engineer Review

Paste this prompt into Copilot Chat:

```
You are a senior security engineer performing a security audit.
Review the code in #file:orderController.js for security vulnerabilities.

Check specifically for:
- SQL injection
- Input validation gaps
- Authentication/authorization
- Error handling (information leakage)
- Data integrity issues

For each finding, rate severity (Critical/High/Medium/Low) and provide a fix.
```

**Expected findings:** SQL injection (Critical), stack trace leakage (High), no input validation (High), no auth check (High)

---

## Part B: Solutions Architect Review

```
You are a solutions architect reviewing code for production readiness.
Review #file:orderController.js for architectural concerns.

Evaluate:
- Separation of concerns
- Error handling and resilience
- Data consistency (what happens if a step fails mid-way?)
- Performance (N+1 queries, blocking operations)
- Scalability under load

Suggest an improved architecture.
```

**Expected findings:** No transaction wrapping, N+1 query problem, business logic in controller, no idempotency

---

## Part C: QA Architect Review

```
You are a QA architect. Review #file:orderController.js and create
a comprehensive test plan.

Include:
- Unit tests needed (mock the database)
- Integration test scenarios
- Edge cases (empty items array, negative discount, missing product)
- Error path testing
- What test fixtures and mocks are required?

Output a test plan as a markdown checklist.
```

---

## Part D: DevOps Engineer Review

```
You are a senior DevOps engineer reviewing this code for operational readiness.
Review #file:orderController.js for:

- Logging and observability (can you debug this in production?)
- Health check compatibility
- Graceful error handling under load
- Configuration management (hardcoded values?)
- Deployment considerations

What monitoring and alerting would you set up for this endpoint?
```

---

## Discussion

- Which role found the most critical issues?
- Were there any findings that appeared across multiple roles?
- How would you prioritize fixes across the four review perspectives?
