# �� FingerMobile Protocol

> A comprehensive mobile-first communication and commerce platform with end-to-end encryption, decentralized identity, and integrated marketplace.

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14-blue.svg)](https://www.postgresql.org/)
[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

FingerMobile Protocol is a mobile-first, end-to-end encrypted communication and digital commerce fusion platform focused on secure communications, decentralized identity (SSI), and integrated digital marketplaces with a "security-first" design philosophy.

### Key Features
- Secure messaging with end-to-end encryption
- Decentralized identity verification
- Integrated digital marketplace
- Multi-factor authentication
- GDPR compliance

---

## 🧾 Git Configuration

### Recommended Git Settings

The project includes a `.gitconfig` file with recommended settings. To apply these settings:

```bash
# Apply the recommended Git configuration
git config --local include.path ../.gitconfig
```

### Git Hooks

The project uses Git hooks to enforce code quality. The pre-commit hook checks for:
- Sensitive data in commits
- Large files (>10MB)
- TODO comments in production code
- Basic syntax errors
- Commit message format

To install the hooks:

```bash
# Copy hooks to .git/hooks directory
cp -r .githooks/* .git/hooks/
chmod +x .git/hooks/pre-commit
```

### .gitignore

The project includes a comprehensive `.gitignore` file that excludes:
- Build artifacts and dist folders
- Environment files
- Log files
- IDE-specific files
- OS-generated files
- Sensitive data

---

## 🌿 Branching Strategy

We follow a GitFlow-inspired branching model:

```
main (production-ready code)
├── development (integration branch)
├── feature/* (feature branches)
├── bugfix/* (bug fixes)
├── hotfix/* (urgent fixes for production)
└── release/* (release preparation)
```

### Branch Naming Convention

- Feature branches: `feature/short-description`
- Bugfix branches: `bugfix/issue-number-short-description`
- Hotfix branches: `hotfix/issue-number-short-description`
- Release branches: `release/version-number`

### Example

```bash
# Create a new feature branch
git checkout -b feature/user-authentication

# Create a bugfix branch
git checkout -b bugfix/123-fix-login-issue

# Create a hotfix branch
git checkout -b hotfix/456-security-patch
```

---

## ✍️ Commit Message Guidelines

We follow the Conventional Commits specification for consistent commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (white-space, formatting, etc.)
- `refactor`: Code refactoring without functional changes
- `test`: Adding or modifying tests
- `chore`: Other changes that don't modify src or test files

### Examples

```
feat(auth): add OAuth2 social login support

- Implement Google OAuth2 strategy
- Implement Facebook OAuth2 strategy
- Add social login buttons to login page
- Update user model to store social provider data
```

```
fix(api): resolve null pointer exception in user profile

- Added null checks in UserProfileController
- Updated unit tests to cover edge cases
- Fixed issue #123
```

### Security
- **Encryption:** libsodium for E2EE
- **Certificates:** Automatic rotation for sealed sender
- **Compliance:** GDPR-ready with data export/deletion

---

## 🚀 CI/CD Pipeline

### Workflow Structure

The CI/CD pipeline is defined in `.github/workflows/fingermobile-protocol-cicd.yml` and consists of the following stages:

1. **Code Quality & Security** - Linting, type checking, and security scanning
2. **Testing** - Unit, integration, and end-to-end tests
3. **Building** - Docker image creation
4. **Staging Deployment** - Deploy to staging environment
5. **Production Deployment** - Deploy to production (with manual approval)
6. **Release Notes** - Generate and publish release notes

### Environments

- **Development**: Automatic deployment from `development` branch
- **Staging**: Automatic deployment from `staging` branch
- **Production**: Manual deployment from `main` branch

### Secrets Management

The following secrets need to be configured in GitHub Secrets:

#### Staging Environment
- `STAGING_HOST`
- `STAGING_USER`
- `STAGING_SSH_KEY`

#### Production Environment
- `PRODUCTION_HOST`
- `PRODUCTION_USER`
- `PRODUCTION_SSH_KEY`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `S3_BUCKET`

#### Notifications
- `SLACK_CHANNEL_ID`
- `SLACK_BOT_TOKEN`

---

## 🕓 Auto-Commit Watcher

The project includes an auto-commit watcher script (`auto_commit_watcher.js`) that automatically commits and pushes changes at regular intervals. This is particularly useful during active development phases.

### Features

- Watches specified directories for changes
- Automatically commits changes with timestamp
- Pushes changes to the configured remote repository
- Includes safety checks to prevent committing sensitive data
- Configurable commit intervals

### Configuration

The watcher monitors the following directories:
- `FingerMobile Protocol/apps/frontend-main`
- `FingerMobile Protocol/apps/backend`
- `FingerMobile Business and Monetization Suite`

### Running the Watcher

```bash
# Start the auto-commit watcher
node auto_commit_watcher.js
```

---

## 🔐 Security Considerations

### Sensitive Data Protection

- Never commit API keys, passwords, or other sensitive data
- Use environment variables for configuration
- The pre-commit hook checks for sensitive data patterns
- Use Git LFS for large binary files

### Access Control

- Limit write access to main branches
- Require pull request reviews before merging
- Use branch protection rules
- Regular security audits of dependencies

### Vulnerability Management

- Automated security scanning with Trivy
- Regular dependency updates
- Vulnerability reporting procedures

---

## 🛠️ Troubleshooting

### Common Issues

#### Large Files Error
If you encounter errors about large files:
```bash
# Add the file to Git LFS
git lfs track "path/to/large/file"
git add .gitattributes
git add "path/to/large/file"
```

#### Merge Conflicts
```bash
# Resolve conflicts manually, then
git add <resolved-files>
git commit
```

#### Failed CI Builds
Check the GitHub Actions logs for specific error messages. Common issues include:
- Linting errors
- Type checking failures
- Test failures
- Missing environment variables

### Git Commands Cheat Sheet

```bash
# Sync with remote
git fetch origin
git pull origin <branch>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (remove changes)
git reset --hard HEAD~1

# Stash changes temporarily
git stash
git stash pop

# View commit history
git log --oneline --graph --all

# Compare branches
git diff main..<branch>
```

## 📞 Support

For support with Git and CI/CD configuration:
- Check the GitHub Actions logs for CI/CD issues
- Contact the development team for access issues
- Review the documentation in the `docs/` directory
- Open an issue in the repository for bugs or feature requests

---

**Maintained by:** FingerMobile Protocol Team  
**Last Updated:** September 2026