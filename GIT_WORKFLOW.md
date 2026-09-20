# FingerMobile Protocol Git Workflow Guide

This document outlines the Git workflow and best practices for the FingerMobile Protocol project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Branching Strategy](#branching-strategy)
3. [Feature Development Workflow](#feature-development-workflow)
4. [Bug Fix Workflow](#bug-fix-workflow)
5. [Hotfix Workflow](#hotfix-workflow)
6. [Pull Request Process](#pull-request-process)
7. [Code Review Guidelines](#code-review-guidelines)
8. [Merge Strategies](#merge-strategies)
9. [Tagging and Releases](#tagging-and-releases)
10. [Git Hooks Configuration](#git-hooks-configuration)
11. [Troubleshooting](#troubleshooting)

## Getting Started

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/fingermobile-main/FingerMobile-Protocol-Frontend-Main.git
   cd FingerMobile-Protocol-Frontend-Main
   ```

2. Configure your Git identity:
   ```bash
   git config user.name "Your Full Name"
   git config user.email "your.email@fingermobile.com"
   ```

3. Set up the pre-commit hooks:
   ```bash
   # Make the hooks executable
   chmod +x .githooks/pre-commit
   # Link the hooks to your local repo
   git config core.hooksPath .githooks
   ```

4. Install dependencies:
   ```bash
   npm install
   cd apps/backend && npm install && cd ../..
   cd apps/frontend-main && npm install && cd ../..
   cd "FingerMobile Business and Monetization Suite" && npm install && cd ../..
   ```

## Branching Strategy

We follow a GitFlow-inspired branching model:

### Main Branches

- `main`: Production-ready code. Only released code should be merged here.
- `development`: Integration branch for features being developed for the next release.

### Supporting Branches

- `feature/*`: Feature development branches
- `bugfix/*`: Bug fixes for features in development
- `hotfix/*`: Urgent fixes for production issues
- `release/*`: Preparation for a new production release

### Branch Naming Convention

- Feature branches: `feature/short-description` (e.g., `feature/user-authentication`)
- Bugfix branches: `bugfix/issue-number-short-description` (e.g., `bugfix/123-fix-login-error`)
- Hotfix branches: `hotfix/issue-number-short-description` (e.g., `hotfix/456-security-patch`)
- Release branches: `release/version-number` (e.g., `release/v1.2.0`)

## Feature Development Workflow

### 1. Create a Feature Branch

```bash
# Switch to the development branch
git checkout development

# Pull the latest changes
git pull origin development

# Create and switch to a new feature branch
git checkout -b feature/my-new-feature
```

### 2. Develop Your Feature

- Write code following the project's coding standards
- Commit frequently with meaningful commit messages
- Run tests locally before pushing
- Keep your branch up-to-date with development

```bash
# Make changes to files
# ...

# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat(auth): add OAuth2 social login support"

# Push to remote
git push origin feature/my-new-feature
```

### 3. Keep Your Branch Updated

```bash
# Switch to development branch
git checkout development

# Pull the latest changes
git pull origin development

# Switch back to your feature branch
git checkout feature/my-new-feature

# Rebase your feature branch onto development
git rebase development
```

### 4. Submit for Review

- Create a pull request from your feature branch to the development branch
- Fill out the pull request template completely
- Assign reviewers
- Address any feedback

## Bug Fix Workflow

### 1. Identify the Issue

- Ensure the bug is tracked in an issue
- Understand the scope and impact of the bug

### 2. Create a Bugfix Branch

```bash
# Switch to the development branch
git checkout development

# Pull the latest changes
git pull origin development

# Create and switch to a new bugfix branch
git checkout -b bugfix/issue-number-bug-description
```

### 3. Implement the Fix

- Write a failing test case first (if applicable)
- Implement the fix
- Ensure all tests pass
- Commit with a clear message

```bash
# Make changes to fix the bug
# ...

# Add and commit the changes
git add .
git commit -m "fix(auth): resolve null pointer exception in login flow (#123)"

# Push to remote
git push origin bugfix/issue-number-bug-description
```

### 4. Submit for Review

- Create a pull request from your bugfix branch to the development branch
- Reference the issue number in the PR description
- Assign appropriate reviewers

## Hotfix Workflow

Hotfixes are urgent fixes for production issues that need to be applied directly to the main branch.

### 1. Create a Hotfix Branch

```bash
# Switch to the main branch
git checkout main

# Pull the latest changes
git pull origin main

# Create and switch to a new hotfix branch
git checkout -b hotfix/issue-number-hotfix-description
```

### 2. Implement the Fix

- Apply the urgent fix
- Keep the changes minimal and targeted
- Test thoroughly

### 3. Create Pull Requests

Create two pull requests:
1. From the hotfix branch to the main branch
2. From the hotfix branch to the development branch

This ensures the fix is applied to both production and development.

## Pull Request Process

### 1. Before Creating a PR

- Ensure your branch is up-to-date with the target branch
- Run all tests locally
- Verify your code meets the project's quality standards
- Squash unnecessary commits if needed
- Update documentation if required

### 2. Creating a PR

- Use a clear and descriptive title
- Fill out the PR template completely
- Include screenshots if applicable
- Reference related issues
- Assign appropriate reviewers
- Set the correct milestone

### 3. PR Template

```
## Description
Brief description of changes made in this PR.

## Related Issue
Closes #[issue-number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Existing tests updated

## Checklist
- [ ] Code follows project standards
- [ ] Self-reviewed my code
- [ ] Added documentation for new features
- [ ] Tested on multiple browsers/devices
```

## Code Review Guidelines

### As a Reviewer

- Be constructive and respectful in your feedback
- Focus on the code's functionality, readability, and maintainability
- Look for potential security vulnerabilities
- Verify that tests cover the changes
- Check that the code follows project standards
- Approve only when all feedback is addressed

### As an Author

- Respond to all feedback in a timely manner
- Explain your decisions when questioned
- Make requested changes promptly
- Request another review after addressing feedback

### Review Criteria

- Does the code meet the requirements?
- Is the code well-structured and readable?
- Are there adequate tests?
- Does the code follow security best practices?
- Is the documentation updated?

## Merge Strategies

### Feature Branches

- Use "Squash and Merge" to keep a clean history
- Ensure the squashed commit message follows the conventional commit format
- Delete the branch after merging

### Hotfix Branches

- Use "Merge Commit" to preserve the commit history
- Merge to both main and development branches
- Tag the release if applicable

### When to Merge

- All automated checks pass
- At least one reviewer approves
- All feedback is addressed
- Tests are passing
- Documentation is updated

## Tagging and Releases

### Semantic Versioning

We follow semantic versioning (MAJOR.MINOR.PATCH):

- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Creating a Release

```bash
# Create and push a tag
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

### Release Process

1. Create a release branch from development
2. Update version numbers and changelog
3. Create a pull request to main
4. After merging, tag the release
5. Create a GitHub release with release notes

## Git Hooks Configuration

### Pre-commit Hook

The project includes a pre-commit hook that:

- Checks for sensitive data in commits
- Verifies file sizes are within limits
- Runs basic linting
- Validates commit message format

### Setting Up Hooks

```bash
# Make the hooks executable
chmod +x .githooks/pre-commit

# Configure Git to use the hooks directory
git config core.hooksPath .githooks
```

## Troubleshooting

### Common Issues and Solutions

#### Large File Errors

If you accidentally commit a large file:

```bash
# Remove the file from your commit
git reset HEAD -- path/to/large/file

# Add to .gitignore
echo "path/to/large/file" >> .gitignore

# Commit the .gitignore changes
git add .gitignore
git commit -m "chore: ignore large file"
```

#### Merge Conflicts

1. Identify the conflicting files
2. Manually resolve conflicts in the files
3. Stage the resolved files
4. Commit the merge

```bash
# After resolving conflicts manually
git add .
git commit -m "Resolve merge conflict in feature branch"
```

#### Rebasing Errors

If you encounter issues during a rebase:

```bash
# Abort the rebase to start over
git rebase --abort

# Or continue after resolving conflicts
git add .
git rebase --continue
```

#### Accidentally Committed to Wrong Branch

```bash
# Move the commit to a new branch
git branch new-branch-name
git reset --hard HEAD~1  # Go back one commit
git checkout new-branch-name
```

### Recovery Commands

```bash
# Reset to a previous commit (removes commits after)
git reset --hard <commit-hash>

# Revert a specific commit (creates a new commit)
git revert <commit-hash>

# Undo the last commit but keep changes
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
git clean -fd
```

## Best Practices

### Commit Messages

- Use the imperative mood ("Add feature" not "Added feature")
- Start with a verb
- Keep the first line under 50 characters
- Reference issues with #issue-number
- Use conventional commit format when possible

### Branch Management

- Keep branches short-lived
- Regularly update with the target branch
- Delete branches after merging
- Use descriptive branch names

### Collaboration

- Communicate early about large changes
- Seek feedback during development
- Keep pull requests focused and small
- Review others' code constructively

---

**Document Version:** 1.0  
**Last Updated:** September 2026  
**Maintainer:** FingerMobile Protocol Team