terraform {
  required_version = ">= 1.7.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "location" {
  description = "Azure region for all resources in this workshop"
  type        = string
  default     = "canadacentral"
}

variable "environment" {
  description = "Environment tag applied to every resource"
  type        = string
  default     = "workshop"
}

resource "azurerm_resource_group" "workshop" {
  name     = "rg-copilot-workshop-training"
  location = var.location

  tags = {
    environment = var.environment
    owner       = "workshop"
  }
}

# TODO (Exercise 9A): use Copilot Agent mode to add, following the
# naming/tagging/variable conventions established above:
#   1. An azurerm_service_plan named "workshop-plan" (Linux, B1 SKU)
#      in azurerm_resource_group.workshop
#   2. An azurerm_linux_web_app named "workshop-orders-api" on that plan,
#      Node 18 runtime
#   3. Both resources tagged environment = var.environment,
#      owner = "<your GitHub username>"
