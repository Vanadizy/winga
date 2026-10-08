<?php
require_once __DIR__.'/../_bootstrap.php';$u=user();
$s=db()->prepare('SELECT id,amount,expense_date,description,created_at FROM expenses WHERE user_id=? ORDER BY expense_date DESC,id DESC');$s->execute([$u['id']]);$rows=$s->fetchAll();$total=array_sum(array_map(fn($r)=>(float)$r['amount'],$rows));out(['success'=>true,'expenses'=>$rows,'total'=>$total]);
