# segark-docs

Fonte de **docs.segark.com**: a documentação de todos os produtos da SEGARK. A decisão e as alternativas estão em [`adr/0001`](adr/0001-portal-de-documentacao-multiproduto.md).

## Estrutura

```
products/
  centralops/docs/   SEGARK Pipeline · motor CentralOps   → /centralops
  edr/docs/          SEGARK EDR                           → /edr
  <produto>/docs/    produto novo: crie a pasta, a barra lateral em sidebars/ e a instância em docusaurus.config.ts
sidebars/            uma barra lateral por produto
static/img/<produto>/ capturas de tela, uma pasta por página
scripts/sync-changelog.mjs  changelog do CentralOps a partir das GitHub Releases
```

## Rodar

```bash
npm ci
npm run sync:changelog   # opcional: atualiza o changelog do CentralOps
npm start                # http://localhost:3000
npm run build            # falha em qualquer link quebrado
```

## Versionamento

As versões seguem a **linha maior** de cada produto, como o Wazuh faz com 3.x e 4.x:

- A doc atual de um produto acompanha a linha corrente (por exemplo, 2.x). Versões menores e correções só atualizam a doc atual.
- Quando sai uma **versão maior** (mudança incompatível), congele a linha anterior antes de mudar o texto:

  ```bash
  npm run version:centralops 2.x   # cria versioned_docs/version-2.x e /centralops/2.x
  ```

  Depois atualize o rótulo de `current` em `docusaurus.config.ts` para a linha nova e escreva as notas de atualização.
- Mantenha publicadas só as linhas com suporte. Ao encerrar o suporte de uma linha, apague a pasta dela e o item em `*_versions.json`.

## Escrever para o EDR

- Público: quem instala e opera (sysadmin, SecOps). Diga o que fazer e por quê; detalhe de engenharia interna fica fora.
- Cada página responde a uma tarefa: preparar, instalar, operar, resolver.
- Comandos completos, prontos para copiar. Valores de exemplo: `suaempresa`, `edr.suaempresa.com.br`, `10.0.0.0/8`.
- Arquivos `.md` são CommonMark: admonition com título usa colchetes, `:::info[Título]`.

### Capturas de tela

Cada lugar que precisa de imagem tem um bloco:

```md
:::info[Captura de tela]
`static/img/edr/<página>/<nome>.png`: o que a imagem deve mostrar.
:::
```

Para preencher: salve a imagem no caminho indicado (PNG, largura de 1600 px, tema claro, sem dados reais de cliente) e troque o bloco por `![Descrição curta](/img/edr/<página>/<nome>.png)`.

Para listar o que falta: `grep -rn "Captura de tela" products/`.
