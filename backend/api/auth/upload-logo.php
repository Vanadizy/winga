<?php
require_once __DIR__.'/../_bootstrap.php';
$account=user();
if(empty($_FILES['logo'])||$_FILES['logo']['error']!==UPLOAD_ERR_OK)fail('Choose a logo image to upload.');
$file=$_FILES['logo'];
if($file['size']>3*1024*1024)fail('Shop logos must be 3 MB or smaller.');
$mime=(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extensions=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
if(!isset($extensions[$mime]))fail('Use a JPG, PNG or WebP image.');
$directory=__DIR__.'/../../uploads/';
if(!is_dir($directory)&&!mkdir($directory,0755,true))fail('Could not prepare the logo folder.',500);
$filename='shop_logo_'.$account['id'].'_'.bin2hex(random_bytes(5)).'.'.$extensions[$mime];
if(!move_uploaded_file($file['tmp_name'],$directory.$filename))fail('Could not save the shop logo.',500);
$path='uploads/'.$filename;
$save=db()->prepare('UPDATE users SET profile_image=? WHERE id=?');
$save->execute([$path,$account['id']]);
out(['success'=>true,'profile_image'=>$path,'message'=>'Shop logo updated.']);
