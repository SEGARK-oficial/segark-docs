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
| Prevenção ativa (aceite do cliente) | Ligada: sem ela, o bloqueio no acesso e o encerramento de processos viram só alerta (modo detecção) |
| Varredura em tempo real | Ligada |
| Bloquear arquivo malicioso no acesso | Ligado |
| Encerrar o processo pelas regras de detecção do sensor Linux (por exemplo, shell reverso) | Ligado |
| [Motor comportamental](./deteccao-comportamental.md) | **Desligado**, inclusive a resposta automática dele (veja abaixo) |
| Anti-ransomware | Bloqueio, com restauração dos arquivos ([detalhes](./anti-ransomware.md)) |
| Autoproteção do agente | Bloqueia alterações nos arquivos e processos do agente (reduzida em kernels antigos: veja os [requisitos](../requisitos/endpoints.md#restrições-medidas-em-kernels-antigos)) |
| Desinstalação | Exige token de manutenção |
| Reputação na nuvem | Ligada (só o SHA-256 do arquivo sai do host) |
| Isolamento automático em detecção | **Desligado**: isolar um servidor por falso positivo o tira da rede |
| Varredura agendada | **Desligada**: em servidores, a varredura em tempo real já cobre os arquivos em uso |
| Machine learning | **Desligado** ([detalhes](./machine-learning.md)) |

O formulário marca cada campo como **Recomendado** ou **Não recomendado**, e avisa quando uma mudança enfraquece a proteção.

:::note[Duas respostas automáticas diferentes]
A linha **Encerrar o processo pelas regras de detecção do sensor** fala das regras de detecção do sensor Linux, na seção **Resposta automática do sensor** da política. A resposta do motor comportamental é outra coisa: fica na aba **Resposta automática** da política e vem com a trava desligada e em dry-run. Nesta versão ela não executa nenhuma ação.
:::

## Motor comportamental na política

A política **Proteção contra ameaças** controla o motor comportamental em três lugares:

| Onde | O que controla | Padrão |
|---|---|---|
| Aba **Configurações**, seção **Motor comportamental (modo sombra)** | Modo do motor (desligado ou sombra) e as regras desligadas (kill-switch) | Desligado, nenhuma regra desligada |
| Aba **Promoção a alerta** | Quais regras, em qual versão, viram alerta | Nenhuma |
| Aba **Resposta automática** | Trava, dry-run, teto por minuto e permissão por regra | Trava desligada, dry-run ligado, teto de 5 por minuto, nenhuma permissão |

O passo a passo de cada uma está em [Detecção comportamental](./deteccao-comportamental.md).

## Mudar com segurança

1. **Crie um grupo piloto** de alguns servidores e uma política só para ele.
2. Para validar regras novas, use o modo **auditoria** (só alerta) nessa política.
3. Acompanhe os alertas por alguns dias e crie **exclusões** para o que for legítimo.
4. Volte ao modo de bloqueio e só então estenda para os outros grupos.

:::note[Quatro olhos]
Com **Exigir aprovação de um segundo administrador** ligado (cartão **Publicação de políticas**), as mudanças arriscadas, como desligar o anti-ransomware, incluir exclusões ou ligar a resposta automática do motor comportamental, só são publicadas depois que **outro administrador** aprova. A opção vem desligada: ligue-a se a sua empresa exige quatro olhos. Ligada ou não, toda mudança fica na auditoria com quem, quando e o que mudou.
:::

![Formulário da política com os selos Recomendado e Não recomendado](/img/edr/politicas/formulario.png)
