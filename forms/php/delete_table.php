<?php
	$db_name = 'db_ddl_dml';
	$tb_name = $_POST['tb_name'];
	$host = 'BD';
	$user = 'root';
	$password = 'root';
	try {
		$dbh = new PDO("mysql:host={$host}; dbname={$db_name}", 'root', $password);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$sql_delete_tb = "DROP TABLE {$tb_name}";
		$dbh->query($sql_delete_tb);
	}  catch (PDOException $e) {
		echo "Ошибка! Запрос не выполнен" . $e->getMessage();
	}