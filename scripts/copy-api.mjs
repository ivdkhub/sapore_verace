// Copia il backend PHP dentro dist/api, così dist/ è esattamente il contenuto di public_html su GoDaddy.
// config.php, il database e gli strumenti di sviluppo NON vengono copiati (restano quelli del server).
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const from = join(root, 'api');
const to = join(root, 'dist', 'api');

if (!existsSync(join(root, 'dist'))) {
  console.error('dist/ non trovato: esegui prima "vite build".');
  process.exit(1);
}
mkdirSync(to, { recursive: true });

const EXCLUDED = ['config.php', 'dev-router.php'];
cpSync(from, to, {
  recursive: true,
  filter: (src) => {
    const rel = relative(from, src);
    if (EXCLUDED.includes(rel)) return false;
    // della cartella data/ si copia solo la protezione .htaccess, mai il database
    if (rel.startsWith('data' + sep) && !rel.endsWith('.htaccess')) return false;
    return true;
  },
});
console.log('Backend copiato in dist/api (senza config.php né database)');
