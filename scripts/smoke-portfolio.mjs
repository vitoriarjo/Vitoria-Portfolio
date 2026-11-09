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
const jsFiles = ['portfolio.js', 'portfolio-evolucao.js', 'portfolio-a11y.js', 'analytics.js'];

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
console.log('OK: scripts, folhas CSS, âncoras, dez cases, evidências e posicionamento.');
