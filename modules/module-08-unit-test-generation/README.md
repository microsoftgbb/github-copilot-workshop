# Module 8: Unit Test Framework & Generation

> **Duration:** 75 minutes (25 min demo + 50 min hands-on)
> **Format:** Demo + Hands-on

---

## Learning Objectives

By the end of this module, you will be able to:

- Use Copilot to generate unit tests that developers typically avoid writing, without sacrificing coverage quality
- Run a Test-Driven Development (TDD) Red-Green-Refactor loop with Copilot writing tests first
- Turn Gherkin/BDD feature files into step definitions and passing implementations with Copilot
- Apply Spec-Driven Development (SDD): generate a plan, implementation, and tests from a written spec, in that order
- Use Copilot to generate documentation (Javadoc/JSDoc, READMEs, API docs) alongside code and tests

---

## 1. Why This Is the Module Developers Skip (5 min demo)

Tests and documentation are consistently the first things cut under deadline pressure, not because they aren't valuable, but because writing them is repetitive and doesn't feel like forward progress. Copilot changes that math: generating a first draft of tests or docs takes seconds, which means the remaining human effort is reviewing and improving them, not authoring them from a blank file.

| Task | Why developers avoid it | What Copilot removes |
|------|--------------------------|------------------------|
| Writing unit tests | Repetitive setup, mocking boilerplate | First-draft tests for every method/branch |
| Writing BDD step definitions | Translating plain English to test code | Mechanical Gherkin -> step definition mapping |
| Writing a spec before coding | Feels like "extra" work before the "real" work | Turns a spec into a plan and tests automatically |
| Writing docs | Falls out of date, feels like busywork | Docs generated from the code that already exists |

> This module builds on the `/tests` slash command from Module 2 - here we go deeper into three structured methodologies (TDD, BDD, SDD) rather than one-off test generation.

---

## 2. Test-Driven Development (TDD) with Copilot (7 min demo)

### The Loop

```
Red    -> Ask Copilot to write a failing test for ONE requirement
Green  -> Ask Copilot to write the minimum code to pass that test
Refactor -> Ask Copilot to improve the implementation while keeping tests green
```

### Example: Driving Implementation from a Requirement

```
Requirement: calculatePoints(purchaseAmount) returns 1 point per whole
dollar spent.

Write a single failing Jest test for this requirement only. Do not write
the implementation yet.
```

Then, after confirming the test fails for the right reason (no implementation exists):

```
Write the minimum loyaltyCalculator.js implementation needed to make this
one test pass. Do not implement any other requirement yet.
```

Repeat per requirement, then refactor:

```
All tests are green. Refactor calculatePoints for clarity and to remove
any duplication, without changing its observable behavior. Re-run tests
after each change.
```

> **Enterprise tip:** The discipline is in the prompt, not the tool - explicitly asking for "one requirement" or "minimum code" keeps Copilot from front-running the whole implementation and skipping the Red step.

---

## 3. Behavior-Driven Development (BDD) with Copilot (7 min demo)

BDD expresses behavior in plain language (Given/When/Then) that's readable by non-engineers, then maps it to executable step definitions.

### From Feature File to Step Definitions

```
#file:discount-eligibility.feature

Generate Jest step definitions (using jest-cucumber) for this feature file.
Each step should call into a discountEligibility.js module that does not
exist yet - stub it with clear TODOs for the implementation.
```

### From Step Definitions to Implementation

```
Now implement discountEligibility.js so every scenario in
discount-eligibility.feature passes, including the boundary condition
scenarios (inclusive thresholds).
```

### Why BDD Prompts Need the Feature File as Context

Always reference the actual `.feature` file with `#file` rather than re-describing scenarios from memory. Gherkin's Given/When/Then structure is precise about boundaries (`10 items` vs. `9 items`), and re-typing it from memory is where subtle mismatches between spec and test creep in.

---

## 4. Spec-Driven Development (SDD) with Copilot (4 min demo)

SDD treats a written specification as the source of truth: **spec -> plan -> implementation + tests**, in that order, so implementation decisions trace back to a requirement instead of an assumption.

