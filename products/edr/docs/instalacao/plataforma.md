---
title: Instalar a plataforma
sidebar_position: 1
description: Instalação passo a passo da plataforma do SEGARK EDR com Docker Compose.
---

# Instalar a plataforma

:::tip[Parceiro do acesso antecipado?]
No programa de acesso antecipado, a SEGARK opera uma instância dedicada para você. Pule para o [primeiro acesso](./primeiro-acesso.md).
:::

Todos os comandos rodam na pasta `deploy/` do pacote de implantação da plataforma.

## 1. Gerar a configuração e os segredos

```bash
cp .env.example .env && chmod 600 .env
docker build -t openedr/backend:dev ../backend

SIGNER_IMAGE=ghcr.io/segark-oficial/segark-edr-signer:0.1.0
docker pull "$SIGNER_IMAGE" && echo "SIGNER_IMAGE=$SIGNER_IMAGE" >> .env

# segredos do banco, das sessões e do MFA
docker run --rm --network none openedr/backend:dev python -m openedr.cli gen-secrets >> .env

# chaves de assinatura de políticas, ações e atualizações
docker run --rm --network none "$SIGNER_IMAGE" gen-keys | grep -E '^OPENEDR_SIGNER_' >> .env
```

:::danger[Guarde as chaves de reserva fora do servidor]
O `gen-keys` também imprime sementes marcadas `# KEEP OFFLINE`. Elas são as chaves de reserva que os agentes já aceitam. Guarde-as num cofre de senhas, **nunca** no `.env` nem no servidor. Faça o mesmo com uma cópia do `.env`: perder `OPENEDR_MFA_KEY` obriga todos os usuários a recadastrar o autenticador.
:::

## 2. Emitir o certificado do gateway

```bash
./pki/gen-server-cert.sh pki/out edr.suaempresa.com.br [IP-do-servidor]
```

O script imprime dois **pins** (a chave principal e a de reserva). Coloque-os no `.env`, junto com o endereço público do gateway:

```ini
OPENEDR_PUBLIC_GATEWAY_URL=https://edr.suaempresa.com.br:9080
OPENEDR_SPKI_PINS=["<pin principal>","<pin de reserva>"]
```

## 3. Apontar as atualizações para a SEGARK

```ini
OPENEDR_AGENT_RELEASE_INDEX_URL=https://dl.segark.com/v1/agent-stable/index.json
OPENEDR_AGENT_RELEASE_CONTENT_INDEX_URL=https://dl.segark.com/v1/content-stable/index.json
```

Não é preciso token: a plataforma usa a própria licença para baixar.

## 4. Subir a pilha e criar o administrador

```bash
docker compose up -d
docker compose run --rm migrate python -m openedr.cli bootstrap \
    --tenant-slug suaempresa --tenant-name "Sua Empresa" --admin-username admin
```

O `bootstrap` imprime uma **senha de uso único** para `admin@suaempresa`. Não existe conta padrão.

## 5. Conferir

```bash
docker compose ps                                   # todos "healthy" ou "running"
curl -sk https://127.0.0.1:9443/api/health/ready    # API pronta
```

:::info[Captura de tela]
`static/img/edr/instalacao/compose-ps.png`: saída do `docker compose ps` com todos os serviços saudáveis.
:::

Siga para o [primeiro acesso](./primeiro-acesso.md).
