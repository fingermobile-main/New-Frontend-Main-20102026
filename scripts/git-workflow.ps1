# PowerShell script for managing Git workflow for development and production environments
# This script automates Git operations for the frontend-main project

param(
    [string]$Command = "",
    [string]$RemoteUrl = "",
    [string]$DevBranch = "development",
    [string]$ProdBranch = "production",
    [string]$MainBranch = "main"
)

# Function to display help
function Show-Help {
    Write-Host "Git Workflow Management Script for Frontend-Main" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\git-workflow.ps1 -Command <command> [-RemoteUrl <url>] [-DevBranch <branch>] [-ProdBranch <branch>] [-MainBranch <branch>]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  init          Initialize the Git repository with proper configuration"
    Write-Host "  setup-dev     Setup development branch and configure"
    Write-Host "  setup-prod    Setup production branch and configure"
    Write-Host "  sync-dev      Sync development branch with latest changes"
    Write-Host "  sync-prod     Sync production branch with latest changes"
    Write-Host "  promote-dev   Promote development to production"
    Write-Host "  backup        Create a backup of the current state"
    Write-Host "  status        Show status of all branches"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\git-workflow.ps1 -Command init -RemoteUrl 'https://github.com/user/repo.git'"
    Write-Host "  .\git-workflow.ps1 -Command sync-dev"
    Write-Host "  .\git-workflow.ps1 -Command promote-dev"
}

# Function to initialize the repository
function Initialize-Repository {
    param([string]$RemoteUrl)
    
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    
    # Ensure we're in the correct directory
    Set-Location $PSScriptRoot/../
    
    # Check if Git is available
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Warning "Git is not installed or not in PATH. Please install Git first."
        Write-Host "You can download Git from: https://git-scm.com/downloads" -ForegroundColor Yellow
        return
    }
    
    # Check if this is already a Git repository
    if (!(Test-Path ".git")) {
        Write-Host "Initializing new Git repository..." -ForegroundColor Yellow
        git init
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to initialize Git repository"
            return
        }
    }
    
    # Add all files to the repository
    Write-Host "Adding files to repository..." -ForegroundColor Yellow
    git add .
    
    # Create initial commit if needed
    $initialCommit = git rev-list --count HEAD
    if ($initialCommit -eq 0) {
        git commit -m "Initial commit: Frontend-Main project setup"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create initial commit"
            return
        }
    }
    
    # Set up branches
    Setup-Branches
    
    # Configure remote if provided
    if ($RemoteUrl) {
        Configure-Remote $RemoteUrl
    }
    
    Write-Host "Repository initialized successfully!" -ForegroundColor Green
}

# Function to set up standard branches
function Setup-Branches {
    Write-Host "Setting up standard branches..." -ForegroundColor Yellow
    
    # Create development branch if it doesn't exist
    $branches = git branch --list
    if ($branches -notmatch $DevBranch) {
        Write-Host "Creating $DevBranch branch..." -ForegroundColor Yellow
        git checkout -b $DevBranch
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create $DevBranch branch"
            return
        }
        # Switch back to main
        git checkout $MainBranch
    }
    
    # Create production branch if it doesn't exist
    if ($branches -notmatch $ProdBranch) {
        Write-Host "Creating $ProdBranch branch..." -ForegroundColor Yellow
        git checkout -b $ProdBranch
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create $ProdBranch branch"
            return
        }
        # Switch back to main
        git checkout $MainBranch
    }
    
    Write-Host "Branches set up successfully!" -ForegroundColor Green
}

# Function to configure remote
function Configure-Remote {
    param([string]$RemoteUrl)
    
    Write-Host "Configuring remote origin: $RemoteUrl" -ForegroundColor Yellow
    
    # Check if remote already exists
    $existingRemote = git remote get-url origin 2>$null
    if ($existingRemote) {
        git remote set-url origin $RemoteUrl
    } else {
        git remote add origin $RemoteUrl
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to configure remote origin"
        return
    }
    
    Write-Host "Remote configured successfully!" -ForegroundColor Green
}

