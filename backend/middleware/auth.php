<?php
require_once __DIR__.'/../config/jwt.php';
require_once __DIR__.'/../helpers/response.php';
function user(): array {
    // Apache/PHP-CGI may expose Authorization only after an internal rewrite.
    $header=$_SERVER['HTTP_AUTHORIZATION']??$_SERVER['REDIRECT_HTTP_AUTHORIZATION']??'';
    if($header===''&&function_exists('getallheaders')){
        foreach(getallheaders() as $name=>$value){
            if(strcasecmp($name,'Authorization')===0){$header=$value;break;}
        }
    }
    $token=preg_replace('/^Bearer\s+/i','',trim($header));
    $payload=jwt_decode($token);
    if(!$payload) fail('Unauthorized',401);
    $q=db()->prepare('SELECT id,role,status,subscription_end_at,trial_ends_at FROM users WHERE id=?');
    $q->execute([$payload['id']]); $account=$q->fetch();
    if(!$account||$account['status']!=='active') fail('Your account is inactive. Contact the administrator.',403);
    if($account['role']!=='admin') {
        $ends=$account['subscription_end_at']?:$account['trial_ends_at'];
        if(!$ends||strtotime($ends)<time()) { db()->prepare("UPDATE users SET status='suspended',subscription_status='expired' WHERE id=?")->execute([$account['id']]); fail('Subscription expired. Send payment proof to WhatsApp +'.PAYMENT_WHATSAPP.'.',403); }
    }
    return ['id'=>(int)$account['id'],'role'=>$account['role']];
}
function admin(): array { $u=user(); if($u['role']!=='admin') fail('Admin access required',403); return $u; }
