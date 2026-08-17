# PowerShell script to set up Git hooks for the frontend-main project
# This script will automate Git operations for Dev and Production environments

param(
    [string]$RemoteUrl = "",
    [string]$DevBranch = "development",
    [string]$ProdBranch = "production",
    [string]$MainBranch = "main"
)

Write-Host "Setting up Git hooks for frontend-main..." -ForegroundColor Green

# Ensure we're in the correct directory
Set-Location $PSScriptRoot/../

# Create hooks directory if it doesn't exist
$hooksDir = ".git\hooks"
if (!(Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
    Write-Host "Created hooks directory at $hooksDir" -ForegroundColor Yellow
}

# Pre-commit hook to run tests
$preCommitHook = @"
#!/bin/sh
echo "Running pre-commit checks..."

# Run linting if available
if [ -f "package.json" ] && grep -q "lint" package.json; then
  echo "Running linter..."
  npm run lint --silent
  if [ $? -ne 0 ]; then
    echo "Linting failed. Commit aborted."
    exit 1
  fi
fi

# Run tests
echo "Running tests..."
npm test -- --passWithNoTests --bail
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi

echo "Pre-commit checks passed!"
exit 0
"@

# Write the pre-commit hook
$preCommitHook | Out-File -FilePath "$hooksDir\pre-commit" -Encoding utf8NoBOM
Write-Host "Created pre-commit hook" -ForegroundColor Yellow

# Post-commit hook for notifications
$postCommitHook = @"
#!/bin/sh
echo "Commit completed successfully"
"@

# Write the post-commit hook
$postCommitHook | Out-File -FilePath "$hooksDir\post-commit" -Encoding utf8NoBOM
Write-Host "Created post-commit hook" -ForegroundColor Yellow

# Post-merge hook to automatically install dependencies if package-lock changed
$postMergeHook = @"
#!/bin/sh
if git diff-tree -r --name-only --no-commit-id -z ORIG_HEAD HEAD | grep -qE '(package-lock.json|yarn.lock)'; then
  echo "Dependencies changed, running npm install..."
  npm install
fi
"@

# Write the post-merge hook
$postMergeHook | Out-File -FilePath "$hooksDir\post-merge" -Encoding utf8NoBOM
Write-Host "Created post-merge hook" -ForegroundColor Yellow

# Make hooks executable (for systems that support it)
if ($IsLinux -or $IsMacOS) {
    chmod +x "$hooksDir\pre-commit"
    chmod +x "$hooksDir\post-commit"
    chmod +x "$hooksDir\post-merge"
}

# Configure Git branches for tracking
Write-Host "`nConfiguring Git branch tracking..." -ForegroundColor Green

# Set up branch tracking relationships
git config branch.$DevBranch.remote origin
git config branch.$DevBranch.merge refs/heads/$DevBranch
git config branch.$ProdBranch.remote origin
git config branch.$ProdBranch.merge refs/heads/$ProdBranch
git config branch.$MainBranch.remote origin
git config branch.$MainBranch.merge refs/heads/$MainBranch

# Set up Git push configuration
git config push.default simple

Write-Host "`nGit hooks and configuration setup complete!" -ForegroundColor Green
Write-Host "Branches configured for tracking:" -ForegroundColor Yellow
Write-Host "  - $DevBranch (development)"
Write-Host "  - $ProdBranch (production)" 
Write-Host "  - $MainBranch (main)"

if ($RemoteUrl) {
    # Add the remote origin if provided
    $existingRemote = git remote get-url origin 2>$null
    if ($existingRemote) {
        Write-Host "`nUpdating existing remote origin to: $RemoteUrl" -ForegroundColor Yellow
        git remote set-url origin $RemoteUrl
    } else {
        Write-Host "`nAdding new remote origin: $RemoteUrl" -ForegroundColor Yellow
        git remote add origin $RemoteUrl
    }
    
    Write-Host "Remote origin configured successfully!" -ForegroundColor Green
}

Write-Host "`nSetup complete!" -ForegroundColor Green