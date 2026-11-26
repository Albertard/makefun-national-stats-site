// NationStat — "Make the best national statistics site" (Node 22, standard
// library only). The site is plain static files under app/ and its
// screenshots under screenshots/. This program hands the entry in: it
// copies both folders to the output directory and writes
// /output/dossier.json with buildDossier from the vendored make.fun
// library. vendor/makefun-frontend.ts must stay exactly as the kit
// shipped it: the scorer rebuilds the dossier with its own copy and
// compares the two byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Hard fail when the site or its screenshots are missing: a silent
// partial hand-in would reach the gate as an invalid entry.
const indexPath = join(here, 'app', 'index.html');
if (!existsSync(indexPath) || !statSync(indexPath).isFile()) {
  throw new Error('missing app/index.html: the site cannot be handed in without it');
}
const shotsDir = join(here, 'screenshots');
if (!existsSync(shotsDir) || !statSync(shotsDir).isDirectory()) {
  throw new Error('missing screenshots/: the entry needs 3 or 4 screenshots');
}
const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.'));
if (shots.length < 3 || shots.length > 4) {
  throw new Error('screenshots/ must hold 3 or 4 images, found ' + shots.length);
}
for (const shot of shots) {
  const shotPath = join(shotsDir, shot);
  const shotStats = statSync(shotPath);
  if (!shotStats.isFile() || shotStats.size === 0 || shotStats.size > 262144) {
    throw new Error('screenshot ' + shot + ' must be a non-empty image of at most 256 KiB');
  }
}
if (statSync(indexPath).size > 1048576) {
  throw new Error('app/index.html is over the 1 MiB cap');
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (kit reference/gate.json): only text_max_bytes
// shapes the bytes; the others refuse an entry the scorer would refuse
// (more than 4 screenshots or one over 256 KiB; more than 993 files and
// directories in app/ or 16 MiB of app files: app/ counts beside
// /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
