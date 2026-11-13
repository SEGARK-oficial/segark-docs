---
title: Portas e firewall
sidebar_position: 3
description: Matriz de portas da plataforma e dos agentes do SEGARK EDR, com exemplos de regras de firewall.
---

# Portas e regras de firewall

A regra geral: **os agentes sempre iniciam a conexão**. A plataforma não abre conexões até os endpoints, e o banco de dados nunca fica exposto.

## Matriz de portas

| Porta | Protocolo | Origem → destino | Para quê | Expor? |
|---|---|---|---|---|
| `9080` | TCP · TLS | Agentes → plataforma | Registro, telemetria, políticas, ações, atualizações do agente e o instalador de uma linha | **Sim**, para a rede dos endpoints |
| `9443` | TCP · TLS | Navegador do analista → plataforma | Console web e API | Por padrão só em `127.0.0.1`. Veja abaixo |
| `443` | TCP · HTTPS | Plataforma → `dl.segark.com` | Pacotes do agente e conteúdo de detecção | Saída |
| `123` | UDP · NTP | Plataforma e agentes → seu servidor NTP | Hora sincronizada | Saída |
| `5432` | TCP | Interna | PostgreSQL | **Nunca**. Fica numa rede interna do Docker |
| `8123` | TCP | Interna | ClickHouse | **Nunca** |
| `3000` | TCP | Local | Grafana (opcional, pacote de observabilidade) | Só `127.0.0.1` |

Os números `9080` e `9443` são os padrões e podem ser trocados no `.env` (`OPENEDR_AGENT_PORT` e `OPENEDR_CONSOLE_PORT`).

### Acesso ao console

O console escuta só em `127.0.0.1:9443`. Para acessar de outra máquina, escolha uma das opções:

- **Túnel SSH** (recomendado para começar): `ssh -L 9443:127.0.0.1:9443 usuario@servidor-edr` e abra `https://localhost:9443`.
- **Rede de administração**: defina `OPENEDR_CONSOLE_BIND=0.0.0.0` no `.env` e restrinja a porta `9443` no firewall à rede dos analistas ou à VPN.

Nunca publique o console na internet sem uma camada de controle de acesso à frente.

### Rede local com satélites (opcional)

Em filiais com link limitado, um endpoint pode atuar como satélite e repassar tráfego e atualizações aos vizinhos:

| Porta | Serviço | Origem → destino |
|---|---|---|
| `8444` | Relay | Agentes da filial → satélite |
| `8443` | Cache de atualizações | Agentes da filial → satélite |

## Exemplos de regras no servidor da plataforma

Troque `10.0.0.0/8` pela rede dos seus endpoints e `10.20.0.0/24` pela rede dos analistas.

### ufw (Ubuntu, Debian)

```bash
sudo ufw allow from 10.0.0.0/8 to any port 9080 proto tcp comment 'SEGARK EDR agentes'
# só se o console estiver exposto (OPENEDR_CONSOLE_BIND=0.0.0.0):
sudo ufw allow from 10.20.0.0/24 to any port 9443 proto tcp comment 'SEGARK EDR console'
```

### firewalld (Rocky, RHEL, openSUSE)

```bash
sudo firewall-cmd --permanent --new-zone=edr-agentes
sudo firewall-cmd --permanent --zone=edr-agentes --add-source=10.0.0.0/8
sudo firewall-cmd --permanent --zone=edr-agentes --add-port=9080/tcp
sudo firewall-cmd --reload
```

:::caution[Docker e firewall do host]
O Docker escreve as próprias regras de NAT e pode publicar portas por fora do ufw e do firewalld. Confira com `sudo nft list ruleset` (ou `iptables -L DOCKER-USER`) e, se precisar restringir origens, use a cadeia `DOCKER-USER`.
:::

## Nos endpoints

O agente só precisa de **saída** TCP até a plataforma, na porta do agente. Nenhuma porta de entrada é aberta no endpoint.

Quando um host é **isolado**, o agente bloqueia todo o tráfego, exceto o da plataforma e o das redes de gerência configuradas (`OPENEDR_ISOLATION_MANAGEMENT_CIDRS`). Inclua aí a rede de onde vocês administram os servidores, para não perder o SSH durante um isolamento.

## Proxy e inspeção TLS

O agente fixa a chave pública do certificado do gateway (pinning). Um proxy que intercepta TLS entre o agente e a plataforma quebra a conexão: libere o tráfego da porta do agente sem inspeção.
