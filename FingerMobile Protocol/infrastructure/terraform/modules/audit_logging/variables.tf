variable "environment" {
  type        = string
  description = "Deployment environment (dev, staging, prod)"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
}

variable "region" {
  type        = string
  default     = "af-south-1"
  description = "Target AWS Region (e.g., af-south-1 for Cape Town or us-east-1 for Global Edge / Lagos Local Zone attachment)"
}

variable "account_id" {
  type        = string
  description = "AWS Account ID for KMS policies and resource ownership"
}

variable "retention_days" {
  type        = number
  default     = 2555 # 7 years for financial ledgers, audit trails, and NDPR/GDPR compliance
  description = "WORM Object Lock retention period in days (default 2555 days / 7 years)"
}
