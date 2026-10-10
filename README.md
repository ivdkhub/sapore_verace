# Sapore Verace — sito web

Sito della pizzeria Sapore Verace (Castellanza, VA): menu, prodotti della settimana, prenotazione tavoli, ordini a domicilio e da asporto, richieste per eventi e area admin.

- **Frontend**: React 19 + Vite + Tailwind (`src/`)
- **Backend**: PHP 8 con SQLite o MySQL (`api/`), pensato per l'hosting condiviso GoDaddy (cPanel)
- **Notifiche** al ristorante: Telegram, WhatsApp (CallMeBot), email

## Comandi

```bash
npm install
npm run dev:api   # API PHP su 127.0.0.1:5180 (serve PHP e api/config.php)
npm run dev       # sito su http://localhost:3000
npm run build     # crea dist/ (= contenuto di public_html)
npm run package   # build + sapore-verace-deploy.zip pronto da caricare
```

## Configurazione

| File | Cosa contiene |
| --- | --- |
| `site.config.json` | dominio pubblico (SEO, robots.txt, sitemap.xml) |
| `src/config/business.js` | ragione sociale, P.IVA, contatti, social |
| `api/config.php` | password admin, database, regole ordini e prenotazioni (si crea sul server da `config.example.php`; mai su git) |

La pubblicazione passo passo è in [DEPLOY-GODADDY.md](DEPLOY-GODADDY.md).
L'area admin si apre aggiungendo `#admin` all'indirizzo del sito.
