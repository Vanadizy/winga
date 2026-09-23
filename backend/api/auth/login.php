<?php
require_once __DIR__.'/../_bootstrap.php';
$d=body(); required($d,['phone','password']);
$q=db()->prepare('SELECT * FROM users WHERE phone=?'); $q->execute([$d['phone']]); $u=$q->fetch();
if(!$u||!password_verify($d['password'],$u['password'])) fail('Invalid phone or password',401);
if($u['status']!=='active') fail('Your account is suspended. Contact support on WhatsApp to restore access.',403,['payment_whatsapp'=>PAYMENT_WHATSAPP,'payment_required'=>true]);
if($u['role']!=='admin') { $ends=$u['subscription_end_at']?:$u['trial_ends_at']; if(!$ends||strtotime($ends)<time()) {db()->prepare("UPDATE users SET status='suspended',subscription_status='expired' WHERE id=?")->execute([$u['id']]);fail('Your trial or subscription has ended. Contact us on WhatsApp to continue.',403,['payment_whatsapp'=>PAYMENT_WHATSAPP,'payment_required'=>true]);} }
$end=$u['subscription_end_at']?:$u['trial_ends_at'];$u['days_remaining']=$u['role']==='admin'?null:max(0,(int)ceil((strtotime($end)-time())/86400));$u['payment_whatsapp']=PAYMENT_WHATSAPP;unset($u['password']); $token=jwt_encode(['id'=>(int)$u['id'],'role'=>$u['role'],'exp'=>time()+604800]); out(['success'=>true,'token'=>$token,'user'=>$u]);
