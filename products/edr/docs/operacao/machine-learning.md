---
title: Machine learning
sidebar_position: 4
description: O modelo de machine learning para executáveis Linux e como ligá-lo com segurança.
---

# Machine learning

:::caution[Laboratório]
O modelo de machine learning vem **desligado**. Ligue primeiro em modo relatório, num grupo piloto.
:::

O SEGARK EDR tem um modelo de machine learning que avalia **executáveis Linux (ELF)** e dá a cada um uma pontuação de risco. Ele complementa as assinaturas e as regras comportamentais: pega variações de malware que ainda não têm assinatura.

- A análise roda no próprio host, em cerca de 1 milissegundo por arquivo.
- Do host saem só atributos numéricos do arquivo, nunca o arquivo, e só se o [compartilhamento de inteligência](https://www.segark.com/privacy#inteligencia) estiver ligado.
- O modelo é atualizado como conteúdo assinado, junto com as regras.

## Ligar em etapas

| Etapa | Modo | O que acontece |
|---|---|---|
| 1 | **Relatório** | O modelo pontua e registra, sem gerar alerta. Use para medir o ruído no seu ambiente. |
| 2 | **Alerta** | Gera alertas com origem `ml`, sem bloquear. Filtre por essa origem na triagem. |
| 3 | **Bloqueio** | Bloqueia o arquivo. Exige a aceitação de prevenção na política. |

Avance de uma etapa para a outra só depois de revisar os resultados da anterior.
