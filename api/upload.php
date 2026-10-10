<?php
// Upload immagini prodotti (solo admin). POST multipart con campo "image".
// I file finiscono in /uploads e il database salva solo il percorso.

declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';

allow_methods(['POST']);
require_admin();

$file = $_FILES['image'] ?? null;
$err = $file['error'] ?? UPLOAD_ERR_NO_FILE;
// Senza $_FILES ma con dati inviati: superato post_max_size del server
if ((!$file && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) || $err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) {
    fail('Immagine troppo grande per il server (limite ' . ini_get('upload_max_filesize') . '). Usa una foto più leggera.', 413);
}
if (!$file || $err !== UPLOAD_ERR_OK) fail('Nessun file ricevuto o upload non riuscito.');
if ($file['size'] > 5 * 1024 * 1024) fail('Immagine troppo grande (massimo 5 MB).');

$info = @getimagesize($file['tmp_name']);
$types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
if (!$info || !isset($types[$info[2]])) fail('Formato non supportato: usa JPG, PNG o WEBP.');

$dir = dirname(__DIR__) . '/uploads';
if (!is_dir($dir)) mkdir($dir, 0755, true);
if (!is_file($dir . '/.htaccess')) {
    // Nessuno script eseguibile nella cartella upload
    file_put_contents($dir . '/.htaccess', "Options -Indexes -ExecCGI\n<FilesMatch \"\\.(php|phtml|phar|pl|py|cgi|sh)$\">\n  Require all denied\n</FilesMatch>\n");
}

$name = date('Ymd') . '_' . bin2hex(random_bytes(8)) . '.' . $types[$info[2]];
if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) fail('Impossibile salvare il file sul server.', 500);

json_out(['ok' => true, 'url' => '/uploads/' . $name]);
