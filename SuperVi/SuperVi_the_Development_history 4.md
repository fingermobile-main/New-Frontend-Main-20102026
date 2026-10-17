# SuperVi Development History

## PowerShell Development Environment Enhancement Script

```powershell
# Enhanced Development Environment Setup Script
# Removes common limitations and sets up useful development tools

Write-Host "Setting up enhanced development environment..." -ForegroundColor Green

# Enable script execution
try {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentMember -Force
    Write-Host "✓ Execution policy set to RemoteSigned" -ForegroundColor Green
} catch {
    Write-Warning "Could not set execution policy. Scripts may not run."
}

# Create useful aliases for development
Set-Alias -Name ll -Value Get-ChildItem
Set-Alias -Name cls -Value Clear-Host
Set-Alias -Name grep -Value Select-String

Write-Host "✓ Created useful aliases (ll, cls, grep)" -ForegroundColor Green

# Function to create a new project workspace
function New-ProjectWorkspace {
    param(
        [Parameter(Mandatory=$true)]
        [string]$ProjectName,
        [string]$ProjectPath = "."
    )
    $fullPath = Join-Path $ProjectPath $ProjectName
    New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    Set-Location $fullPath
    # Create standard project folders
    New-Item -ItemType Directory -Path "src", "docs", "tests", "assets", "config", "lib" -Force | Out-Null
    # Create common files
    New-Item -ItemType File -Path "README.md", ".gitignore", "package.json" -Force | Out-Null
    Write-Host "Project workspace '$ProjectName' created at $fullPath" -ForegroundColor Green
}

# Function to create a file with content
function New-DevFile {
    param(
        [Parameter(Mandatory=$true)]
        [string]$FilePath,
        [string[]]$Content = @()
    )
    $dir = Split-Path -Path $FilePath -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    if ($Content.Length -gt 0) {
        $Content | Out-File -FilePath $FilePath -Encoding UTF8
    } else {
        New-Item -ItemType File -Path $FilePath -Force | Out-Null
    }
    Write-Host "Created file: $FilePath" -ForegroundColor Green
}

# Function to append content to existing file
function Add-ToDevFile {
    param(
        [Parameter(Mandatory=$true)]
        [string]$FilePath,
        [Parameter(Mandatory=$true)]
        [string[]]$Content
    )
    if (Test-Path $FilePath) {
        $Content | Add-Content -Path $FilePath -Encoding UTF8
        Write-Host "Added content to: $FilePath" -ForegroundColor Green
    } else {
        Write-Warning "File $FilePath does not exist. Use New-DevFile to create it."
    }
}

# Function to create multiple files at once
function New-DevFiles {
    param(
        [Parameter(Mandatory=$true)]
        [hashtable]$Files
    )
    foreach ($file in $Files.GetEnumerator()) {
        New-DevFile -FilePath $file.Key -Content $file.Value
    }
}

# Function to get project statistics
function Get-ProjectStats {
    param([string]$Path = ".")
    $allFiles = Get-ChildItem -Path $Path -File -Recurse -ErrorAction SilentlyContinue
    $totalFiles = $allFiles.Count
    $totalSize = ($allFiles | Measure-Object -Property Length -Sum).Sum
    Write-Host "Project Statistics for: $Path" -ForegroundColor Cyan
    Write-Host "Total Files: $totalFiles" -ForegroundColor White
    Write-Host "Total Size: $([math]::Round($totalSize/1KB, 2)) KB" -ForegroundColor White
    $extGroups = $allFiles | Group-Object Extension | Sort-Object Count -Descending | Select-Object -First 10
    Write-Host "`nTop File Extensions:" -ForegroundColor Cyan
    foreach ($group in $extGroups) {
        Write-Host "  $($group.Name): $($group.Count) files" -ForegroundColor White
    }
}

# Function to search for text in files
function Find-InFiles {
    param(
        [string]$Pattern,
        [string]$Path = ".",
        [string]$Include = "*"
    )
    Select-String -Path "$Path\$Include" -Pattern $Pattern -Recurse -ErrorAction SilentlyContinue
}

# Function to open current directory in VS Code
function Open-Editor {
    param([string]$Path = ".")
    if (Get-Command code -ErrorAction SilentlyContinue) {
        code $Path
    } else {
        Write-Warning "VS Code is not installed or not in PATH"
        Invoke-Item $Path
    }
}

# Function to quickly start a local HTTP server
function Start-LocalServer {
    param(
        [int]$Port = 8000,
        [string]$Path = "."
    )
    # Check if Python is available
    if (Get-Command python -ErrorAction SilentlyContinue) {
        Start-Process "python" -ArgumentList "-m", "http.server", "$Port", "-d", "$Path"
        Write-Host "Started local server at http://localhost:$Port" -ForegroundColor Green
    } elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
        Start-Process "python3" -ArgumentList "-m", "http.server", "$Port", "-d", "$Path"
        Write-Host "Started local server at http://localhost:$Port" -ForegroundColor Green
    } else {
        Write-Warning "Python is not available. Install Python to use local server feature."
    }
}

