#!/bin/bash
# FingerMobile Platform - Database Setup Script
# This script sets up the PostgreSQL database with schema and functions

set -e

# Database configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5434}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-fingermobile_platform_db}"

echo "========================================="
echo "FingerMobile Platform Database Setup"
echo "========================================="
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "User: $DB_USER"
echo "Database: $DB_NAME"
echo "========================================="

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql command not found. Please install PostgreSQL client."
    exit 1
fi

# Step 1: Create database if it doesn't exist
echo ""
echo "Step 1: Creating database..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"
echo "✅ Database created/exists: $DB_NAME"

# Step 2: Apply consolidated schema
echo ""
echo "Step 2: Applying database schema..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/platform_consolidated_schema.sql"
echo "✅ Schema applied successfully"

# Step 3: Apply API functions and stored procedures
echo ""
echo "Step 3: Applying API functions and stored procedures..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/api_database_functions.sql"
echo "✅ API functions applied successfully"

# Step 4: Verify setup
echo ""
echo "Step 4: Verifying setup..."
TABLES=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tc "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
FUNCTIONS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tc "SELECT count(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace;")

echo "✅ Tables created: $TABLES"
echo "✅ Functions created: $FUNCTIONS"

# Step 5: Create test user (optional)
echo ""
echo "Step 5: Creating test user..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM members WHERE email = 'test@fingermobile.com') THEN
        INSERT INTO members (membername, email, password_hash, first_name, last_name, is_verified)
        VALUES ('testuser', 'test@fingermobile.com', '\$2b\$10\$dummyhashfortestingpurposesonly', 'Test', 'User', true);
        
        INSERT INTO fics_wallets (member_id, balance)
        SELECT id, 1000.00 FROM members WHERE email = 'test@fingermobile.com';
        
        RAISE NOTICE 'Test user created with 1000 FIC';
    ELSE
        RAISE NOTICE 'Test user already exists';
    END IF;
END
\$\$;
"
echo "✅ Test user ready"

echo ""
echo "========================================="
echo "✅ Database setup complete!"
echo "========================================="
echo "Database: $DB_NAME"
echo "Tables: $TABLES"
echo "Functions: $FUNCTIONS"
echo ""
echo "Next steps:"
echo "1. Install Node.js dependencies: npm install"
echo "2. Configure .env file"
echo "3. Start server: npm start"
echo "========================================="
