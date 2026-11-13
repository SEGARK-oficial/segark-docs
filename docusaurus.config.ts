import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/**
 * docs.segark.com — um portal, vários produtos (ADR 0001).
 *
 * Cada produto é UMA instância do plugin de docs, com caminho, barra lateral e
 * versões próprias. Por isso o SEGARK Pipeline pode estar na linha 2.x enquanto
 * o SEGARK EDR ainda está em beta, sem que um arraste o outro:
 *
 *   /                      portal (escolha do produto)        src/pages/index.tsx
 *   /centralops/...        SEGARK Pipeline · motor CentralOps  products/centralops/docs
 *   /centralops/1.x/...    linha maior anterior (quando existir: `npm run version:centralops 1.x`)
 *   /edr/...               SEGARK EDR                          products/edr/docs
 *   /<produto>/changelog   histórico de atualizações do produto
 *
 * Versões são cortadas por VERSÃO MAIOR (mudança incompatível), como o Wazuh
 * faz com 3.x/4.x: a doc "atual" acompanha a linha corrente e recebe cada
 * versão menor e correção; uma linha antiga vira snapshot só-leitura quando
 * a nova maior sai. Ver README › "Versionamento".
 */

const config: Config = {
  title: 'SEGARK Docs',
  tagline: 'Documentação do SEGARK Pipeline e do SEGARK EDR',
  favicon: 'img/favicon.ico',

  future: {v4: true},

  url: 'https://docs.segark.com',
  baseUrl: '/',
  organizationName: 'SEGARK-oficial',
  projectName: 'segark-docs',
  trailingSlash: false,

  // Herdado do docs-site do CentralOps: link quebrado falha o build, nunca
  // aparece publicado.
  onBrokenLinks: 'throw',

  markdown: {
    // .md = CommonMark. Admonition com título leva colchetes: `:::info[Título]`.
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },

  i18n: {
    // Escrita em pt-BR; en/es entram pelo fluxo de tradução do Docusaurus
    // (`i18n/<locale>/docusaurus-plugin-content-docs-<id>/`).
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en', 'es'],
    localeConfigs: {
      'pt-BR': {label: 'Português'},
      en: {label: 'English'},
      es: {label: 'Español'},
    },
  },

  presets: [
    [
      'classic',
      {
        // Os docs de produto são instâncias próprias (plugins abaixo); o
        // preset fica só com páginas e tema.
        docs: false,
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'centralops',
        path: 'products/centralops/docs',
        routeBasePath: 'centralops',
        sidebarPath: './sidebars/centralops.ts',
        editUrl: 'https://github.com/SEGARK-oficial/segark-docs/edit/main/',
        // A linha corrente do motor. Ao lançar a 3.0: `npm run version:centralops 2.x`
        // congela esta doc em /centralops/2.x e "current" passa a ser a 3.x.
        versions: {current: {label: '2.x', path: ''}},
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'edr',
        path: 'products/edr/docs',
        routeBasePath: 'edr',
        sidebarPath: './sidebars/edr.ts',
        editUrl: 'https://github.com/SEGARK-oficial/segark-docs/edit/main/',
        // Sem versão estável ainda. Na primeira estável, o rótulo vira a linha
        // maior dela; o banner some.
        versions: {current: {label: 'Beta', path: '', banner: 'unreleased'}},
      },
    ],
    [
      // Links antigos de docs.segark.com (CentralOps servido na raiz) e links
      // do site, como /api/mcp, continuam funcionando depois da migração.
      // GitHub Pages não tem redirect no servidor: o plugin gera páginas que
      // redirecionam no cliente.
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects(existingPath: string) {
          if (existingPath.startsWith('/centralops/')) {
            return [existingPath.replace(/^\/centralops/, '')];
          }
          return undefined;
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: true},
    navbar: {
      title: 'SEGARK Docs',
      items: [
        {
          type: 'dropdown',
          label: 'Produtos',
          position: 'left',
          items: [
            {type: 'doc', docsPluginId: 'centralops', docId: 'intro', label: 'SEGARK Pipeline (CentralOps)'},
            {type: 'doc', docsPluginId: 'edr', docId: 'intro', label: 'SEGARK EDR'},
          ],
        },
        {type: 'docSidebar', docsPluginId: 'centralops', sidebarId: 'centralops', position: 'left', label: 'Pipeline'},
        {type: 'docSidebar', docsPluginId: 'edr', sidebarId: 'edr', position: 'left', label: 'EDR'},
        // Só aparece dentro do produto correspondente.
        {type: 'docsVersionDropdown', docsPluginId: 'centralops', position: 'right'},
        {type: 'docsVersionDropdown', docsPluginId: 'edr', position: 'right'},
        {type: 'localeDropdown', position: 'right'},
        {href: 'https://www.segark.com/releases', label: 'Versões', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'SEGARK Pipeline',
          items: [
            {label: 'Visão geral', to: '/centralops'},
            {label: 'Histórico de atualizações', to: '/centralops/changelog'},
          ],
        },
        {
          title: 'SEGARK EDR',
          items: [
            {label: 'Visão geral', to: '/edr'},
            {label: 'Portas e firewall', to: '/edr/rede/portas-e-firewall'},
            {label: 'Solução de problemas', to: '/edr/solucao-de-problemas/agente-linux'},
            {label: 'Histórico de atualizações', to: '/edr/changelog'},
          ],
        },
        {
          title: 'SEGARK',
          items: [
            {label: 'Site', href: 'https://www.segark.com'},
            {label: 'Versões e roadmap', href: 'https://www.segark.com/releases'},
            {label: 'Suporte', href: 'mailto:support@segark.com'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} SEGARK.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'powershell', 'ini'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
