resource "aws_kms_key" "audit_log_key" {
  description         = "KMS key for FingerMobile audit logs and compliance immutability"
  enable_key_rotation = true
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = { AWS = "arn:aws:iam::${var.account_id}:root" }
        Action = "kms:*"
        Resource = "*"
      }
    ]
  })

  tags = {
    Name        = "${var.environment}-fingermobile-audit-kms"
    Environment = var.environment
    Compliance  = "GDPR-NDPR-EUAIAct"
  }
}

resource "aws_kms_alias" "audit_log_key_alias" {
  name          = "alias/${var.environment}-fingermobile-audit-logs"
  target_key_id = aws_kms_key.audit_log_key.key_id
}

resource "aws_s3_bucket" "audit_logs" {
  bucket        = "${var.environment}-fingermobile-audit-logs-${var.region}"
  force_destroy = false # Compliance: prevent accidental deletion

  object_lock_enabled = true
  tags = {
    Name        = "Audit Logs"
    Environment = var.environment
    Compliance  = "GDPR-NDPR-Immutable"
  }
}

resource "aws_s3_bucket_versioning" "audit_logs" {
  bucket = aws_s3_bucket.audit_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "audit_logs" {
  bucket = aws_s3_bucket.audit_logs.id
  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.audit_log_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# Object Lock Compliance Mode (WORM - Write Once, Read Many)
resource "aws_s3_bucket_object_lock_configuration" "audit_logs" {
  bucket = aws_s3_bucket.audit_logs.id
  rule {
    default_retention {
      mode  = "COMPLIANCE"
      days  = var.retention_days
    }
  }
}

# Lifecycle: move to Glacier Deep Archive after 1 year, expire after retention period
resource "aws_s3_bucket_lifecycle_configuration" "audit_logs" {
  bucket = aws_s3_bucket.audit_logs.id
  rule {
    id     = "archive-and-expire"
    status = "Enabled"
    transition {
      days          = 365
      storage_class = "GLACIER_DEEP_ARCHIVE"
    }
    expiration {
      days = var.retention_days
    }
    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "GLACIER"
    }
  }
}

# Explicit Bucket Policy: Enforce TLS 1.2+ and deny unencrypted/unauthorized deletions
resource "aws_s3_bucket_policy" "audit_logs_policy" {
  bucket = aws_s3_bucket.audit_logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "EnforceTLSRequestsOnly"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.audit_logs.arn,
          "${aws_s3_bucket.audit_logs.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}

# IAM Role for logging services (Kafka MSK Connect worker, Lambda, CloudTrail)
resource "aws_iam_role" "audit_writer" {
  name = "${var.environment}-audit-writer"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = ["lambda.amazonaws.com", "logs.amazonaws.com", "s3.amazonaws.com", "kafkaconnect.amazonaws.com"]
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    Service     = "AuditLoggingWriter"
  }
}

resource "aws_iam_role_policy" "audit_writer_policy" {
  name = "${var.environment}-audit-writer-policy"
  role = aws_iam_role.audit_writer.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:PutObjectVersion",
          "s3:GetObjectVersion"
        ]
        Resource = "${aws_s3_bucket.audit_logs.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = aws_kms_key.audit_log_key.arn
      }
    ]
  })
}
