# DEP-2: Infrastructure-as-Code & Pipeline-as-Code

> **Duration:** 60 minutes (20 min demo + 35 min hands-on + 5 min wrap-up)
> **Format:** Demo + Hands-on
> **Audience:** DevOps engineers
> **Prerequisites:** VS Code, GitHub Copilot license, GitHub.com account, Terraform CLI installed locally, Azure CLI (`az login`) if running the live-plan exercise against a real subscription

---

> **Assumption to confirm before delivery:** this module targets **Terraform**
> on **Azure** (`azurerm` provider) with **GitHub Actions** as the pipeline
> tool. If the target cloud or CI platform differs, the concrete examples in
> Sections 1-3 need to be swapped accordingly — the concepts and prompt
> patterns still apply.

---

## Learning Objectives

By the end of this module, you will be able to:

- Use Copilot to scaffold a new Terraform module from a plain-language description of the target architecture
- Ground Terraform generation in an existing `.tf` file's conventions instead of letting Copilot invent its own style
- Use Copilot Chat to explain a `terraform plan` diff in plain language and flag risky changes (deletions, forced replacements) before anyone runs `apply`
- Use Copilot to scaffold a GitHub Actions workflow implementing a build -> test -> plan -> approval -> apply pipeline
- Apply guardrails (required reviewers, environments, OIDC federation instead of long-lived secrets) to a Copilot-generated pipeline, and recognize when a suggestion violates them
- Debug a failing pipeline run using Copilot against real log output, the same pattern used for application code in Module 7

---

## 1. Infrastructure-as-Code with Copilot (10 min demo)

### A Different Risk Profile

Everything so far in this workshop has been about application code: a bad
suggestion fails a test or a build. Infrastructure-as-Code is different — a
bad suggestion can delete or replace *live infrastructure*. The workflow
changes accordingly: Copilot drafts, a human reviews the plan, a human runs
apply.

| Task | Where Copilot helps | Where a human must stay in the loop |
|------|----------------------|--------------------------------------|
| Drafting new `.tf` resources | Fast first draft from a plain-language description | Confirm naming, tagging, and sizing match team standards |
| Modifying existing `.tf` files | Explaining what a resource block does before you touch it | Checking whether the change forces a replace instead of an in-place update |
| Reviewing `terraform plan` output | Summarizing a long diff in plain language | Deciding whether a flagged destroy/replace is actually safe |
| Running `terraform apply` | Not applicable | Always a human action, never delegated to an agent |

### Scaffolding Infrastructure from a Description

A good infrastructure prompt names the resources, their relationships, and
any conventions to follow, the same way a good scaffolding prompt in
Module 6 names every application layer:

```
Add the following to main.tf using the existing azurerm provider block:

1. An azurerm_service_plan named "app-plan" on the Linux/B1 SKU
2. An azurerm_linux_web_app named "orders-api" running on that plan, Node 18
3. Tag both resources with environment = "dev" and owner = "workshop"
4. Follow the naming and variable conventions already used in this file
   (see the resource_group and provider blocks above)
```

Watch how Copilot:
1. Reads the existing provider/resource-group block for naming and variable
   conventions before adding anything new
2. Wires the new resources to the existing resource group and variables
   rather than hardcoding new values
3. Applies the requested tags consistently across both resources

### Grounding Terraform in Existing Conventions

Just like `#codebase` for application code, reference the existing `.tf`
file directly so new resources don't introduce a second naming or tagging
scheme:

```
#file:main.tf How does this file name resources and apply tags? Add a new
azurerm_storage_account that follows the same pattern.
```

> **Enterprise tip:** An inconsistent tagging scheme across a Terraform
> state is a governance and cost-allocation problem, not just a style
> nit — this is one of the places where "grounded in existing conventions"
> has a real dollar cost if skipped.

### Reviewing a Plan Before Anyone Applies

Paste (or reference) a `terraform plan` output into Chat and ask for a
plain-language read specifically on destructive changes:

```
Explain this terraform plan output in plain language. Call out specifically
any resource that will be destroyed or replaced (not just updated in place),
and explain why Terraform considers it a replace rather than an update.

<paste plan output>
```

> **The one rule to say out loud in this session: Copilot can draft
> infrastructure and explain a plan. A human always runs `terraform apply`.**
> No exercise in this module auto-applies, and no production workflow should
> either without an explicit approval gate (see Section 2).

---

## 2. Pipeline-as-Code with Copilot (10 min demo)

### Scaffolding a Deployment Workflow

Describe the stages you want and let Agent mode draft the workflow file:

