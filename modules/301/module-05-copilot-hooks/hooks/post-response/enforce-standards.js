/**
 * Post-Response Hook: Enforce Standards
 *
 * Validates Copilot-generated code against team coding standards.
 * Checks for common violations and emits warnings to stderr.
 *
 * Optionally calls an external lint script for deeper analysis.
 *
 * Input (stdin):  JSON with { response, ... }
 * Output (stdout): Passthrough (unmodified response)
 */

import { execSync } from "node:child_process";
import { existsSync, writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Coding standards rules — each rule checks for a pattern that violates
 * the team's coding conventions (based on .github/copilot-instructions.md).
 */
const STANDARDS_RULES = [
  {
    id: "no-var",
    pattern: /\bvar\s+\w+/g,
    message: "Use 'const' or 'let' instead of 'var'",
    severity: "error",
  },
  {
    id: "no-then-chains",
    pattern: /\.then\s*\(/g,
    message: "Use async/await instead of .then() chains",
    severity: "warning",
  },
  {
    id: "no-console-log",
    pattern: /console\.(log|warn|error)\(/g,
    message: "Use a structured logger (e.g., SLF4J, winston) instead of console.*",
    severity: "warning",
  },
  {
    id: "no-field-injection",
    pattern: /@Autowired\s+private/g,
    message: "Use constructor injection instead of @Autowired field injection",
    severity: "error",
  },
  {
    id: "no-double-money",
    pattern: /\b(double|float)\b.*\b(price|cost|amount|total|balance)\b/gi,
    message: "Use BigDecimal for monetary calculations, not double/float",
    severity: "error",
  },
  {
    id: "no-string-concat-sql",
    pattern: /["']\s*\+\s*\w+.*(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)/gi,
    message: "Use parameterized queries — never concatenate SQL strings",
    severity: "error",
  },
  {
    id: "no-stack-trace-response",
    pattern: /\.printStackTrace\(\)|e\.stack|err\.stack/g,
    message: "Never expose stack traces in API responses",
    severity: "error",
  },
];

/**
 * Extract code blocks from a Copilot response.
 *
 * @param {string} response
 * @returns {string[]}
 */
function extractCodeBlocks(response) {
  const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = codeBlockRegex.exec(response)) !== null) {
    blocks.push(match[1]);
  }

  // If no fenced blocks, treat the whole response as potential code
  if (blocks.length === 0 && /[{};()=>]/.test(response)) {
    blocks.push(response);
  }

  return blocks;
}

/**
 * Run built-in standards checks on code content.
 *
 * @param {string} code
 * @returns {Array<{ ruleId: string, message: string, severity: string, line: number }>}
 */
function checkStandards(code) {
  const violations = [];
  const lines = code.split("\n");

  for (const rule of STANDARDS_RULES) {
    for (let i = 0; i < lines.length; i++) {
      if (rule.pattern.test(lines[i])) {
        violations.push({
          ruleId: rule.id,
          message: rule.message,
          severity: rule.severity,
          line: i + 1,
        });
      }
      // Reset regex lastIndex for global patterns
      rule.pattern.lastIndex = 0;
    }
  }

  return violations;
}

/**
 * Optionally run the external lint script on the generated code.
 *
 * @param {string} code
 * @returns {string | null} Lint output or null if script doesn't exist
 */
function runExternalLint(code) {
  const scriptPath = path.resolve(__dirname, "../../scripts/lint-output.sh");
  if (!existsSync(scriptPath)) {
    return null;
  }

  // Write code to a temp file for the lint script to process
  const tmpFile = path.resolve(__dirname, "../../.tmp-lint-input.js");
  try {
    writeFileSync(tmpFile, code, "utf-8");
    const output = execSync(`bash "${scriptPath}" "${tmpFile}"`, {
      encoding: "utf-8",
      timeout: 5000,
    });
    return output.trim() || null;
  } catch (err) {
    return err.stdout?.trim() ?? null;
  } finally {
    try { unlinkSync(tmpFile); } catch { /* ignore cleanup errors */ }
  }
}

async function main() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  const payload = JSON.parse(input);
  const response = payload.response ?? "";

  const codeBlocks = extractCodeBlocks(response);

  if (codeBlocks.length === 0) {
    // No code to check — pass through
    process.stdout.write(JSON.stringify(payload, null, 2));
    return;
  }

  let totalViolations = 0;

  for (const [i, code] of codeBlocks.entries()) {
    const violations = checkStandards(code);
    totalViolations += violations.length;

    if (violations.length > 0) {
      console.error(`\n🔍 Standards check — code block ${i + 1}:`);
      for (const v of violations) {
        const icon = v.severity === "error" ? "❌" : "⚠️";
        console.error(`   ${icon} [${v.ruleId}] Line ${v.line}: ${v.message}`);
      }
    }

    // Run external lint script if available
    const lintOutput = runExternalLint(code);
    if (lintOutput) {
      console.error(`   📋 External lint: ${lintOutput}`);
    }
  }

  if (totalViolations === 0) {
    console.error("✅ Standards check passed — no violations found");
  } else {
    console.error(`\n📊 Total: ${totalViolations} violation(s) found across ${codeBlocks.length} code block(s)`);
  }

  // Pass through the response unmodified (hooks report but don't block post-response)
  process.stdout.write(JSON.stringify(payload, null, 2));
}

main();
