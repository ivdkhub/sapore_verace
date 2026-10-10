<?php
// ==========================================================================
// CONFIGURAZIONE BACKEND SAPORE VERACE
// Copia questo file come "config.php" nella stessa cartella (api/) sul server
// GoDaddy e compila i valori. config.php NON va mai pubblicato su GitHub.
// ==========================================================================

return [
    // Password dell'area admin.
    // Consigliato: incolla qui un hash generato con api/tools/hash-password.php
    // (es. '$2y$10$....'). In alternativa puoi scrivere la password in chiaro:
    // il file è PHP e non è leggibile dal browser, ma l'hash è più sicuro.
    'admin_password' => 'CAMBIA-QUESTA-PASSWORD',

    // Database.
    // SQLite (predefinito): nessuna configurazione, il file viene creato da solo.
    // Su GoDaddy è meglio tenerlo FUORI da public_html, es. '/home/UTENTE/sapore-data/sapore.sqlite'.
    'db' => [
        'driver' => 'sqlite',
        'sqlite_path' => __DIR__ . '/data/sapore.sqlite',

        // MySQL (opzionale): crea il database da cPanel > Database MySQL e imposta driver => 'mysql'.
        'mysql_host' => 'localhost',
        'mysql_name' => '',
        'mysql_user' => '',
        'mysql_pass' => '',
    ],

    // Ordini online
    'orders' => [
        'delivery_fee' => 2.50,
        'min_order_delivery' => 0,       // es. 15 per un minimo di 15 € a domicilio
        // CAP serviti a domicilio. Vuoto = nessun limite.
        // Esempio: ['21053', '21052', '20025', '21057', '21050']
        'delivery_postcodes' => [],
        'prep_minutes' => 20,            // anticipo minimo per un orario programmato
    ],

    // Prenotazioni
    'reservations' => [
        'max_days_ahead' => 60,
        'slot_minutes' => 30,
        'last_slot_before_close' => 30,  // ultimo orario prenotabile = chiusura - N minuti
        'retention_days' => 30,          // dopo N giorni i dati dei clienti vengono cancellati (GDPR)
    ],

    // Email: GoDaddy blocca l'SMTP esterno (es. Gmail) sull'hosting condiviso,
    // quindi le email partono con la funzione mail() del server.
    // Usa un indirizzo del TUO dominio (creato in cPanel > Email Accounts).
    'mail_from' => 'ordini@saporeverace.it',
    'mail_from_name' => 'Sapore Verace',
];
