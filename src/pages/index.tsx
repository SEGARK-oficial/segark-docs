import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

/** Portal: escolher o produto. Cada cartão leva à doc atual dele. */
export default function Home() {
  return (
    <Layout title="Documentação" description="Documentação do SEGARK Pipeline e do SEGARK EDR.">
      <main className="container margin-vert--xl">
        <h1>Documentação da SEGARK</h1>
        <p>Escolha o produto. Cada um tem a própria documentação, versões e histórico de atualizações.</p>
        <div className="product-grid">
          <section className="product-card">
            <h2>SEGARK Pipeline</h2>
            <p>Pipeline de dados de segurança: coleta, normalização OCSF, enriquecimento, redução e roteamento. Motor open-source CentralOps.</p>
            <ul>
              <li><Link to="/centralops">Documentação (2.x)</Link></li>
              <li><Link to="/centralops/changelog">Histórico de atualizações</Link></li>
            </ul>
          </section>
          <section className="product-card">
            <h2>SEGARK EDR</h2>
            <p>Detecção e resposta para servidores Linux, hospedado no seu ambiente. Em beta.</p>
            <ul>
              <li><Link to="/edr">Documentação</Link></li>
              <li><Link to="/edr/rede/portas-e-firewall">Portas e firewall</Link></li>
              <li><Link to="/edr/changelog">Histórico de atualizações</Link></li>
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}
