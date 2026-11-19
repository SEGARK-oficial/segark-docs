---
title: Agente Linux
sidebar_position: 1
description: Códigos de saída do instalador, diagnóstico, cobertura do sensor, motor comportamental e problemas comuns do agente Linux.
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
| `5` | Menos de 2048 MiB livres no sistema de arquivos do `/opt` | Veja [Pouco espaço no /opt](#pouco-espaço-no-opt) |
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

### Pouco espaço no /opt

O instalador exige 2048 MiB livres no sistema de arquivos onde fica o `/opt`. A mensagem diz quanto há:

```text
disk: 1389 MiB livres em /opt; necessário 2048 MiB
```

Algumas imagens de nuvem do RHEL 8 deixam o `/` com 2 GB no LVM, e o `/opt` fica nele. Confira e amplie o volume antes de instalar:

```bash
df -m /opt                      # espaço livre, em MiB, e o volume onde o /opt está
sudo vgs                        # espaço livre em cada grupo de volumes (VFree)
sudo lvs                        # nome do grupo e do volume
```

Se o grupo de volumes tem espaço livre, amplie o volume e o sistema de arquivos de uma vez, com os nomes que o `lvs` mostrou:

```bash
sudo lvextend -r -L +4G /dev/<grupo>/<volume>
```

Sem espaço no grupo, acrescente um disco ao grupo ou monte um volume próprio em `/opt`. Depois rode a instalação de novo; se o código `33` disser que o link já foi usado, gere outro comando no console.

## O host não aparece online

1. `systemctl status sensor-agentd`: o serviço está rodando?
2. `journalctl -u sensor-agentd -n 100`: procure erros de conexão ou de certificado.
3. Confira a hora: `timedatectl`. Diferença maior que 5 minutos derruba a sessão.
4. Teste a porta do agente a partir do host.

## Consumo alto de CPU

Programas que mexem em muitos arquivos (backup, compilação, bancos de dados) geram muito evento. Crie exclusões por caminho na política do grupo desses servidores, sempre em auditoria primeiro.

## Cobertura do sensor

O sensor eBPF carrega um conjunto de programas no kernel. Num kernel antigo parte deles não sobe, e o sensor segue com o resto: o host fica online, mas vê menos.

No console: dispositivo, aba **Diagnóstico**, cartão **Saúde do agente**, linha **Sensor eBPF**, com **Programas carregados** e **Programas anexados**.

No host, o sensor registra a cobertura a cada início:

```bash
journalctl -u sensor-ebpf -b -o cat | grep -E '^\[(COVERAGE|COVERAGE-WARN|PROBE)\]'
```

Como ler:

- `[COVERAGE]` traz os totais: `programs` (os esperados), `loaded` (carregados), `attached` (anexados), `skipped` (em geral, de recursos que só sobem quando uma regra ligada os usa: é normal), `load_failed` e `attach_failed`.
- `[COVERAGE-WARN]` lista cada programa que não subiu, com o motivo. Sem essa linha, tudo o que era esperado subiu.
- `[PROBE] variante=` diz o canal de eventos: `Ringbuf` nos kernels novos, `Compat` nos que não têm ring buffer (o Ubuntu 20.04, por exemplo).

Causas comuns, pelo que aparece no motivo:

| No motivo | Causa | O que muda |
|---|---|---|
| `file`: `nenhuma variante de 'file' utilizavel`; `mount`: `failed to create map` | Kernel sem armazenamento por tarefa (`BPF_MAP_TYPE_TASK_STORAGE`, a partir do 5.11): RHEL/Rocky 8, Ubuntu 20.04 | Sem eventos de arquivo e de montagem do sensor |
| `bpf_prog_attach failed` em `dns`, `tls`, `sock` ou `cgroup_connect4`/`cgroup_connect6` | cgroup v1 ou híbrido | Rede reduzida: as regras que dependem da conexão TCP não disparam |
| `perf_event_open do uprobe negado (EACCES)` | A unit do sensor perdeu a capacidade de anexar uprobes (um drop-in local, por exemplo) | Sem os eventos de autenticação (PAM) |

Para saber qual cgroup o host usa:

```bash
stat -fc %T /sys/fs/cgroup      # cgroup2fs = v2; tmpfs = v1 ou híbrido
ls -d /sys/fs/cgroup/unified    # existe no modo híbrido
```

O que cada restrição significa por sistema está em [Requisitos dos endpoints](../requisitos/endpoints.md#restrições-medidas-em-kernels-antigos). Se um host em kernel novo mostrar programas que não sobem, gere o [pacote de diagnóstico](#primeiro-passo-o-pacote-de-diagnóstico) e fale com o suporte.

## Motor comportamental

O estado do [motor comportamental](../operacao/deteccao-comportamental.md) de cada host aparece no dispositivo, aba **Eventos**, cartão **Motor comportamental (modo sombra)**. Ele mostra o que o agente informa no status: modo efetivo e da política, regras carregadas, políticas recusadas, eventos e observações descartados, falhas.

No host:

```bash
journalctl -u sensor-ebpf -o cat | grep '\[COMPORTAMENTO\]' | tail -n 20
```

Na partida o sensor registra o pacote e o modo, por exemplo `[COMPORTAMENTO] pacote builtin:<id> (… regras Linux); modo off pela política`. Com a sombra ligada aparece `[COMPORTAMENTO] motor em sombra: … regras Linux`.

| No cartão | Causa provável | O que fazer |
|---|---|---|
| "O agente ainda não informou o estado do motor comportamental" | Agente anterior ao motor | [Atualize o agente](../operacao/atualizacoes.md) |
| **Modo da política** Desligado, embora a versão publicada esteja em Sombra | A política ainda não chegou ao host, ou foi recusada | Confira **Política aplicada** e **Políticas recusadas** no mesmo cartão. Depois de receber a política, o sensor a aplica em poucos segundos |
| **Políticas recusadas** maior que zero | O agente recusou uma versão da política do motor e manteve a anterior | Colete o diagnóstico e fale com o suporte |
| **Regras em alerta / com modo noutra versão**: o segundo número maior que zero | Uma regra promovida mudou de versão no pacote e voltou à sombra | [Promova a versão nova](../operacao/deteccao-comportamental.md#quando-uma-regra-muda-de-versão) com uma medição nova |
| **Observações emitidas / descartadas**: descartes crescendo | Uma regra ruidosa bateu no teto de 60 por minuto no host | Veja a contagem por regra no mesmo cartão e [desligue a regra](../operacao/deteccao-comportamental.md#2-desligar-uma-regra-ruidosa) se for o caso |
| **Eventos avaliados / descartados (fila cheia)**: descartes crescendo | O host gera mais eventos do que o motor consegue avaliar | Colete o diagnóstico e fale com o suporte |
| **Falhas contidas do motor** maior que zero | O motor falhou e recomeçou vazio. Depois de 5 falhas ele fica desligado até o sensor reiniciar | Colete o diagnóstico e fale com o suporte |
| Uma regra nunca dispara num kernel antigo | O sensor não recebe os eventos de que ela depende | Veja a [cobertura do sensor](#cobertura-do-sensor) |
