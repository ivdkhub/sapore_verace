<?php
// Genera l'hash della password admin da incollare in api/config.php.
// Uso (in locale o dal Terminale di cPanel):  php api/tools/hash-password.php "LaTuaPassword"
// Questo script funziona SOLO da riga di comando, non dal browser.

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
if ($argc < 2 || strlen($argv[1]) < 10) {
    fwrite(STDERR, "Uso: php hash-password.php \"password di almeno 10 caratteri\"\n");
    exit(1);
}
echo password_hash($argv[1], PASSWORD_DEFAULT), PHP_EOL;
