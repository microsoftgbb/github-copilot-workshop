/**
 * Post-Response Hook: Collect Metrics
 *
 * Gathers usage metrics from each Copilot interaction and sends them
 * to a telemetry pipeline (stubbed as a shell script or log file).
 *
 * Metrics tracked:
 * - Response latency
 * - Code vs. explanation ratio
 * - Language distribution
 * - Acceptance signals
 *
 * Input (stdin):  JSON with { response, latencyMs, model, ... }
 * Output (stdout): Passthrough (unmodified response)
 */

import { execSync } from "node:child_process";
import { appendFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const METRICS_DIR = path.resolve(process.cwd(), "logs");
const METRICS_FILE = path.join(METRICS_DIR, "copilot-metrics.jsonl");

/**
 * Detect the programming language of generated code blocks.
 *
 * @param {string} response
 * @returns {string[]}
 */
function detectLanguages(response) {
  const langRegex = /```(\w+)\n/g;
  const languages = new Set();
  let match;

  while ((match = langRegex.exec(response)) !== null) {
    languages.add(match[1].toLowerCase());
  }

  return [...languages];
}

/**
 * Count lines of code vs. lines of explanation in the response.
 *
 * @param {string} response
 * @returns {{ codeLines: number, textLines: number, ratio: number }}
 */
function calculateCodeRatio(response) {
  const lines = response.split("\n");
  let inCodeBlock = false;
  let codeLines = 0;
  let textLines = 0;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) {
      codeLines++;
    } else if (line.trim().length > 0) {
      textLines++;
    }
  }

  const total = codeLines + textLines;
  return {
    codeLines,
    textLines,
    ratio: total > 0 ? Math.round((codeLines / total) * 100) : 0,
  };
}

/**
 * Send metrics to the external telemetry script (stubbed).
 *
 * @param {object} metrics
 */
function sendToTelemetryPipeline(metrics) {
  const scriptPath = path.resolve(__dirname, "../../scripts/send-telemetry.sh");
  if (!existsSync(scriptPath)) {
    return;
  }

  try {
    const metricsJson = JSON.stringify(metrics);
    execSync(
      `echo ${JSON.stringify(metricsJson)} | bash "${scriptPath}"`,
      { encoding: "utf-8", timeout: 3000 }
    );
  } catch {
    console.error("⚠️  Telemetry send failed (non-blocking)");
  }
}

async function main() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  const payload = JSON.parse(input);
  const response = payload.response ?? "";

  const languages = detectLanguages(response);
  const codeRatio = calculateCodeRatio(response);

  const metrics = {
    timestamp: new Date().toISOString(),
    model: payload.model ?? "unknown",
    latencyMs: payload.latencyMs ?? null,
    responseLength: response.length,
    languages,
    codeLines: codeRatio.codeLines,
    textLines: codeRatio.textLines,
    codeRatioPercent: codeRatio.ratio,
    containsCode: codeRatio.codeLines > 0,
    activeFile: payload.activeFile ?? null,
  };

  // Write metrics to local JSONL file
  mkdirSync(METRICS_DIR, { recursive: true });
  appendFileSync(METRICS_FILE, JSON.stringify(metrics) + "\n", "utf-8");

  // Send to telemetry pipeline (async, non-blocking)
  sendToTelemetryPipeline(metrics);

  console.error(
    `📊 Metrics collected: ${metrics.codeLines} code lines, ` +
    `${metrics.textLines} text lines (${metrics.codeRatioPercent}% code), ` +
    `languages: [${languages.join(", ") || "none"}]`
  );

  // Pass through the response unmodified
  process.stdout.write(JSON.stringify(payload, null, 2));
}

main();
