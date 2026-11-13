---
title: Requisitos do servidor
sidebar_position: 1
description: O que o servidor da plataforma do SEGARK EDR precisa ter antes da instalação.
---

# Requisitos do servidor da plataforma

A plataforma roda em **um servidor Linux com Docker Compose**. Uma instalação atende uma empresa: cada empresa tem a própria pilha, com dados, chaves e certificados separados.

## Software

| Item | Requisito |
|---|---|
| Sistema operacional | Linux de 64 bits com Docker Engine. |
| Orquestração | Docker Compose v2 (o comando `docker compose`). Kubernetes e Helm não são suportados. |
| Nome DNS | Um nome que os agentes resolvam para o servidor, por exemplo `edr.suaempresa.com.br`. O certificado do gateway é emitido para ele. |
| Hora | Relógio sincronizado por NTP. Os agentes recusam diferenças maiores que 5 minutos. |
| Saída para a internet | HTTPS (443) até `dl.segark.com`, para baixar pacotes do agente e conteúdo de detecção. Veja [Portas e firewall](../rede/portas-e-firewall.md). |

## O que roda no servidor

| Serviço | Função | Limite de memória |
|---|---|---|
| PostgreSQL 15 | Cadastro de dispositivos, usuários, políticas, ações e auditoria | 2 GB |
| ClickHouse 24.3 | Telemetria e alertas (data lake) | 4 GB |
| Gateway | Recebe os agentes | 1 GB (2 vCPUs) |
| API | Atende o console | 768 MB (1 vCPU) |
| Assinador | Assina políticas, ações e atualizações | 256 MB |
| nginx, relay, sincronização de versões | Borda TLS e serviços de apoio | 256 MB cada |

Os limites de memória somam cerca de **9 GB**, sem contar o sistema operacional.

## Dimensionamento

:::caution[Em validação]
Ainda não publicamos números oficiais de CPU, memória e disco por tamanho de frota. O teste de carga interno mostrou que, acima de cerca de 9.000 linhas de telemetria por segundo, a latência de gravação passa de 1 segundo. Meça no seu hardware antes de dimensionar para produção.
:::

| Frota | vCPU | RAM | Disco (90 dias de retenção) |
|---|---|---|---|
| Piloto, até 50 endpoints | _a definir_ | _a definir_ | _a definir_ |
| Até 500 endpoints | _a definir_ | _a definir_ | _a definir_ |

Use disco SSD para o volume do ClickHouse e deixe o volume de backups em outro disco.

## Antes de seguir

- [ ] Servidor com Docker e Compose v2
- [ ] Nome DNS do gateway criado
- [ ] NTP funcionando
- [ ] Saída HTTPS para `dl.segark.com` liberada
- [ ] Licença gerada no portal da SEGARK
