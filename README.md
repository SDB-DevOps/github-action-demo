# github-action-demo

A small Node.js app with a full CI/CD pipeline. **CI** builds and publishes a
container image; **CD** is GitOps-based via ArgoCD.

## Pipeline

```
push to main
    │
    ▼
CI (.github/workflows/ci.yml)
  builds & pushes  ghcr.io/sdb-devops/github-action-demo:sha-<short>  (+ latest)
    │
    ▼  (on CI success)
Deploy (.github/workflows/deploy.yml)
  bumps the image tag in the GitOps repo → opens a PR
    │
    ▼  (a human reviews & merges the PR)
ArgoCD
  auto-syncs the new image into the K3S cluster
```

Deploys are **declarative**: the GitOps repo is the source of truth, and nothing
is applied to the cluster with `kubectl` anymore. See the companion repo
[`github-action-demo-gitops`](https://github.com/sdb-devops/github-action-demo-gitops)
for the manifests and the ArgoCD `Application`.

## Setup

### 1. Create the GitOps repo

The manifests are scaffolded in a sibling folder `../github-action-demo-gitops`.
Create an empty GitHub repo and push:

```sh
cd ../github-action-demo-gitops
gh repo create sdb-devops/github-action-demo-gitops --private --source=. --push
```

(Adjust the owner/visibility as needed. If you rename it, update `GITOPS_REPO`
in `deploy.yml` and `repoURL` in the GitOps repo's `argocd/application.yaml`.)

### 2. Add the `GITOPS_TOKEN` secret

The deploy workflow needs write access to the GitOps repo to push a branch and
open a PR. Create a token with **contents: read/write** and **pull-requests:
read/write** scope on the GitOps repo (a fine-grained PAT, or a classic PAT with
`repo`), then add it here:

```sh
gh secret set GITOPS_TOKEN --repo sdb-devops/github-action-demo
```

> The default `GITHUB_TOKEN` cannot reach another repository, which is why a
> dedicated token is required.

### 3. Install & wire up ArgoCD

Follow the "One-time cluster setup" section in the GitOps repo's README.

## Local development

```sh
npm install
npm test
npm start        # serves on http://localhost:3000  (GET /health for liveness)
```
