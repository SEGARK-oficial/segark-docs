---
title: Alertas
sidebar_position: 1
description: Triagem de alertas no console do SEGARK EDR.
---

# Alertas

Cada detecção vira um alerta em **Detecções**, ordenado por severidade.

## Ciclo de um alerta

| Status | Quando usar |
|---|---|
| **Novo** | Ninguém olhou ainda. |
| **Em investigação** | Alguém assumiu. Atribua a você para a equipe saber. |
| **Resolvido** | A ameaça foi tratada. |
| **Falso positivo** | Não era ameaça. Considere uma exclusão na política, para não se repetir. |

Dá para mudar status e responsável de vários alertas de uma vez, e deixar notas em cada um.

## O que olhar em um alerta

- **Árvore de processos**: quem iniciou o quê, até o processo detectado.
- **Linha do tempo do dispositivo**: o que aconteceu no host antes e depois.
- **Eventos relacionados**: arquivos, conexões e DNS ligados à detecção.
- **Origem da detecção**: regra comportamental, antivírus, reputação, anti-ransomware ou machine learning. Filtre por origem para separar, por exemplo, o que o modelo de ML marcou.

:::info[Captura de tela]
`static/img/edr/alertas/detalhe.png`: um alerta aberto, com a árvore de processos e as ações de resposta.
:::

Para agir sobre o host a partir do alerta, veja [Resposta](./resposta.md).
