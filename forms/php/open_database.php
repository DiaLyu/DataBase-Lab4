<?php 
$host = 'BD';
$dbname = 'db_ddl_dml';
$user = 'root';
$password = 'root';
try {
	$dbh = new PDO("mysql:host={$host}; dbname={$dbname}", 'root', $password);
} catch (PDOException $e) {
	echo "Ошибка подключения к базе данных<br>" . $e->getMessage() . "<br>";
}
$result = $dbh->query("SHOW TABLE STATUS")->fetchAll();
$table = "<h2 class=\"right-block-title\">
			Список таблиц базы данных `{$dbname}`
		</h2>";
if ($result) {
	$table .= "<div class=\"table-block\">
				<table class=\"table\" border=\"1\">
			    <thead>
			        <tr>
			            <th>Имя таблицы</th>
			            <th>Действие</th>
			        </tr>
			    </thead>";
	$table .= "<tbody>";
	$ind = 1;
	foreach ($result as $value) {
		$table .= "<tr>
		            <td>{$value["Name"]}</td>
		            <td><button class=\"open_table_i btn\">SHOW</button><button class=\"struct_table btn\">Structure</button><button class=\"delete_table btn\">DROP</button></td>
				      </tr>";
	}
$table .= "</tbody></table></div>";
echo $table;
}
else {
	echo "<h2 class=\"right-block-title\">
			Список таблиц базы данных `{$dbname}` пуст
		</h2>".$add_table;
}


