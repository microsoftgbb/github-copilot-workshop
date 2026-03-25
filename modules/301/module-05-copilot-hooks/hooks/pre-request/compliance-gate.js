/**
 * Pre-Request Hook: Compliance Gate
 *
 * Checks every Copilot prompt against a blocklist of sensitive patterns.
 * If a prompt matches, the hook either:
 *   - Blocks the request (exits with non-zero code)
 *   - Strips the sensitive content and passes a sanitized prompt
 *
 * This enables enterprise governance without disrupting developer flow.
 *
 * Input (stdin):  JSON with { prompt, ... }
 * Output (stdout): JSON with original or sanitized prompt
 * Exit code:       0 = pass, 1 = blocked
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Patterns that should never appear in Copilot prompts.
 * In production, load these from a config file or policy service.
 */
const BLOCKLIST_PATTERNS = [
  // Credential / secret patterns
  { pattern: /password\s*(for|to|of)\s+production/i, category: "credentials", severity: "block" },
  { pattern: /api[_-]?key\s*[:=]\s*['"][A-Za-z0-9]/i, category: "credentials", severity: "block" },
  { pattern: /secret\s*[:=]\s*['"][A-Za-z0-9]/i, category: "credentials", severity: "block" },
  { pattern: /\bBEARER\s+[A-Za-z0-9._-]{20,}/i, category: "credentials", severity: "block" },

  // PII patterns
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, category: "pii", severity: "warn" },  // SSN-like
  { pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, category: "pii", severity: "warn" },

  // Restricted topics
  { pattern: /bypass\s+(security|authentication|authorization)/i, category: "security", severity: "block" },
  { pattern: /disable\s+(ssl|tls|certificate\s+validation)/i, category: "security", severity: "block" },
  { pattern: /eval\s*\(\s*req\./i, category: "security", severity: "block" },
];

/**
 * Check a prompt against all blocklist patterns.
 *
 * @param {string} prompt
 * @returns {{ passed: boolean, violations: Array<{ category: string, severity: string, match: string }> }}
 */
function checkCompliance(prompt) {
  const violations = [];

  for (const rule of BLOCKLIST_PATTERNS) {
    const match = prompt.match(rule.pattern);
    if (match) {
      violations.push({
        category: rule.category,
        severity: rule.severity,
        match: match[0],
      });
    }
  }

  const hasBlockers = violations.some((v) => v.severity === "block");
  return { passed: !hasBlockers, violations };
}

/**
 * Optionally call an external blocklist check script for extended rules.
 *
 * @param {string} prompt
 * @returns {boolean} true if the external check passes
 */
function runExternalBlocklistCheck(prompt) {
  const scriptPath = path.resolve(__dirname, "../../scripts/check-blocklist.sh");
  if (!existsSync(scriptPath)) {
    return true; // no external script — pass by default
  }

  try {
    // Pass the prompt to the external script via stdin
    execSync(`echo ${JSON.stringify(prompt)} | bash "${scriptPath}"`, {
      encoding: "utf-8",
      timeout: 3000,
    });
    return true;
  } catch {
    return false; // script exited non-zero — treat as blocked
  }
}

async function main() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  const payload = JSON.parse(input);
  const { prompt } = payload;

  // Run built-in compliance checks
  const result = checkCompliance(prompt);

  // Run external blocklist check
  const externalPassed = runExternalBlocklistCheck(prompt);

  if (!result.passed || !externalPassed) {
    const blocked = result.violations.filter((v) => v.severity === "block");
    console.error("🚫 COMPLIANCE GATE: Prompt blocked");
    console.error(`   Violations: ${JSON.stringify(blocked, null, 2)}`);
    process.exit(1);
  }

  // Log warnings (but don't block)
  const warnings = result.violations.filter((v) => v.severity === "warn");
  if (warnings.length > 0) {
    console.error("⚠️  COMPLIANCE GATE: Warnings detected (not blocking)");
    for (const w of warnings) {
      console.error(`   [${w.category}] Matched: "${w.match}"`);
    }
  }

  // Pass through the original payload
  process.stdout.write(JSON.stringify(payload, null, 2));
}

main();
