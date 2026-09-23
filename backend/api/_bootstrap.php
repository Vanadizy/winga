<?php
require_once __DIR__.'/../config/cors.php'; require_once __DIR__.'/../config/database.php'; require_once __DIR__.'/../config/app.php'; require_once __DIR__.'/../helpers/response.php'; require_once __DIR__.'/../helpers/validator.php'; require_once __DIR__.'/../helpers/profit.php'; require_once __DIR__.'/../middleware/auth.php';
// Every API failure stays JSON, even when PHP/MySQL raises an unexpected exception.
set_exception_handler(function (Throwable $exception): void {
    error_log('WINGA API error: '.$exception->getMessage());
    if (!headers_sent()) fail('Server error. Check database settings and the PHP error log.', 500);
});
function product_images(int $id): array { $s=db()->prepare('SELECT id,image_path,is_primary FROM product_images WHERE product_id=?');$s->execute([$id]);return $s->fetchAll(); }
function product_row(array $p): array { $p['images']=product_images((int)$p['id']); return $p; }
