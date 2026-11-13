#!/usr/bin/env node
/**
 * Smoke test estático do portfólio, sem dependências externas.
 * Uso: node scripts/smoke-portfolio.mjs
 * Não substitui testes em navegador (Lighthouse, mobile, teclado e roteamento real).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import assert from 'node:assert/strict';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const html = read('index.html');
const jsFiles = ['portfolio.js', 'portfolio-evolucao.js', 'portfolio-a11y.js', 'portfolio-share.js', 'analytics.js'];

for (const file of jsFiles) {
  new Script(read(file), { filename: file });
}
const cssPaths = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^"]*)?)"[^>]*>/g)]
  .map((match) => match[1].split('?')[0])
  .filter((file) => !file.startsWith('http'));
assert.ok(cssPaths.length > 0, 'CSS local não identificado');
for (const css of cssPaths) {
  assert.ok(existsSync(join(root, css)), 'CSS ausente: ' + css);
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'IDs duplicados no HTML');
const idSet = new Set(ids);
const hashLinks = [...html.matchAll(/<a\b[^>]*href="#([^"]+)"/g)].map((match) => match[1]);
for (const target of hashLinks) {
  assert.ok(target === 'home' || idSet.has(target) || idSet.has('page-' + target), 'Âncora sem destino: #' + target);
}
assert.equal((html.match(/data-track="ver-case-/g) || []).length, 10, 'Esperados dez links de cases');
assert.ok(html.includes('data-evidence="mixed" id="page-case-formalizacao"'), 'Efetivação deve distinguir evidências');
assert.ok(html.includes('data-evidence="estimated" id="page-case-troca-tecnologia"'), 'Estimativa do business case deve continuar explícita');
assert.ok(html.includes('Objetivo profissional: Product Manager Pleno ou Product Owner Sênior'), 'Vagas-alvo PM Pleno / PO Sênior ausentes');
assert.ok(html.includes('Product Manager · Governance, Automation &amp; AI'), 'Cargo atual deve refletir currículo enviado');
assert.ok(read('portfolio.js').includes('Product Manager e Product Owner Sênior · Estratégia de Produto'), 'Título dinâmico deve refletir posicionamento atual');
assert.ok(html.includes('Desde 11 nov 2026'), 'Data de início em Governança de TI ausente');
assert.ok(!html.includes('transição prevista para 11/11/2026'), 'Referência antiga à transição futura deve ser removida');
assert.equal((html.match(/class="recruiter-featured-card"/g) || []).length, 3, 'Devem existir três cases recomendados');
for (const slug of ['autoagendamento', 'troca-tecnologia', 'voice-cloud']) {
  assert.ok(html.includes('data-track="destaque-' + slug + '"'), 'Destaque ausente: ' + slug);
  assert.ok(html.includes('data-route="case-' + slug + '"'), 'Rota do destaque ausente: ' + slug);
}
assert.ok(html.includes('id="case-curation-controls"'), 'Atalho para filtros não encontrado');
assert.ok(html.includes('portfolio-sprint07.css?v=20261112'), 'CSS da sprint não vinculado');
assert.ok(html.includes('portfolio-sprints.css?v=20261109'), 'Bundle CSS não vinculado');
assert.ok(html.includes('src="data:image/webp;base64,'), 'Retrato da hero não encontrado');
assert.ok(!html.includes('Product Manager · Senior Product Owner'), 'Rodapé apresenta cargo inconsistente');

const base = 'https://vitoriarjo.github.io/Vitoria-Portfolio/';
const shareSlugs = [
  'autoagendamento', 'troca-tecnologia', 'jornada-fibra', 'voice-cloud',
  'formalizacao', 'automacao-capacidade', 'release-governance', 'portfolio-product'
];
assert.equal((html.match(/data-share-case="/g) || []).length, 8, 'Esperados oito botões de compartilhamento');
for (const slug of shareSlugs) {
  const permalink = 'cases/' + slug + '/index.html';
  assert.ok(existsSync(join(root, permalink)), 'Permalink ausente: ' + permalink);
  const page = read(permalink);
  assert.ok(page.includes('name="robots" content="noindex,follow"'), 'Redirecionador não deve competir com conteúdo canônico: ' + slug);
  assert.ok(page.includes('property="og:title"') && page.includes('property="og:image"'), 'Metadados de compartilhamento ausentes: ' + slug);
  assert.ok(page.includes(base + '#case-' + slug), 'Destino incorreto do permalink: ' + slug);
}
const independentPages = ['case-novo-brisacliente.html', 'cases/governanca-backlog/index.html'];
const sitemap = read('sitemap.xml');
for (const file of independentPages) {
  const page = read(file);
  assert.ok(page.includes('rel="canonical"'), 'Canonical ausente: ' + file);
  assert.ok(page.includes('property="og:image"'), 'Prévia social ausente: ' + file);
}
assert.ok(sitemap.includes('case-novo-brisacliente.html') && sitemap.includes('cases/governanca-backlog/'), 'Páginas independentes ausentes do sitemap');
for (const slug of shareSlugs) {
  assert.ok(!sitemap.includes('/cases/' + slug + '/'), 'Redirecionador não-canônico no sitemap: ' + slug);
}
assert.ok(html.includes('property="og:url"'), 'Falta og:url na home');

const cvFilename = 'CV_Vitoria_Araujo_PM_Pleno_PO_Senior_2026.pdf';
const cv = readFileSync(join(root, cvFilename));
const legacyCv = readFileSync(join(root, 'cv-vitoria-araujo.pdf'));
assert.equal((html.match(/href="CV_Vitoria_Araujo_PM_Pleno_PO_Senior_2026.pdf"/g) || []).length, 3, 'Três links de currículo devem apontar ao novo PDF');
assert.ok(!html.includes('href="cv-vitoria-araujo.pdf"'), 'Link antigo do PDF não deve ser usado na home');
assert.ok(cv.subarray(0, 8).toString('ascii').startsWith('%PDF-1.'), 'CV deve ter cabeçalho PDF');
assert.ok(cv.toString('ascii').includes('%%EOF'), 'CV deve ter fechamento PDF');
assert.ok(cv.toString('ascii').includes('/Count 2'), 'CV deve conter as duas páginas');
assert.ok(cv.equals(legacyCv), 'Alias legado do CV deve estar atualizado');
console.log('OK: scripts, CSS, rotas, dez cases, compartilhamento, foco PM/PO e currículo PDF.');
