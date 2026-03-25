# Exercise 2: Cross-Service Context

## Objective

Use API contracts, dependency mapping, and multi-root workspaces to help Copilot reason across service boundaries.

---

## Part A: API Contracts as Context

Create `docs/order-service-api.yaml` (OpenAPI spec):

```yaml
openapi: 3.0.3
info:
  title: Order Service API
  version: 1.0.0
  description: Manages order lifecycle in the e-commerce platform

paths:
  /api/orders:
    post:
      summary: Create a new order
      operationId: createOrder
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
      responses:
        '201':
          description: Order created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Validation error
        '409':
          description: Insufficient inventory

    get:
      summary: List orders with pagination
      operationId: listOrders
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
        - name: status
          in: query
          schema: { $ref: '#/components/schemas/OrderStatus' }
      responses:
        '200':
          description: Paginated order list

  /api/orders/{orderId}:
    get:
      summary: Get order by ID
      operationId: getOrder
      parameters:
        - name: orderId
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Order details
        '404':
          description: Order not found

components:
  schemas:
    OrderStatus:
      type: string
      enum: [pending, confirmed, shipped, delivered, cancelled]

    CreateOrderRequest:
      type: object
      required: [customerId, items]
      properties:
        customerId:
          type: string
          format: uuid
        items:
          type: array
          items:
            $ref: '#/components/schemas/LineItem'

    LineItem:
      type: object
      required: [productId, quantity]
      properties:
        productId:
          type: string
          format: uuid
        quantity:
          type: integer
          minimum: 1

    Order:
      type: object
      properties:
        id: { type: string, format: uuid }
        customerId: { type: string, format: uuid }
        status: { $ref: '#/components/schemas/OrderStatus' }
        items:
          type: array
          items:
            $ref: '#/components/schemas/LineItem'
        total: { type: number, format: decimal }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
```

Now ask Copilot:

```
Using the OpenAPI spec in #file:docs/order-service-api.yaml, generate a
TypeScript client SDK for the order service with:
- Type-safe request/response types
- Methods for each operation
- Proper error handling for each status code
```

**Observe:** Copilot uses the exact types, paths, and status codes from the spec.

---

## Part B: Dependency Mapping in Instructions

Add cross-service context to `.github/copilot-instructions.md`:

```markdown
## Service Dependencies

This service (order-service) has the following dependencies:

### Synchronous (REST)
- **inventory-service**: `POST /api/inventory/reserve` — reserves stock for an order
  - Request: `{ productId: string, quantity: number, orderId: string }`
  - Response: `{ reservationId: string, expiresAt: string }`
  - Error 409: Insufficient stock

### Asynchronous (Kafka)
- **Publishes to** `order-events` topic:
  - `order.created` — when a new order is placed
  - `order.confirmed` — when payment is verified
  - `order.cancelled` — when an order is cancelled

- **Subscribes to** `payment-events` topic:
  - `payment.completed` — triggers order confirmation
  - `payment.failed` — triggers order cancellation

### Impact Rules
When modifying order processing logic:
- Changes to order creation MUST update the `order.created` event schema
- Changes to order status affect notification-service templates
- Stock reservation failures should NOT block order creation (use saga pattern)
```

Now ask:

```
Add a new 'order.shipped' event to the order service. What files need to
change and what downstream services are affected?
```

**Observe:** Copilot references the dependency mapping to identify impacted consumers.

---

## Part C: Event Schema Documentation

Create `docs/event-schemas.md`:

```markdown
# Event Schemas

All events follow CloudEvents v1.0 specification.

## order.created
```json
{
  "specversion": "1.0",
  "type": "order.created",
  "source": "order-service",
  "id": "evt-<uuid>",
  "time": "2026-03-24T10:30:00Z",
  "datacontenttype": "application/json",
  "data": {
    "orderId": "<uuid>",
    "customerId": "<uuid>",
    "items": [
      { "productId": "<uuid>", "quantity": 2, "unitPrice": 29.99 }
    ],
    "totalAmount": 59.98,
    "currency": "USD"
  }
}
```

## payment.completed
```json
{
  "specversion": "1.0",
  "type": "payment.completed",
  "source": "payment-service",
  "id": "evt-<uuid>",
  "time": "2026-03-24T10:31:00Z",
  "data": {
    "paymentId": "<uuid>",
    "orderId": "<uuid>",
    "amount": 59.98,
    "currency": "USD",
    "method": "credit_card",
    "transactionRef": "txn-<external-ref>"
  }
}
```
```

Now ask Copilot:

```
Using the event schemas in #file:docs/event-schemas.md and the architecture
in #file:ARCHITECTURE.md, create a new 'order.shipped' event schema and
the event publisher code in the order-service.
```

---

## Discussion

- How do API specs and event schemas differ as context sources?
- What's the cost/benefit of maintaining these documents vs. the improvement in Copilot output?
- How could you auto-generate some of these context files from running services?
