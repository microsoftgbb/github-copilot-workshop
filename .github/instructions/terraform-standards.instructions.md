---
applyTo: "**/*.tf"
---

# Terraform Standards

## Naming
- Resource group names: `rg-<project>-<purpose>` (e.g., `rg-copilot-workshop-training`)
- All other resources: `<project>-<component>` (e.g., `workshop-plan`, `workshop-orders-api`)
- Never hardcode a resource group or location string outside of the resource
  group resource itself; reference `azurerm_resource_group.<name>.name` and
  `.location`

## Variables
- Every environment-specific value (region, environment tag, owner tag) is a
  variable with a sensible default, never a literal repeated across
  resources
- Variable descriptions are required

## Tagging
- Every resource must be tagged with at minimum `environment` and `owner`
- Tag values come from variables, never hardcoded per-resource

## Provider and Version Pinning
- Pin the `azurerm` provider to a minor version range (`~> 3.90`), not an
  unbounded range
- Pin `required_version` for Terraform itself

## Change Safety
- Never suggest `-auto-approve` outside of an already-gated pipeline `apply`
  job
- Flag any suggested change that would force a resource replacement
  (destroy + recreate) and explain why before presenting it
