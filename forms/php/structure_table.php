<?php 
$host = 'BD';
$dbname = 'db_ddl_dml';
$tbname = $_POST['tb_name'];
$user = 'root';
$password = 'root';
try {
	$dbh = new PDO("mysql:host={$host}; dbname={$dbname}", 'root', $password);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$add_row = "<button class=\"add-stb-btn btn\">ALTER ADD</button>";
$result = $dbh->query("SHOW COLUMNS FROM {$tbname}")->fetchAll();
//var_dump($result);
$table = "<h2 class=\"right-block-title\">
			Структура таблицы `{$tbname}`
		</h2>".$add_row;
if ($result) {
	$table .= "<div class=\"table-block\">
				<table class=\"table\" border=\"1\">
			    <thead>
			        <tr>
			            <th>Имя</th>
			            <th>Тип</th>
			            <th>Null</th>
			            <th>Ключ</th>
			            <th>По умолчанию</th>
			            <th>Extra</th>
			            <th>Действия</th>
			        </tr>
			    </thead>";
	$table .= "<tbody>";
	$ind = 1;
	foreach ($result as $value) {
		$table .= "<tr>
		            <td>{$value["Field"]}</td>
		            <td>{$value["Type"]}</i></td>
		            <td>{$value["Null"]}</td>
		            <td>{$value["Key"]}</td>
		            <td>{$value["Default"]}</td>
		            <td>{$value["Extra"]}</td>
		            <td><button class=\"change_stb btn\">ALTER CHANGE</button><button class=\"delete_stb btn\">ALTER DROP</button></td>
				      </tr>";
	}
$table .= "</tbody></table></div>";
$add_table = "<button class=\"lets-go-back-btn btn\">Назад</button>";
echo $table.$add_table;
}
else 
	echo "<h2 class=\"right-block-title\">
			Ошибка!
		</h2>".$add_table;		
}  catch (PDOException $e) {
	echo "Ошибка! Запрос не выполнен" . $e->getMessage();
}
