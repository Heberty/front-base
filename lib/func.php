<?php

$content = 'pages/index.php';

if(isset($_GET['path']) && trim($_GET['path'])) {
	$newPath = 'pages/' . $_GET['path'] . '.php';

	if(file_exists(dirname(__DIR__) . '/' . $newPath)) {
		$content = $newPath;
	}
} else {
	// Saída caso o .htaccess não funcione
	$requests = explode("/", trim($_SERVER['REQUEST_URI']));
	foreach($requests as $request) {
		if(trim($request) != '') {
			$newPath = 'pages/' . $request . '.php';

			if(file_exists(dirname(__DIR__) . '/' . $newPath)) {
				$content = $newPath;
			}

			break;		
		}
	}
}