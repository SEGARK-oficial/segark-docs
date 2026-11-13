# ADR 0001 — Portal de documentação multiproduto em repositório dedicado

- **Status:** proposto (2026-11-13)
- **Decisores:** dono da SEGARK
- **Contexto técnico:** hoje `docs.segark.com` é o `docs-site/` (Docusaurus 3.10) dentro do repositório público `SEGARK-oficial/CentralOps`, servido na raiz, sem versionamento ("só existe a doc atual"). O SEGARK EDR não tem documentação pública: o material está em `OpenEDR/docs` e `segark-edr-agent/docs`, escrito para engenharia e em parte em repositórios privados.

## Decisão

1. **Um portal, um domínio:** `docs.segark.com`, com a página inicial escolhendo o produto.
2. **Repositório dedicado:** `SEGARK-oficial/segark-docs` (público), separado do código dos produtos e do site.
3. **Uma instância de docs por produto** (Docusaurus multi-instance): `/centralops` e `/edr`, cada uma com barra lateral, versões e changelog próprios. Produto novo = instância nova, sem mexer nas existentes.
4. **Versionamento por linha maior** (modelo Wazuh 3.x/4.x): a doc "atual" acompanha a linha corrente e recebe cada versão menor e correção. Uma linha só é congelada (`docs:version`) quando sai uma versão maior, que é onde a numeração semântica permite mudança incompatível. Linhas antigas ficam só-leitura enquanto tiverem suporte.
5. **Changelog por produto**, gerado das GitHub Releases no build (`scripts/sync-changelog.mjs`), agrupado pela mesma linha maior da doc. Notas de atualização de uma versão maior (o que fazer antes de subir) são escritas à mão.
6. **Redirects** dos endereços antigos (`docs.segark.com/<página>` → `/centralops/<página>`) pelo `plugin-client-redirects`, porque o GitHub Pages não faz redirect no servidor. Links do site, como `/api/mcp`, continuam valendo.

## Alternativas

| Opção | Prós | Contras |
|---|---|---|
| **A. Repositório dedicado (escolhida)** | Um lugar para todos os produtos; produto privado (EDR, agente) ganha doc pública sem abrir o código; ritmo de publicação próprio; revisão de texto sem ruído de código; um build, uma busca, um tema | A doc pode atrasar em relação ao código; precisa de disciplina no release |
| B. Monorepo (docs dentro de cada produto, agregadas no build) | Doc muda no mesmo PR que o código | Repositórios privados do EDR teriam de expor `docs/` ao build público; três pipelines para um site; versões e busca entre produtos ficam frágeis |
| C. Manter no CentralOps e acrescentar o EDR lá | Zero migração | Mistura um produto proprietário no repositório AGPL de outro; quem contribui com o CentralOps passa a revisar doc do EDR |

O contra principal da opção A (doc atrasar) é tratado no processo, abaixo.

## Consequências e processo

- **Release:** o checklist de release de cada produto ganha o passo "doc atualizada em `segark-docs`". Versão maior só sai com o `docs:version` da linha anterior e as notas de atualização.
- **PR de produto com mudança visível** leva o rótulo `docs-needed`, e a issue espelho é aberta em `segark-docs`.
- **CentralOps:** o `docs-site/` sai do repositório na fase 2. O README aponta para o portal e o `CONTRIBUTING` explica onde a doc mora. O histórico é trazido com `git filter-repo --path docs-site/` para não perder autoria.
- **Público:** a doc do EDR é escrita para quem instala e opera (sysadmin, SecOps). Detalhe de engenharia interna fica nos repositórios privados.
- **i18n:** pt-BR é a fonte; en/es seguem o fluxo de tradução do Docusaurus por instância.

## Fases

1. **Agora:** criar o repositório com o portal, a instância do EDR (escrita) e a do CentralOps (placeholder + changelog). Publicar em um subdomínio de teste.
2. **Migração do CentralOps:** trazer `docs-site/docs` com histórico, ajustar links absolutos (`/x` → `/centralops/x`), ligar os redirects, trocar o CNAME de `docs.segark.com` para o novo repositório.
3. **Primeira versão estável do EDR:** trocar o rótulo "Beta" pela linha maior e iniciar o changelog.
