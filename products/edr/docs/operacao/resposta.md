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

## Resposta automática

Além das ações que você pede pelo console, o agente pode agir sozinho. Cada tipo tem o próprio controle na política:

| Resposta automática | Onde se controla | Padrão |
|---|---|---|
| Encerrar o processo que abriu ou executou um arquivo malicioso | Seção **Varredura em tempo real (on-access)** | Ligada |
| Encerrar o processo pelas regras de detecção do sensor Linux (por exemplo, shell reverso) | Seção **Resposta automática do sensor**: **Executar as ações de encerramento das regras** e **Encerrar de verdade** (desligado = só registra) | Ligada |
| Isolar o dispositivo numa detecção | Seção **Resposta automática do sensor** | **Desligada** |
| Encerrar o processo de uma regra do motor comportamental | Aba **Resposta automática** da política | **Desligada** e em dry-run |

As três primeiras dependem da **Prevenção ativa (aceite do cliente)**: sem ela, as detecções só geram alertas.

A resposta do motor comportamental tem trava global, dry-run, teto por minuto e permissão por regra e versão, e **nesta versão não executa nenhuma ação**: em dry-run ela só registra o que faria. Veja [Detecção comportamental](./deteccao-comportamental.md#4-resposta-automática).

## Live Response

Um terminal no host, aberto pelo console, sem porta de entrada no endpoint.

- Exige papel de resposta e MFA.
- A sessão é autenticada e **gravada desde a primeira tecla**. A transcrição só aceita acréscimos.

![Sessão de Live Response gravada e auditada](/img/edr/resposta/live-response.png)
