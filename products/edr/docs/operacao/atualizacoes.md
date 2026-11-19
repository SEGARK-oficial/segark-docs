---
title: Atualizações
sidebar_position: 7
description: Como o agente e o conteúdo de detecção se atualizam, e como controlar o ritmo.
---

# Atualizações

Há duas coisas que se atualizam, de jeitos diferentes:

| O quê | Como |
|---|---|
| **Conteúdo de detecção** (regras, assinaturas, modelos) | Sempre automático. É assinado e conferido pelo agente. |
| **Versão do agente** | Automática por padrão, controlável por **anéis de atualização**. |

## Anéis de atualização

Use anéis para que uma versão nova chegue primeiro a poucos servidores:

1. Um anel **piloto** com servidores de homologação recebe a versão primeiro.
2. Depois de um período sem problemas, o anel seguinte recebe.
3. Os servidores críticos ficam no último anel.

Os anéis ficam em **Plataforma › Versões do agente**, cartão **Anéis de atualização**. Para pôr um grupo de dispositivos num anel, use o cartão **Anéis de atualização por grupo**, em **Implantação** (com **Linux** selecionado), dentro de **Versões, links e opções avançadas de implantação**: instalações novas do grupo já nascem no anel. O anel de cada host aparece no dispositivo, aba **Diagnóstico**, e pode ser trocado ali; o anel do próprio host vence o do grupo.

Para forçar um host a atualizar agora, use **Atualizar agora** no dispositivo ou em lote.

A plataforma baixa as versões novas do servidor de distribuição da SEGARK com a sua licença. Se a licença expirar, os agentes continuam protegendo com o que já têm, mas param de receber versões novas.

![Anéis de atualização com a versão do agente de cada anel](/img/edr/atualizacoes/aneis.png)
