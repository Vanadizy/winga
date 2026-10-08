<?php
require_once __DIR__.'/../_bootstrap.php';
$u=user();$d=body();required($d,['amount','expense_date','description']);
$amount=(float)$d['amount'];$description=trim($d['description']);
if($amount<=0||$description==='')fail('Enter an amount greater than zero and describe the expense.');
$date=DateTime::createFromFormat('!Y-m-d',$d['expense_date']);if(!$date||$date->format('Y-m-d')!==$d['expense_date'])fail('Enter a valid expense date.');
$s=db()->prepare('INSERT INTO expenses(user_id,amount,expense_date,description) VALUES(?,?,?,?)');
$s->execute([$u['id'],$amount,$d['expense_date'],$description]);
out(['success'=>true,'expense'=>['id'=>(int)db()->lastInsertId(),'amount'=>$amount,'expense_date'=>$d['expense_date'],'description'=>$description]],201);
