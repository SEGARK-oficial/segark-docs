---
title: Backup e restauração
sidebar_position: 9
description: Backup cifrado da plataforma, cópia fora do servidor e restauração.
---

# Backup e restauração

O backup leva o banco de dados, a telemetria e a trilha de auditoria, com um manifesto SHA-256. Ele contém dados sensíveis: **sempre cifre e guarde fora do servidor**.

## Preparar a chave (uma vez, fora do servidor)

```bash
./backup/gen-backup-recipient.sh ~/segark-edr-backup-key
```

Copie para o servidor **só** o `backup-recipient.crt`. A chave privada nunca deve ficar no servidor da plataforma.

## Fazer o backup

```bash
./backup/backup.sh --encrypt-to backup-recipient.crt \
    --copy-to backup@cofre.suaempresa.com.br:/srv/segark-edr-backups \
    /var/backups/segark-edr/$(date -u +%Y%m%dT%H%M%SZ)
```

Agende no cron ou num timer do systemd, e anote o SHA-256 que o script imprime num lugar fora do servidor.

## Restaurar

Numa pilha vazia, depois do `migrate`:

```bash
./backup/restore.sh /var/backups/segark-edr/<data>
docker compose run --rm migrate python -m openedr.cli verify-audit
```

O `restore.sh` recusa um backup cujo manifesto não confere. Os agentes retomam a sessão sozinhos, sem novo registro.

:::caution[O que o backup não leva]
O volume de pacotes do agente não entra no backup. Depois de restaurar, a plataforma baixa as versões de novo do servidor de distribuição.
:::
