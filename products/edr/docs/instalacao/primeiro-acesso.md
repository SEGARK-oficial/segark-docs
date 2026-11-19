---
title: Primeiro acesso
sidebar_position: 2
description: Entrar no console, ativar o MFA, importar a licença e revisar as configurações de segurança.
---

# Primeiro acesso ao console

## 1. Entrar e trocar a senha

Abra `https://<servidor>:9443` (ou o túnel SSH, veja [Portas e firewall](../rede/portas-e-firewall.md#acesso-ao-console)) e entre com `admin@suaempresa` e a senha de uso único. O console pede uma senha nova antes de qualquer outra coisa.

![Tela de login do console](/img/edr/primeiro-acesso/login.png)

## 2. Cadastrar o autenticador (MFA)

A verificação em duas etapas por app autenticador (TOTP) é obrigatória para todos os usuários. Escaneie o QR code com o seu aplicativo e confirme com um código.

![Cadastro do autenticador com o QR code](/img/edr/primeiro-acesso/mfa.png)

## 3. Importar a licença

Em **Administração › Licença**, cole a licença gerada no portal da SEGARK ou envie o arquivo de licença offline. A licença é verificada localmente, sem acesso à internet.

![Tela de licença com os agentes usados e disponíveis](/img/edr/primeiro-acesso/licenca.png)

## 4. Revisar a segurança da organização

Em **Configurações › Segurança da organização** os padrões já são seguros:

| Configuração | Padrão |
|---|---|
| MFA | Obrigatório para todos |
| Sessão do console | Encerra após 30 minutos sem uso e 8 horas após o login |
| Tokens de registro de agentes | Valem no máximo 90 dias |

Afrouxar uma delas exige uma justificativa, que fica registrada na auditoria.

## 5. Convidar a equipe

Crie os usuários e dê a cada um o menor papel que resolve o trabalho dele. Veja [Usuários e MFA](../operacao/usuarios-e-mfa.md).

Próximo passo: [instalar o agente](./agente-linux.md).
