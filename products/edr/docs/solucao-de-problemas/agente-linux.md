---
title: Agente Linux
sidebar_position: 1
description: Códigos de saída do instalador, diagnóstico e problemas comuns do agente Linux.
---

# Solução de problemas: agente Linux

## Primeiro passo: o pacote de diagnóstico

```bash
sudo /opt/sensor-spl/bin/sensor-diagnose
```

Gera um pacote em `/var/lib/sensor-spl/diagnose` com configuração, estado, versões e as últimas linhas do journal. É o arquivo que o suporte vai pedir. Ele também é gerado sozinho quando a instalação falha, e pode ser coletado pelo console com a ação **Coletar diagnóstico**.

Outros comandos úteis:

```bash
systemctl status 'sensor-*'                                          # estado dos serviços
journalctl -u 'sensor-*' --since '1 hour ago'                        # logs recentes
sudo /opt/sensor-spl/bin/sensor-installer verify                     # confere os arquivos instalados
sudo /opt/sensor-spl/bin/sensor-installer preflight                  # reavalia os requisitos do host
sudo /opt/sensor-spl/bin/sensor-updater status --config /etc/sensor-spl/updater.json
```

## Códigos de saída do instalador

| Código | Causa | O que fazer |
|---|---|---|
| `1` | Não é Linux | — |
| `2` | Não rodou como root | Rode com `sudo` |
| `9` | Arquitetura sem suporte, ou sem versão publicada para ela | Confira `uname -m`: só `x86_64` e `aarch64` |
| `13` | Falha de integridade (hash ou assinatura) | Não insista. Gere um comando novo; se repetir, fale com o suporte |
| `21` | glibc anterior à 2.17 | Sistema antigo demais |
| `29` | PID 1 não é systemd | Não suportado |
| `30` | Falta um comando (`curl`/`wget`, `tar`, `sha256sum`…) | Instale o que a mensagem indicar |
| `31` | Pouco espaço em disco | Libere espaço no diretório temporário |
| `33` | Plataforma inalcançável ou link recusado | Veja abaixo |
| `38` | Kernel sem suporte ao sensor eBPF (anterior à 4.18) | Atualize o kernel ou use `--allow-degraded` |
| `39` | Kernel sem BTF | Veja [Requisitos dos endpoints](../requisitos/endpoints.md#kernel-sem-btf) |

### Código 33

A mensagem diz a causa exata. As mais comuns:

- **DNS ou conexão recusada**: o host não chega ao gateway. Teste `nc -vz edr.suaempresa.com.br 9080` e confira o firewall ([Portas e firewall](../rede/portas-e-firewall.md)).
- **TLS ou pin**: um proxy está inspecionando TLS no caminho, ou o certificado do gateway foi trocado sem atualizar os pins.
- **Link expirado, revogado ou já usado**: gere outro comando. Cada download instala um host só.
- **Sem assento de licença** (HTTP 409): a licença chegou ao limite. Libere assentos ou amplie a licença no portal.

## O host não aparece online

1. `systemctl status sensor-agentd`: o serviço está rodando?
2. `journalctl -u sensor-agentd -n 100`: procure erros de conexão ou de certificado.
3. Confira a hora: `timedatectl`. Diferença maior que 5 minutos derruba a sessão.
4. Teste a porta do agente a partir do host.

## Consumo alto de CPU

Programas que mexem em muitos arquivos (backup, compilação, bancos de dados) geram muito evento. Crie exclusões por caminho na política do grupo desses servidores, sempre em auditoria primeiro.
