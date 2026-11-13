---
title: Instalar o agente Linux
sidebar_position: 3
description: Instalar o agente do SEGARK EDR em servidores Linux com o comando de uma linha gerado no console.
---

# Instalar o agente Linux

O jeito mais simples é o **comando de uma linha** que o console gera. Ele baixa o agente da sua própria plataforma, confere a assinatura e registra o host.

## 1. Gerar o comando

1. No console, abra **Instalação**.
2. Escolha um **token de registro**. O padrão serve para começar. Para separar lotes por grupo, tags ou validade, crie um em **Novo token de registro**.
3. Em **Gerar comando de instalação**, dê um nome ao link e escolha a validade (de 1 a 720 horas, padrão 72) e, se quiser, um limite de downloads.
4. Copie o comando (curl ou wget).

:::caution[O comando aparece uma vez só]
A plataforma guarda só o hash do link. Se perder o comando, gere outro.
:::

:::info[Captura de tela]
`static/img/edr/agente-linux/gerar-comando.png`: tela Instalação com o comando gerado.
:::

## 2. Rodar no servidor

Cole o comando num terminal com `sudo`. Para testar antes sem mudar nada, acrescente `--dry-run` depois de `"$F"`:

```bash
... && sudo sh "$F" --dry-run; ...
```

O script confere o sistema (arquitetura, systemd, glibc, kernel, espaço em disco), valida a assinatura do pacote, instala e espera até 90 segundos pelo registro.

Cada download carrega uma credencial de uso único: **rode o comando em cada host**, não copie o arquivo baixado para outros.

| Opção | Efeito |
|---|---|
| `--dry-run` | Baixa e confere tudo, sem instalar |
| `--no-start` | Instala sem iniciar o agente |
| `--force` | Reinstala |
| `--reconfigure` | Reescreve a configuração local do agente |
| `--allow-degraded` | Instala sem o sensor eBPF em kernel sem suporte |

### Hosts sem acesso ao gateway na instalação

Em **Instalação**, use **Baixar instalador completo**: um `.sh` autocontido com os pacotes das duas arquiteturas. Copie para o host e rode com `sudo sh`.

## 3. Conferir

```bash
systemctl status 'sensor-*'
sudo /opt/sensor-spl/bin/sensor-installer verify
```

No console, o host aparece em **Dispositivos** como online.

:::info[Captura de tela]
`static/img/edr/agente-linux/dispositivo-online.png`: o novo host na lista de dispositivos.
:::

## O que fica no host

| Item | Caminho |
|---|---|
| Binários | `/opt/sensor-spl/bin` |
| Configuração | `/etc/sensor-spl/` (`agentd.json`, `updater.json`, `isolation.json`) |
| Estado | `/var/lib/sensor-spl/` |
| Logs | `journalctl -u 'sensor-*'` e `/var/log/sensor-spl` |
| Serviços | `sensor-agentd`, `sensor-ebpf`, `sensor-fanotify`, `sensor-responder`, `sensor-isolation`, `sensor-updater` |

## Desinstalar

```bash
sudo /opt/sensor-spl/bin/sensor-installer uninstall          # para os serviços, libera o isolamento e avisa a plataforma
sudo /opt/sensor-spl/bin/sensor-installer uninstall --purge  # também apaga configuração, estado e logs
```

A proteção contra adulteração exige um **token de manutenção**, emitido no console para aquele host. Isso impede que alguém com acesso ao servidor remova o agente sem deixar rastro.

Se a instalação falhar, veja [Solução de problemas do agente](../solucao-de-problemas/agente-linux.md).
