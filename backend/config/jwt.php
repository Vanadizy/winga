<?php
const JWT_SECRET = '6d3cf7bcaaafbaaa16d745a3dc5051e25dd2c68622a39887f20eb9c6ac454b16';
function b64url($data) { return rtrim(strtr(base64_encode($data), '+/', '-_'), '='); }
function jwt_encode(array $payload): string { $h=b64url(json_encode(['typ'=>'JWT','alg'=>'HS256'])); $p=b64url(json_encode($payload)); return "$h.$p.".b64url(hash_hmac('sha256', "$h.$p", JWT_SECRET, true)); }
function jwt_decode(string $token): ?array { $a=explode('.', $token); if(count($a)!==3) return null; $sig=b64url(hash_hmac('sha256', "$a[0].$a[1]", JWT_SECRET, true)); if(!hash_equals($sig,$a[2])) return null; $p=json_decode(base64_decode(strtr($a[1], '-_', '+/')),true); return $p && ($p['exp']??0)>time()?$p:null; }
