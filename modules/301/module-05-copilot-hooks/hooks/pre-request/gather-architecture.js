/**
 * Pre-Request Hook: Gather Architecture Context
 *
 * Reads architecture documentation (ARCHITECTURE.md, service maps, API specs)
 * from the workspace and injects a summary into the Copilot prompt.
 *
 * This helps Copilot understand multi-service systems without the developer
 * needing to manually reference files every time.
 *
 * Input (stdin):  JSON with { prompt, activeFile, ... }
 * Output (stdout): JSON with architecture context appended
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

/** Files to scan for architecture context, in priority order. */
const ARCHITECTURE_FILES = [
  "ARCHITECTURE.md",
  "docs/architecture.md",
  "docs/ARCHITECTURE.md",
  "CODEBASE.md",
  "docs/system-design.md",
  "docs/api-spec.yaml",
  "docs/openapi.yaml",
];

/**
 * Stub: In a real setup, this would call a service registry or read
 * from a config file to build a service dependency map.
 *
 * @returns {string} Service dependency context
 */
function getServiceDependencies() {
  // Stubbed — replace with actual service registry lookup
  return [
    "Service Dependencies (from registry):",
    "  order-service → inventory-service (REST: POST /api/inventory/reserve)",
    "  order-service → notification-service (Kafka: topic 'order-events')",
    "  inventory-service → analytics-service (Kafka: topic 'stock-updates')",
  ].join("\n");
}

/**
 * Read the first N lines of an architecture doc to keep context concise.
 *
 * @param {string} filePath
 * @param {number} maxLines
 * @returns {string | null}
 */
function readArchitectureDoc(filePath, maxLines = 50) {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n").slice(0, maxLines);
    return lines.join("\n");
  } catch {
    return null;
  }
}

/**
 * Detect which service the active file belongs to, based on path conventions.
 *
 * @param {string | undefined} activeFile
 * @returns {string | null}
 */
function detectActiveService(activeFile) {
  if (!activeFile) return null;

  const servicePatterns = [
    { pattern: /order[_-]?service/i, name: "order-service" },
    { pattern: /inventory[_-]?service/i, name: "inventory-service" },
    { pattern: /notification[_-]?service/i, name: "notification-service" },
    { pattern: /auth[_-]?service/i, name: "auth-service" },
    { pattern: /gateway/i, name: "api-gateway" },
  ];

  for (const { pattern, name } of servicePatterns) {
    if (pattern.test(activeFile)) {
      return name;
    }
  }

  return null;
}

async function main() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  const payload = JSON.parse(input);
  const contextParts = [];

  // 1. Try to find and read an architecture doc
  for (const relPath of ARCHITECTURE_FILES) {
    const fullPath = path.resolve(process.cwd(), relPath);
    const content = readArchitectureDoc(fullPath);
    if (content) {
      contextParts.push(`Architecture (from ${relPath}):\n${content}`);
      break; // use the first one found
    }
  }

  // 2. Add service dependency info
  contextParts.push(getServiceDependencies());

  // 3. Detect which service context we're in
  const activeService = detectActiveService(payload.activeFile);
  if (activeService) {
    contextParts.push(`Active Service Context: ${activeService}`);
  }

  // Only inject if we found any context
  if (contextParts.length > 0) {
    const contextBlock = [
      "--- Architecture Context (auto-injected by pre-request hook) ---",
      ...contextParts,
      "--- End Architecture Context ---",
    ].join("\n\n");

    payload.prompt = `${payload.prompt}\n\n${contextBlock}`;
  }

  process.stdout.write(JSON.stringify(payload, null, 2));
}

main();
