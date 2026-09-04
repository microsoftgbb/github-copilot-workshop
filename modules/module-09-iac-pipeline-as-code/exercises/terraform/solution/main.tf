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

variable "owner" {
  description = "Owner tag applied to every resource (set to your GitHub username during the exercise)"
  type        = string
  default     = "workshop"
}

resource "azurerm_resource_group" "workshop" {
  name     = "rg-copilot-workshop-training"
  location = var.location

  tags = {
    environment = var.environment
    owner       = var.owner
  }
}

# Reference solution for Exercise 9A. Do not distribute to attendees
# ahead of the exercise -- this is the instructor/facilitator answer key.

resource "azurerm_service_plan" "workshop" {
  name                = "workshop-plan"
  resource_group_name = azurerm_resource_group.workshop.name
  location            = azurerm_resource_group.workshop.location
  os_type             = "Linux"
  sku_name            = "B1"

  tags = {
    environment = var.environment
    owner       = var.owner
  }
}

resource "azurerm_linux_web_app" "orders_api" {
  name                = "workshop-orders-api"
  resource_group_name = azurerm_resource_group.workshop.name
  location            = azurerm_resource_group.workshop.location
  service_plan_id     = azurerm_service_plan.workshop.id

  site_config {
    application_stack {
      node_version = "18-lts"
    }
  }

  tags = {
    environment = var.environment
    owner       = var.owner
  }
}

output "orders_api_default_hostname" {
  description = "Default hostname of the deployed workshop web app"
  value       = azurerm_linux_web_app.orders_api.default_hostname
}
