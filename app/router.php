<?php

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$docRoot = __DIR__.'/public';

if ($uri !== '/' && file_exists($docRoot.$uri)) {
    return false;
}

$_SERVER['SCRIPT_FILENAME'] = $docRoot.'/index.php';
$_SERVER['DOCUMENT_ROOT'] = $docRoot;

require $docRoot.'/index.php';
