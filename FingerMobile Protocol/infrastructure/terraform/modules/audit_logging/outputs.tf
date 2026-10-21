output "bucket_id" {
  description = "The ID of the S3 audit logging bucket"
  value       = aws_s3_bucket.audit_logs.id
}

output "bucket_arn" {
  description = "The ARN of the S3 audit logging bucket"
  value       = aws_s3_bucket.audit_logs.arn
}

output "kms_key_id" {
  description = "The ID of the KMS customer-managed key used for audit logs"
  value       = aws_kms_key.audit_log_key.key_id
}

output "kms_key_arn" {
  description = "The ARN of the KMS customer-managed key used for audit logs"
  value       = aws_kms_key.audit_log_key.arn
}

output "writer_role_arn" {
  description = "The ARN of the IAM role permitted to write to the audit logs"
  value       = aws_iam_role.audit_writer.arn
}
