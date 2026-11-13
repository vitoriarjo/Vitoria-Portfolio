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
assert.ok(html.includes('transição prevista para 11/11/2026'), 'Data da transição não pode ser antecipada');
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

console.log('OK: scripts, folhas CSS, âncoras, dez cases, evidências, compartilhamento e SEO.');
