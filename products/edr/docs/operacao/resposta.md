---
title: Resposta
sidebar_position: 5
description: Isolar hosts, encerrar processos, quarentena e Live Response.
---

# Resposta a incidentes

As ações de resposta são assinadas pela plataforma e conferidas pelo agente antes de executar. Toda ação fica na trilha de auditoria.

## Ações

| Ação | Papel mínimo | Observação |
|---|---|---|
| Isolar host | Resposta | Bloqueia a rede, exceto a plataforma e as redes de gerência configuradas |
| Varrer agora | Resposta | Varredura sob demanda |
| Limpar ameaças | Resposta | |
| Encerrar processo, apagar arquivo, enviar e baixar arquivo | Resposta | |
| Coletar diagnóstico | Resposta | Gera o pacote de diagnóstico do agente |
| Restaurar ou apagar da quarentena | Resposta pede, **um administrador diferente aprova** | Evita que uma só pessoa solte um arquivo malicioso |

Isolar, varrer e atualizar também funcionam em lote, a partir da lista de dispositivos.

:::tip[Antes de isolar um servidor]
Confirme que a rede de onde vocês administram o servidor está nas redes de gerência. Senão, o isolamento também corta o seu SSH.
:::

## Live Response

Um terminal no host, aberto pelo console, sem porta de entrada no endpoint.

- Exige papel de resposta e MFA.
- A sessão é autenticada e **gravada desde a primeira tecla**. A transcrição só aceita acréscimos.

:::info[Captura de tela]
`static/img/edr/resposta/live-response.png`: sessão de Live Response com a gravação ativa.
:::
