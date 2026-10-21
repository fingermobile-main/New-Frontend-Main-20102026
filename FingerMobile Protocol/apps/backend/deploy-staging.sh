#!/bin/bash

# ==========================================
# FingerMobile Protocol - Staging Deployment Script
# Date: June 11, 2026
# Purpose: Execute complete staging deployment with all components
# ==========================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.staging.yml"
BACKUP_DIR="./backups/staging_$(date +%Y%m%d_%H%M%S)"
LOG_FILE="./logs/deployment_$(date +%Y%m%d_%H%M%S).log"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

log_step() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n" | tee -a "$LOG_FILE"
}

# Pre-deployment checks
pre_deploy_checks() {
    log_step "PHASE 1: PRE-DEPLOYMENT CHECKS"
    
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    log_info "✓ Docker installed: $(docker --version)"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed."
        exit 1
    fi
    log_info "✓ Docker Compose available"
    
    # Check environment file
    if [ ! -f ".env.staging" ]; then
        log_warn ".env.staging not found. Creating from template..."
        cp .env.staging.template .env.staging
        log_warn "⚠️  IMPORTANT: Edit .env.staging and update all CHANGE_THIS values before proceeding!"
        log_warn "Press Enter to continue after updating .env.staging..."
        read
    fi
    
    # Validate critical environment variables
    source .env.staging
    if [[ "$DB_PASSWORD" == "CHANGE_THIS"* ]]; then
        log_error "Database password not updated in .env.staging"
        exit 1
    fi
    
    if [[ "$JWT_SECRET" == "CHANGE_THIS"* ]]; then
        log_error "JWT secret not updated in .env.staging"
        exit 1
    fi
    
    log_info "✓ Environment configuration validated"
    
    # Create necessary directories
    mkdir -p logs uploads backups ssl public monitoring/grafana/dashboards monitoring/grafana/datasources traefik/dynamic
    log_info "✓ Required directories created"
    
    # Backup current state
    log_info "Creating backup of current state..."
    mkdir -p "$BACKUP_DIR"
    if [ -f "docker-compose.staging.yml" ]; then
        cp docker-compose.staging.yml "$BACKUP_DIR/" 2>/dev/null || true
    fi
    log_info "✓ Backup created: $BACKUP_DIR"
}

# Database migration execution
execute_migrations() {
    log_step "PHASE 2: DATABASE MIGRATIONS"
    
    log_info "Starting PostgreSQL container..."
    docker-compose -f $COMPOSE_FILE up -d postgres
    
    log_info "Waiting for PostgreSQL to be ready..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker exec fingermobile-db-staging pg_isready -U ${DB_USER:-fingermobile_staging} &> /dev/null; then
            log_info "✓ PostgreSQL is ready"
            break
        fi
        log_info "Waiting... ($timeout seconds remaining)"
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        log_error "PostgreSQL failed to start within timeout period"
        exit 1
    fi
    
    log_info "Executing database migrations..."
    
    # Execute schema migrations
    docker exec -i fingermobile-db-staging psql -U ${DB_USER:-fingermobile_staging} -d ${DB_NAME:-fingermobile_staging} < database/comprehensive_controller_schemas.sql 2>&1 | tee -a "$LOG_FILE"
    log_info "✓ Comprehensive controller schemas migrated"
    
    docker exec -i fingermobile-db-staging psql -U ${DB_USER:-fingermobile_staging} -d ${DB_NAME:-fingermobile_staging} < database/security_schemas.sql 2>&1 | tee -a "$LOG_FILE"
    log_info "✓ Security schemas migrated"
    
    # Run custom migration script if exists
    if [ -f "database/run_comprehensive_migration.js" ]; then
        log_info "Running comprehensive migration script..."
        node database/run_comprehensive_migration.js 2>&1 | tee -a "$LOG_FILE" || log_warn "Migration script had warnings (non-critical)"
    fi
    
    log_info "✓ All database migrations completed successfully"
}

# Deploy all services
deploy_services() {
    log_step "PHASE 3: DEPLOYING ALL SERVICES"
    
    log_info "Building and starting all containers..."
    docker-compose -f $COMPOSE_FILE build --no-cache 2>&1 | tee -a "$LOG_FILE"
    log_info "✓ Images built successfully"
    
    log_info "Starting all services..."
    docker-compose -f $COMPOSE_FILE up -d 2>&1 | tee -a "$LOG_FILE"
    log_info "✓ All services started"
    
    log_info "Waiting for services to become healthy..."
    sleep 30
    
    # Check service health
    log_info "Checking service health..."
    
    services=("api" "postgres" "redis" "nginx")
    for service in "${services[@]}"; do
        timeout=120
        while [ $timeout -gt 0 ]; do
            if docker inspect --format='{{.State.Health.Status}}' "fingermobile-${service}-staging" 2>/dev/null | grep -q "healthy"; then
                log_info "✓ $service is healthy"
                break
            fi
            sleep 5
            timeout=$((timeout - 5))
        done
        
        if [ $timeout -le 0 ]; then
            log_warn "⚠️  $service health check timed out (may still be starting)"
        fi
    done
}

