---
title: Requisitos dos endpoints
sidebar_position: 2
description: Distribuições, kernels e arquiteturas suportados pelo agente do SEGARK EDR, e o que muda nos kernels antigos.
---

# Requisitos dos endpoints

## Linux

| Item | Requisito |
|---|---|
| Arquitetura | `x86_64` ou `aarch64` |
| Init | systemd como PID 1 |
| Biblioteca C | glibc 2.17 ou mais nova (musl, como no Alpine, não é suportado) |
| Kernel | 4.18 ou mais novo, **com BTF** (`/sys/kernel/btf/vmlinux`) |
| Recomendado | kernel 5.11 ou mais novo, cgroup v2 e nftables (veja [restrições nos kernels antigos](#restrições-medidas-em-kernels-antigos)) |
| Disco | 2048 MiB livres no sistema de arquivos do `/opt`. O instalador confere e para se faltar espaço |
| Acesso | `root` ou `sudo` para instalar |

O sensor usa eBPF: não há módulo de kernel para compilar, e o agente continua funcionando quando o kernel é atualizado.

Para conferir um host antes de instalar:

```bash
uname -r -m                          # kernel e arquitetura
ls -l /sys/kernel/btf/vmlinux        # BTF presente?
stat -fc %T /sys/fs/cgroup           # cgroup2fs = cgroup v2; tmpfs = v1 ou híbrido
df -m /opt                           # espaço livre no /opt, em MiB
```

### Distribuições

| Situação | Distribuições |
|---|---|
| Testadas (`x86_64`) | Ubuntu 22.04, 24.04 e 26.04 · Debian 11 e 12 · Rocky Linux 9 · Amazon Linux 2023 · openSUSE Leap 15.6 · Proxmox VE |
| Testadas (`aarch64`) | Ubuntu 24.04 |
| Testadas, com restrições | Ubuntu 20.04 · Red Hat Enterprise Linux 8.10 · Rocky Linux 8 |
| Não testadas | Red Hat Enterprise Linux 9 (compatível em binário com o Rocky Linux 9) · outras distribuições `aarch64` |
| Não suportadas | Debian 10 · CentOS/RHEL 7 |

Os testes são manuais e não são certificação.

### Restrições medidas em kernels antigos

Medido com o agente atual, em host real: Red Hat Enterprise Linux 8.10 (kernel 4.18) e Ubuntu 20.04 (kernel 5.4). O Rocky Linux 8 usa o mesmo kernel do RHEL 8: planeje com as mesmas restrições.

Nos dois sistemas o agente instala e o [motor comportamental](../operacao/deteccao-comportamental.md) roda em sombra e alerta. O que fica de fora:

| | RHEL 8.10 / Rocky Linux 8 (4.18) | Ubuntu 20.04 (5.4) |
|---|---|---|
| Eventos de arquivo e de montagem do sensor | **Não**: o kernel abaixo de 5.11 não tem o recurso que o sensor usa | **Não**, pelo mesmo motivo |
| Rede no sensor | **Reduzida**: com o cgroup v1, padrão do RHEL 8, os ganchos de rede por cgroup não anexam | **Reduzida**: com o cgroup híbrido, padrão do Ubuntu 20.04, os mesmos ganchos não anexam |
| Efeito na detecção | As regras que dependem da conexão TCP, como as de shell reverso, não disparam. A coleta de DNS e de TLS por esses ganchos fica de fora | Igual. Também ficam de fora a captura de TLS em IPv6 e uma das detecções de alteração de arquivo |
| Autoproteção do agente | **Reduzida**: na medição, o bloqueio no kernel não carregou neste kernel. O agente só bloqueia a escrita comum nos próprios arquivos; o resto (sinais, parada, injeção) gera alerta, sem bloqueio | **Reduzida**, igual: o kernel 5.4 não tem como negar a adulteração |
| Disco | Algumas imagens de nuvem do RHEL 8 deixam o `/` com 2 GB no LVM, e o `/opt` fica nele: o instalador reprova por falta de espaço. Amplie o volume antes de instalar | — |

Há correções em andamento para os eventos de arquivo e de montagem e para a rede no cgroup híbrido. Esta página muda quando elas saírem numa versão.

Para ver quantos programas do sensor subiram num host, veja [Cobertura do sensor](../solucao-de-problemas/agente-linux.md#cobertura-do-sensor).

### Kernel sem BTF

Sem BTF o instalador para com o código `39` e não instala nada. Você pode:

1. atualizar para um kernel com BTF (o caminho recomendado);
2. fornecer o arquivo BTF do kernel exato com `SENSOR_BTF_PATH=/caminho/arquivo`;
3. instalar sem o sensor eBPF com `--allow-degraded`. Nesse modo o agente tem visibilidade reduzida.

## Windows

O agente Windows está em **pré-release**: as versões de pré-lançamento trazem o instalador MSI, mas não há versão estável, e a proteção em kernel ainda não está disponível. Somente x64. Veja [Agente Windows](../instalacao/agente-windows.md).
