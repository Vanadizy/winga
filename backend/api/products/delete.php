<?php
require_once __DIR__.'/../_bootstrap.php';
$u=user();$d=body();required($d,['id']);
$find=db()->prepare('SELECT id,status FROM products WHERE id=?'.($u['role']==='admin'?'':' AND user_id=?'));
$find->execute($u['role']==='admin'?[$d['id']]:[$d['id'],$u['id']]);$p=$find->fetch();
if(!$p)fail('Product not found in your shop.',404);
if($p['status']!=='available')fail('Only available products can be deleted.',403);
$s=db()->prepare('DELETE FROM products WHERE id=?');$s->execute([$p['id']]);out(['success'=>true,'message'=>'Product deleted']);
