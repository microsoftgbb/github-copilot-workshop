# Module 04: System-Level Understanding

## Overview

Copilot works best when it understands your system as a whole — not just the file you're editing. This module covers techniques for giving Copilot **cross-service, architectural context** so it can reason about distributed systems.

1. **Architecture-as-context** — `ARCHITECTURE.md` files that describe your system
2. **Cross-repo context** — Multi-root workspaces and API contract files
3. **Dependency mapping** — Telling Copilot how services relate to each other
4. **Workspace-level instructions** — Global context that applies everywhere

## Key Concepts

### Context Sources

| Source | What It Provides | How Copilot Uses It |
|--------|-----------------|-------------------|
| `ARCHITECTURE.md` | Service map, communication patterns, data stores | Understands cross-service impact of changes |
| OpenAPI / Protobuf specs | API contracts and types | Generates clients, validates implementations |
| `copilot-instructions.md` | Service dependencies, team conventions | Scopes suggestions to your tech stack |
| Multi-root workspace | Multiple repos side-by-side | Cross-references types and patterns |

### Why This Matters

Without system context, Copilot treats every file in isolation. With it:
- Changes to a Kafka producer prompt Copilot to mention consumer impacts
- API endpoint changes reference the OpenAPI spec for consistency
- Cross-service types stay synchronized

## Exercises

### Exercise 1: Architecture Documentation

Create an `ARCHITECTURE.md` and see how it changes Copilot's suggestions.

**File:** [exercises/exercise-01-architecture-docs.md](exercises/exercise-01-architecture-docs.md)

### Exercise 2: Cross-Service Context

Work across service boundaries using contracts and dependency mapping.

**File:** [exercises/exercise-02-cross-service.md](exercises/exercise-02-cross-service.md)

### Sample Docs

Example architecture and API spec files are in the [docs/](docs/) directory.

## Demo Tips

- Show a "before" prompt without architecture context, then an "after" with `ARCHITECTURE.md` — the difference is dramatic
- Open two service repos in a multi-root workspace for the cross-service demo
- Ask Copilot to "trace a request from the API gateway to the database" with architecture context