# Function to setup development branch
function Setup-Dev {
    Write-Host "Setting up development branch..." -ForegroundColor Green
    
    # Switch to development branch
    git checkout $DevBranch
    
    # Pull latest changes
    git pull origin $DevBranch
    
    Write-Host "Development branch set up successfully!" -ForegroundColor Green
}

# Function to setup production branch
function Setup-Prod {
    Write-Host "Setting up production branch..." -ForegroundColor Green
    
    # Switch to production branch
    git checkout $ProdBranch
    
    # Pull latest changes
    git pull origin $ProdBranch
    
    Write-Host "Production branch set up successfully!" -ForegroundColor Green
}

# Function to sync development branch
function Sync-Dev {
    Write-Host "Syncing development branch..." -ForegroundColor Green
    
    # Switch to development branch
    git checkout $DevBranch
    
    # Pull latest changes
    git pull origin $DevBranch
    
    # Merge from main if needed
    git merge $MainBranch --no-edit
    
    # Push changes back
    git push origin $DevBranch
    
    Write-Host "Development branch synced successfully!" -ForegroundColor Green
}

# Function to sync production branch
function Sync-Prod {
    Write-Host "Syncing production branch..." -ForegroundColor Green
    
    # Switch to production branch
    git checkout $ProdBranch
    
    # Pull latest changes
    git pull origin $ProdBranch
    
    # Merge from development if needed (or main for direct releases)
    git merge $DevBranch --no-edit
    
    # Push changes back
    git push origin $ProdBranch
    
    Write-Host "Production branch synced successfully!" -ForegroundColor Green
}

# Function to promote development to production
function Promote-Dev {
    Write-Host "Promoting development to production..." -ForegroundColor Green
    
    # Ensure we're on main branch
    git checkout $MainBranch
    
    # Pull latest from main
    git pull origin $MainBranch
    
    # Merge from development
    git merge $DevBranch --no-edit
    
    # Push to main
    git push origin $MainBranch
    
    # Switch to production
    git checkout $ProdBranch
    
    # Merge from main to production
    git merge $MainBranch --no-edit
    
    # Push to production
    git push origin $ProdBranch
    
    Write-Host "Development promoted to production successfully!" -ForegroundColor Green
}

# Function to create backup
function Create-Backup {
    Write-Host "Creating backup of current state..." -ForegroundColor Green
    
    # Get current date for backup name
    $date = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupName = "backup-$date"
    
    # Create a new branch as backup
    git checkout -b $backupName
    git push origin $backupName
    
    # Switch back to main
    git checkout $MainBranch
    
    Write-Host "Backup created as branch '$backupName'" -ForegroundColor Green
}

# Function to show status
function Show-Status {
    Write-Host "Repository Status" -ForegroundColor Cyan
    Write-Host "=================" -ForegroundColor Cyan
    
    # Show current branch
    $currentBranch = git branch --show-current
    Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow
    
    # Show branch status
    Write-Host "`nBranch Status:" -ForegroundColor Yellow
    git branch -v
    
    # Show recent commits
    Write-Host "`nRecent Commits:" -ForegroundColor Yellow
    git log --oneline -10
}

# Main execution logic
switch ($Command.ToLower()) {
    "init" { 
        Initialize-Repository -RemoteUrl $RemoteUrl
    }
    "setup-dev" { 
        Setup-Dev
    }
    "setup-prod" { 
        Setup-Prod
    }
    "sync-dev" { 
        Sync-Dev
    }
    "sync-prod" { 
        Sync-Prod
    }
    "promote-dev" { 
        Promote-Dev
    }
    "backup" { 
        Create-Backup
    }
    "status" { 
        Show-Status
    }
    default { 
        Show-Help
    }
}