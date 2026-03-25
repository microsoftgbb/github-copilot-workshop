/**
 * Custom Tools Agent — Copilot SDK Demo
 *
 * Demonstrates the advanced SDK features:
 * 1. Custom tools — the agent calls back into your code
 * 2. Session hooks — intercept and modify behavior at lifecycle points
 * 3. Permission handling — fine-grained control over what the agent can do
 *
 * Prerequisites:
 *   - npm install
 *   - Copilot CLI installed and in PATH
 *   - Authenticated via `copilot auth login` or GITHUB_TOKEN env var
 */

import { z } from "zod";
import { CopilotClient, defineTool } from "@github/copilot-sdk";

// ─── Stubbed Data ─────────────────────────────────────────────
// In production, replace with calls to real APIs (Datadog, App Insights,
// PagerDuty, your deployment pipeline, etc.)

const SERVICE_HEALTH = {
  "order-service": { status: "healthy", uptimePercent: 99.97, replicas: "3/3", avgResponseMs: 45, version: "2.4.1" },
  "payment-service": { status: "healthy", uptimePercent: 99.99, replicas: "2/2", avgResponseMs: 120, version: "1.8.0" },
  "inventory-service": { status: "degraded", uptimePercent: 98.5, replicas: "2/3", avgResponseMs: 230, version: "3.1.2", issue: "1 replica in CrashLoopBackOff" },
  "notification-service": { status: "healthy", uptimePercent: 99.95, replicas: "2/2", avgResponseMs: 15, version: "1.2.0" },
};

const DEPLOYMENTS = [
  { service: "order-service", version: "2.4.1", environment: "production", deployer: "ci-bot", timestamp: "2026-03-24T14:00:00Z", status: "success" },
  { service: "order-service", version: "2.4.0", environment: "staging", deployer: "ci-bot", timestamp: "2026-03-23T11:30:00Z", status: "success" },
  { service: "order-service", version: "2.3.9", environment: "production", deployer: "ci-bot", timestamp: "2026-03-20T10:00:00Z", status: "rolled-back" },
  { service: "payment-service", version: "1.8.0", environment: "production", deployer: "ci-bot", timestamp: "2026-03-22T13:00:00Z", status: "success" },
  { service: "inventory-service", version: "3.1.2", environment: "production", deployer: "ci-bot", timestamp: "2026-03-25T08:30:00Z", status: "partial-failure" },
];

const INTERNAL_DOCS = [
  { title: "Authentication Guide", url: "https://docs.internal/auth", summary: "JWT-based auth, 15-min token expiry, OAuth2 client credentials for service-to-service" },
  { title: "Kafka Consumer Config", url: "https://docs.internal/kafka", summary: "3 retries, exponential backoff (1s/5s/30s), DLT pattern, consumer group naming" },
  { title: "Deployment Runbook", url: "https://docs.internal/deploy", summary: "PR merge → CI → ACR → Helm staging → smoke tests → canary production (10/50/100%)" },
  { title: "Incident Response", url: "https://docs.internal/incidents", summary: "PagerDuty escalation: P1=15min ack, P2=30min, P3=next business day, post-mortem within 48hrs" },
];

// ─── Custom Tool Definitions ──────────────────────────────────

const tools = [
  defineTool("get_service_health", {
    description: "Returns the health status, uptime, replica count, and average response time for a microservice",
    parameters: z.object({
      service: z.string().describe("Name of the service (e.g., order-service, payment-service)"),
    }),
    handler: async ({ service }) => {
      const health = SERVICE_HEALTH[service];
      if (!health) {
        return { error: `Unknown service '${service}'. Available: ${Object.keys(SERVICE_HEALTH).join(", ")}` };
      }
      return { service, ...health };
    },
  }),

  defineTool("get_recent_deployments", {
    description: "Lists recent deployments for a service, including version, environment, deployer, and status",
    parameters: z.object({
      service: z.string().describe("Name of the service"),
      environment: z.enum(["dev", "staging", "production"]).optional().describe("Filter by environment"),
      limit: z.number().int().min(1).max(20).optional().describe("Max results to return (default: 5)"),
    }),
    handler: async ({ service, environment, limit = 5 }) => {
      let results = DEPLOYMENTS.filter((d) => d.service === service);
      if (environment) {
        results = results.filter((d) => d.environment === environment);
      }
      return { service, deployments: results.slice(0, limit) };
    },
  }),

  defineTool("search_internal_docs", {
    description: "Searches internal company documentation and returns matching articles with summaries",
    parameters: z.object({
      query: z.string().describe("Search query — use keywords related to the topic"),
    }),
    skipPermission: true, // Read-only, no approval needed
    handler: async ({ query }) => {
      const lower = query.toLowerCase();
      const results = INTERNAL_DOCS.filter((doc) =>
        doc.title.toLowerCase().includes(lower) ||
        doc.summary.toLowerCase().includes(lower)
      );
      return { query, resultCount: results.length, results };
    },
  }),
];

