#!/usr/bin/env node
/**
 * Turns a Claude design export (index.html) into a clean, deployable site in ./docs/
 * (named docs so GitHub Pages can serve it straight from the main branch).
 *
 * The export is a self-unpacking bundle: the real prototype lives in a
 * <script type="__bundler/template"> tag, with every image/font/script stored as
 * base64 in <script type="__bundler/manifest">. This script unpacks those assets
 * to site/assets/, rewrites the template to reference them by path, and strips the
 * presentation staging (faux iPhone frame, dynamic island, home indicator, control
 * rail, fake status bar on real phones) so the app serves edge-to-edge.
 *
 * Re-run any time you export a fresh prototype:  node build.mjs [export.html]
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcFile = process.argv[2] || path.join(here, 'index.html');
const outDir = path.join(here, 'docs');
const assetDir = path.join(outDir, 'assets');

const html = fs.readFileSync(srcFile, 'utf8');
const grab = (type) => {
  const m = html.match(new RegExp(`<script type="__bundler/${type}">\\s*([\\s\\S]*?)\\s*</script>`));
  if (!m) throw new Error(`No __bundler/${type} block found — is ${srcFile} a Claude design export?`);
  return JSON.parse(m[1]);
};
const manifest = grab('manifest');
const extResources = grab('ext_resources');
let template = grab('template');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(assetDir, { recursive: true });

// ---- unpack assets, choosing readable names where we can ----
const EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/svg+xml': '.svg', 'image/webp': '.webp', 'font/woff2': '.woff2' };
const idByUuid = Object.fromEntries(extResources.map((r) => [r.uuid, r.id]));
const nameFor = (uuid, entry, content) => {
  if (entry.mime.startsWith('image/') || entry.mime.startsWith('font/')) {
    const base = idByUuid[uuid] || uuid.slice(0, 8);
    return base + (EXT[entry.mime] || '');
  }
  const head = content.toString('utf8', 0, 300);
  if (/@license React\s*\*\s*react-dom\./.test(head.replace(/\n/g, ' '))) return 'react-dom.js';
  if (/@license React\s*\*\s*react\./.test(head.replace(/\n/g, ' '))) return 'react.js';
  if (/Babel/.test(head) && content.length > 1_000_000) return 'babel.js';
  // App scripts open with a descriptive comment — slugify its first few words.
  const c = head.match(/\/\*\s*([^*\n]{4,60})/);
  const slug = c ? c[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) : uuid.slice(0, 8);
  return `${slug}.js`;
};

const pathByUuid = {};
const used = new Set();
for (const [uuid, entry] of Object.entries(manifest)) {
  let buf = Buffer.from(entry.data, 'base64');
  if (entry.compressed) buf = zlib.gunzipSync(buf);
  let name = nameFor(uuid, entry, buf);
  while (used.has(name)) name = uuid.slice(0, 8) + '-' + name; // collision guard
  used.add(name);
  fs.writeFileSync(path.join(assetDir, name), buf);
  pathByUuid[uuid] = 'assets/' + name;
}

// ---- rewrite template: uuid refs -> asset paths, drop stale SRI attrs ----
for (const [uuid, p] of Object.entries(pathByUuid)) template = template.split(uuid).join(p);
template = template.replace(/\s+integrity="[^"]*"/gi, '').replace(/\s+crossorigin(="[^"]*")?/gi, '');

// The app reads its images via window.__resources (id -> URL), which the
// bundler's loader used to inject. Provide it with plain paths instead.
const resourceMap = Object.fromEntries(extResources.map((r) => [r.id, pathByUuid[r.uuid]]));

// ---- strip the staging ----
// Faux iPhone (stage > scaler > phone > island/home-indicator) -> a plain frame.
const stripped = template.replace(
  /<div id="stage">[\s\S]*?(?=<!-- prototype control rail -->)/,
  '<div id="frame">\n    <div id="app-root" class="app-root"></div>\n  </div>\n\n  ',
);
if (stripped === template) console.warn('WARN: phone-frame markup not found — template layout may have changed');
template = stripped;

// The phone-scaling script targets the removed #scaler.
template = template.replace(/<script>\s*\/\/ ---- scaling ----[\s\S]*?<\/script>/, '');

// Local fonts now, so the Google Fonts preconnects are dead weight.
template = template.replace(/^\s*<link rel="preconnect"[^>]*>\n?/gm, '');

// ---- head additions: PWA/native-feel meta + resource map ----
template = template.replace(/<meta name="viewport"[^>]*>/, '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">');
template = template.replace(/<title>[^<]*<\/title>/, '<title>PGA of Atlantica</title>');
const iconPath = resourceMap.pgaLogo || Object.values(resourceMap)[0] || '';
template = template.replace(
  '</title>',
  `</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Atlantica">
<meta name="theme-color" content="#0B2440">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="${iconPath}">
<link rel="apple-touch-icon" href="${iconPath}">
<script>window.__resources = ${JSON.stringify(resourceMap)};</script>`,
);

// ---- presentation overrides: fullscreen app on phones, centred column on desktop ----
const overrides = `<style>
  /* ---- standalone presentation (replaces the design-canvas staging) ---- */
  html { touch-action: manipulation; }
  body {
    background: #ECE8DD;
    -webkit-user-select: none; user-select: none;
    -webkit-touch-callout: none;
  }
  input, textarea { -webkit-user-select: text; user-select: text; }

  #frame { position: fixed; inset: 0; background: var(--cream); overflow: hidden; }

  /* Prototype scaffolding (screen-jump rail, overlays) stays wired but hidden.
     Append ?controls to the URL to bring it back. */
  body:not(.show-controls) #rail,
  body:not(.show-controls) #railShow,
  body:not(.show-controls) #jump { display: none !important; }

  /* Wide screens: a plain phone-sized column, no bezel. */
  @media (min-width: 560px) and (min-height: 700px) {
    #frame {
      inset: auto; position: fixed; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      width: 393px; height: min(852px, calc(100dvh - 48px));
      border-radius: 28px; border: 1px solid rgba(20, 30, 22, .1);
      box-shadow: 0 24px 70px rgba(20, 30, 22, .22);
    }
  }

  /* Real devices: the phone provides the status bar and home indicator.
     iOS 26.1 letterboxes installed web apps top and bottom, painting the
     reserved strips with the page background — match it to the app surface
     so they read as part of the app. */
  @media (max-width: 559.98px), (max-height: 699.98px) {
    html, body { background: var(--cream); }
    .statusbar { display: none !important; }
    .tabbar {
      height: calc(64px + max(22px, env(safe-area-inset-bottom)));
      padding-bottom: max(22px, env(safe-area-inset-bottom));
    }
    .toast { bottom: calc(82px + max(22px, env(safe-area-inset-bottom))); }
    .sheet { padding-bottom: env(safe-area-inset-bottom); }
  }
</style>
</head>`;
template = template.replace('</head>', overrides);

// ?controls flag — restores the screen-jump rail for demoing.
template = template.replace(
  '</body>',
  `  <script>if (new URLSearchParams(location.search).has('controls')) document.body.classList.add('show-controls');</script>\n</body>`,
);

fs.writeFileSync(path.join(outDir, 'index.html'), template);
fs.writeFileSync(
  path.join(outDir, 'manifest.webmanifest'),
  JSON.stringify({
    name: 'PGA of Atlantica',
    short_name: 'Atlantica',
    display: 'standalone',
    background_color: '#F6F3EB',
    theme_color: '#0B2440',
    icons: iconPath ? [{ src: iconPath, sizes: '512x512', type: 'image/png' }] : [],
  }, null, 2),
);

const size = fs.readdirSync(assetDir).reduce((s, f) => s + fs.statSync(path.join(assetDir, f)).size, 0);
console.log(`Built docs/ — ${Object.keys(manifest).length} assets (${(size / 1e6).toFixed(1)} MB), index.html ${(template.length / 1024).toFixed(0)} KB`);
