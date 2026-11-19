---
title: Agente Windows
sidebar_position: 4
description: Situação do agente Windows do SEGARK EDR e como instalá-lo para avaliação em laboratório.
---

# Agente Windows

:::warning[Pré-release: só para avaliação]
O agente Windows sai hoje só nas versões de pré-lançamento, com instalador MSI. Não há versão estável, e ele ainda não foi validado em host de cliente. Use-o em laboratório, não em produção.
:::

## O que já existe

O MSI instala o agente em **modo usuário**:

- telemetria por ETW;
- inspeção de scripts via AMSI;
- varredura de arquivos e quarentena;
- isolamento de rede pelo Firewall do Windows;
- [motor comportamental](../operacao/deteccao-comportamental.md) em sombra e alerta, pela mesma política do Linux (sem resposta automática);
- [modelo de machine learning de PE](../operacao/machine-learning.md), só em alerta.

A **proteção em kernel ainda não está disponível**: o driver do agente tem só assinatura de teste, e o MSI das versões de pré-lançamento não o instala.

Testado em laboratório e na integração contínua: Windows 11, Windows Server 2022 e Windows Server 2025. Somente x64.

## Instalar para avaliação

É preciso papel de administrador no console.

1. No console, abra **Implantação** e escolha **Windows**.
2. No cartão **Agente Windows**, confira a versão selecionada e clique em **Baixar MSI**. O cartão mostra o SHA-256 do arquivo e as pendências, se houver.
3. No cartão **Instalar o agente no Windows**, clique em **Obter o comando de instalação**. Para escolher o token de registro, a validade e o limite de usos, abra **Versões, links e opções avançadas de implantação**, use o cartão **Linha msiexec personalizada (token, validade e limite)** e clique em **Gerar comando de instalação**. O console mostra a linha `msiexec` uma vez só: copie antes de fechar.
4. No host, abra um prompt elevado (Administrador) na pasta do MSI e cole a linha.

O MSI é o mesmo para todos os clientes e não carrega credencial. O tenant, o grupo e as tags vêm do link, e cada host recebe uma credencial de registro de uso único. O instalador fixa o certificado do gateway e não usa as autoridades certificadoras do sistema.

Se algo falhar, o MSI desfaz a instalação. O motivo fica no log que a própria linha grava, na pasta onde você a rodou; o token não vai para o log.

Para várias máquinas, distribua o MSI com a sua ferramenta de distribuição de software e use a mesma linha. Ao revogar o link no console, novas instalações com ele param de funcionar; os agentes já instalados continuam.

O host precisa alcançar o gateway na porta do agente, como no Linux. Veja [Portas e firewall](../rede/portas-e-firewall.md).
