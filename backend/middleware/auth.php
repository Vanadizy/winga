<?php
require_once __DIR__.'/../config/jwt.php'; require_once __DIR__.'/../helpers/response.php';
function user(): array { $h=$_SERVER['HTTP_AUTHORIZATION']??''; $token=preg_replace('/^Bearer\\s+/i','',$h); $p=jwt_decode($token); if(!$p) fail('Unauthorized',401); return $p; }
function admin(): array { $u=user(); if(($u['role']??'')!=='admin') fail('Admin access required',403); return $u; }
