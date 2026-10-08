<?php
require_once __DIR__.'/../_bootstrap.php';
$u=user();$pid=(int)($_POST['product_id']??0);$files=$_FILES['images']??null;
if(!$files||!isset($files['name']))fail(!empty($_SERVER['CONTENT_LENGTH'])?'The selected images exceed the server upload limit. Upload fewer or smaller images.':'Select at least one product image.');
$s=db()->prepare('SELECT user_id FROM products WHERE id=?');$s->execute([$pid]);if(($s->fetch()['user_id']??0)!=$u['id'])fail('Not your product',403);
$dir=__DIR__.'/../../uploads/';if(!is_dir($dir)&&!mkdir($dir,0755,true))fail('Could not prepare the product image folder.',500);
$extensions=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
$names=(array)$files['name'];$paths=[];$errors=[];$mimeReader=new finfo(FILEINFO_MIME_TYPE);$countQuery=db()->prepare('SELECT COUNT(*) FROM product_images WHERE product_id=?');$countQuery->execute([$pid]);$hasImages=(int)$countQuery->fetchColumn()>0;
foreach($names as $i=>$name){
  $error=$files['error'][$i]??UPLOAD_ERR_NO_FILE;
  if($error!==UPLOAD_ERR_OK){$errors[]=$error===UPLOAD_ERR_INI_SIZE||$error===UPLOAD_ERR_FORM_SIZE?'An image is too large for the server upload limit.':'An image could not be uploaded. Please try again.';continue;}
  $tmp=$files['tmp_name'][$i]??'';$size=(int)($files['size'][$i]??0);
  if($size<1||$size>10*1024*1024){$errors[]='Each product image must be 10 MB or smaller.';continue;}
  $mime=$mimeReader->file($tmp);if(!isset($extensions[$mime])||!@getimagesize($tmp)){$errors[]='Use a JPG, PNG, WebP or GIF image. If your phone saved HEIC, choose JPG in camera settings or convert it before upload.';continue;}
  $fn='product_'.bin2hex(random_bytes(12)).'.'.$extensions[$mime];
  if(!move_uploaded_file($tmp,$dir.$fn)){$errors[]='Could not save an image. Check the uploads folder permissions.';continue;}
  try{db()->prepare('INSERT INTO product_images(product_id,image_path,is_primary) VALUES(?,?,?)')->execute([$pid,'uploads/'.$fn,!$hasImages&&count($paths)===0]);$paths[]='uploads/'.$fn;}
  catch(Throwable $e){@unlink($dir.$fn);throw $e;}
}
if(!$paths)fail($errors[0]??'No images were uploaded.');
out(['success'=>true,'images'=>$paths,'warnings'=>$errors]);
