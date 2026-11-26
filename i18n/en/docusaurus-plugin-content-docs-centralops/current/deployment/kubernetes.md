---
sidebar_position: 2
title: Deploy with Kubernetes (Helm)
description: Run CentralOps in multi-node production with the Helm chart — API, workers, HPA, PDB, and NetworkPolicies.
---

# Deploy with Kubernetes (Helm)

For **production at scale** (multiple nodes, high availability, autoscaling), CentralOps
ships a **Helm chart** that provisions the API, the frontend, the collection workers
(Celery), the scheduler, plus **HPA** (autoscaling), **PDB** (availability during
maintenance), and **NetworkPolicies**. It is the same Docker artifact as
[Docker Compose](./docker-compose.md) — only the orchestration changes.

:::tip[When to use]
Choose Kubernetes when you need **horizontal scaling, multi-node resilience, or
integration with an existing cluster**. For a single server, [Docker Compose](./docker-compose.md)
is simpler.
:::

## Prerequisites

- A **Kubernetes** 1.27+ cluster with `kubectl` access.
- **Helm** 3.9+.
- A **Postgres** and a **Redis** — managed (recommended) or inside the cluster.

## Step by step

### 1. Prepare the values

Create a `values.override.yaml` with the minimum for your environment:

```yaml
image:
  repository: ghcr.io/segark-oficial/centralops
  tag: "v1.0.0"          # fixe uma tag imutável em produção

frontendImage:
  repository: ghcr.io/segark-oficial/centralops-frontend
  tag: "v1.0.0"

# Segredos essenciais (use um Secret existente em produção)
config:
  appEnv: production
  # APP_MASTER_KEY e a URL do banco devem vir de um Secret — ver "Segredos" abaixo.

postgres:
  # aponte para o seu Postgres gerido
  host: postgres.exemplo.internal
  database: centralops

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 6
```

### 2. Install

```bash
kubectl create namespace centralops
helm install centralops kubernetes/helm/centralops \
  --namespace centralops \
  -f values.override.yaml
```

### 3. Verify

```bash
kubectl -n centralops rollout status deploy/centralops-api
kubectl -n centralops get pods
kubectl -n centralops port-forward svc/centralops-api 8080:80 &
curl -fsS http://localhost:8080/readyz
```

## Essential secrets

Never put secrets in `values.yaml`. Create a Secret and reference it:

```bash
kubectl -n centralops create secret generic centralops-secrets \
  --from-literal=APP_MASTER_KEY="<chave-de-32+-caracteres>" \
  --from-literal=DATABASE_URL="postgresql+psycopg2://user:senha@host:5432/centralops"
```

| Key | What it is for |
|---|---|
| `APP_MASTER_KEY` | Master encryption key for integration secrets (≥ 32 chars). |
| `DATABASE_URL` | Connection to the production Postgres. |
| `POSTGRES_PASSWORD` | If you use the chart's in-cluster Postgres. |

The complete variable reference is in **[Configuration](./configuration.md)**.

## Server AWS identity {#identidade-aws-do-servidor}

Only needed if you will use AWS integrations. The server needs an AWS identity that can only assume the customers' roles; [AWS: give CentralOps access](../integrations/aws-acesso.md#instalação-própria-a-identidade-do-servidor) shows how to create it. The API and all workers read the whole Secret and use the same identity.

- **On EKS, with IRSA or EKS Pod Identity (recommended):** create a ServiceAccount bound to the server role and point the chart to it. No key stays in the cluster.

  ```yaml
  serviceAccount:
    create: false
    name: centralops-aws   # the ServiceAccount with the eks.amazonaws.com/role-arn annotation (IRSA)
  ```

- **Outside AWS, with an access key:** the chart-generated Secret has no field for AWS keys. Use `secrets.existingSecret` and add the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` keys (and, if you want, `AWS_TRUST_PRINCIPAL_ARN`) to your Secret. Then restart the pods, because the variables are only read at startup:

  ```bash
  kubectl -n centralops patch secret <your-secret> --type merge \
    -p '{"stringData":{"AWS_ACCESS_KEY_ID":"AKIA...","AWS_SECRET_ACCESS_KEY":"..."}}'
  kubectl -n centralops rollout restart deployment
  ```

To check, open a new AWS integration: the **AWS role access** panel should show the server identity's ARN as principal.

## What the chart delivers

- **API + frontend + Celery workers + beat** as separate Deployments (release
  decoupled from the UI).
- **HPA** to scale the API/workers by CPU.
- **PodDisruptionBudget** so maintenance does not take down all replicas at once.
- **NetworkPolicies** restricting traffic between components.
- **License keyring** (ConfigMap with **public** keys) to verify the Enterprise
  license **offline** — see **[Editions & Upgrade](/centralops/editions/community-vs-enterprise)**.

## Next steps

- **[Configuration](./configuration.md)** — all environment variables.
- **[First Login](/centralops/getting-started/first-login)** — create the admin.
- **[Upgrade to Enterprise](../editions/upgrade.md)** — enable the MSSP features.
