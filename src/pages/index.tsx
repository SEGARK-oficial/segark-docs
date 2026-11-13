import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';

/**
 * Portal: escolher o produto. Cada cartão leva à doc atual dele.
 *
 * Textos em pt-BR aqui; en/es em `i18n/<locale>/code.json` (ids `portal.*`).
 * Texto novo: `npm run write-translations -- --locale en` (e `es`) e traduza.
 */
export default function Home() {
  return (
    <Layout
      title={translate({id: 'portal.meta.title', message: 'Documentação'})}
      description={translate({
        id: 'portal.meta.description',
        message: 'Documentação do SEGARK Pipeline e do SEGARK EDR.',
      })}>
      <main className="container margin-vert--xl">
        <h1>
          <Translate id="portal.heading">Documentação da SEGARK</Translate>
        </h1>
        <p>
          <Translate id="portal.intro">
            Escolha o produto. Cada um tem a própria documentação, versões e histórico de atualizações.
          </Translate>
        </p>
        <div className="product-grid">
          <section className="product-card">
            <h2>SEGARK Pipeline</h2>
            <p>
              <Translate id="portal.pipeline.description">
                Pipeline de dados de segurança: coleta, normalização OCSF, enriquecimento, redução e roteamento. Motor open-source CentralOps.
              </Translate>
            </p>
            <ul>
              <li>
                <Link to="/centralops">
                  <Translate id="portal.pipeline.docs">Documentação (2.x)</Translate>
                </Link>
              </li>
              <li>
                <Link to="/centralops/changelog">
                  <Translate id="portal.changelog">Histórico de atualizações</Translate>
                </Link>
              </li>
            </ul>
          </section>
          <section className="product-card">
            <h2>SEGARK EDR</h2>
            <p>
              <Translate id="portal.edr.description">
                Detecção e resposta para servidores Linux, hospedado no seu ambiente. Em beta.
              </Translate>
            </p>
            <ul>
              <li>
                <Link to="/edr">
                  <Translate id="portal.edr.docs">Documentação</Translate>
                </Link>
              </li>
              <li>
                <Link to="/edr/rede/portas-e-firewall">
                  <Translate id="portal.edr.ports">Portas e firewall</Translate>
                </Link>
              </li>
              <li>
                <Link to="/edr/changelog">
                  <Translate id="portal.changelog">Histórico de atualizações</Translate>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}
