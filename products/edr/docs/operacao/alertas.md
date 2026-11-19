---
title: Alertas
sidebar_position: 1
description: Triagem de alertas no console do SEGARK EDR, o alerta comportamental com a cadeia de eventos e a História do incidente.
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
- **História do incidente**: a árvore do processo com o que cada um fez (veja [abaixo](#história-do-incidente)).

:::info[Captura de tela]
`static/img/edr/alertas/detalhe.png`: um alerta aberto, com a árvore de processos e as ações de resposta.
:::

Para agir sobre o host a partir do alerta, veja [Resposta](./resposta.md).

## Alerta comportamental

Uma regra do [motor comportamental](./deteccao-comportamental.md) promovida a alerta abre uma detecção como as outras. O detalhe dela traz o cartão **Cadeia comportamental**:

- a regra, com o identificador e a versão (`OEDR-BHV-0152 v1`, por exemplo), e o título;
- a gravidade e a confiança;
- o primeiro e o último evento da sequência;
- o pacote de regras do agente;
- a cadeia passo a passo: cada passo com o tipo de evento, o horário, o PID e a evidência (processo, linha de comando, arquivo, destino de rede…).

![Detalhe de um alerta comportamental com o cartão Cadeia comportamental](/img/edr/alertas/cadeia-comportamental.png)

Se o cartão diz **Sem cadeia**, o agente não mandou a cadeia ou a plataforma a recusou por estar inválida. O alerta é mantido do mesmo jeito.

As observações do motor em sombra **não** viram alerta: elas ficam no dispositivo, aba **Eventos**.

### Confiança e gravidade

São duas medidas diferentes, e o console as mostra sempre separadas:

| | O que diz |
|---|---|
| **Gravidade** | O impacto, se a detecção estiver certa. |
| **Confiança** | Quanto a regra tem certeza: baixa, média ou alta. |

Só as regras comportamentais informam confiança. Nas outras detecções o console mostra **confiança não informada**. Na triagem, um alerta de gravidade alta e confiança baixa pede confirmação antes de uma ação drástica.

## História do incidente

A História do incidente junta, numa tela só, o processo da detecção, os ancestrais e os descendentes dele, e o que cada um fez.

Para abrir:

- no detalhe da detecção, botão **História do incidente**;
- na árvore de processos de um dispositivo, no link **História do incidente** de um processo.

É preciso papel de analista ou acima. Cada abertura fica na trilha de auditoria.

![História do incidente com a árvore de processos, os itens de cada processo e a prevalência](/img/edr/investigacao/historia-do-incidente.png)

### O que a tela mostra

- **Cadeia comportamental do alerta**, no topo, quando a detecção é de uma regra comportamental.
- **Processos e o que cada um fez**: a árvore, com o processo investigado marcado. Para cada processo: arquivos, conexões, consultas DNS, detecções e observações do motor em sombra.
- **Prevalência na organização**: em quantos hosts e quantas vezes o mesmo hash, a mesma imagem e a mesma linha de comando apareceram nos últimos 30 dias. Algo visto em um host só merece mais atenção do que algo presente na frota inteira.

Ancestrais mais antigos que a telemetria guardada (um `sshd` de semanas, por exemplo) aparecem a partir da linhagem que o agente registrou no momento da detecção.

### Ligação forte e ligação fraca

Cada item diz como foi ligado ao processo. Não leia uma ligação fraca como prova de causa.

| Marca | Força | Quando |
|---|---|---|
| **guid** | Forte | O evento traz a identidade do processo. Vale para processos, detecções e observações. |
| **PID + janela** | Fraca | O evento traz só o PID: ele é ligado ao processo quando o PID é o mesmo e o horário cai dentro da vida do processo no host. Vale para arquivos, conexões e DNS. |

A marca **executável diferente** num item indica que o executável do evento não é o do processo: provavelmente o PID foi reaproveitado por outro processo que a telemetria não viu.

### Limites e recorte

A história é limitada para continuar rápida. Você ajusta os limites na própria tela:

| Limite | Padrão | Opções |
|---|---|---|
| Níveis de descendentes | 4 | 1, 2, 4 ou 8 |
| Processos no total | 150 | 50, 150 ou 500 |
| Janela (antes e depois do início do processo) | 6 h | 1, 6, 24 ou 72 h |
| Itens por processo e tipo | 20 | 5, 20 ou 100 |

Quando algum limite corta a história, a tela avisa **História recortada pelos limites** e diz o quê: ancestrais além do limite, descendentes abaixo do último nível, processos cortados pelo teto ou listas com mais itens. Aumente o limite indicado para ver o resto.

A história não cruza hosts: movimento lateral entre servidores não aparece nela. Detecções de agentes antigos, sem a identidade do processo, não têm história; nesses casos o console oferece a árvore de processos por PID.
