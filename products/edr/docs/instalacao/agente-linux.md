---
title: Instalar o agente Linux
sidebar_position: 3
description: Instalar o agente do SEGARK EDR em servidores Linux com o comando de uma linha gerado no console.
---

# Instalar o agente Linux

O jeito mais simples é o **comando de uma linha** que o console gera. Ele baixa o agente da sua própria plataforma, confere a assinatura e registra o host.

## 1. Gerar o comando

No console, abra **Implantação** (com **Linux** selecionado). Há dois caminhos:

- **Rápido:** no cartão **Instalar o agente no Linux**, clique em **Obter o comando de instalação**. O comando vale por até 30 dias, sem limite de instalações: quem o tiver registra hosts no seu tenant, então trate-o como segredo. Se ele vazar, use **Invalidar todos os comandos já gerados** no mesmo cartão.
- **Personalizado**, para separar lotes por grupo e tags, ou limitar validade e downloads:
  1. Escolha um **token de registro**, ou crie um em **Novo token de registro** (na seção **Tokens de registro (avançado)**).
  2. Abra **Versões, links e opções avançadas de implantação** e, no cartão **Comando personalizado (token, validade e limite)**, dê um nome ao link, escolha a validade (de 1 a 720 horas, padrão 72) e, se quiser, um limite de downloads.
  3. Clique em **Gerar comando de instalação**.

Copie o comando (curl ou wget).

:::caution[O comando aparece uma vez só]
A plataforma guarda só o hash do link. Se perder o comando, gere outro.
:::

![Tela Implantação com o comando de instalação gerado](/img/edr/agente-linux/gerar-comando.png)

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

Em **Implantação**, use **Baixar instalador completo**: um `.sh` autocontido com os pacotes das duas arquiteturas. Copie para o host e rode com `sudo sh`.

## 3. Conferir

```bash
systemctl status 'sensor-*'
sudo /opt/sensor-spl/bin/sensor-installer verify
```

No console, o host aparece em **Dispositivos** como online.

![Lista de dispositivos com os hosts online](/img/edr/agente-linux/dispositivo-online.png)

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