> See [speckit.org](https://speckit.org/) for a structured, tool-assisted approach to SDD if your team wants to formalize this workflow further.

### Step 1: Spec -> Plan

```
#file:spec.md

Create an implementation plan for this spec. For each functional
requirement (FR1-FR5), list:
- The function/method that satisfies it
- Its inputs, outputs, and error behavior
- Which non-functional requirement(s), if any, constrain its design

Do not write code yet.
```

### Step 2: Plan -> Implementation + Tests

```
Implement the plan above as passwordResetTokenService.js, and generate
Jest tests that map directly to the acceptance criteria in spec.md.
Each acceptance criterion should be traceable to at least one test name.
```

### Why Order Matters

Generating the plan first (and reviewing it) catches design gaps - like FR5's "invalidate the previous token" requirement - before they're baked into code. Jumping straight from spec to code tends to silently drop requirements that don't map to an obvious method name.

---

## 5. Documentation Generation (2 min demo)

Once code and tests exist, generate documentation from them rather than writing it by hand:

```
/doc Generate Javadoc for every public method in this class, including
@param, @return, and @throws tags. Follow the project's Java standards.
```

```
Generate a README.md for this module covering: purpose, public API with
signatures, example usage, and error conditions. Base it only on the
actual implementation, not assumptions about what it should do.
```

> **Enterprise tip:** Ask Copilot to generate docs *from* the final code, not from the original spec - this catches drift between what was planned and what was actually built.

---

## 6. Hands-on Exercise (50 min)

### Exercise 8A: TDD Loop (15 min)

1. Open [`exercises/tdd/REQUIREMENTS.md`](exercises/tdd/REQUIREMENTS.md).
2. For requirement 1, ask Copilot to write a single failing test in a new `exercises/tdd/loyaltyCalculator.test.js`.
3. Run the test and confirm it fails because `loyaltyCalculator.js` doesn't exist yet.
4. Ask Copilot for the minimum implementation to pass just that test.
5. Repeat Red -> Green for requirements 2-5, one at a time.
6. Once all tests are green, ask Copilot to refactor the implementation and confirm tests stay green.

### Exercise 8B: BDD Feature to Implementation (15 min)

1. Open [`exercises/bdd/discount-eligibility.feature`](exercises/bdd/discount-eligibility.feature).
2. Ask Copilot to generate step definitions referencing the feature file directly (`#file:discount-eligibility.feature`).
3. Ask Copilot to implement `discountEligibility.js` so all scenarios pass, paying particular attention to the boundary `Scenario Outline`.
4. Run the tests and verify every scenario, including boundaries, passes.

### Exercise 8C: Spec-Driven Development (15 min)

1. Open [`exercises/sdd/spec.md`](exercises/sdd/spec.md).
2. Ask Copilot to generate an implementation plan from the spec (Section 4, Step 1). Review it: does it account for FR5 (invalidating the previous token)?
3. Ask Copilot to implement `passwordResetTokenService.js` and its tests from the plan.
4. Verify each acceptance criterion in the spec has a corresponding test.

### Exercise 8D: Documentation Generation (5 min)

1. Pick one file you generated in 8A, 8B, or 8C.
2. Ask Copilot to generate JSDoc/Javadoc for it, then a short README describing its public API.
3. Compare the generated docs against the actual code: do they describe real behavior, or aspirational behavior?

---

## Key Takeaways

1. **TDD works best when your prompts enforce the discipline:** ask for one failing test, then the minimum code, not the whole feature at once
2. **BDD feature files should be referenced directly (`#file`), not re-typed from memory**, so scenarios and boundaries stay exact
3. **SDD's value is in the plan step:** reviewing a plan before code catches dropped requirements that reviewing code alone would miss
4. **Order matters for all three methodologies:** test-then-code, feature-then-steps, spec-then-plan-then-code
5. **Generate documentation from finished code**, not from the original intent, to catch drift between plan and implementation

---

**Next:** [Module 9 - Wrap-up, Q&A & Next Steps →](../module-09-wrapup/)