// ─── Session Hooks ────────────────────────────────────────────
// Hooks intercept the agent at key lifecycle points.
// This is the enterprise governance layer.

const hooks = {
  /**
   * Runs BEFORE each tool call.
   * Can allow/deny execution, modify arguments, or add context.
   */
  onPreToolUse: async (input, _invocation) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PRE-TOOL  │ ${input.toolName} │ args: ${JSON.stringify(input.toolArgs)}`);

    // Example: force all deployment queries to production only
    if (input.toolName === "get_recent_deployments" && !input.toolArgs.environment) {
      console.log(`[${timestamp}] PRE-TOOL  │ Injecting environment=production filter`);
      return {
        permissionDecision: "allow",
        modifiedArgs: { ...input.toolArgs, environment: "production" },
        additionalContext: "Filtered to production deployments per org policy.",
      };
    }

    return { permissionDecision: "allow" };
  },

  /**
   * Runs AFTER each tool call.
   * Can modify tool results or add context for the model.
   */
  onPostToolUse: async (input, _invocation) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] POST-TOOL │ ${input.toolName} │ completed`);

    return {
      additionalContext: `Tool '${input.toolName}' executed successfully at ${timestamp}.`,
    };
  },

  /**
   * Runs when a user prompt is submitted.
   * Can modify the prompt before the agent processes it.
   */
  onUserPromptSubmitted: async (input, _invocation) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PROMPT    │ "${input.prompt.slice(0, 80)}..."`);

    // Inject org context into every prompt
    return {
      modifiedPrompt: `${input.prompt}\n\n[System context: User is querying the e-commerce platform. Current date: ${timestamp}]`,
    };
  },

  /**
   * Runs when a session starts or resumes.
   */
  onSessionStart: async (input, _invocation) => {
    console.log(`[SESSION]  │ Started (source: ${input.source})`);
    return {
      additionalContext: [
        "This agent has access to: service health monitoring, deployment history, and internal documentation.",
        "Available services: order-service, payment-service, inventory-service, notification-service.",
      ].join("\n"),
    };
  },

  /**
   * Runs when an error occurs.
   */
  onErrorOccurred: async (input, _invocation) => {
    console.error(`[ERROR]    │ ${input.errorContext}: ${input.error}`);
    return { errorHandling: "retry" };
  },
};

// ─── Permission Handler ──────────────────────────────────────
// Fine-grained control over what the agent is allowed to do.

/**
 * Custom permission handler that allows our tools and reads,
 * but blocks shell commands and writes outside src/.
 *
 * @param {import("@github/copilot-sdk").PermissionRequest} request
 * @returns {import("@github/copilot-sdk").PermissionRequestResult}
 */
function handlePermission(request) {
  const timestamp = new Date().toISOString();

  switch (request.kind) {
    case "custom-tool":
      // Always allow our registered custom tools
      console.log(`[${timestamp}] PERM ✅   │ custom-tool: ${request.toolName}`);
      return { kind: "approved" };

    case "read":
      // Allow all file reads
      console.log(`[${timestamp}] PERM ✅   │ read: ${request.fileName}`);
      return { kind: "approved" };

    case "write":
      // Only allow writes to src/
      if (request.fileName?.startsWith("src/")) {
        console.log(`[${timestamp}] PERM ✅   │ write: ${request.fileName}`);
        return { kind: "approved" };
      }
      console.log(`[${timestamp}] PERM ❌   │ write blocked: ${request.fileName}`);
      return { kind: "denied-interactively-by-user" };

    case "shell":
      // Block all shell commands
      console.log(`[${timestamp}] PERM ❌   │ shell blocked: ${request.fullCommandText}`);
      return { kind: "denied-interactively-by-user" };

    case "url":
      // Allow URL fetches
      console.log(`[${timestamp}] PERM ✅   │ url fetch`);
      return { kind: "approved" };

    default:
      console.log(`[${timestamp}] PERM ❌   │ unknown kind: ${request.kind}`);
      return { kind: "denied-interactively-by-user" };
  }
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  const client = new CopilotClient();
  await client.start();
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  Copilot SDK — Custom Tools Agent Demo       ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  try {
    const session = await client.createSession({
      model: "gpt-5",
      streaming: true,
      onPermissionRequest: handlePermission,
      tools,
      hooks,
    });

    console.log(`Session: ${session.sessionId}\n`);

    // Set up streaming output
    const done = new Promise((resolve) => {
      session.on("assistant.message_delta", (event) => {
        process.stdout.write(event.data.deltaContent);
      });
      session.on("session.idle", () => {
        console.log("\n");
        resolve();
      });
    });

    // Send the prompt (from CLI arg or default)
    const prompt = process.argv[2]
      ?? "Check the health of all services. Are there any issues? Also show me recent production deployments for the inventory-service.";

    console.log(`\nPrompt: "${prompt}"\n`);
    console.log("─".repeat(60));

    await session.send({ prompt });
    await done;

    console.log("─".repeat(60));
    await session.disconnect();
  } finally {
    await client.stop();
    console.log("Done.");
  }
}

main();
