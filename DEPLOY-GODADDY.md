# Pubblicare Sapore Verace su GoDaddy

Il sito è composto da:

- **frontend React** (cartella `dist/` generata da `npm run build`);
- **backend PHP** (`dist/api/`) che salva menu, orari, ferie, sala, prenotazioni, ordini e richieste, e invia le notifiche.

Serve un piano **GoDaddy Web Hosting (cPanel, Linux)** con PHP 8.x.
Il "Website Builder" di GoDaddy **non va bene**, perché non permette di caricare codice proprio.

---

## 1. Prima volta: preparazione su GoDaddy

1. **Dominio → hosting**: in GoDaddy collega il dominio (es. `saporeverace.it`) al piano di hosting.
2. **SSL**: cPanel → *SSL/TLS Status* → attiva il certificato gratuito per `saporeverace.it` e `www.saporeverace.it`.
3. **Versione PHP**: cPanel → *Select PHP Version* → scegli **8.1 o superiore** e verifica che siano attive le estensioni `pdo_sqlite` (o `pdo_mysql`), `curl`, `mbstring`.
4. **Casella email mittente**: cPanel → *Email Accounts* → crea `ordini@saporeverace.it`. Da qui partiranno le email di notifica.

## 2. Compilare il sito

Sul tuo PC, nella cartella del progetto:

```bash
npm install
npm run build
```

Viene creata la cartella `dist/`: il suo contenuto è esattamente quello che va in `public_html`.

## 3. Caricare i file

cPanel → *File Manager* → `public_html` (oppure via FTP):

- carica **tutto il contenuto** di `dist/`, compresi i file nascosti `.htaccess`
  (nel File Manager: *Settings → Show Hidden Files*);
- non serve caricare `node_modules`, `src`, `Instagram`, `Immagini` né altre cartelle del progetto.

## 4. Configurare il backend (solo la prima volta)

1. In `public_html/api/` duplica `config.example.php` e chiama la copia **`config.php`**.
2. Modifica `config.php`:
   - `admin_password`: la password dell'area admin. Meglio usare un hash:
     da cPanel → *Terminal* esegui `php public_html/api/tools/hash-password.php "LaTuaPasswordLunga"`
     e incolla nel file il risultato (inizia con `$2y$`);
   - `db.sqlite_path`: consigliato un percorso **fuori** da `public_html`, es.
     `'/home/TUO_UTENTE_CPANEL/sapore-data/sapore.sqlite'` (il nome utente è in cPanel, in alto a destra);
   - `mail_from`: la casella creata al punto 1.4;
   - `orders`: costo consegna, ordine minimo e CAP serviti a domicilio.
3. Apri `https://www.saporeverace.it/api/state.php`: se vedi un testo che inizia con `{"ok":true` il backend funziona.

> `config.php` e il database **non vengono mai sovrascritti** dagli aggiornamenti: `npm run build` non li mette in `dist/`.

## 5. Primo accesso admin

1. Vai su **`https://www.saporeverace.it/#admin`** e inserisci la password.
2. Scheda **Notifiche**: attiva almeno un canale (Telegram consigliato) e premi *Invia di prova*.
3. Controlla **Orari & Ferie**: gli orari che salvi qui sono quelli usati da prenotazioni, ordini, footer e sezione "Dove siamo".
4. Nella scheda **Ordini & Eventi** trovi ordini online, richieste per feste e messaggi dal sito.

## 6. Prima di andare online

In `src/config/business.js` compila **ragione sociale, Partita IVA ed email privacy**: la P.IVA sul sito è obbligatoria.
Poi rifai `npm run build` e ricarica i file.
Se il dominio non è `www.saporeverace.it`, aggiorna anche `index.html`, `public/robots.txt` e `public/sitemap.xml`.

## Aggiornamenti successivi

`npm run build` → carica il contenuto di `dist/` in `public_html` sovrascrivendo i file.
Dati, configurazione e immagini caricate dall'admin (cartella `uploads/`) restano intatti.

## Backup

Scarica periodicamente il file del database (il percorso è in `db.sqlite_path`) e la cartella `public_html/uploads/`.

## Sviluppo in locale

```bash
npm run dev:api   # server PHP su 127.0.0.1:5180 (serve PHP installato e api/config.php)
npm run dev       # sito su http://localhost:3000, che inoltra /api al server PHP
```
