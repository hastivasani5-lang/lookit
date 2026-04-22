# Requirements Document

## Introduction

This feature provides a Git workflow automation tool for the "lookit" Next.js project. It allows developers to safely stage, commit, and push code changes to the `main` branch from within the development environment. The tool validates the working tree state, enforces commit message quality, and handles common push errors (conflicts, auth failures, dirty state) with clear feedback.

## Glossary

- **Git_Tool**: The push-to-main automation script/utility being built
- **Working_Tree**: The local file system state tracked by Git
- **Staging_Area**: The Git index where changes are prepared before committing
- **Main_Branch**: The primary branch named `main` in the remote repository
- **Remote**: The upstream Git repository (e.g., GitHub/GitLab origin)
- **Commit**: A recorded snapshot of staged changes with a message
- **Push**: The operation that uploads local commits to the Remote
- **Conflict**: A state where local and remote histories have diverged and cannot be fast-forward merged
- **Dirty_State**: A Working_Tree that has uncommitted or unstaged changes

## Requirements

### Requirement 1: Detect Working Tree Status

**User Story:** As a developer, I want to see the current state of my working tree before pushing, so that I know exactly what changes will be included.

#### Acceptance Criteria

1. WHEN the Git_Tool is invoked, THE Git_Tool SHALL read and display the current branch name
2. WHEN the Git_Tool is invoked, THE Git_Tool SHALL list all modified, added, deleted, and untracked files in the Working_Tree
3. IF the Working_Tree has no changes, THEN THE Git_Tool SHALL display a message indicating there is nothing to commit and exit without error
4. THE Git_Tool SHALL display the number of commits ahead of the Remote Main_Branch

---

### Requirement 2: Stage Changes

**User Story:** As a developer, I want to stage all current changes for commit, so that my work is included in the push.

#### Acceptance Criteria

1. WHEN the developer confirms staging, THE Git_Tool SHALL stage all modified, added, and deleted tracked files
2. WHERE untracked files exist, THE Git_Tool SHALL prompt the developer to confirm whether to include them before staging
3. IF staging fails, THEN THE Git_Tool SHALL display the error output from Git and exit without pushing
4. WHEN staging completes, THE Git_Tool SHALL display a summary of staged files

---

### Requirement 3: Commit with a Message

**User Story:** As a developer, I want to attach a commit message to my changes, so that the history is meaningful and traceable.

#### Acceptance Criteria

1. WHEN staging is complete, THE Git_Tool SHALL prompt the developer to enter a commit message
2. IF the commit message is empty, THEN THE Git_Tool SHALL reject it and re-prompt the developer
3. IF the commit message is fewer than 5 characters, THEN THE Git_Tool SHALL reject it and re-prompt the developer
4. WHEN a valid commit message is provided, THE Git_Tool SHALL create a Commit with that message
5. IF the Commit operation fails, THEN THE Git_Tool SHALL display the Git error and exit without pushing

---

### Requirement 4: Push to Main Branch

**User Story:** As a developer, I want to push my committed changes to the Main_Branch on the Remote, so that my work is available to the team.

#### Acceptance Criteria

1. WHEN a Commit exists that is not yet on the Remote, THE Git_Tool SHALL push it to the Main_Branch of the Remote named `origin`
2. WHEN the Push succeeds, THE Git_Tool SHALL display a success confirmation including the commit hash and branch name
3. IF the Push fails due to a Conflict, THEN THE Git_Tool SHALL display a clear message explaining the divergence and suggest running `git pull --rebase` before retrying
4. IF the Push fails due to an authentication error, THEN THE Git_Tool SHALL display the authentication error and suggest verifying SSH keys or access tokens
5. IF the Push fails for any other reason, THEN THE Git_Tool SHALL display the raw Git error output

---

### Requirement 5: Guard Against Pushing to Wrong Branch

**User Story:** As a developer, I want protection against accidentally pushing to the wrong branch, so that I don't corrupt the main branch history.

#### Acceptance Criteria

1. WHILE the current branch is not `main`, THE Git_Tool SHALL warn the developer that they are not on `main`
2. WHEN a branch mismatch warning is shown, THE Git_Tool SHALL require explicit confirmation before proceeding with the Push
3. IF the developer does not confirm within the prompt, THEN THE Git_Tool SHALL abort the Push and exit without error

---

### Requirement 6: Dry Run Mode

**User Story:** As a developer, I want to preview what would be pushed without actually pushing, so that I can verify my changes before they go live.

#### Acceptance Criteria

1. WHERE dry-run mode is enabled, THE Git_Tool SHALL perform all steps up to and including the Commit creation
2. WHERE dry-run mode is enabled, THE Git_Tool SHALL display what would be pushed without executing the Push
3. WHERE dry-run mode is enabled, THE Git_Tool SHALL label all output clearly as a dry run so the developer is not confused
