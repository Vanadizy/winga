<?php
require_once __DIR__.'/../_bootstrap.php';
$u=user();
$id=$u['id'];
$summary=db()->prepare("SELECT (SELECT COUNT(*) FROM products WHERE user_id=? AND status='available') available_stock,(SELECT COUNT(*) FROM products WHERE user_id=? AND status='sold') sold_stock,(SELECT COUNT(*) FROM sales WHERE seller_id=? AND DATE(sold_at)=CURDATE() AND id NOT IN(SELECT sale_id FROM returns)) today_sales,(SELECT COALESCE(SUM(profit),0) FROM sales WHERE seller_id=? AND DATE(sold_at)=CURDATE() AND id NOT IN(SELECT sale_id FROM returns)) today_profit,(SELECT COUNT(*) FROM product_requests WHERE requester_id=? AND status='open') pending_requests,(SELECT COALESCE(SUM(cost_price),0) FROM products WHERE user_id=? AND status='available') stock_value");
$summary->execute([$id,$id,$id,$id,$id,$id]);
$stats=$summary->fetch();
$trend=db()->prepare("SELECT DATE_FORMAT(sold_at,'%a') label,COALESCE(SUM(selling_price),0) value,DATE(sold_at) sale_date FROM sales WHERE seller_id=? AND sold_at>=DATE_SUB(CURDATE(),INTERVAL 6 DAY) AND id NOT IN(SELECT sale_id FROM returns) GROUP BY DATE(sold_at) ORDER BY sale_date");
$trend->execute([$id]);
$stats['sales_trend']=$trend->fetchAll();
out(['success'=>true,'stats'=>$stats]);
