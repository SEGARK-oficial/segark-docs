---
sidebar_position: 2
title: Despliegue con Kubernetes (Helm)
description: Ejecuta CentralOps en producción multi-nodo con el Helm chart — API, workers, HPA, PDB y NetworkPolicies.
---

# Despliegue con Kubernetes (Helm)

Para **producción a escala** (múltiples nodos, alta disponibilidad, autoescalado), el
CentralOps trae un **Helm chart** que aprovisiona la API, el frontend, los workers de recolección
(Celery), el planificador, además de **HPA** (autoescalado), **PDB** (disponibilidad durante
el mantenimiento) y **NetworkPolicies**. Es el mismo artefacto Docker de
[Docker Compose](./docker-compose.md) — solo cambia la orquestación.

:::tip[Cuándo usarlo]
Elige Kubernetes cuando necesites **escala horizontal, resiliencia multi-nodo o
integración con un clúster existente**. Para 1 servidor, [Docker Compose](./docker-compose.md)
es más simple.
:::

## Requisitos previos

- Un clúster de **Kubernetes** 1.27+ con acceso a `kubectl`.
- **Helm** 3.9+.
- Un **Postgres** y un **Redis** — gestionados (recomendado) o dentro del clúster.

## Paso a paso

### 1. Prepara los valores

Crea un `values.override.yaml` con lo mínimo para tu entorno:

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

### 2. Instala

```bash
kubectl create namespace centralops
helm install centralops kubernetes/helm/centralops \
  --namespace centralops \
  -f values.override.yaml
```

### 3. Verifica

```bash
kubectl -n centralops rollout status deploy/centralops-api
kubectl -n centralops get pods
kubectl -n centralops port-forward svc/centralops-api 8080:80 &
curl -fsS http://localhost:8080/readyz
```

## Secretos esenciales

Nunca coloques secretos en el `values.yaml`. Crea un Secret y referéncialo:

```bash
kubectl -n centralops create secret generic centralops-secrets \
  --from-literal=APP_MASTER_KEY="<chave-de-32+-caracteres>" \
  --from-literal=DATABASE_URL="postgresql+psycopg2://user:senha@host:5432/centralops"
```

| Clave | Para qué sirve |
|---|---|
| `APP_MASTER_KEY` | Clave maestra de cifrado de los secretos de integración (≥ 32 caracteres). |
| `DATABASE_URL` | Conexión con el Postgres de producción. |
| `POSTGRES_PASSWORD` | Si usas el Postgres in-cluster del chart. |

La referencia completa de variables está en **[Configuración](./configuration.md)**.

## Identidad AWS del servidor {#identidade-aws-do-servidor}

Solo hace falta si vas a usar integraciones AWS. El servidor necesita una identidad de AWS que solo puede asumir los roles de los clientes; [AWS: dar acceso a CentralOps](../integrations/aws-acesso.md#instalação-própria-a-identidade-do-servidor) muestra cómo crearla. La API y todos los workers leen el Secret entero y usan la misma identidad.

- **En EKS, con IRSA o EKS Pod Identity (recomendado):** crea una ServiceAccount vinculada al rol del servidor y apunta el chart a ella. Ninguna clave queda en el clúster.

  ```yaml
  serviceAccount:
    create: false
    name: centralops-aws   # la ServiceAccount con la anotación eks.amazonaws.com/role-arn (IRSA)
  ```

- **Fuera de AWS, con access key:** el Secret que genera el chart no tiene campo para claves AWS. Usa `secrets.existingSecret` y agrega a tu Secret las claves `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` (y, si quieres, `AWS_TRUST_PRINCIPAL_ARN`). Después reinicia los pods, porque las variables solo se leen al arrancar:

  ```bash
  kubectl -n centralops patch secret <tu-secret> --type merge \
    -p '{"stringData":{"AWS_ACCESS_KEY_ID":"AKIA...","AWS_SECRET_ACCESS_KEY":"..."}}'
  kubectl -n centralops rollout restart deployment
  ```

Para comprobarlo, abre una integración AWS nueva: el panel **Acceso por rol de AWS** debe mostrar como principal el ARN de la identidad del servidor.

## Recursos que entrega el chart

- **API + frontend + workers Celery + beat** como Deployments separados (release
  desacoplado de la UI).
- **HPA** para escalar la API/workers por CPU.
- **PodDisruptionBudget** para no derribar todas las réplicas durante el mantenimiento.
- **NetworkPolicies** que restringen el tráfico entre componentes.
- **License keyring** (ConfigMap con claves **públicas**) para verificar la licencia
  Enterprise **offline** — ver **[Ediciones y Upgrade](/centralops/editions/community-vs-enterprise)**.

## Próximos pasos

- **[Configuración](./configuration.md)** — todas las variables de entorno.
- **[Primer Inicio de Sesión](/centralops/getting-started/first-login)** — crear el admin.
- **[Upgrade a Enterprise](../editions/upgrade.md)** — habilitar las funciones MSSP.
