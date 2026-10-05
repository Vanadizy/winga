<?php
require_once __DIR__.'/../_bootstrap.php';
admin();
if($_SERVER['REQUEST_METHOD']==='DELETE'){
    $id=(int)($_GET['id']??0);
    if($id<1)fail('A valid user id is required.');
    $current=user();
    if($id===(int)$current['id'])fail('You cannot delete your own admin account.',400);
    $find=db()->prepare('SELECT id,role FROM users WHERE id=?');
    $find->execute([$id]);
    $target=$find->fetch();
    if(!$target)fail('User not found.',404);
    if($target['role']==='admin')fail('Admin accounts cannot be deleted from this screen.',403);
    try {
        db()->beginTransaction();
        $remove=db()->prepare('DELETE FROM returns WHERE seller_id=?');$remove->execute([$id]);
        $remove=db()->prepare('DELETE FROM sales WHERE seller_id=?');$remove->execute([$id]);
        $remove=db()->prepare('DELETE FROM product_transfers WHERE from_user_id=? OR to_user_id=?');$remove->execute([$id,$id]);
        $remove=db()->prepare('DELETE FROM product_requests WHERE requester_id=? OR accepted_by=?');$remove->execute([$id,$id]);
        $remove=db()->prepare('UPDATE audit_logs SET actor_id=NULL WHERE actor_id=?');$remove->execute([$id]);
        $remove=db()->prepare('DELETE FROM products WHERE user_id=?');$remove->execute([$id]);
        $del=db()->prepare('DELETE FROM users WHERE id=?');
        $del->execute([$id]);
        db()->commit();
        out(['success'=>true,'message'=>'User and their shop records deleted.']);
    }catch(Throwable $e){if(db()->inTransaction())db()->rollBack();throw $e;}
}
$s=db()->query('SELECT id,full_name,shop_name,phone,email,role,status,trial_ends_at,subscription_start_at,subscription_end_at,subscription_status,created_at FROM users ORDER BY created_at DESC');
$rows=$s->fetchAll();
foreach($rows as &$row){$end=$row['subscription_end_at']?:$row['trial_ends_at'];$row['days_remaining']=$row['role']==='admin'?null:($end?max(0,(int)ceil((strtotime($end)-time())/86400)):0);$row['days_type']=$row['subscription_end_at']?'subscription':'trial';}
out(['success'=>true,'users'=>$rows]);
