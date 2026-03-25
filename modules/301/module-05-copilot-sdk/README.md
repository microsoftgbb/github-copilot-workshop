# Module 05: Leveraging the GitHub Copilot SDK

## Overview

The [GitHub Copilot SDK](https://github.com/github/copilot-sdk) lets you embed Copilot's agent runtime — the same engine behind Copilot CLI — into your own applications and services. Instead of building your own orchestration, you define agent behavior and Copilot handles planning, tool invocation, file edits, streaming, and more.

> **Status:** Technical Preview. Available for Node.js/TypeScript, Python, Go, .NET, and Java.

| SDK | Package | Install |
|-----|---------|---------|
| Node.js / TypeScript | `@github/copilot-sdk` | `npm install @github/copilot-sdk` |
| Python | `github-copilot-sdk` | `pip install github-copilot-sdk` |
| Go | `github.com/github/copilot-sdk/go` | `go get github.com/github/copilot-sdk/go` |
| .NET | `GitHub.Copilot.SDK` | `dotnet add package GitHub.Copilot.SDK` |

## Architecture

```
Your Application
       │
       ▼
  CopilotClient (SDK)
       │ JSON-RPC
       ▼
  Copilot CLI (server mode)
       │
       ▼
  LLM (GPT-5, Claude, etc.)
```

The SDK manages the CLI process lifecycle automatically. You create a `CopilotClient`, open sessions, send prompts, register custom tools, and handle events — all programmatically.

## Key Concepts

### CopilotClient & Sessions

```javascript
import { CopilotClient, approveAll } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();

const session = await client.createSession({
  model: "gpt-5",
  onPermissionRequest: approveAll,
});

const response = await session.sendAndWait({
  prompt: "What is the purpose of this codebase?",
});
console.log(response.data.content);

await session.disconnect();
await client.stop();
```

### Custom Tools

Register tools the agent can call back into your application:

```javascript
import { z } from "zod";
import { defineTool } from "@github/copilot-sdk";

const session = await client.createSession({
  model: "gpt-5",
  onPermissionRequest: approveAll,
  tools: [
    defineTool("lookup_issue", {
      description: "Fetch issue details from our tracker",
      parameters: z.object({
        id: z.string().describe("Issue identifier"),
      }),
      handler: async ({ id }) => {
        const issue = await fetchIssueFromTracker(id);
        return issue;
      },
    }),
  ],
});
```

### Session Hooks

Intercept and modify behavior at key lifecycle points:

| Hook | When It Fires | What You Can Do |
|------|---------------|-----------------|
| `onPreToolUse` | Before a tool executes | Allow/deny, modify args, add context |
| `onPostToolUse` | After a tool executes | Modify results, add context |
| `onUserPromptSubmitted` | When user sends a prompt | Modify the prompt |
| `onSessionStart` | Session created/resumed | Initialize context |
| `onSessionEnd` | Session ends | Cleanup, logging |
| `onErrorOccurred` | An error occurs | Retry, skip, or abort |

### Permission Handling

Every tool invocation goes through a permission handler — you decide what the agent is allowed to do:

```javascript
onPermissionRequest: (request) => {
  if (request.kind === "shell") {
    return { kind: "denied-interactively-by-user" };
  }
  return { kind: "approved" };
}
```

## Prerequisites

- **Node.js >= 18.0.0**
- **GitHub Copilot CLI** installed and in your PATH ([install guide](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli))
- **GitHub Copilot subscription** (or use BYOK with your own API keys)

## Directory Structure

```
module-05-copilot-sdk/
├── README.md                          # ← You are here
├── exercises/
│   ├── exercise-01-basic-agent.md     # Build a basic Copilot SDK agent
│   └── exercise-02-custom-tools.md    # Register custom tools and hooks
└── examples/
    ├── basic-agent/                   # Minimal SDK agent
    │   ├── package.json
    │   └── index.js                   # CopilotClient + session + streaming
    └── custom-tools-agent/            # Agent with custom tools and hooks
        ├── package.json
        └── index.js                   # Tools, hooks, and permissions
```

## Setup

```bash
# Basic agent example
cd examples/basic-agent
npm install
node index.js

# Custom tools example
cd examples/custom-tools-agent
npm install
node index.js
```

## Demo Tips

- Start with the **basic agent** example — show how few lines it takes to embed Copilot
- Then show **custom tools** — the "aha" moment is when the agent calls back into your code
- Session hooks are the enterprise governance story — show `onPreToolUse` denying shell commands
- If the audience uses Azure, show the BYOK config with Azure OpenAI
