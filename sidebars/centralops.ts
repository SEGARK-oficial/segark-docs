import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Barra lateral única do SEGARK Pipeline (motor CentralOps).
 *
 * No docs-site do CentralOps eram oito barras, uma por item do navbar
 * (gettingStartedSidebar, operationsSidebar, ...). No portal o navbar é por
 * produto (ADR 0001), então cada uma virou uma categoria desta barra, na ordem
 * do pipeline: começar → operar → administrar e integrar → normalizar →
 * enriquecer → rotear e entregar → runbooks → API.
 *
 * Os rótulos das categorias são as chaves de tradução em
 * `i18n/<locale>/docusaurus-plugin-content-docs-centralops/current.json`
 * (`sidebar.centralops.category.<rótulo>`): mudou o rótulo, mude a chave.
 *
 * `changelog` é gerado por `npm run sync:changelog`.
 */
const sidebars: SidebarsConfig = {
  centralops: [
    'intro',
    {
      type: 'category',
      label: 'Começar',
      collapsed: false,
      items: ['getting-started/overview', 'getting-started/first-login', 'getting-started/quickstart'],
    },
    {
      type: 'category',
      label: 'Instalação & Deploy',
      items: ['deployment/docker-compose', 'deployment/kubernetes', 'deployment/configuration', 'deployment/upgrading'],
    },
    {
      type: 'category',
      label: 'Edições & Upgrade',
      items: ['editions/community-vs-enterprise', 'editions/upgrade'],
    },
    {
      type: 'category',
      label: 'Conceitos',
      items: ['concepts/architecture', 'concepts/rbac', 'concepts/data-model'],
    },
    {
      type: 'category',
      label: 'Operação diária',
      items: [
        'operations/dashboard',
        'operations/fluxo-de-dados',
        'operations/quarantine',
        'operations/search',
        'operations/federated-search',
        'operations/detections',
        'operations/correlation-rules',
        'operations/pipeline-health',
        'operations/live-capture',
        'operations/observability',
        'operations/history-audit',
      ],
    },
    {
      type: 'category',
      label: 'Administração',
      items: [
        'administration/users-and-roles',
        'administration/sso-entra',
        'administration/organizations',
        'administration/tenant-hierarchy',
        'administration/platform-config',
        'administration/secrets-and-master-key',
      ],
    },
    {
      type: 'category',
      label: 'Integrações',
      items: [
        'integrations/overview',
        'integrations/sophos',
        'integrations/wazuh',
        'integrations/crowdstrike',
        'integrations/microsoft-defender',
        'integrations/google-cloud',
        'integrations/microsoft-azure',
        'integrations/akamai',
        'integrations/cloudflare',
        'integrations/google-workspace',
        'integrations/microsoft-365',
        'integrations/aws-acesso',
        'integrations/aws-cloudtrail',
        'integrations/aws-cloudwatch',
        'integrations/aws-waf',
        'integrations/aws-findings',
        'integrations/aws-firehose',
        'integrations/microsoft-entra-id',
        'integrations/okta',
        'integrations/ninjaone',
        'integrations/veeam',
        'integrations/dfir-iris',
        'integrations/push-ingestion',
        'integrations/fortinet-fortigate',
        'integrations/windows-event-log',
        'integrations/syslog-receiver',
        'integrations/custom-json',
        'integrations/adding-new-vendor',
      ],
    },
    {
      type: 'category',
      label: 'Mappings (CML)',
      items: [
        'normalization/overview',
        'normalization/cml',
        'normalization/dsl-spec',
        'normalization/cookbook',
        'normalization/operators-reference',
        'normalization/use-cases',
        'normalization/troubleshooting',
        'normalization/migration-v1-to-v2',
      ],
    },
    {
      type: 'category',
      label: 'Pipelines',
      items: [
        'pipelines/collectors',
        'pipelines/collection-filters',
        'pipelines/scheduler',
        'pipelines/drift',
        'pipelines/backfill',
      ],
    },
    {
      type: 'category',
      label: 'Enriquecimento',
      items: ['enrichment/overview', 'enrichment/how-to-enrich', 'enrichment/catalog'],
    },
    {
      type: 'category',
      label: 'Saídas & Roteamento',
      items: [
        'outputs/overview',
        'outputs/ocsf-nativo',
        {
          type: 'category',
          label: 'Destinos',
          items: [
            'outputs/destinations',
            'outputs/destination-wazuh-syslog',
            'outputs/destination-splunk-hec',
            'outputs/destination-elastic',
            'outputs/destination-clickhouse',
            'outputs/destination-nano',
            'outputs/destination-crowdstrike-ngsiem',
            'outputs/destination-crowdstrike-logscale',
            'outputs/destination-s3',
            'outputs/destination-sentinel',
            'outputs/destination-kafka',
            'outputs/destination-otlp',
            'outputs/destination-operations',
            'outputs/destination-webhook',
            'outputs/destination-datadog',
            'outputs/destination-chronicle',
            'outputs/destination-security-lake',
            'outputs/adding-a-destination',
          ],
        },
        {
          type: 'category',
          label: 'Roteamento',
          items: [
            'outputs/routing',
            'outputs/routing-canary',
            'outputs/routing-dry-run',
            'outputs/reducao-de-volume',
            'outputs/pii-redaction',
          ],
        },
        'outputs/observability',
      ],
    },
    {
      type: 'category',
      label: 'Runbooks (SRE)',
      items: [
        'runbooks/dispatcher',
        'runbooks/scheduler-stuck',
        'runbooks/collection-lag-backlog',
        'runbooks/high-quarantine-rate',
        'runbooks/slo-burn',
        'runbooks/redis-capacity',
        'runbooks/dlq-and-destination-delivery',
        'runbooks/destination-down',
        'runbooks/routing-misroute',
        'runbooks/pii-redaction-blocked',
        'runbooks/iris-handoff-customer-mapping',
        'runbooks/migration-and-boot',
      ],
    },
    {
      type: 'category',
      label: 'Compliance',
      items: ['compliance/retention', 'compliance/lgpd-gdpr'],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/overview',
        'api/authentication',
        'api/permissions',
        'api/mcp',
        'api/conventions',
        'api/reference',
        'api/openapi',
        'api/recipes',
      ],
    },
    'changelog',
  ],
};

export default sidebars;
