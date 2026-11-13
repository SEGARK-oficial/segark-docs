---
title: Usuários e MFA
sidebar_position: 8
description: Papéis, MFA e recuperação de acesso no console.
---

# Usuários, papéis e MFA

## Papéis

Do menor para o maior:

| Papel | Pode |
|---|---|
| **Leitor** | Ver alertas, dispositivos e relatórios |
| **Analista** | Tudo do leitor, mais triagem de alertas e Live Query |
| **Resposta** | Tudo do analista, mais ações de resposta e Live Response |
| **Administrador** | Tudo, mais políticas, usuários, licença e configurações |

Os nomes de usuário seguem o formato `nome@empresa`, por exemplo `ana@suaempresa`.

## MFA

O MFA por app autenticador é obrigatório para todos por padrão. Se alguém perder o celular, um administrador **reinicia o MFA** dessa pessoa, que cadastra o autenticador de novo no próximo login.

Login único (SSO) ainda não está disponível.
