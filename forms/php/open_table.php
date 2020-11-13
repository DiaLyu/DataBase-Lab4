<?php 
$host = 'BD';
$dbname = 'db_ddl_dml';
$tbname = $_POST['tb_name'];
$user = 'root';
$password = 'root';
try {
	$dbh = new PDO("mysql:host={$host}; dbname={$dbname}", 'root', $password);
} catch (PDOException $e) {
	echo "Ошибка подключения к базе данных<br>" . $e->getMessage() . "<br>";
}
$prim_key = $dbh->query("SHOW KEYS FROM {$tbname} WHERE Key_name = 'PRIMARY'")->fetchAll()[0]["Column_name"];
$rez = $dbh->query("SELECT * FROM {$dbname}.{$tbname}")->fetchAll();
$add_row = "<button class=\"add-row-btn btn\">INSERT</button>";
if ($rez) {
	respond($rez, $tbname, $prim_key);
}
else 
 echo "<h2 class=\"right-block-title\">В таблице `{$tbname}` записей нет</h2><br>".$add_row."<button class=\"back-table-btn btn\" style=\"display: block;\">Назад</button>";

function respond($rez, $tbname, $prim_key){	
		$add_row = "<button class=\"add-row-btn btn\">INSERT</button>";
		$table = "<h2 class=\"right-block-title\">Записи в таблице `{$tbname}`</h2>";
		$table .= $add_row;
		$table .= "<div class=\"table-block\">
				<table class=\"table\" border=\"1\">
			    <thead>
			        <tr>";
		$ind = 0;
		foreach ($rez[0] as $key => $value) {
			if ($ind == 0) {
				if ($key == $prim_key)
					$table .= "<th class=\"primary-key\">{$key}</th>";
				else $table .= "<th>{$key}</th>";
				$ind++;
			} else $ind = 0;
		}
		$table .= "<th>Действия</th></tr></thead><tbody>";
		foreach ($rez as $key => $value) {
			$table .= "<tr>";
			for ($i = 0; $i < count($value)/2; $i++) {
				$table .= "<td>{$value["{$i}"]}</td>";
			}
			$table .= "<td><button class=\"change_row btn\">UPDATE</button><button class=\"delete_row btn\">DELETE</button></td></tr>";
		}
		$table .= "</tbody></table></div>";
		echo $table."<button class=\"back-table-btn btn\">Назад</button>";
}