```
Create a GitHub Actions workflow at .github/workflows/deploy.yml that:

1. Triggers on pull_request and push to main
2. Runs `terraform fmt -check` and `terraform validate`
3. Runs `terraform plan` and posts the plan output as a comment on the PR
4. On push to main only, requires approval via a "production" environment
   before running `terraform apply`
5. Authenticates to Azure using OIDC federation (azure/login@v2 with
   client-id/tenant-id/subscription-id, not a client secret)

Use the existing azurerm provider configuration in main.tf.
```

Watch how Copilot:
1. Separates the plan job (runs on every PR) from the apply job (gated
   behind the `production` environment)
2. Uses `permissions: id-token: write` and OIDC login instead of a stored
   client secret
3. Posts the plan as a PR comment so reviewers see the infrastructure diff
   alongside the code diff

### Encoding Guardrails, Not Bolting Them On

A common failure mode: Copilot's first draft of a deploy workflow works, but
authenticates with a long-lived secret and has no approval gate, because
that's the simplest thing that runs. Ask explicitly for the guardrail and
verify it's actually there:

```
Does this workflow use OIDC or a stored secret to authenticate to Azure?
If it uses a secret, convert it to OIDC federation using azure/login@v2.
```

> **Enterprise tip:** Treat "does this violate our security/approval
> guardrails" as a standing question for any Copilot-generated pipeline,
> the same way Module 8 treats "does this test actually cover the branch"
> as a standing question for generated tests. A working pipeline and a
> compliant pipeline are not the same thing.

### Debugging a Failing Run

The same debugging pattern from Module 7 (paste the error, ask for root
cause) applies directly to CI/CD logs:

```
@terminal This GitHub Actions job failed. Here is the log:

<paste failed job log>

What's the root cause, and what's the minimal fix?
```

---

## 3. Hands-on Exercise (35 min)

One continuous exercise: scaffold the infrastructure, scaffold the pipeline
that deploys it, then debug a deliberately broken run. This mirrors how
these two things actually depend on each other in practice.

### Exercise DEP-2A: Scaffold the Infrastructure (15 min)

1. Open [`exercises/terraform/starter/main.tf`](exercises/terraform/starter/main.tf). It contains only the `azurerm` provider block and a resource group.
2. Switch to **Agent** mode.
3. Enter:

```
Add the following to main.tf:

1. An azurerm_service_plan named "workshop-plan" on the Linux/B1 SKU, in the
   existing resource group
2. An azurerm_linux_web_app named "workshop-orders-api" on that plan, Node 18
   runtime
3. Tag both resources environment = "workshop" and owner = your GitHub
   username
4. Follow the same variable and naming conventions already used in this file
```

4. Review what Copilot generates. Confirm:
   - New resources reference the existing resource group/variables rather
     than hardcoding new ones
   - Tags are applied consistently
   - Naming follows the existing convention in the starter file
5. Run `terraform init` and `terraform plan` (no `apply`) and review the
   plan output together as a group.

### Exercise DEP-2B: Scaffold the Pipeline (15 min)

1. Open [`exercises/github-actions/starter/deploy.yml`](exercises/github-actions/starter/deploy.yml). It contains only a checkout + Terraform setup step.
2. Switch to **Agent** mode.
3. Enter:

```
Extend deploy.yml to:

1. Run terraform fmt -check and terraform validate
2. Run terraform plan and post the output as a PR comment
3. Gate terraform apply behind a "production" GitHub Actions environment,
   only on push to main
4. Authenticate to Azure using OIDC federation, not a stored client secret
```

4. Confirm the generated workflow:
   - Separates the plan job (PR) from the apply job (main, gated)
   - Uses OIDC (`azure/login@v2` with `id-token: write` permission), not a
     secret
   - Actually posts the plan as a PR comment, not just to the job log

### Exercise DEP-2C: Break and Fix (5 min)

1. The instructor introduces one deliberate error into a copy of the
   workflow (for example, a Terraform variable referenced but never
   declared) and triggers a run.
2. Using the failed run's log, ask Copilot Chat for root cause and fix:

```
@terminal This GitHub Actions job failed with the log below. What's the
root cause and the minimal fix?

<paste failed job log>
```

3. Apply the fix and confirm the corrected workflow passes.

---

## Key Takeaways

1. **IaC suggestions carry real infrastructure risk:** Copilot drafts and explains, a human always runs `apply`
2. **Ground Terraform generation in existing conventions:** naming, tagging, and variable use, the same discipline as `#codebase` for application code
3. **Encode guardrails from the start, don't bolt them on after:** approval gates and OIDC federation should be part of the first prompt, and verified afterward
4. **Debugging CI/CD logs with Copilot follows the same pattern as debugging application logs:** paste the evidence, ask for root cause, verify the fix
5. **Review a `terraform plan` diff at least as carefully as a pull request:** it's the last checkpoint before a change touches live infrastructure

---

**Next:** Wrap-up, Q&A & next steps
