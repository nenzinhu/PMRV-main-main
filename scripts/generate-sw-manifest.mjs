#!/usr/bin/env node
/**
 * Gera lista de assets para o Service Worker automaticamente
 * Uso: node scripts/generate-sw-manifest.mjs
 * 
 * Procura por arquivos no projeto e gera APP_SHELL no service_worker.js
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.slice(1);
const SW_FILE = join(ROOT, 'service_worker.js');

const EXTENSIONS = ['.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'android', 'dist', 'build'];

function* walkDir(dir, baseUrl = '') {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (EXCLUDE_DIRS.includes(entry.name)) continue;
      const fullPath = join(dir, entry.name);
      const urlPath = baseUrl ? `${baseUrl}/${entry.name}` : `./${entry.name}`;
      
      if (entry.isDirectory()) {
        yield* walkDir(fullPath, urlPath);
      } else if (EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
        yield urlPath;
      }
    }
  } catch (e) {
    // Silenciar erros de permissão
  }
}

// Gerar manifest
const assets = [
  './',
  './index.html',
  './manifest.json',
  './service_worker.js',
  ...Array.from(walkDir(ROOT)).sort(),
];

// Remover duplicatas
const uniqueAssets = [...new Set(assets)];

// Gerar código do APP_SHELL
const appShell = `const CACHE_NAME = 'pmrv-4em1-v5';
const APP_SHELL = [
  ${uniqueAssets.map((a) => `  '${a}',`).join('\n')}
];`;

// Ler arquivo atual e substituir APP_SHELL
let swContent = readFileSync(SW_FILE, 'utf-8');
const swStart = swContent.indexOf('const CACHE_NAME');
const swEnd = swContent.indexOf('];', swStart) + 2;

if (swStart !== -1 && swEnd > swStart) {
  swContent = swContent.slice(0, swStart) + appShell + swContent.slice(swEnd);
  writeFileSync(SW_FILE, swContent, 'utf-8');
  console.log(`✓ Service Worker atualizado com ${uniqueAssets.length} assets`);
} else {
  console.error('✗ Não foi possível atualizar service_worker.js');
  process.exit(1);
}
