#!/usr/bin/env node
/**
 * Gera products/centralops/docs/changelog.md a partir das GitHub Releases do
 * CentralOps (notas do release-please). Roda no CI antes do build e pode rodar
 * à mão: `npm run sync:changelog`.
 *
 * As versões ficam agrupadas por linha maior ("2.x", "1.x"): é a mesma unidade
 * em que a documentação é versionada, então o leitor de /centralops/1.x acha o
 * histórico da linha dele no mesmo lugar.
 *
 * Sem rede (ou com rate limit), o arquivo existente é mantido: o build nunca
 * falha por causa do GitHub.
 */
import {writeFile} from 'node:fs/promises';

const REPO = process.env.CHANGELOG_REPO ?? 'SEGARK-oficial/CentralOps';
const OUT = new URL('../products/centralops/docs/changelog.md', import.meta.url);

async function fetchReleases() {
  const headers = {accept: 'application/vnd.github+json'};
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`, {headers});
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all.filter((r) => !r.draft && !r.prerelease);
}

/** Notas do release-please → Markdown que cabe sob um título de versão. */
function body(md) {
  return (md ?? '')
    .split('\n')
    .filter((l) => !/^##\s+\[/.test(l)) // o título "## [x.y.z](compare) (data)" vira o nosso
    .map((l) => l.replace(/^###\s+Features/, '#### Novidades')
      .replace(/^###\s+Bug Fixes/, '#### Correções')
      .replace(/^###\s+⚠ BREAKING CHANGES|^###\s+BREAKING CHANGES/i, '#### ⚠️ Mudanças incompatíveis')
      .replace(/^###\s+/, '#### '))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

try {
  const releases = await fetchReleases();
  const byMajor = new Map();
  for (const r of releases) {
    const major = (r.tag_name.match(/^v?(\d+)\./) ?? [])[1] ?? '?';
    if (!byMajor.has(major)) byMajor.set(major, []);
    byMajor.get(major).push(r);
  }
  const parts = [
    '---',
    'title: Histórico de atualizações',
    'sidebar_position: 99',
    'description: O que mudou em cada versão do SEGARK Pipeline e do motor CentralOps.',
    '---',
    '',
    '# Histórico de atualizações',
    '',
    `Gerado das [notas de versão no GitHub](https://github.com/${REPO}/releases). Mudanças incompatíveis só aparecem em versões maiores e vêm marcadas com ⚠️.`,
    '',
  ];
  for (const [major, list] of [...byMajor.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))) {
    parts.push(`## ${major}.x`, '');
    for (const r of list) {
      parts.push(`### ${r.tag_name} · ${String(r.published_at).slice(0, 10)}`, '', body(r.body) || '_Sem notas._', '');
    }
  }
  await writeFile(OUT, parts.join('\n'));
  console.log(`changelog: ${releases.length} versões de ${REPO}`);
} catch (err) {
  console.warn(`changelog: mantido o arquivo atual (${err.message})`);
}
