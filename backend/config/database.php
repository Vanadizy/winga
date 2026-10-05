<?php
// For a new host, edit the four fallback values below or set EMS_DB_* environment variables.
const DB_HOST = 'localhost';
const DB_NAME = 'pangaleo_uza';
const DB_USER = 'pangaleo_admin';
const DB_PASS = 'pangaleo2026';
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $host = getenv('EMS_DB_HOST') ?: DB_HOST;
    $name = getenv('EMS_DB_NAME') ?: DB_NAME;
    $username = getenv('EMS_DB_USER') ?: DB_USER;
    $password = getenv('EMS_DB_PASS');
    $password = $password === false ? DB_PASS : $password;
    $pdo = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
