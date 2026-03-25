# Exercise 2: Custom Tools, Hooks & Permissions

## Objective

Extend a Copilot SDK agent with **custom tools** (that the agent can call back into your code), **session hooks** (to intercept and control behavior), and **permission handling** (to govern what the agent is allowed to do).

---

## Part A: Register Custom Tools

Custom tools let the Copilot agent call back into your application. You define the tool's name, description, parameters (using Zod schemas), and a handler function.

Create `index.js`:

```javascript
import { z } from "zod";
import { CopilotClient, approveAll, defineTool } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();

const session = await client.createSession({
  model: "gpt-5",
  onPermissionRequest: approveAll,
  tools: [
    defineTool("get_service_health", {
      description: "Returns the health status and uptime for a microservice",
      parameters: z.object({
        service: z.string().describe("Name of the service, e.g. order-service"),
      }),
      handler: async ({ service }) => {
        // Stubbed — in production, call your monitoring API
        const healthData = {
          "order-service": { status: "healthy", uptime: "99.97%", replicas: "3/3" },
          "payment-service": { status: "healthy", uptime: "99.99%", replicas: "2/2" },
          "inventory-service": { status: "degraded", uptime: "98.5%", replicas: "2/3" },
        };
        return healthData[service] ?? { status: "unknown", message: `Service '${service}' not found` };
      },
    }),

    defineTool("get_recent_deployments", {
      description: "Lists recent deployments for a service, including version and status",
      parameters: z.object({
        service: z.string().describe("Name of the service"),
        environment: z.enum(["dev", "staging", "production"]).optional()
          .describe("Filter by environment"),
      }),
      handler: async ({ service, environment }) => {
        const deployments = [
          { version: "2.4.1", environment: "production", status: "success", timestamp: "2026-03-24T14:00:00Z" },
          { version: "2.4.0", environment: "staging", status: "success", timestamp: "2026-03-23T11:30:00Z" },
          { version: "2.3.9", environment: "production", status: "rolled-back", timestamp: "2026-03-20T10:00:00Z" },
        ];
        const filtered = environment
          ? deployments.filter((d) => d.environment === environment)
          : deployments;
        return { service, deployments: filtered };
      },
    }),

    defineTool("search_internal_docs", {
      description: "Searches internal documentation and returns matching articles",
      parameters: z.object({
        query: z.string().describe("Search query"),
      }),
      skipPermission: true, // Read-only — no permission prompt needed
      handler: async ({ query }) => {
        // Stubbed — in production, call your vector DB or search API
        return {
          results: [
            { title: "Deployment Runbook", url: "https://docs.internal/deploy" },
            { title: "Kafka Consumer Config", url: "https://docs.internal/kafka" },
          ],
          query,
        };
      },
    }),
  ],
});

const response = await session.sendAndWait({
  prompt: "Is the inventory service healthy? Also show me recent production deployments.",
});

console.log(response.data.content);

await session.disconnect();
await client.stop();
```

**Observe:** The agent autonomously decides which tools to call based on the prompt. It may call both `get_service_health` and `get_recent_deployments` in a single turn.

---

## Part B: Session Hooks

Hooks let you intercept tool calls, prompt submission, and errors — the foundation for enterprise governance.

```javascript
const session = await client.createSession({
  model: "gpt-5",
  onPermissionRequest: approveAll,
  tools: [/* ... your tools ... */],
  hooks: {
    // Runs BEFORE every tool call
    onPreToolUse: async (input, invocation) => {
      console.log(`[HOOK] Tool starting: ${input.toolName}`);
      console.log(`[HOOK]   Args: ${JSON.stringify(input.toolArgs)}`);

      // Example: block a specific tool
      if (input.toolName === "run_shell_command") {
        return {
          permissionDecision: "deny",
          additionalContext: "Shell commands are not allowed in this environment.",
        };
      }

      // Example: modify tool arguments
      if (input.toolName === "get_recent_deployments") {
        return {
          permissionDecision: "allow",
          modifiedArgs: {
            ...input.toolArgs,
            environment: "production", // Force production-only results
          },
          additionalContext: "Filtered to production deployments per policy.",
        };
      }

      return { permissionDecision: "allow" };
    },

    // Runs AFTER every tool call
    onPostToolUse: async (input, invocation) => {
      console.log(`[HOOK] Tool completed: ${input.toolName}`);
      // Could log to an audit system, add context, or transform results
      return {
        additionalContext: `Tool ${input.toolName} executed successfully.`,
      };
    },

    // Runs when user submits a prompt
    onUserPromptSubmitted: async (input, invocation) => {
      console.log(`[HOOK] Prompt: ${input.prompt}`);
      // Could inject context, modify the prompt, or block it
      return {
        modifiedPrompt: `${input.prompt}\n\n[Context: User is querying the staging environment]`,
      };
    },

    // Runs when session starts
    onSessionStart: async (input, invocation) => {
      console.log(`[HOOK] Session started (source: ${input.source})`);
      return {
        additionalContext: "This agent has access to service health and deployment data.",
      };
    },

    // Runs when an error occurs
    onErrorOccurred: async (input, invocation) => {
      console.error(`[HOOK] Error: ${input.error} (context: ${input.errorContext})`);
      return {
        errorHandling: "retry", // "retry", "skip", or "abort"
      };
    },
  },
});
```

**Try it:** Run the agent and watch the hook output in the console. Notice how `onPreToolUse` fires before each tool and can modify arguments or block execution.

---

## Part C: Custom Permission Handler

Replace `approveAll` with fine-grained permission logic:

```javascript
const session = await client.createSession({
  model: "gpt-5",
  onPermissionRequest: (request) => {
    // Log every permission request
    console.log(`[PERMISSION] ${request.kind}: ${request.toolName ?? request.fileName ?? request.fullCommandText ?? "n/a"}`);

    switch (request.kind) {
      case "shell":
        // Block all shell commands
        console.log("[PERMISSION] Denied: shell commands not allowed");
        return { kind: "denied-interactively-by-user" };

      case "write":
        // Only allow writes to specific directories
        if (!request.fileName?.startsWith("src/")) {
          console.log(`[PERMISSION] Denied: write outside src/ (${request.fileName})`);
          return { kind: "denied-interactively-by-user" };
        }
        return { kind: "approved" };

      case "custom-tool":
        // Always allow our registered tools
        return { kind: "approved" };

      case "read":
        // Allow all reads
        return { kind: "approved" };

      default:
        // Deny anything unexpected
        return { kind: "denied-interactively-by-user" };
    }
  },
});
```

---

## Part D: BYOK (Bring Your Own Key)

Use the SDK with your own Azure OpenAI or other provider — no GitHub Copilot subscription required:

```javascript
const session = await client.createSession({
  model: "gpt-4",
  provider: {
    type: "azure",
    baseUrl: "https://my-resource.openai.azure.com",
    apiKey: process.env.AZURE_OPENAI_KEY,
    azure: {
      apiVersion: "2024-10-21",
    },
  },
  onPermissionRequest: approveAll,
});
```

---

## Discussion

- How do custom tools differ from MCP servers? When would you use each?
- What governance policies would your org need before deploying an SDK-based agent?
- How would you test tool handlers independently of the Copilot runtime?
- What's the security model for permission handling in a multi-tenant scenario?
