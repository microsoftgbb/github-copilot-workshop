# Module 05: Copilot Chat Hooks & Diagnostics

## Overview

**Chat hooks** let you run scripts automatically **before** and **after** every Copilot Chat interaction. This gives teams the ability to inject context, enforce policies, log usage, and post-process responses — all without changing how developers use Copilot.

This module demonstrates each hook type with runnable scripts.

## Hook Types

| Hook | When It Runs | Use Cases |
|------|-------------|-----------|
| **Pre-request** | Before the prompt is sent to Copilot | Inject context, enforce policies, gather metadata |
| **Post-response** | After Copilot returns a response | Log interactions, enforce standards, collect metrics |

## Directory Structure

```
module-05-copilot-hooks/
├── .vscode/
│   └── settings.json          # VS Code hook configuration
├── hooks/
│   ├── pre-request/
│   │   ├── inject-context.js      # Injects git/project context into prompts
│   │   ├── compliance-gate.js     # Blocks prompts that mention sensitive topics
│   │   └── gather-architecture.js # Reads architecture docs and feeds to Copilot
│   └── post-response/
│       ├── log-interaction.js     # Audit logs every Copilot interaction
│       ├── enforce-standards.js   # Validates response against coding standards
│       └── collect-metrics.js     # Tracks usage metrics and acceptance rates
├── scripts/
│   ├── lint-output.sh             # Shell script called by enforce-standards hook
│   ├── send-telemetry.sh          # Shell script called by collect-metrics hook
│   └── check-blocklist.sh         # Shell script called by compliance-gate hook
├── package.json
└── README.md                      # ← You are here
```

## Setup

```bash
cd modules/301/module-05-copilot-hooks
npm install
```

Then open this folder in VS Code. The `.vscode/settings.json` configures the hooks automatically.

## How Hooks Work

### Configuration (`.vscode/settings.json`)

Hooks are configured in VS Code settings under `github.copilot.chat.hooks`:

```jsonc
{
  "github.copilot.chat.hooks": {
    "preRequest": [
      {
        "command": "node hooks/pre-request/inject-context.js",
        "description": "Inject project context"
      }
    ],
    "postResponse": [
      {
        "command": "node hooks/post-response/log-interaction.js",
        "description": "Audit log interaction"
      }
    ]
  }
}
```

### Pre-Request Hooks

Pre-request hooks run **before** the prompt reaches Copilot. They receive the prompt via `stdin` and can modify it or inject additional context by writing to `stdout`.

**Flow:**
```
User types prompt → Pre-request hook runs → Modified prompt sent to Copilot
```

**Example use cases:**
1. **Context injection** — Automatically append git branch, recent commits, or architecture docs
2. **Compliance gating** — Block or flag prompts that reference restricted codebases, PII patterns, or sensitive topics
3. **Metadata gathering** — Read workspace state (open files, diagnostics, test results) and include as context

### Post-Response Hooks

Post-response hooks run **after** Copilot returns a response. They receive the response via `stdin` and can log, validate, or transform it.

**Flow:**
```
Copilot returns response → Post-response hook runs → Response shown to user
```

**Example use cases:**
1. **Audit logging** — Record every interaction to a log file or external system for compliance
2. **Standards enforcement** — Check generated code against linting rules or org patterns
3. **Metrics collection** — Track response length, language, latency, and topic distribution

## Demo Walkthrough

### Demo 1: Context Injection (Pre-Request)

Show how `inject-context.js` appends git and project info to every prompt:

```bash
# Simulate the hook with sample input
echo '{"prompt": "Write a function to process orders"}' | node hooks/pre-request/inject-context.js
```

The hook reads git state and project metadata, then appends it as additional context.

### Demo 2: Compliance Gate (Pre-Request)

Show how `compliance-gate.js` blocks prompts mentioning sensitive terms:

```bash
# This should pass through
echo '{"prompt": "Refactor the order validation logic"}' | node hooks/pre-request/compliance-gate.js

# This should be flagged/blocked
echo '{"prompt": "Show me the database password for production"}' | node hooks/pre-request/compliance-gate.js
```

### Demo 3: Audit Logging (Post-Response)

Show how `log-interaction.js` writes structured logs:

```bash
echo '{"response": "Here is the refactored code...", "model": "gpt-4o", "timestamp": "2026-03-24T10:00:00Z"}' | node hooks/post-response/log-interaction.js

# Check the log
cat copilot-audit.log
```

### Demo 4: Standards Enforcement (Post-Response)

Show how `enforce-standards.js` validates generated code:

```bash
echo '{"response": "function processOrder(order) { var x = order.id; ... }"}' | node hooks/post-response/enforce-standards.js
```

The hook detects `var` usage and flags it as a standards violation.

## Key Takeaways

1. **Hooks are non-invasive** — Developers don't change their workflow; hooks run transparently
2. **Hooks are composable** — Chain multiple pre/post hooks for layered behavior
3. **Hooks enable governance** — Enterprise teams can enforce compliance without blocking adoption
4. **Hooks are scriptable** — Use any language or tool; hooks are just processes that read stdin and write stdout
