// Crea sapore-verace-deploy.zip con il contenuto di dist/ (file nascosti .htaccess compresi):
// su GoDaddy si carica in public_html dal File Manager e si estrae con "Extract".
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const zip = join(root, 'sapore-verace-deploy.zip');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/ non trovato: esegui prima "npm run build".');
  process.exit(1);
}
if (existsSync(zip)) rmSync(zip);

// Promemoria: dati obbligatori per legge ancora da compilare
const business = readFileSync(join(root, 'src', 'config', 'business.js'), 'utf8');
const missing = ['legalName', 'vatNumber', 'privacyEmail'].filter((k) => new RegExp(`${k}:\\s*''`).test(business));
if (missing.length) {
  console.warn(`⚠️  In src/config/business.js mancano: ${missing.join(', ')}. Compilali prima di andare online.`);
}

try {
  // tar di Windows 10+ (System32, non quello di Git Bash) e di macOS crea zip con -a; su Linux si usa zip
  if (process.platform === 'linux') {
    execFileSync('zip', ['-qr', zip, '.'], { cwd: dist, stdio: 'inherit' });
  } else {
    const tar = process.platform === 'win32' ? join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
    execFileSync(tar, ['-a', '-c', '-f', '../sapore-verace-deploy.zip', '.'], { cwd: dist, stdio: 'inherit' });
  }
} catch {
  console.error('Impossibile creare lo zip: comprimi a mano il contenuto di dist/ (file nascosti compresi).');
  process.exit(1);
}
console.log('Creato sapore-verace-deploy.zip: caricalo in public_html ed estrailo.');
