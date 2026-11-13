---
title: Visão geral
slug: /
sidebar_position: 1
description: O que é o SEGARK EDR, como as partes se encaixam e por onde começar.
---

# SEGARK EDR

O SEGARK EDR detecta ataques em servidores, ajuda a investigar o que aconteceu e responde no próprio host: isola, encerra processos, põe arquivos em quarentena. Ele roda inteiro no seu ambiente.

Esta documentação é para quem instala e opera: administradores de sistemas, de redes e equipes de SecOps.

:::warning[Beta]
O SEGARK EDR está em beta, no programa de acesso antecipado. Recursos marcados como **laboratório** vêm desligados por padrão. A página [Versões](https://www.segark.com/releases#edr) mostra a situação de cada recurso.
:::

## As duas partes

| Parte | O que faz | Onde roda |
|---|---|---|
| **Plataforma** | Console web, API e o gateway que recebe os agentes. Guarda alertas, telemetria e a trilha de auditoria. | Um servidor seu, com Docker Compose. |
| **Agente** | Coleta eventos do sistema, aplica as políticas e executa as ações de resposta. | Cada servidor Linux protegido. O agente Windows está em desenvolvimento. |

## Como os dados circulam

- O agente se conecta à plataforma por TLS, na **porta do agente** (padrão `9080`). A plataforma nunca abre conexão até o agente.
- Alertas e telemetria ficam na plataforma, no seu ambiente. A retenção padrão é de 90 dias.
- A plataforma baixa os pacotes do agente e as atualizações de conteúdo de detecção do servidor de distribuição da SEGARK (`dl.segark.com`), autenticada pela sua licença.
- Nada do seu ambiente é enviado à SEGARK, a menos que um administrador ligue o [compartilhamento de inteligência](https://www.segark.com/privacy#inteligencia).

## Licença

Toda instalação usa uma licença SEGARK, inclusive a gratuita, que cobre até 50 endpoints. Crie uma conta em [segark.com](https://www.segark.com), gere a licença no portal e importe no console em **Administração › Licença**.

Passar do limite de assentos só impede que **novos** agentes se registrem. Os agentes já registrados continuam protegidos.

## Por onde começar

1. Confira os [requisitos do servidor](./requisitos/servidor.md) e dos [endpoints](./requisitos/endpoints.md).
2. Libere as [portas e regras de firewall](./rede/portas-e-firewall.md).
3. [Instale a plataforma](./instalacao/plataforma.md) e faça o [primeiro acesso](./instalacao/primeiro-acesso.md).
4. [Instale o agente](./instalacao/agente-linux.md) nos servidores.
