# Setup Script for Git Environment in Frontend-Main Project
# This script installs Git, configures the repository, and sets up the CI/CD workflow

param(
    [string]$GitInstallationPath = "C:\Git",
    [string]$RemoteRepoUrl = "",
    [switch]$InstallGit = $false,
    [switch]$ConfigureOnly = $false
)

# Function to write log messages
function Write-Status {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Function to install Git
function Install-Git {
    Write-Status "Checking for Git installation..." "Yellow"
    
    # Check if Git is already installed
    if (Get-Command git -ErrorAction SilentlyContinue) {
        Write-Status "Git is already installed." "Green"
        $gitVersion = git --version
        Write-Status "Git version: $gitVersion" "Cyan"
        return $true
    }
    
    Write-Status "Git is not installed. Installing Git..." "Yellow"
    
    try {
        # Using winget to install Git (if available)
        if (Get-Command winget -ErrorAction SilentlyContinue) {
            Write-Status "Using winget to install Git..." "Cyan"
            winget install --id Git.Git -e --source winget
        } 
        # Fallback to Chocolatey if winget is not available
        elseif (Get-Command choco -ErrorAction SilentlyContinue) {
            Write-Status "Using Chocolatey to install Git..." "Cyan"
            choco install git -y
        }
        else {
            Write-Status "Neither winget nor Chocolatey found. Please install Git manually from https://git-scm.com/" "Red"
            Write-Status "After installing Git, please restart your terminal and run this script again." "Red"
            return $false
        }
        
        # Restart the shell to refresh PATH
        Write-Status "Git installation completed. Please restart your terminal to refresh PATH environment." "Green"
        return $true
    }
    catch {
        Write-Status "Failed to install Git: $($_.Exception.Message)" "Red"
        Write-Status "Please install Git manually from https://git-scm.com/" "Red"
        return $false
    }
}

# Function to configure the Git repository
function Configure-GitRepository {
    param([string]$RemoteUrl)
    
    Write-Status "Configuring Git repository for Frontend-Main..." "Yellow"
    
    # Change to the repository directory
    Set-Location $PSScriptRoot
    
    # Verify this is a Git repository
    if (!(Test-Path ".git")) {
        Write-Status "Initializing new Git repository..." "Cyan"
        git init
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Failed to initialize Git repository" "Red"
            return $false
        }
    }
    
    # Configure user information
    $userName = git config --global user.name
    $userEmail = git config --global user.email
    
    if (-not $userName) {
        Write-Status "Please enter your Git username:" "Cyan"
        $userName = Read-Host
        git config --global user.name $userName
    }
    
    if (-not $userEmail) {
        Write-Status "Please enter your Git email:" "Cyan"
        $userEmail = Read-Host
        git config --global user.email $userEmail
    }
    
    Write-Status "Configured Git user: $userName <$userEmail>" "Green"
    
    # Add all files to the repository
    Write-Status "Adding files to repository..." "Cyan"
    git add .
    
    # Create initial commit if needed
    $initialCommit = git rev-list --count HEAD
    if ($initialCommit -eq 0) {
        git commit -m "Initial commit: Frontend-Main project setup with Git workflow configuration"
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Failed to create initial commit" "Red"
            return $false
        }
        Write-Status "Created initial commit" "Green"
    }
    
    # Set up standard branches
    $branches = git branch --list
    $mainExists = $branches -match "main"
    $devExists = $branches -match "development"
    $prodExists = $branches -match "production"
    
    if (-not $mainExists) {
        git checkout -b main
        git checkout -
    }
    
    if (-not $devExists) {
        Write-Status "Creating development branch..." "Cyan"
        git checkout -b development
        git checkout -
    }
    
    if (-not $prodExists) {
        Write-Status "Creating production branch..." "Cyan"
        git checkout -b production
        git checkout -
    }
    
    # Configure remotes if provided
    if ($RemoteUrl) {
        $existingRemote = git remote get-url origin 2>$null
        if ($existingRemote) {
            git remote set-url origin $RemoteUrl
        } else {
            git remote add origin $RemoteUrl
        }
        Write-Status "Configured remote origin: $RemoteUrl" "Green"
    }
    
    # Run the Git workflow setup script
    Write-Status "Running Git workflow setup..." "Cyan"
    & "$PSScriptRoot/scripts/setup-git-hooks.ps1"
    
    Write-Status "Git repository configured successfully!" "Green"
    return $true
}

# Main execution
Write-Status "Setting up Git environment for Frontend-Main project..." "Cyan"

if ($InstallGit) {
    $gitInstalled = Install-Git
    if (-not $gitInstalled) {
        Write-Status "Cannot proceed without Git installed." "Red"
        return
    }
}

if (-not $ConfigureOnly) {
    # Check if Git is available
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Status "Git is not installed or not in PATH. Please install Git first." "Red"
        Write-Status "Run this script with -InstallGit switch to install Git automatically: .\setup-git-environment.ps1 -InstallGit" "Yellow"
        return
    }
}

$result = Configure-GitRepository -RemoteUrl $RemoteRepoUrl

if ($result) {
    Write-Status "Git environment setup completed successfully!" "Green"
    Write-Status "Next steps:" "Cyan"
    Write-Host "1. Review the Git workflow setup in GIT_WORKFLOW_SETUP.md" -ForegroundColor White
    Write-Host "2. Use the scripts in the scripts/ directory to manage your Git workflow" -ForegroundColor White
    Write-Host "3. Run 'npm run git:status' to check the status of your repository" -ForegroundColor White
    Write-Host "4. Set up your CI/CD pipeline using the GitHub Actions workflow in .github/workflows/ci-cd.yml" -ForegroundColor White
} else {
    Write-Status "Git environment setup failed." "Red"
}