# Function to clone a git repository with progress
function Get-GitRepo {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Url,
        [string]$Destination = ""
    )
    if (Get-Command git -ErrorAction SilentlyContinue) {
        if ($Destination -eq "") {
            $repoName = [System.IO.Path]::GetFileNameWithoutExtension($Url)
            git clone $Url $repoName
        } else {
            git clone $Url $Destination
        }
    } else {
        Write-Warning "Git is not installed or not in PATH"
    }
}

# Function to quickly install Node.js packages
function Install-NpmPackages {
    param([string[]]$Packages)
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        foreach ($pkg in $Packages) {
            npm install $pkg
        }
    } else {
        Write-Warning "NPM is not available"
    }
}

# Function to run common development tasks
function Start-DevTask {
    param([string]$Task)
    switch ($Task.ToLower()) {
        "setup" {
            Write-Host "Setting up development environment..." -ForegroundColor Cyan
            # Create common config files
            if (!(Test-Path ".gitignore")) {
                "@(node_modules, dist, build, .vscode, .idea)" | Out-File -FilePath ".gitignore" -Encoding UTF8
            }
            Write-Host "✓ Common setup completed" -ForegroundColor Green
        }
        "clean" {
            Write-Host "Cleaning development environment..." -ForegroundColor Cyan
            $pathsToRemove = @("node_modules", "dist", "build", "target", "bin", "obj")
            foreach ($path in $pathsToRemove) {
                if (Test-Path $path) {
                    Remove-Item $path -Recurse -Force
                    Write-Host "Removed $path" -ForegroundColor Yellow
                }
            }
            Write-Host "✓ Clean completed" -ForegroundColor Green
        }
        default {
            Write-Warning "Unknown task: $Task. Available tasks: setup, clean"
        }
    }
}

Write-Host "`nEnhanced development environment is ready!" -ForegroundColor Green
Write-Host "Available functions:" -ForegroundColor Yellow
Write-Host "  - New-ProjectWorkspace" -ForegroundColor White
Write-Host "  - New-DevFile" -ForegroundColor White
Write-Host "  - Add-ToDevFile" -ForegroundColor White
Write-Host "  - New-DevFiles" -ForegroundColor White
Write-Host "  - Get-ProjectStats" -ForegroundColor White
Write-Host "  - Find-InFiles" -ForegroundColor White
Write-Host "  - Open-Editor" -ForegroundColor White
Write-Host "  - Start-LocalServer" -ForegroundColor White
Write-Host "  - Get-GitRepo" -ForegroundColor White
Write-Host "  - Install-NpmPackages" -ForegroundColor White
Write-Host "  - Start-DevTask" -ForegroundColor White
Write-Host "`nUseful aliases:" -ForegroundColor Yellow
Write-Host "  - ll (equivalent to Get-ChildItem)" -ForegroundColor White
Write-Host "  - cls (equivalent to Clear-Host)" -ForegroundColor White
Write-Host "  - grep (equivalent to Select-String)" -ForegroundColor White
Write-Host "`nRun 'Start-DevTask setup' to initialize a new project." -ForegroundColor Cyan
```

## Usage Instructions

To use this script:

1. First, ensure script execution is allowed by running this command in PowerShell as Administrator:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentMember -Force
   ```

2. Copy the entire PowerShell script above (the code between the triple backticks)

3. Open PowerShell in your desired directory

4. Paste the script and press Enter to execute it

5. The script will set up enhanced development functions and aliases

6. You can now use any of these enhanced functions:
   - `New-ProjectWorkspace -ProjectName "MyProject"` - Create a new project structure
   - `New-DevFile -FilePath "src/main.js" -Content @("console.log('Hello');")` - Create files with content
   - `Get-ProjectStats` - View project statistics
   - `Find-InFiles -Pattern "TODO"` - Search for text in files
   - `Open-Editor` - Open current directory in VS Code
   - `Start-LocalServer -Port 3000` - Start a local HTTP server
   - `Start-DevTask -Task "setup"` - Run common development tasks
   - And many more!

This script removes common PowerShell limitations and provides a more developer-friendly environment with useful shortcuts and functions.

## Alternative Installation Method

If you encounter issues when pasting the script directly, you can save it as a .ps1 file:

1. Copy the PowerShell code between the triple backticks into a text editor
2. Save it as `dev_enhancement.ps1` in your desired directory
3. In PowerShell, navigate to that directory
4. Run the script with: `.\dev_enhancement.ps1`

This approach avoids potential parsing issues when pasting directly into the PowerShell console.