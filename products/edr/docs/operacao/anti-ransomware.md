---
title: Anti-ransomware
sidebar_position: 3
description: Como o SEGARK EDR detecta e contém ransomware, e o que fazer depois de um alerta.
---

# Anti-ransomware

O anti-ransomware reconhece um programa, ou um cliente de compartilhamento de rede (SMB/Samba), cifrando ou destruindo arquivos em sequência. Ele usa o padrão de alteração dos arquivos e **arquivos-isca** espalhados em pastas que um ransomware costuma varrer.

## Modos

| Modo | O que acontece |
|---|---|
| **Desligado** | Nada. |
| **Auditoria** | Gera o alerta, sem interromper. Use em grupos piloto ou para programas legítimos que reescrevem muitos arquivos, até criar a exclusão. |
| **Bloqueio** (padrão) | Contém o ataque e, com a restauração ligada, desfaz as alterações a partir das cópias guardadas antes de cada mudança. |

No Linux, a restauração cobre **só dados de usuário**: nunca caminhos do sistema e nunca arquivos escritos por gerenciador de pacotes. Agentes antigos recebem o modo auditoria, sem restauração, até serem atualizados.

## Depois de um alerta

O alerta tem severidade alta e técnica MITRE ATT&CK T1486. No alerta, um analista com papel de resposta pode:

- **Refazer a restauração**, se algum arquivo não voltou;
- **Liberar** o programa, quando era legítimo (e então criar a exclusão na política).

Essas ações estão disponíveis para hosts Linux.

## Exclusões

Programas de backup e de compactação podem parecer ransomware. Exclua pelo caminho ou pela impressão digital (SHA-256) do executável na política. Incluir exclusão exige aprovação de um segundo administrador.

:::info[Captura de tela]
`static/img/edr/anti-ransomware/alerta.png`: alerta de criptografia em massa com as ações Refazer restauração e Liberar.
:::
