---
title: Detecção comportamental
sidebar_position: 3
description: Ligar o motor comportamental em sombra, promover regras a alerta, desligar uma regra e configurar a resposta automática com segurança.
---

# Detecção comportamental

O motor comportamental reconhece **sequências** de ações suspeitas num host, e não um evento isolado. Exemplo: um arquivo baixado, tornado executável e executado em seguida. Cada regra tem um identificador (`OEDR-BHV-0152`, por exemplo), uma versão, uma gravidade e uma confiança. As regras vêm num pacote assinado, junto com o agente.

O motor roda no próprio host, no sensor do agente Linux. O agente Windows também traz o motor, mas está em pré-release (veja [Agente Windows](../instalacao/agente-windows.md)).

:::info[Nada liga sozinho]
O motor vem **desligado** em toda política. Cada etapa abaixo é uma decisão sua, tomada por política, e começa por um grupo piloto.
:::

## As etapas

| Etapa | No host | No console |
|---|---|---|
| **Desligado** (padrão) | Nada é avaliado. | Nada. |
| **Sombra** | O motor avalia todas as regras e relata cada sequência que fecha. Não alerta e não faz nada no host. | Observações no dispositivo, para medir o ruído de cada regra. |
| **Alerta** | Só as regras que você promoveu, cada uma numa versão. As demais continuam em sombra. | Detecções em **Detecções**, com a cadeia de eventos ([Alertas](./alertas.md#alerta-comportamental)). |
| **Resposta automática** | Encerrar o processo, só para regras em alerta com permissão. **Nesta versão nenhuma ação é executada** (veja [abaixo](#4-resposta-automática)). | Contadores de propostas e recusas por dispositivo. |

## 1. Ligar a sombra num grupo piloto

1. Crie um grupo piloto com alguns servidores e uma política **Proteção contra ameaças** só para ele.
2. Na aba **Configurações** da política, seção **Motor comportamental (modo sombra)**, mude **Modo** para **Sombra**.
3. Crie a versão e publique. O agente recebe na próxima política aplicada e liga o motor sem reiniciar.

Ligar a sombra não é mudança arriscada: ela só observa, então não espera um segundo administrador.

Para acompanhar, abra o dispositivo, aba **Eventos**, cartão **Motor comportamental (modo sombra)**. Ele mostra:

- o aviso "Modo sombra: só observação";
- a saúde do motor: modo efetivo e da política, regras carregadas e desligadas, eventos descartados, falhas;
- a contagem de observações por regra no período (clique na regra para filtrar);
- cada observação com regra, gravidade, confiança, ATT&CK e a cadeia passo a passo.

![Cartão do motor comportamental no dispositivo, com a contagem por regra e uma observação aberta](/img/edr/comportamental/dispositivo.png)

Cada host envia no máximo 60 observações por minuto, e 10 por regra. O que passar disso é contado como descartado, sem calar as outras regras.

:::tip[Quanto tempo medir]
Deixe a sombra rodar pelo menos uma semana no piloto, com a carga normal dos servidores, antes de promover qualquer regra.
:::

## 2. Desligar uma regra ruidosa

Para calar uma regra sem esperar pacote novo, use o campo **Regras desligadas (kill-switch)** da mesma seção da política. Informe os identificadores, um por item:

```text
OEDR-BHV-0103
```

A regra para de avaliar e de emitir na próxima política aplicada; nas outras regras nada muda. O desligamento vale sobre tudo: uma regra no kill-switch não alerta nem responde, mesmo promovida. Como a sombra, essa mudança não espera um segundo administrador.

Um identificador que o pacote do agente não tem é aceito e aparece contado no cartão do dispositivo.

## 3. Promover uma regra a alerta

A promoção é feita por regra **e por versão**, a partir da medição da sombra. Só administradores promovem.

1. Abra a política **Proteção contra ameaças**, aba **Promoção a alerta**.
2. Importe o relatório de medição da sombra (`sombra.json`), ou cole o conteúdo dele, e clique em **Validar proposta**. O relatório traz a evidência por regra e a proposta.
3. Revise a tabela **Evidência por regra**: versão medida, observações, hosts distintos, observações por host por dia (o falso positivo), resultado em laboratório e revisão humana.
4. A plataforma confere a proposta com a sua frota. Uma regra fica **bloqueada** quando os dispositivos informam outra versão dela, quando ela está no kill-switch desta política ou já está em alerta na mesma versão. Com o motor desligado na política, todas ficam bloqueadas. Avisos que não bloqueiam: regra sem observação recente, pacote medido que nenhum dispositivo da política usa, medição com mais de 14 dias.
5. Marque as regras que você aceita. Para cada regra proposta que deixar de fora, escreva o motivo: ele vai para a auditoria.
6. Clique em **Ver a diferença da nova versão**, confira o antes e o depois, escreva a nota e crie a versão (fica em rascunho).
7. Publique a versão no passo seguinte. Os dispositivos da política passam a alertar por essas regras na próxima política aplicada.

![Tela de promoção a alerta, com a evidência por regra e a diferença da nova versão](/img/edr/comportamental/promocao.png)

A promoção muda só as regras aceitas: o modo do motor e o kill-switch da política continuam como estavam. Cada promoção fica na auditoria com quem, quando, a versão criada e a de partida, o SHA-256 do arquivo importado e as regras aceitas, recusadas e bloqueadas.

### Quando uma regra muda de versão

O alerta vale para a regra **na versão promovida**. Quando um pacote novo traz outra versão dela, o agente a devolve à sombra sozinho, até você promover a versão nova com uma medição nova. A regra também perde a permissão de resposta.

O cartão do dispositivo mostra isso em **Regras em alerta / com modo noutra versão**: um número maior que zero na segunda parte indica regra promovida que voltou à sombra.

## 4. Resposta automática

Na aba **Resposta automática** da mesma política você configura a resposta do motor comportamental. Ela só vale para regras **já em alerta** na versão em vigor da política.

| Controle | Padrão | O que faz |
|---|---|---|
| **Trava global** | Desligada | Sem ela, nenhuma regra responde. |
| **Dry-run** | Ligado | O agente só registra o que faria. |
| **Teto de ações por minuto** | 5 | De 1 a 60 por dispositivo. Acima do teto o agente recusa, e a resposta do host fica parada até chegar uma versão nova da política (ou o agente reiniciar). |
| **Permissão por regra e versão** | Nenhuma | A ação permitida para aquela regra naquela versão: **Encerrar o processo**. |

:::danger[Leia antes de ligar]
Com a trava ligada e fora do dry-run, o agente pode **encerrar um processo automaticamente**, inclusive um processo **legítimo** quando a regra der falso positivo. Ligue primeiro em dry-run e acompanhe as propostas e as recusas por alguns dias.
:::

Ligar a trava, sair do dry-run e acrescentar uma permissão são **mudanças arriscadas**:

- o console pede que você digite `ACEITO O RISCO` para criar e para publicar a versão;
- a publicação fica na auditoria com a diferença;
- se a empresa liga **Exigir aprovação de um segundo administrador**, a versão espera a aprovação de outro administrador.

Desligar qualquer um desses controles não é arriscado e não espera aprovação.

:::note[Nesta versão nenhuma ação é executada]
O agente atual não tem executor da resposta comportamental. Em dry-run ele registra o que faria; fora do dry-run ele recusa a ação com o motivo **sem executor** e nada é encerrado. A resposta automática do motor vale só para o agente Linux.
:::

Mesmo com tudo ligado, o agente recusa a ação quando:

- o processo não é mais o da detecção (o PID foi reaproveitado ou o processo já terminou);
- o alvo é um processo crítico do sistema ou do próprio agente, numa lista fixa que a política não muda;
- o executável é do sistema e a regra não tem confiança alta;
- o agente não consegue ler o executável para conferir o hash, como em `/tmp`, que o agente não enxerga. Aparece como **hash ilegível**, inclusive em dry-run.

O cartão **Estado da resposta por dispositivo**, abaixo do formulário, mostra para cada host a versão da política que ele recebe, a trava, o dry-run, as ações propostas, recusadas, em dry-run e executadas, e as recusas por motivo.

![Tela de resposta automática, com o aviso de risco, a trava, o dry-run e o estado por dispositivo](/img/edr/comportamental/resposta.png)

## Limites desta versão

- Em kernels antigos parte das regras não dispara, porque o sensor não recebe os eventos de que elas dependem. Veja as restrições de cada sistema em [Requisitos dos endpoints](../requisitos/endpoints.md#restrições-medidas-em-kernels-antigos).
- No Windows (pré-release), o motor segue a mesma política de sombra e alerta, mas ainda não foi validado em host de cliente, e a resposta automática não se aplica.
- Para diagnosticar o motor num host, veja [Solução de problemas do agente Linux](../solucao-de-problemas/agente-linux.md#motor-comportamental).
