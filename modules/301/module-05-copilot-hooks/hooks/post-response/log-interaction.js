/**
 * Post-Response Hook: Log Interaction
 *
 * Writes a structured audit log entry for every Copilot Chat interaction.
 * Useful for compliance, debugging, and understanding usage patterns.
 *
 * Logs are appended to `copilot-audit.log` in JSONL format (one JSON object per line).
 *
 * Input (stdin):  JSON with { response, model, ... }
 * Output (stdout): Passthrough (unmodified response)
 */

import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "copilot-audit.log");

/**
 * Create a truncated, one-way hash of the response for deduplication
 * without storing full content in logs (privacy-conscious).
 *
 * @param {string} text
 * @returns {string}
 */
function hashContent(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 12);
}

/**
 * Classify the type of response (code generation, explanation, refactor, etc.)
 *
 * @param {string} response
 * @returns {string}
 */
function classifyResponse(response) {
  if (/```[\w]*\n/.test(response)) return "code-generation";
  if (/\brefactor/i.test(response)) return "refactor";
  if (/\btest|describe\(|it\(/i.test(response)) return "test-generation";
  if (/\bbecause|explanation|the reason/i.test(response)) return "explanation";
  return "general";
}

async function main() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  const payload = JSON.parse(input);
  const response = payload.response ?? "";

  // Build the audit log entry
  const logEntry = {
    timestamp: new Date().toISOString(),
    model: payload.model ?? "unknown",
    responseHash: hashContent(response),
    responseLength: response.length,
    responseType: classifyResponse(response),
    containsCode: /```/.test(response),
    linesOfCode: (response.match(/\n/g) ?? []).length,
    activeFile: payload.activeFile ?? null,
    // Never log the full response content for privacy — only metadata
  };

  // Ensure log directory exists
  mkdirSync(LOG_DIR, { recursive: true });

  // Append as JSONL (one JSON object per line)
  appendFileSync(LOG_FILE, JSON.stringify(logEntry) + "\n", "utf-8");

  console.error(`📝 Audit log written: ${logEntry.responseType} (${logEntry.responseLength} chars)`);

  // Pass through the response unmodified
  process.stdout.write(JSON.stringify(payload, null, 2));
}

main();
