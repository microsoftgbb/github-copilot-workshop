# Exercise 1: Build a Basic Copilot SDK Agent

## Objective

Build a minimal application that embeds Copilot's agent runtime using the `@github/copilot-sdk`. By the end you'll have a working program that creates a session, sends prompts, streams responses, and handles the full agent lifecycle.

---

## Background: What Is the Copilot SDK?

The [GitHub Copilot SDK](https://github.com/github/copilot-sdk) wraps the Copilot CLI agent runtime as a programmable library. Your app communicates with the CLI over JSON-RPC — you get the same engine behind Copilot in VS Code, but callable from your own code.

```
Your Application
       │
  CopilotClient (SDK)
       │ JSON-RPC
  Copilot CLI (server mode)
       │
  LLM (GPT-5, Claude, etc.)
```

**You don't build an orchestration layer** — Copilot handles planning, tool invocation, file edits, and context management. You simply create sessions, send prompts, and handle events.

---

## Part A: Minimal Agent

Create a new directory and set up the project:

```bash
mkdir copilot-agent-demo && cd copilot-agent-demo
npm init -y
npm install @github/copilot-sdk
```

Create `index.js`:

```javascript
import { CopilotClient, approveAll } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();

const session = await client.createSession({
  model: "gpt-5",
  onPermissionRequest: approveAll,
});

const response = await session.sendAndWait({
  prompt: "Explain what the Copilot SDK is in 3 sentences.",
});

console.log(response.data.content);

await session.disconnect();
await client.stop();
```

Run it:

```bash
node index.js
```

**Observe:** With ~15 lines of code, you have the full Copilot agent runtime embedded in your application.

---

## Part B: Streaming Responses

Modify the agent to stream responses as they arrive (like a chat interface):

```javascript
import { CopilotClient, approveAll } from "@github/copilot-sdk";

const client = new CopilotClient();
await client.start();

const session = await client.createSession({
  model: "gpt-5",
  streaming: true,
  onPermissionRequest: approveAll,
});

const done = new Promise((resolve) => {
  session.on("assistant.message_delta", (event) => {
    process.stdout.write(event.data.deltaContent);
  });

  session.on("session.idle", () => {
    console.log("\n--- Done ---");
    resolve();
  });
});

await session.send({ prompt: "Write a haiku about debugging." });
await done;

await session.disconnect();
await client.stop();
```

**Observe:** `assistant.message_delta` fires for each chunk, giving you real-time streaming like Copilot Chat.

---

## Part C: Multiple Sessions and Models

Create two sessions using different models and compare their responses:

```javascript
const session1 = await client.createSession({
  model: "gpt-5",
  onPermissionRequest: approveAll,
});

const session2 = await client.createSession({
  model: "claude-sonnet-4.5",
  onPermissionRequest: approveAll,
});

const prompt = "What are the trade-offs of microservices vs. monolith?";

const [response1, response2] = await Promise.all([
  session1.sendAndWait({ prompt }),
  session2.sendAndWait({ prompt }),
]);

console.log("=== GPT-5 ===\n", response1.data.content);
console.log("\n=== Claude ===\n", response2.data.content);
```

**Observe:** Sessions are independent — you can run different models concurrently.

---

## Part D: File Attachments

Send files to the agent for analysis:

```javascript
await session.send({
  prompt: "Review this code for security issues",
  attachments: [
    {
      type: "file",
      path: "./src/orderController.js",
      displayName: "Order Controller",
    },
  ],
});
```

---

## Part E: System Message Customization

Control the agent's persona and behavior:

```javascript
const session = await client.createSession({
  model: "gpt-5",
  onPermissionRequest: approveAll,
  systemMessage: {
    mode: "customize",
    sections: {
      tone: {
        action: "replace",
        content: "Respond in a concise, senior-engineer tone. No fluff.",
      },
      code_change_rules: { action: "remove" },
    },
    content: "Focus exclusively on security analysis. Ignore feature requests.",
  },
});
```

---

## Discussion

- How does `sendAndWait` differ from `send` + event handlers?
- When would you use streaming vs. wait-for-completion?
- What applications at your company could embed Copilot this way?
- How does the BYOK (Bring Your Own Key) option change the deployment model?
