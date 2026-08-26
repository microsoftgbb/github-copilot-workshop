# Module 7: Debugging & Defect RCA

> **Duration:** 60 minutes (20 min demo + 40 min hands-on)
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Use Copilot to interpret stack traces, compiler errors, and runtime logs to locate the root cause of a defect
- Distinguish between compile-time errors, runtime exceptions, and silent logic defects, and adapt your prompting approach for each
- Use `@terminal`, `#terminalLastCommand`, and pasted log excerpts to ground Copilot's analysis in real evidence
- Perform a structured root cause analysis (RCA) with Copilot instead of jumping straight to a patch
- Use Agent mode to reproduce, diagnose, and fix a defect with tests that prove the fix

---

## 1. Three Kinds of Defects, Three Prompting Strategies (5 min demo)

| Defect Type | Signal | Prompting Strategy |
|-------------|--------|---------------------|
| **Compiler/build error** | Red squiggles, failed `mvn compile` / `tsc` | Paste the exact error; ask Copilot to explain *why* the type/syntax is invalid, not just to silence it |
| **Runtime exception** | Stack trace, crash, non-zero exit code | Paste the full stack trace; ask Copilot to trace the call chain back to the offending state, not just the throwing line |
| **Silent logic defect** | Wrong output, no error at all | Give Copilot the expected vs. actual behavior and relevant logs/metrics; ask it to reason about what state produced the wrong number |

> **Enterprise tip:** The most common mistake is asking Copilot to "fix this" with only the error message and no surrounding context. More context (the log lines before the failure, the input that triggered it, related code) produces a correct root cause instead of a surface-level patch.

---

## 2. Using Logs, Stack Traces & Terminal Output (10 min demo)

### The `@terminal` Participant and `#terminalLastCommand`

After running a failing command, ask Copilot Chat directly about the output it just saw:

```
@terminal #terminalLastCommand

Explain why this command failed and what change would fix it.
```

### Root Cause Analysis Prompt Pattern

A strong RCA prompt separates **symptom**, **evidence**, and **question**:

```
Symptom: The nightly reconciliation job crashes with a NullPointerException.

Evidence:
#file:samples/logs/reconciler-stacktrace.log
#file:samples/java/InventoryReconciler.java

Question: Walk through the call chain in the stack trace and identify the
exact state that causes the NullPointerException. Do not propose a fix yet -
first explain the root cause and every code path that could reach it.
```

Separating "explain the root cause" from "fix it" keeps Copilot from jumping to a shallow patch (like wrapping a line in a null check) before understanding whether the *real* problem is upstream (e.g., a SKU that should have been registered but wasn't).

### Debugging Silent Logic Defects with Metrics/Logs

When there's no crash, ground Copilot in the numbers:

```
This function computes an average variance that should be ~2.4 based on our
QA sample data, but production is reporting 1.1. Here is the function and
the input log showing which SKUs were skipped:

#file:samples/java/InventoryReconciler.java
#file:samples/logs/reconciler-stacktrace.log

Identify what could cause the reported average to be understated.
```

### Fixing Compiler/Build Errors

```
@terminal #terminalLastCommand

This Maven build is failing. Explain the compilation error, identify the
exact type mismatch, and propose the minimal fix that preserves the
method's existing contract.
```

---

## 3. RCA in Agent Mode: Reproduce, Diagnose, Fix, Prove (5 min demo)

For defects that need reproduction, Agent mode can close the loop:

```
There is a defect in pricingEngine.js: checkout totals sometimes come out
as NaN, and invalid promo codes are silently accepted instead of being
rejected. See samples/logs/pricing-engine-runtime-output.log for the
reported behavior.

1. Write a failing test that reproduces each issue
2. Run the tests and confirm they fail for the reasons described
3. Fix the root cause of each defect (not just the symptom)
4. Re-run the tests to confirm they now pass
5. Summarize the root cause of each defect in one sentence
```

Watch how Agent mode writes a reproduction first, verifies the failure matches the reported symptom, then fixes and re-verifies. This "prove it's broken, then prove it's fixed" loop is the same discipline as TDD applied to bug fixing.

---

## 4. Hands-on Exercise (40 min)

### Exercise 7A: Stack Trace RCA - Java (15 min)

Open [`samples/java/InventoryReconciler.java`](samples/java/InventoryReconciler.java) and [`samples/logs/reconciler-stacktrace.log`](samples/logs/reconciler-stacktrace.log).

**Step 1:** In Copilot Chat, ask for a root cause explanation only (no fix yet):

```
#file:samples/java/InventoryReconciler.java
#file:samples/logs/reconciler-stacktrace.log

Explain the root cause of this NullPointerException. Trace exactly which
input condition triggers it and what upstream data quality issue allowed
that condition to occur.
```

**Step 2:** Confirm you understand *why* it happens (an uncounted SKU reaching `findVariances` without being registered), not just *where*.

**Step 3:** Ask Copilot to fix it, specifying what "correct" behavior should be (e.g., skip and log unregistered SKUs rather than crash, or fail fast with a clear message - your choice, but state it explicitly):

```
Fix the root cause so an unregistered SKU is logged as a warning and
excluded from the variance report instead of crashing the batch job.
Add a JUnit 5 test that proves this with an unregistered SKU in the input.
```

**Step 4:** There is a second, silent defect in `averageVariance`. Ask Copilot to find it without giving it the answer:

```
#file:samples/java/InventoryReconciler.java

QA expects averageVariance to average only the SKUs that were actually
compared. Does this implementation do that? Explain your reasoning before
proposing a fix.
```

### Exercise 7B: Runtime Log RCA - JavaScript (15 min)

Open [`samples/javascript/pricingEngine.js`](samples/javascript/pricingEngine.js) and [`samples/logs/pricing-engine-runtime-output.log`](samples/logs/pricing-engine-runtime-output.log).

**Step 1:** Ask Copilot to diagnose both issues mentioned in the on-call notes:

```
#file:samples/javascript/pricingEngine.js
#file:samples/logs/pricing-engine-runtime-output.log

Two issues are reported: totals come out as NaN, and an invalid promo code
(SAVE99) was silently accepted instead of throwing PromoCodeError. Identify
the root cause of each, citing the exact lines responsible.
```

**Step 2:** Switch to **Agent** mode and ask Copilot to write failing Jest tests first, then fix both defects and re-run the tests (see the Section 3 prompt pattern above).

**Step 3:** Review the fix: does it address the root cause (uninitialized accumulator, `=== null` vs. `=== undefined`/nullish check) rather than papering over the symptom (e.g., defaulting `NaN` to `0` after the fact)?

### Exercise 7C: Build Your Own RCA Prompt (10 min)

1. Pick any function from an earlier module's samples (or your own code).
2. Introduce a deliberate defect (compile error, runtime exception, or wrong output).
3. Write an RCA prompt following the Symptom / Evidence / Question pattern from Section 2.
4. Ask Copilot to explain the root cause before fixing, and compare the quality of its answer to what you'd get from just pasting the error with no structure.

---

## Key Takeaways

1. **Match your prompting to the defect type:** compiler errors, stack traces, and silent logic bugs need different evidence
2. **Separate root cause from fix:** ask "why" before asking "fix it" to avoid shallow patches
3. **`@terminal` and `#terminalLastCommand` ground Copilot in what actually happened**, not just the code as written
4. **Logs and metrics matter as much as code** for defects that don't crash
5. **Agent mode can reproduce, fix, and prove a fix** in one guided pass: failing test first, then the fix, then a passing re-run

---

**Next:** [Module 8 - Unit Test Framework & Generation →](../module-08-unit-test-generation/)
