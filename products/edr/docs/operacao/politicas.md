---
title: Políticas
sidebar_position: 2
description: Como as políticas de proteção funcionam, os padrões seguros e como mudar com segurança.
---

# Políticas de proteção

A política define o que o agente detecta, o que bloqueia e o que coleta. Ela é assinada pela plataforma antes de chegar ao host: o agente não aceita política adulterada.

## Padrões seguros

Toda política nova parte destes valores:

| Proteção | Padrão |
|---|---|
| Varredura em tempo real | Ligada |
| Bloquear arquivo malicioso no acesso | Ligado |
| Encerrar processo de regra comportamental | Ligado |
| Anti-ransomware | Bloqueio, com restauração dos arquivos ([detalhes](./anti-ransomware.md)) |
| Autoproteção do agente | Bloqueia alterações nos arquivos e processos do agente |
| Desinstalação | Exige token de manutenção |
| Reputação na nuvem | Ligada (só o SHA-256 do arquivo sai do host) |
| Isolamento automático em detecção | **Desligado**: isolar um servidor por falso positivo o tira da rede |
| Varredura agendada | **Desligada**: em servidores, a varredura em tempo real já cobre os arquivos em uso |
| Machine learning | **Desligado** ([detalhes](./machine-learning.md)) |

O formulário marca cada campo como **Recomendado** ou **Não recomendado**, e avisa quando uma mudança enfraquece a proteção.

## Mudar com segurança

1. **Crie um grupo piloto** de alguns servidores e uma política só para ele.
2. Para validar regras novas, use o modo **auditoria** (só alerta) nessa política.
3. Acompanhe os alertas por alguns dias e crie **exclusões** para o que for legítimo.
4. Volte ao modo de bloqueio e só então estenda para os outros grupos.

:::note[Quatro olhos]
Mudanças arriscadas, como desligar o anti-ransomware ou incluir exclusões, só são publicadas depois que **um segundo administrador** aprova.
:::

:::info[Captura de tela]
`static/img/edr/politicas/formulario.png`: formulário da política com os selos Recomendado e Não recomendado.
:::
