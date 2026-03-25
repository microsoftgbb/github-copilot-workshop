# Sample Architecture Document

> Copy this to `ARCHITECTURE.md` at the root of your project for use in exercises.

## Overview

E-commerce platform using microservices architecture deployed on Azure Kubernetes Service (AKS). Services communicate via REST (synchronous) and Apache Kafka on Azure Event Hubs (asynchronous events).

## Services

| Service | Tech Stack | Database | Kafka Topics |
|---------|-----------|----------|-------------|
| order-service | Node.js / Express | PostgreSQL | Publishes: `order-events` |
| inventory-service | Python / FastAPI | PostgreSQL | Publishes: `inventory-events`, Consumes: `order-events` |
| payment-service | Java / Spring Boot | PostgreSQL | Publishes: `payment-events`, Consumes: `order-events` |
| notification-service | Go | Redis | Consumes: `order-events`, `payment-events`, `inventory-events` |

## Data Flow: Order Creation

```
Client
  │
  ▼
API Gateway (Azure APIM)
  │
  ▼
order-service ──POST /api/orders──► Creates order (pending)
  │                                    │
  │                              Publishes: order.created
  │                                    │
  ├──────────────────┬─────────────────┤
  ▼                  ▼                 ▼
inventory-svc    payment-svc    notification-svc
  │                  │                 │
reserves stock   init payment     queues welcome email
  │                  │
  ▼                  ▼
stock.reserved   payment.completed
                     │
                     ▼
              order-service
              updates status → confirmed
                     │
                     ▼
              notification-svc
              sends confirmation email
```

## Environment

- **Orchestration:** AKS with Helm charts
- **CI/CD:** GitHub Actions → Azure Container Registry → AKS
- **Monitoring:** Azure Monitor + Application Insights
- **Secrets:** Azure Key Vault (mounted via CSI driver)
