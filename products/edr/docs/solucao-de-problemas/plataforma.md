---
title: Plataforma
sidebar_position: 2
description: Saúde dos serviços, logs e problemas comuns da plataforma do SEGARK EDR.
---

# Solução de problemas: plataforma

## Saúde dos serviços

```bash
docker compose ps
curl -sk https://127.0.0.1:9443/api/health/ready     # API
```

| Verificação | O que indica |
|---|---|
| `/health/ready` (gateway, dentro da rede do Docker) | PostgreSQL acessível. Agentes conseguem se registrar e receber ações |
| `/health/ready/datalake` (gateway, dentro da rede do Docker) | ClickHouse acessível. Telemetria está sendo gravada |
| `/api/health/ready` (API) | Console funcionando |

## Logs

```bash
docker compose logs --tail 200 gateway
docker compose logs --tail 200 api
```

Os logs são JSON, uma linha por evento, com um identificador de requisição. Senhas e tokens aparecem mascarados.

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Um serviço não sobe e o log cita um segredo | Segredo ausente, curto ou de exemplo no `.env` | Gere de novo com `gen-secrets` e reinicie |
| Agentes recebem erro 503 | ClickHouse fora do ar ou sem disco | Os agentes guardam a fila por até 14 dias: nada se perde. Libere disco e confira `docker compose logs clickhouse` |
| Console fora, agentes funcionando | Só a API caiu | `docker compose logs api` e `docker compose up -d api` |
| Agentes não atualizam | Saída para `dl.segark.com` bloqueada ou licença expirada | Teste a saída HTTPS e confira **Administração › Licença** |
| Ninguém consegue entrar depois de restaurar | `OPENEDR_MFA_KEY` diferente do original | Restaure o `.env` do cofre. Sem a chave, todos recadastram o MFA |

## Antes de chamar o suporte

Junte a saída de `docker compose ps`, as últimas 200 linhas de log do serviço com problema e, se for um agente, o pacote do `sensor-diagnose`. Escreva para support@segark.com.
