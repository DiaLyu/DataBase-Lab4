<?php
	$db_name = 'db_ddl_dml';
	$tb_name = $_POST['tb_name'];
	$key = $_POST['key'];
	$host = 'BD';
	$user = 'root';
	$password = 'root';
	try {
		$dbh = new PDO("mysql:host={$host}; dbname={$db_name}", 'root', $password);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$sql_delete_row = "ALTER TABLE {$tb_name} DROP COLUMN {$key}";
		$dbh->query($sql_delete_row);
	}  catch (PDOException $e) {
		echo "Ошибка! Запрос не выполнен" . $e->getMessage();
	}