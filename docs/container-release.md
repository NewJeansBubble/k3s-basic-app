# Container Image Release Pipeline

## Overview

This repository uses GitHub Actions and semantic-release to version, build,
and publish the backend and frontend container images to GitHub Container
Registry (GHCR).

The workflow is defined in
[`publish-image.yaml`](../.github/workflows/publish-image.yaml), and the
semantic-release configuration is defined in
[`../.releaserc.json`](../.releaserc.json).

## Release Flow

The release pipeline runs in the following order:

1. A change is pushed to the `master` branch.
2. semantic-release analyzes the Git commit history.
3. If eligible changes are found, a semantic version, Git tag, and GitHub
   Release are created.
4. The backend container image is built and published.
5. The frontend container image is built and published.
6. GHCR assigns an immutable SHA-256 digest to each published image.

```text
Push to master
      |
      v
semantic-release
      |
      v
Git tag and GitHub Release
      |
      v
Build and publish backend
      |
      v
Build and publish frontend
```

## Workflow Triggers

### Automatic execution

The workflow runs automatically when changes are pushed to the `master`
branch.

Changes that exclusively affect the following paths do not trigger the
workflow:

- `README.md`
- `charts/**`
- `.github/**`

If a commit changes an ignored path and an application path, the workflow
still runs.

> Path filters control whether the workflow starts. They do not change how
> semantic-release analyzes the Git commit history.

### Manual execution

The workflow can also be started manually:

1. Open the repository on GitHub.
2. Navigate to **Actions**.
3. Select **Publish container images**.
4. Select **Run workflow**.
5. Choose the `master` branch and confirm the execution.

A manual execution does not guarantee that a new release will be created.
semantic-release only creates a version when eligible commits exist.

## Semantic Versioning

Versions are calculated automatically from commit messages that follow the
[Conventional Commits](https://www.conventionalcommits.org/) specification.

The project uses the `MAJOR.MINOR.PATCH` format.

| Commit example | Release type | Version example |
| --- | --- | --- |
| `fix: correct request validation` | Patch | `1.0.0` to `1.0.1` |
| `feat: add user authentication` | Minor | `1.0.0` to `1.1.0` |
| `feat!: change authentication API` | Major | `1.0.0` to `2.0.0` |
| `docs: update deployment guide` | No release | — |
| `chore: update development tools` | No release | — |

A breaking change can also be declared in the commit body:

```text
feat: update authentication flow

BREAKING CHANGE: authentication tokens now use a different format
```

Git release tags use the following format:

```text
v1.2.0
```

## Published Images

The pipeline publishes the following packages:

| Component | GHCR package |
| --- | --- |
| Backend | `ghcr.io/newjeansbubble/k3s-basic-app-backend` |
| Frontend | `ghcr.io/newjeansbubble/k3s-basic-app-frontend` |

For release `1.2.0`, the following tags are published:

```text
ghcr.io/newjeansbubble/k3s-basic-app-backend:1.2.0
ghcr.io/newjeansbubble/k3s-basic-app-backend:latest

ghcr.io/newjeansbubble/k3s-basic-app-frontend:1.2.0
ghcr.io/newjeansbubble/k3s-basic-app-frontend:latest
```

The version tag identifies an application release. The `latest` tag points
to the most recently published release.

## Image Digests

GHCR automatically assigns an immutable SHA-256 digest to every published
image.

Example:

```text
ghcr.io/newjeansbubble/k3s-basic-app-backend@sha256:<digest>
```

Tags and digests serve different purposes:

- `:1.2.0` identifies the semantic application version.
- `:latest` identifies the most recently published version.
- `@sha256:<digest>` identifies the exact image content.

Tags can be reassigned, while a digest always refers to the same image
content. Production deployments can use a digest when strict image
immutability is required.

Example Kubernetes image reference:

```yaml
image: ghcr.io/newjeansbubble/k3s-basic-app-backend@sha256:<digest>
```

## Authentication and Permissions

The pipeline authenticates with GitHub using the automatically generated
`GITHUB_TOKEN`. No manually managed registry credentials are required for
publishing packages in this repository.

| Permission | Purpose |
| --- | --- |
| `contents: write` | Create Git tags and GitHub Releases |
| `packages: write` | Publish container images to GHCR |
| `issues: write` | Update issues referenced by a release |
| `pull-requests: write` | Update pull requests referenced by a release |

The token is passed to semantic-release and the GHCR login action through:

```yaml
${{ secrets.GITHUB_TOKEN }}
```

## Release Conditions

The image publishing job runs only when semantic-release creates or
identifies a version for the current commit.

If the commit history does not contain an eligible change:

1. No new Git tag is created.
2. No GitHub Release is created.
3. The container publishing job is skipped.

This prevents documentation-only and maintenance-only changes from creating
unnecessary application releases.

## Build Order and Failure Behavior

The images are built sequentially:

1. Backend
2. Frontend

If the backend build fails, the frontend build is not started.

If the backend is published successfully but the frontend build fails, the
release is partially published. Review the failure and run the workflow
again after correcting the issue.

## Troubleshooting

### No release was created

Confirm that at least one commit since the previous release uses a
release-producing type such as `fix:`, `feat:`, or a breaking change.

Commits such as `docs:` and `chore:` do not generate releases by default.

### GHCR authentication failed

Confirm that the workflow grants the following permission:

```yaml
permissions:
  packages: write
```

The registry login must use the GitHub actor and automatically generated
token:

```yaml
username: ${{ github.actor }}
password: ${{ secrets.GITHUB_TOKEN }}
```

### The publishing job was skipped

The publishing job is intentionally skipped when semantic-release does not
create or identify a version for the current commit.

## Current Limitations

The release workflow does not currently run application tests before
publishing the images. Tests, linting, and application build validation
should be handled by a dedicated CI workflow or by a validation job that
runs before the release job.
