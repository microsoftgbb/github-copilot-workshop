# Exercise 1: Architecture Documentation

## Objective

Create an `ARCHITECTURE.md` file and observe how it changes the quality of Copilot's suggestions when working on cross-cutting concerns.

---

## Part A: Baseline — Without Architecture Context

Open any source file and ask Copilot Chat:

```
I need to add a new payment processing flow. When a payment is received,
we need to update the order status, reduce inventory, and send a
confirmation email. How should I implement this?
```

**Observe:** Copilot gives a generic answer — it doesn't know your services, communication patterns, or data stores.

---

## Part B: Create Architecture Documentation

Create a file called `ARCHITECTURE.md` at the project root:

```markdown
# System Architecture

## Overview
E-commerce platform using microservices architecture. Services communicate
via REST (synchronous) and Apache Kafka (asynchronous events).

## Services

### order-service (Node.js / Express)
- **Responsibility:** Order lifecycle management (create, update, cancel)
- **Database:** PostgreSQL (`orders`, `line_items`, `order_status_history`)
- **Publishes events:** `order.created`, `order.updated`, `order.cancelled` → Kafka topic `order-events`
- **Consumes events:** `payment.completed` from `payment-events` topic
- **API Base:** `http://order-service:3000/api`

### inventory-service (Python / FastAPI)
- **Responsibility:** Stock level management, reservation
- **Database:** PostgreSQL (`products`, `stock_levels`, `reservations`)
- **Publishes events:** `stock.reserved`, `stock.released`, `stock.depleted` → Kafka topic `inventory-events`
- **Consumes events:** `order.created` from `order-events` topic
- **API Base:** `http://inventory-service:8000/api`

### payment-service (Java / Spring Boot)
- **Responsibility:** Payment processing, refunds
- **Database:** PostgreSQL (`payments`, `refunds`, `payment_methods`)
- **Publishes events:** `payment.completed`, `payment.failed`, `payment.refunded` → Kafka topic `payment-events`
- **Consumes events:** `order.created` from `order-events` topic
- **API Base:** `http://payment-service:8080/api`

### notification-service (Go)
- **Responsibility:** Email, SMS, push notifications
- **Database:** Redis (notification queue, delivery tracking)
- **Consumes events:** `order.*`, `payment.*`, `inventory.stock.depleted`
- **No published events** — terminal consumer
- **Templates:** `templates/email/`, `templates/sms/`

## Communication Patterns

### Synchronous (REST)
- API Gateway → individual services (read operations, queries)
- order-service → inventory-service: `POST /api/inventory/reserve` (stock reservation)

### Asynchronous (Kafka)
- Topic `order-events`: order-service → inventory-service, payment-service, notification-service
- Topic `payment-events`: payment-service → order-service, notification-service
- Topic `inventory-events`: inventory-service → notification-service

### Event Schema
All events follow the CloudEvents specification:
```json
{
  "specversion": "1.0",
  "type": "order.created",
  "source": "order-service",
  "id": "<uuid>",
  "time": "<ISO 8601>",
  "data": { ... }
}
```

## Data Flow: Order Creation
1. Client → API Gateway → order-service: `POST /api/orders`
2. order-service creates order (status: `pending`) → publishes `order.created`
3. inventory-service receives `order.created` → reserves stock → publishes `stock.reserved`
4. payment-service receives `order.created` → initiates payment
5. payment-service completes → publishes `payment.completed`
6. order-service receives `payment.completed` → updates status to `confirmed`
7. notification-service receives `order.created` + `payment.completed` → sends confirmation email

## Infrastructure
- **Container Orchestration:** Kubernetes (AKS)
- **Message Broker:** Apache Kafka (Azure Event Hubs with Kafka protocol)
- **Databases:** Azure Database for PostgreSQL (one per service)
- **Cache:** Azure Cache for Redis
- **API Gateway:** Azure API Management
```

---

## Part C: Re-ask With Architecture Context

Now ask the same question again:

```
I need to add a new payment processing flow. When a payment is received,
we need to update the order status, reduce inventory, and send a
confirmation email.

Reference the architecture in #file:ARCHITECTURE.md for service boundaries
and communication patterns. How should I implement this?
```

**Compare the responses:**
- Does Copilot now reference specific services and topics?
- Does it follow the event-driven pattern described in the architecture?
- Does it suggest the right Kafka topics and event types?

---

## Part D: Architecture-Informed Code Generation

Now ask Copilot to generate actual code with architecture awareness:

```
Based on #file:ARCHITECTURE.md, create a Kafka consumer in the order-service
that listens to the `payment-events` topic and handles `payment.completed`
events by updating the order status from 'pending' to 'confirmed'.

Follow the CloudEvents schema and the existing patterns in this project.
```

---

## Discussion

- How much did `ARCHITECTURE.md` change the quality of Copilot's responses?
- What's the maintenance cost of keeping this file up to date?
- How would you automate parts of the architecture documentation?