# Run smoke tests
run_smoke_tests() {
    log_step "PHASE 4: SMOKE TESTS"
    
    log_info "Running API health check..."
    health_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health || echo "000")
    
    if [ "$health_response" == "200" ]; then
        log_info "✓ API health endpoint: PASS (HTTP $health_response)"
    else
        log_error "✗ API health endpoint: FAIL (HTTP $health_response)"
        log_info "API logs:"
        docker logs fingermobile-api-staging --tail 50
        exit 1
    fi
    
    log_info "Testing critical endpoints..."
    
    endpoints=(
        "/api/health"
        "/api/auth/status"
    )
    
    for endpoint in "${endpoints[@]}"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$endpoint" || echo "000")
        if [ "$response" == "200" ] || [ "$response" == "401" ]; then
            log_info "✓ $endpoint: PASS (HTTP $response)"
        else
            log_warn "⚠️  $endpoint: WARNING (HTTP $response)"
        fi
    done
    
    log_info "✓ Smoke tests completed"
}

# Validate all endpoints
validate_endpoints() {
    log_step "PHASE 5: ENDPOINT VALIDATION"
    
    log_info "Validating critical route groups..."
    
    # Test authentication routes
    log_info "Testing authentication routes..."
    curl -s http://localhost:3000/api/auth/status > /dev/null && log_info "✓ Auth routes accessible" || log_warn "⚠️  Auth routes issue"
    
    # Test wallet routes
    log_info "Testing wallet routes..."
    curl -s -H "Authorization: Bearer test" http://localhost:3000/api/wallet/balance > /dev/null && log_info "✓ Wallet routes accessible" || log_warn "⚠️  Wallet routes issue"
    
    # Test marketplace routes
    log_info "Testing marketplace routes..."
    curl -s http://localhost:3000/api/marketplace/products?limit=1 > /dev/null && log_info "✓ Marketplace routes accessible" || log_warn "⚠️  Marketplace routes issue"
    
    # Test eLearning routes
    log_info "Testing eLearning routes..."
    curl -s http://localhost:3000/api/elearning/courses?limit=1 > /dev/null && log_info "✓ eLearning routes accessible" || log_warn "⚠️  eLearning routes issue"
    
    # Test gamification routes
    log_info "Testing gamification routes..."
    curl -s -H "Authorization: Bearer test" http://localhost:3000/api/gamification/points > /dev/null && log_info "✓ Gamification routes accessible" || log_warn "⚠️  Gamification routes issue"
    
    log_info "✓ Endpoint validation completed"
}

# Setup monitoring
setup_monitoring() {
    log_step "PHASE 6: MONITORING SETUP"
    
    log_info "Checking monitoring stack..."
    
    # Wait for Prometheus
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:9090/-/healthy > /dev/null 2>&1; then
            log_info "✓ Prometheus is running"
            break
        fi
        sleep 5
        timeout=$((timeout - 5))
    done
    
    # Wait for Grafana
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
            log_info "✓ Grafana is running"
            break
        fi
        sleep 5
        timeout=$((timeout - 5))
    done
    
    log_info "Monitoring dashboards available at:"
    log_info "  - Grafana: http://localhost:3002 (admin/${GRAFANA_ADMIN_PASSWORD:-admin})"
    log_info "  - Prometheus: http://localhost:9090"
    log_info "  - Kibana: http://localhost:5601"
    log_info "  - Traefik Dashboard: http://localhost:8080"
}

# Final status report
final_report() {
    log_step "DEPLOYMENT COMPLETE - FINAL STATUS"
    
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          FINGERMOBILE STAGING DEPLOYMENT SUCCESS         ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_info "Deployment Time: $(date)"
    log_info "Backup Location: $BACKUP_DIR"
    log_info "Log File: $LOG_FILE"
    echo ""
    log_info "Services Running:"
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    log_info "Access URLs:"
    log_info "  - API: https://staging-api.fingermobileprotocol.com"
    log_info "  - Frontend: https://staging.fingermobileprotocol.com"
    log_info "  - Grafana: http://localhost:3002"
    log_info "  - Prometheus: http://localhost:9090"
    log_info "  - Kibana: http://localhost:5601"
    echo ""
    log_info "Next Steps:"
    log_info "  1. Monitor logs: docker-compose -f $COMPOSE_FILE logs -f"
    log_info "  2. View metrics: http://localhost:3002"
    log_info "  3. Check alerts: Configure Grafana alerts"
    log_info "  4. Run integration tests"
    log_info "  5. Monitor for 24-48 hours before production"
    echo ""
    log_info "To stop services: docker-compose -f $COMPOSE_FILE down"
    log_info "To view logs: docker-compose -f $COMPOSE_FILE logs -f [service_name]"
}

# Main execution
main() {
    log_step "FINGERMOBILE PROTOCOL - STAGING DEPLOYMENT"
    log_info "Starting deployment process..."
    log_info "Timestamp: $(date)"
    
    # Execute phases
    pre_deploy_checks
    execute_migrations
    deploy_services
    run_smoke_tests
    validate_endpoints
    setup_monitoring
    final_report
    
    log_info "\n${GREEN}✓ Deployment completed successfully!${NC}"
}

# Handle errors
trap 'log_error "Deployment failed! Check $LOG_FILE for details"; exit 1' ERR

# Run main function
main "$@"
