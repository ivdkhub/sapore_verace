# Pubblicare Sapore Verace su GoDaddy

Il sito è composto da:

- **frontend React** (cartella `dist/` generata da `npm run build`);
- **backend PHP** (`dist/api/`) che salva menu, orari, ferie, sala, prenotazioni, ordini e richieste, e invia le notifiche.

---

## 0. Cosa comprare su GoDaddy

- **Web Hosting (cPanel, Linux)**: va bene anche il piano base (*Economy*); verifica che includa il **certificato SSL**.
  Il "Website Builder" di GoDaddy e i piani "Managed WordPress" **non vanno bene**, perché non permettono di caricare codice proprio.
- **Dominio** (es. `saporeverace.it`). Se il dominio è diverso, scrivilo in `site.config.json` (vedi punto 6).

## 1. Prima volta: preparazione su GoDaddy

1. **Dominio → hosting**: in GoDaddy collega il dominio al piano di hosting.
2. **SSL**: cPanel → *SSL/TLS Status* → attiva il certificato gratuito per il dominio con e senza `www`.
3. **Versione PHP**: cPanel → *Select PHP Version* → scegli **8.1 o superiore** e verifica che siano attive le estensioni `pdo_sqlite` (o `pdo_mysql`), `curl` e `mbstring`.
4. **Casella email mittente**: cPanel → *Email Accounts* → crea ad esempio `ordini@saporeverace.it`. Da qui partiranno le email di notifica.

## 2. Preparare il pacchetto

Sul tuo PC, nella cartella del progetto:

```bash
npm install
npm run package
```

Si ottiene **`sapore-verace-deploy.zip`**, con il contenuto della cartella `dist/` già pronto per `public_html`.
Se mancano P.IVA, ragione sociale o email privacy, il comando lo segnala.

## 3. Caricare i file

cPanel → *File Manager* → `public_html`:

1. *Upload* → carica `sapore-verace-deploy.zip`;
2. clic destro sullo zip → *Extract* → estrai in `public_html`;
3. elimina lo zip.

In alternativa, via FTP carica tutto il contenuto di `dist/`, compresi i file nascosti `.htaccess`.

## 4. Configurare il backend (solo la prima volta)

1. In `public_html/api/` duplica `config.example.php` e chiama la copia **`config.php`**.
2. Modifica `config.php`:
   - `admin_password`: la password dell'area admin. Meglio usare un hash:
     da cPanel → *Terminal* esegui `php public_html/api/tools/hash-password.php "LaTuaPasswordLunga"`
     e incolla nel file il risultato (inizia con `$2y$`);
   - `db.sqlite_path`: consigliato un percorso **fuori** da `public_html`, es.
     `'/home/TUO_UTENTE_CPANEL/sapore-data/sapore.sqlite'` (il nome utente è in cPanel, in alto a destra);
   - `mail_from`: la casella creata al punto 1.4;
   - `orders`: costo consegna (deve essere uguale a `DELIVERY_FEE` in `src/context/CartContext.jsx`), ordine minimo e CAP serviti a domicilio.
3. Apri `https://www.TUODOMINIO/api/state.php`: se vedi un testo che inizia con `{"ok":true` il backend funziona.

> `config.php` e il database **non vengono mai sovrascritti** dagli aggiornamenti: il pacchetto non li contiene.

## 5. Primo accesso admin

1. Vai su **`https://www.TUODOMINIO/#admin`** e inserisci la password.
2. Scheda **Notifiche**: attiva almeno un canale (Telegram consigliato) e premi *Invia di prova*.
3. Controlla **Orari & Ferie**: gli orari salvati qui valgono per prenotazioni, ordini, footer e sezione "Dove siamo".
4. Nella scheda **Ordini & Richieste** trovi ordini online, richieste per feste e messaggi dal sito.
5. Scheda **Gestione Prenotazioni**: imposta i **coperti massimi** (predefinito 65 per ogni pranzo e cena, modificabile per singole serate). Oltre il limite le prenotazioni online arrivano come *Da Confermare* e il cliente viene avvisato che lo staff lo richiamerà.
6. Schede **Prodotti Settimana**, **Menù Fisso** ed **Eventi**: inserisci i contenuti definitivi (i dati del computer di sviluppo non vengono caricati sul server).

## 6. Checklist prima di andare online

- [ ] `src/config/business.js`: **ragione sociale, Partita IVA ed email privacy** (la P.IVA sul sito è obbligatoria).
- [ ] `site.config.json`: dominio definitivo. Viene usato per canonical, anteprima social, dati per Google, `robots.txt` e `sitemap.xml`.
- [ ] `public/.htaccess`: togli il `#` dalle 3 righe del redirect verso `www`, una volta che il dominio funziona.
- [ ] Testi legali (privacy e cookie) riletti dal titolare o dal consulente.
- [ ] Immagine principale (`public/images/hero_section_1.png`) e foto definitive dei prodotti.
- [ ] Una prenotazione e un ordine di prova dal telefono, controllando che la notifica arrivi.
- [ ] Google Search Console: aggiungi il dominio e invia `https://www.TUODOMINIO/sitemap.xml`.

Dopo ogni modifica: `npm run package` e ricarica lo zip.

## Aggiornamenti successivi

`npm run package` → carica ed estrai lo zip in `public_html`, sovrascrivendo i file.
Dati, configurazione e immagini caricate dall'admin (cartella `uploads/`) restano intatti.
**Non cancellare** la cartella `public_html/api` prima di caricare: contiene `config.php`, le sessioni admin e, se non l'hai spostato, il database.

## Backup

Scarica periodicamente il file del database (percorso in `db.sqlite_path`) e la cartella `public_html/uploads/`.

## Sviluppo in locale

```bash
npm run dev:api   # server PHP su 127.0.0.1:5180 (serve PHP installato e api/config.php)
npm run dev       # sito su http://localhost:3000, che inoltra /api al server PHP
```
