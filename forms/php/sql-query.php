<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	$host = 'BD';
	$user = 'root';
	$password = 'root';
	if (isset($_POST['current_db'])) {
		$current_db = $_POST['current_db'];
		try {
			$dbh = new PDO("mysql:host={$host}; dbname={$current_db}", 'root', $password);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$textarea_text = $_POST['textarea_text'];
			$rez = $dbh->query($textarea_text);
			if (strtoupper(explode(' ', $textarea_text)[0]) == "SELECT" ||
		        strtoupper(explode(' ', $textarea_text)[0]) == "CALL") {
				$rez = $rez->fetchAll();
				respond($rez);
			}
			else echo "Запрос выполнен!";
		} catch (PDOException $e) {
			echo "Ошибка! Запрос не выполнен" . $e->getMessage();
		}
	}
	else {
		try {
			$dbh = new PDO("mysql:host={$host};", 'root', $password);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$textarea_text = $_POST['textarea_text'];
			$rez = $dbh->query($textarea_text)->fetchAll();
			if (strtoupper(explode(' ', $textarea_text)[0]) == "SELECT")
				respond($rez);
			else echo "Запрос выполнен!";
		} catch (PDOException $e) {
			echo "Ошибка! Запрос не выполнен" . $e->getMessage();
		}
	}
	function respond($rez){
		if ($rez == null)
			echo "<h2 class=\"right-block-title\">Результат выборки пустой</h2>";
		else {
			$table = "<h2 class=\"right-block-title\">Результат выборки</h2>";
			$table .= "<div class=\"table-block\">
					<table class=\"table\" border=\"1\">
				    <thead>
				        <tr>";
			$ind = 0;
			foreach ($rez[0] as $key => $value) {
				if ($ind == 0) {
					$table .= "<th>{$key}</th>";
					$ind++;
				} else $ind = 0;
			}
			$table .= "</tr></thead><tbody>";
			foreach ($rez as $key => $value) {
				$table .= "<tr>";
				for ($i = 0; $i < count($value)/2; $i++) {
					$table .= "<td>{$value["{$i}"]}</td>";
				}
				$table .= "</tr>";
			}
			$table .= "</tbody></table></div>";
			$table .= "<button class=\"back-table-btn btn\">Назад</button>";
			echo $table;
		}
	}