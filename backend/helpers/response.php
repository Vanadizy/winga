<?php
function out($data, int $status=200): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
function fail(string $message, int $status=400, array $errors=[]): never { out(['success'=>false,'message'=>$message,'errors'=>$errors],$status); }
function body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return $_POST;
    $value = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($value)) fail('Request body must be valid JSON.', 400);
    return $value;
}
