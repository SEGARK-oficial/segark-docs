---
title: Requisitos dos endpoints
sidebar_position: 2
description: Distribuições, kernels e arquiteturas suportados pelo agente do SEGARK EDR.
---

# Requisitos dos endpoints

## Linux

| Item | Requisito |
|---|---|
| Arquitetura | `x86_64` ou `aarch64` |
| Init | systemd como PID 1 |
| Biblioteca C | glibc 2.17 ou mais nova (musl, como no Alpine, não é suportado) |
| Kernel | 4.18 ou mais novo, **com BTF** (`/sys/kernel/btf/vmlinux`) |
| Recomendado | nftables e cgroup v2, para o isolamento de rede |
| Disco | 2 GB livres para o agente |
| Acesso | `root` ou `sudo` para instalar |

O sensor usa eBPF: não há módulo de kernel para compilar, e o agente continua funcionando quando o kernel é atualizado.

### Distribuições

| Situação | Distribuições |
|---|---|
| Testadas | Ubuntu 22.04, 24.04 e 26.04 · Debian 11 e 12 · Rocky Linux 9 · Amazon Linux 2023 · openSUSE Leap 15.6 · Proxmox VE |
| Testadas, com restrições | Ubuntu 20.04 · Rocky Linux 8 |
| Não testadas (compatíveis em binário com o Rocky Linux) | Red Hat Enterprise Linux 8 e 9 |
| Não suportadas | Debian 10 · CentOS/RHEL 7 |

Os testes são manuais e não são certificação. Nenhuma distribuição `aarch64` foi testada ainda.

### Kernel sem BTF

Sem BTF o instalador para com o código `39` e não instala nada. Você pode:

1. atualizar para um kernel com BTF (o caminho recomendado);
2. fornecer o arquivo BTF do kernel exato com `SENSOR_BTF_PATH=/caminho/arquivo`;
3. instalar sem o sensor eBPF com `--allow-degraded`. Nesse modo o agente tem visibilidade reduzida.

## Windows

O agente Windows está em desenvolvimento e ainda não tem versão publicada. Veja [Agente Windows](../instalacao/agente-windows.md).
