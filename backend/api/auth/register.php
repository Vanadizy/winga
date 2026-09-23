<?php
require_once __DIR__.'/../_bootstrap.php';
$d=body(); required($d,['full_name','phone','password']);
$email=trim($d['email']??'');
if($email!==''&&!filter_var($email,FILTER_VALIDATE_EMAIL)) fail('Enter a valid email address.');
if(strlen($d['password'])<6) fail('Password must be at least 6 characters.');
try {
 $days=(int)(db()->query("SELECT setting_value FROM app_settings WHERE setting_key='trial_days'")->fetch()['setting_value']??TRIAL_DAYS);$q=db()->prepare('INSERT INTO users(full_name,shop_name,phone,email,password,trial_ends_at,subscription_status) VALUES(?,?,?,?,?,DATE_ADD(NOW(), INTERVAL '.$days.' DAY),"trial")');
 $q->execute([trim($d['full_name']),trim($d['shop_name']??''),trim($d['phone']),$email?:null,password_hash($d['password'],PASSWORD_DEFAULT)]);
 out(['success'=>true,'message'=>"Account created. Your $days-day trial starts now."],201);
} catch(PDOException $e) { if($e->getCode()==='23000') fail('Phone or email is already registered.',409); error_log($e->getMessage()); fail('Could not create account. Run the subscription migration first.',500); }
