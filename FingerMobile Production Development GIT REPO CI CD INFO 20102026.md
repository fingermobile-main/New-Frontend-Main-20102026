
FingerMobile Production Development GIT REPO CI/CD INFO:-

Primary Repository (origin & ok): https://github.com/fingermobile-main/FingerMobile-Protocol-Frontend-Main.git

Active Branch: main
Secondary Clean Remote (cleanpush): https://github.com/fingermobile-main/FingerMobile-Protocol-Frontend-Main-clean.git

Branch: cleanpush/main
Repository Layout on Disk:
Workspace Root (/Users/user/Documents/FingerMobile Protocol Communication):
Remote: origin & ok -> https://github.com/fingermobile-main/FingerMobile-Protocol-Frontend-Main.git
Current commit: c482f40f6 feat: add Tribut media, rebrand, add WebRTC calls
Inner Monorepo Directory (/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol):
Sub-repo Remote: origin -> https://github.com/fingermobile-main/FingerMobile-Protocol-Frontend-Main.git
Current commit: 8a8fd0e6 refactor: restructure camus routing engine, controllers, and add data store JSON

Use the above details i provided as the current FingerMobile Production Development Git Repository and CI/CD reference for future repository-related work.
FingerMobile Git repository baseline
Primary production repository
Remote: origin · Active branch: main
FingerMobile-Protocol-Frontend-Main
Root commit: c482f40f6

Secondary clean remote
Branch: cleanpush/main
FingerMobile-Protocol-Frontend-Main-clean

Inner monorepo
Separate Git repository context · Remote: origin
FingerMobile Protocol/
Inner commit: 8a8fd0e6
Local repository paths
Workspace root
/Users/user/Documents/FingerMobile Protocol Communication
Inner monorepo
/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol
The two reported commits are distinct. I will not assume that the root repository and inner monorepo have identical working trees, histories, or deployment configurations.
CI/CD safeguards for future work
When working on this setup, I will follow these principles:
	•	Verify before changing: inspect repository status, remotes, branches, commit history, and existing CI/CD workflows before modifying anything.
	•	Protect production: avoid unintended pushes, force pushes, branch overwrites, or deployments.
	•	Preserve the clean remote: treat cleanpush/main as a separate remote branch requiring explicit verification before synchronization.
	•	Validate deployments: inspect build, type-check, lint, test, environment-variable, and deployment requirements as applicable.
	•	Respect your development workflow: do not run docker compose up; focus on the FingerMobile Website/App development servers for Chrome testing.
	•	Report changes: include timestamps for edited files, explain the changes, and report validation results.
These details establish our working baseline; the actual current Git state and CI/CD configuration will still need to be verified when repository work begins.

the supplied production workspace is accessible, and it currently contains three nested Git repositories:
	•	Workspace root — main at c482f40f6, tracking cleanpush/main and 49 commits ahead of its local tracking ref. It has 2 tracked changes and 5 untracked files.
	•	Inner monorepo — main at 8a8fd0e6, tracking origin/main and 550 commits ahead / 13 behind its local tracking ref. It has 3 tracked changes, including the frontend repo pointer.
	•	Frontend repo — apps/frontend-main, tracking its own origin/main and 31 commits ahead / 13 behind its local tracking ref. It has 489 tracked changes and 53 untracked entries.
Those divergence counts use locally cached tracking refs; I did not fetch to refresh them. All three repositories contain active local work, so none is a safe stale-repository removal candidate. The nested setup is clear, but both parent repositories lack .gitmodules, leaving the embedded repo relationships undefined in Git’s submodule configuration.
The root .gitlab-ci.yml is the CI configuration I found. Some job paths don’t match the visible apps/backend and apps/frontend-main layout, so the pipeline needs a path/configuration review as part of harmonization.
One security issue: the frontend repo’s remote URL contains an exposed credential. Revoke or rotate it before any further remote operations, then replace it with a credential-helper or SSH-based setup. I did not repeat the credential here.
I made no repository changes, deleted nothing, and ran no tests. My recommendation is to preserve all three repos while deciding which one should be canonical and how the nested projects should be represented; only then reconcile histories and CI paths.

