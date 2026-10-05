<?php
require_once __DIR__.'/../_bootstrap.php';
$u=user();
$params=[];
$where=$u['role']==='admin'?'1=1':'(p.user_id=? OR EXISTS (SELECT 1 FROM product_transfers mine WHERE mine.product_id=p.id AND (mine.from_user_id=? OR mine.to_user_id=?)))';
if($u['role']!=='admin')array_push($params,$u['id'],$u['id'],$u['id']);
if(!empty($_GET['available']))$where.=" AND p.status='available'";
if(!empty($_GET['status'])){
    $status=$_GET['status'];
    if($status==='returned')$where.=' AND EXISTS (SELECT 1 FROM returns rr WHERE rr.product_id=p.id)';
    elseif($status==='transferred'){$where.=' AND EXISTS (SELECT 1 FROM product_transfers tt WHERE tt.product_id=p.id'.($u['role']==='admin'?'':' AND (tt.from_user_id=? OR tt.to_user_id=?)').')';if($u['role']!=='admin')array_push($params,$u['id'],$u['id']);}
    else{$where.=' AND p.status=?';$params[]=$status;}
}
if(!empty($_GET['brand'])){$where.=' AND p.brand LIKE ?';$params[]='%'.$_GET['brand'].'%';}
if(!empty($_GET['q'])){$where.=' AND (p.name LIKE ? OR p.unique_identifier LIKE ? OR p.brand LIKE ?)';$params[]='%'.$_GET['q'].'%';$params[]='%'.$_GET['q'].'%';$params[]='%'.$_GET['q'].'%';}
$s=db()->prepare("SELECT p.*,u.full_name owner_name,u.shop_name,s.id sale_id,s.customer_name,s.customer_phone,s.sold_at,r.id return_id,r.reason return_reason,r.returned_at,r.refund_amount,transfer.id transfer_id,transfer.transferred_at,transfer.from_user_id,transfer.to_user_id,transfer.from_shop,transfer.to_shop FROM products p JOIN users u ON u.id=p.user_id LEFT JOIN sales s ON s.id=(SELECT ss.id FROM sales ss WHERE ss.product_id=p.id ORDER BY ss.sold_at DESC,ss.id DESC LIMIT 1) LEFT JOIN returns r ON r.sale_id=s.id LEFT JOIN (SELECT t.*,f.shop_name from_shop,tu.shop_name to_shop FROM product_transfers t JOIN users f ON f.id=t.from_user_id JOIN users tu ON tu.id=t.to_user_id WHERE t.id=(SELECT MAX(tt.id) FROM product_transfers tt WHERE tt.product_id=t.product_id)) transfer ON transfer.product_id=p.id WHERE $where ORDER BY p.created_at DESC");
$s->execute($params);
$rows=$s->fetchAll();
foreach($rows as &$row){
    $row['images']=product_images((int)$row['id']);
    if($row['sale_id'])$row['sale_details']=['customer_name'=>$row['customer_name'],'customer_phone'=>$row['customer_phone'],'sold_at'=>$row['sold_at']];
    if($row['return_id'])$row['return_details']=['returned_at'=>$row['returned_at'],'reason'=>$row['return_reason'],'refund_amount'=>$row['refund_amount']];
    if($row['transfer_id'])$row['transfer_details']=['transferred_at'=>$row['transferred_at'],'from_user_id'=>$row['from_user_id'],'to_user_id'=>$row['to_user_id'],'from_shop'=>$row['from_shop'],'to_shop'=>$row['to_shop']];
    unset($row['customer_name'],$row['customer_phone'],$row['sold_at'],$row['return_reason'],$row['returned_at'],$row['refund_amount'],$row['transfer_id'],$row['transferred_at'],$row['from_user_id'],$row['to_user_id'],$row['from_shop'],$row['to_shop']);
}
out(['success'=>true,'products'=>$rows]);
