---
title: Machine learning
sidebar_position: 4
description: Os modelos de machine learning para executáveis Linux e Windows, o que cada um faz nesta versão e como ligar.
---

# Machine learning

:::caution[Laboratório]
Os modelos de machine learning vêm **desligados** e, nesta fase, **só alertam**: nunca bloqueiam nem põem arquivo em quarentena. Quando ligar, comece pelo modo relatório, num grupo piloto.
:::

O SEGARK EDR tem dois modelos de machine learning que dão a cada executável uma pontuação de risco. Eles complementam as assinaturas e as regras comportamentais: pegam variações de malware que ainda não têm assinatura.

| Modelo | Avalia | Onde roda |
|---|---|---|
| ELF | Executáveis Linux | Agente Linux, na varredura em tempo real e nas varreduras |
| PE | Executáveis Windows | Agente Windows (pré-release) |

- A análise roda no próprio host, sem enviar o arquivo.
- Do host saem só atributos numéricos do arquivo, e só se o [compartilhamento de inteligência](https://www.segark.com/privacy#inteligencia) estiver ligado.
- Os modelos são atualizados como conteúdo assinado, junto com as regras. Publicar um modelo novo não liga nada.
- Um alerta de ML aparece em **Detecções** com a origem **Aprendizado de máquina**. Filtre por essa origem na triagem.

## Os modos

| Modo | O que acontece |
|---|---|
| **Desligado** (padrão) | Nada é calculado. |
| **Relatório** | O modelo pontua e registra, sem gerar alerta. Use para medir o ruído no seu ambiente. |
| **Alerta** | O arquivo acima do limiar vira uma detecção só de alerta: o acesso é liberado, nada é encerrado nem posto em quarentena. |

Se outra camada (assinatura, base de hash, lista de bloqueio, reputação) decidir bloquear o mesmo arquivo, o bloqueio dela segue como sempre.

Avance de um modo para o outro só depois de revisar os resultados do anterior.

## O que liga cada modelo nesta versão

| | ELF (Linux) | PE (Windows) |
|---|---|---|
| Quem define o modo | A política assinada do dispositivo | Uma chave do registro, no próprio host |
| Pelo console | Ainda não: o formulário da política não tem o campo nesta versão, então o modelo fica desligado em todos os hosts | Ainda não: o console não gerencia a chave |
| Bloqueio | Não nesta fase | Não existe |

### Ligar o modelo de PE num host Windows de avaliação

Num prompt elevado (Administrador), escolha o modo:

```bat
:: 1 = relatório (só registra no log do agente)
reg add HKLM\SOFTWARE\Myproj\EndpointDefense\PeMl /v Mode /t REG_DWORD /d 1 /f /reg:64

:: 2 = alerta (detecção só de alerta no console)
reg add HKLM\SOFTWARE\Myproj\EndpointDefense\PeMl /v Mode /t REG_DWORD /d 2 /f /reg:64

:: 0 = desligado (o padrão)
reg add HKLM\SOFTWARE\Myproj\EndpointDefense\PeMl /v Mode /t REG_DWORD /d 0 /f /reg:64
```

O agente relê a chave a cada 30 segundos, sem reiniciar. Qualquer valor diferente de `1` ou `2` vale como desligado.

No modo alerta, cada arquivo gera no máximo um alerta por modelo a cada 24 horas. Para calar um falso positivo, inclua o SHA-256 do arquivo em **Arquivos permitidos (SHA-256)** na política, ou o caminho em **Exclusões da varredura sob demanda (Windows)**.
