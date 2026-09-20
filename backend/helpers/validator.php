<?php
function required(array $data, array $fields): void { foreach($fields as $f) if(!isset($data[$f]) || trim((string)$data[$f])==='') fail("$f is required"); }
