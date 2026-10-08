<?php
require_once __DIR__.'/../_bootstrap.php';
$u=user();
$start=$_GET['start_date']??'';$end=$_GET['end_date']??'';
$validDate=fn($v)=>is_string($v)&&preg_match('/^\d{4}-\d{2}-\d{2}$/',$v)&&DateTime::createFromFormat('!Y-m-d',$v)?->format('Y-m-d')===$v;
if($start!==''&&!$validDate($start))fail('Invalid start date. Use YYYY-MM-DD.');
if($end!==''&&!$validDate($end))fail('Invalid end date. Use YYYY-MM-DD.');
if(($start==='')!==($end===''))fail('Choose both a start date and an end date.');
if($start!==''&&$start>$end)fail('Start date must be on or before end date.');
$custom=$start!=='';
$dateWhere=$custom?' AND sold_at>=? AND sold_at<?':' AND sold_at>=?';
$from=$custom?$start:((($_GET['period']??'month')==='day')?date('Y-m-d',strtotime('-30 days')):date('Y-m',strtotime('-30 months')));
$fromDate=$custom?$start:((($_GET['period']??'month')==='day')?$from:$from.'-01');
$toExclusive=$custom?date('Y-m-d',strtotime($end.' +1 day')):null;
$period=$custom?'day':((($_GET['period']??'month')==='day')?'day':'month');
$fmt=$period==='day'?'%Y-%m-%d':'%Y-%m';
$summary=db()->prepare("SELECT DATE_FORMAT(sold_at,'$fmt') label,COUNT(*) sales,COALESCE(SUM(profit),0) profit,COALESCE(SUM(selling_price),0) revenue FROM sales WHERE seller_id=? AND id NOT IN(SELECT sale_id FROM returns) AND sold_at>=?".($custom?' AND sold_at<?':'')." GROUP BY label ORDER BY label DESC".($custom?'':' LIMIT 31'));
$summaryParams=[$u['id'],$fromDate];if($custom)$summaryParams[]=$toExclusive;$summary->execute($summaryParams);
$details=db()->prepare('SELECT s.*,p.name,p.brand,p.category,p.unique_identifier,p.identifier_type FROM sales s JOIN products p ON p.id=s.product_id WHERE s.seller_id=? AND s.sold_at>=?'.($custom?' AND s.sold_at<?':'').' AND s.id NOT IN(SELECT sale_id FROM returns) ORDER BY s.sold_at DESC');
$detailParams=[$u['id'],$fromDate];if($custom)$detailParams[]=$toExclusive;$details->execute($detailParams);
$expenseSql="SELECT DATE_FORMAT(expense_date,'$fmt') label,COALESCE(SUM(amount),0) expenses FROM expenses WHERE user_id=? AND expense_date>=?".($custom?' AND expense_date<=?':'')." GROUP BY label ORDER BY label DESC".($custom?'':' LIMIT 31');
$expenseParams=[$u['id'],$fromDate];if($custom)$expenseParams[]=$end;$expenseQuery=db()->prepare($expenseSql);$expenseQuery->execute($expenseParams);$expensesByPeriod=[];foreach($expenseQuery->fetchAll() as $row)$expensesByPeriod[$row['label']]=(float)$row['expenses'];
$rows=$summary->fetchAll();foreach($rows as &$row){$row['expenses']=$expensesByPeriod[$row['label']]??0;$row['net_profit']=(float)$row['profit']-(float)$row['expenses'];unset($expensesByPeriod[$row['label']]);}unset($row);
foreach($expensesByPeriod as $label=>$amount)$rows[]=['label'=>$label,'sales'=>0,'profit'=>0,'revenue'=>0,'expenses'=>$amount,'net_profit'=>-$amount];
usort($rows,fn($a,$b)=>strcmp($b['label'],$a['label']));$rows=array_slice($rows,0,31);
$expenseDetail=db()->prepare('SELECT id,amount,expense_date,description FROM expenses WHERE user_id=? AND expense_date>=?'.($custom?' AND expense_date<=?':'').' ORDER BY expense_date DESC,id DESC');$expenseParams=[$u['id'],$fromDate];if($custom)$expenseParams[]=$end;$expenseDetail->execute($expenseParams);
$stockEnd=$custom?$end:date('Y-m-d');
$stock=db()->prepare("SELECT COALESCE(SUM(CASE WHEN p.created_at<DATE_ADD(?,INTERVAL 1 DAY) AND (s.sold_at IS NULL OR s.sold_at>=DATE_ADD(?,INTERVAL 1 DAY)) AND (t.transferred_at IS NULL OR t.transferred_at>=DATE_ADD(?,INTERVAL 1 DAY)) THEN p.cost_price ELSE 0 END),0) stock_cost,COALESCE(SUM(CASE WHEN p.created_at<DATE_ADD(?,INTERVAL 1 DAY) AND (s.sold_at IS NULL OR s.sold_at>=DATE_ADD(?,INTERVAL 1 DAY)) AND (t.transferred_at IS NULL OR t.transferred_at>=DATE_ADD(?,INTERVAL 1 DAY)) THEN p.selling_price ELSE 0 END),0) expected_revenue,COALESCE(SUM(CASE WHEN p.created_at<DATE_ADD(?,INTERVAL 1 DAY) AND (s.sold_at IS NULL OR s.sold_at>=DATE_ADD(?,INTERVAL 1 DAY)) AND (t.transferred_at IS NULL OR t.transferred_at>=DATE_ADD(?,INTERVAL 1 DAY)) THEN p.selling_price-p.cost_price ELSE 0 END),0) expected_profit,COALESCE(SUM(CASE WHEN p.created_at<DATE_ADD(?,INTERVAL 1 DAY) AND (s.sold_at IS NULL OR s.sold_at>=DATE_ADD(?,INTERVAL 1 DAY)) AND (t.transferred_at IS NULL OR t.transferred_at>=DATE_ADD(?,INTERVAL 1 DAY)) THEN 1 ELSE 0 END),0) stock_count FROM products p LEFT JOIN sales s ON s.product_id=p.id LEFT JOIN (SELECT product_id,MAX(transferred_at) transferred_at FROM product_transfers WHERE from_user_id=? GROUP BY product_id) t ON t.product_id=p.id WHERE p.user_id=?");
$stockDateParams=[];for($i=0;$i<4;$i++)array_push($stockDateParams,$stockEnd,$stockEnd,$stockEnd);array_push($stockDateParams,$u['id'],$u['id']);$stock->execute($stockDateParams);
$stockMetrics=$stock->fetch();$expenseTotal=db()->prepare('SELECT COALESCE(SUM(amount),0) FROM expenses WHERE user_id=? AND expense_date<=?');$expenseTotal->execute([$u['id'],$stockEnd]);$stockMetrics['total_expenses']=(float)$expenseTotal->fetchColumn();$stockMetrics['expected_net_profit']=(float)$stockMetrics['expected_profit']-(float)$stockMetrics['total_expenses'];
out(['success'=>true,'report'=>$rows,'sold_products'=>$details->fetchAll(),'expenses'=>$expenseDetail->fetchAll(),'stock_metrics'=>$stockMetrics,'date_range'=>['start'=>$fromDate,'end'=>$stockEnd]]);



