import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * SEGARK EDR — escrito para quem instala e opera (sysadmin, SecOps), na ordem
 * em que a pessoa precisa: preparar o ambiente, instalar, operar, resolver.
 */
const sidebars: SidebarsConfig = {
  edr: [
    'intro',
    {
      type: 'category',
      label: 'Antes de instalar',
      collapsed: false,
      items: ['requisitos/servidor', 'requisitos/endpoints', 'rede/portas-e-firewall'],
    },
    {
      type: 'category',
      label: 'Instalação',
      collapsed: false,
      items: [
        'instalacao/plataforma',
        'instalacao/primeiro-acesso',
        'instalacao/agente-linux',
        'instalacao/agente-windows',
      ],
    },
    {
      type: 'category',
      label: 'Operação do dia a dia',
      collapsed: false,
      items: [
        'operacao/alertas',
        'operacao/politicas',
        'operacao/anti-ransomware',
        'operacao/machine-learning',
        'operacao/resposta',
        'operacao/live-query',
        'operacao/atualizacoes',
        'operacao/usuarios-e-mfa',
        'operacao/backup',
      ],
    },
    {
      type: 'category',
      label: 'Solução de problemas',
      collapsed: false,
      items: ['solucao-de-problemas/agente-linux', 'solucao-de-problemas/plataforma'],
    },
    'changelog',
  ],
};

export default sidebars;
