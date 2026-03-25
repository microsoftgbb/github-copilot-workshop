/**
 * Basic Copilot SDK Agent
 *
 * Demonstrates the minimal setup for embedding the Copilot agent runtime:
 * 1. Create a CopilotClient
 * 2. Open a session with a model
 * 3. Send a prompt with streaming
 * 4. Clean up
 *
 * Prerequisites:
 *   - npm install @github/copilot-sdk
 *   - Copilot CLI installed and in PATH
 *   - Authenticated via `copilot auth login` or GITHUB_TOKEN env var
 */

import { CopilotClient, approveAll } from "@github/copilot-sdk";

/**
 * Run a basic Copilot agent that streams a response to stdout.
 */
async function main() {
  // ── 1. Create and start the client ──
  // This spawns the Copilot CLI in server mode and connects via JSON-RPC.
  const client = new CopilotClient();
  await client.start();
  console.log("Copilot client started.\n");

  try {
    // ── 2. Create a session ──
    // Each session is an independent conversation with its own context.
    // `onPermissionRequest` is required — it governs what the agent can do.
    const session = await client.createSession({
      model: "gpt-5",
      streaming: true,
      onPermissionRequest: approveAll,
    });

    console.log(`Session created: ${session.sessionId}\n`);

    // ── 3. Set up event handlers for streaming ──
    const done = new Promise((resolve) => {
      // Fires for each chunk of the response (streaming)
      session.on("assistant.message_delta", (event) => {
        process.stdout.write(event.data.deltaContent);
      });

      // Fires when a tool starts executing
      session.on("tool.execution_start", (event) => {
        console.log(`\n🔧 Tool starting: ${event.data.toolName}`);
      });

      // Fires when a tool completes
      session.on("tool.execution_complete", (event) => {
        console.log(`✅ Tool completed: ${event.data.toolName}\n`);
      });

      // Fires when the session is idle (response complete)
      session.on("session.idle", () => {
        console.log("\n\n--- Session idle ---");
        resolve();
      });
    });

    // ── 4. Send a prompt ──
    const prompt = process.argv[2] ?? "Explain the GitHub Copilot SDK in 3 sentences.";
    console.log(`Prompt: "${prompt}"\n`);
    console.log("Response:\n");

    await session.send({ prompt });
    await done;

    // ── 5. Clean up ──
    await session.disconnect();
    console.log("Session disconnected.");
  } finally {
    await client.stop();
    console.log("Client stopped.");
  }
}

main();
