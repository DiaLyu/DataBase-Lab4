<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="libs/overhang/overhang.css">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <title>База данных</title>
</head>
<body>
  <div class="main">
    <div class="left-block">
      <h1 class="left-block_header">
        Работа с базой данных
      </h1>
      <div class="left-block_btn">
          <input type="submit" name="btn_CREATE" class = "btn_CREATE" value="CREATE">
          <input type="submit" name="btn_SELECT" class = "btn_SELECT" value="SELECT">
      </div>
    </div>
    <div class="right-block">
      <?php require_once("php/open_database.php");?>
    </div>
  </div>

  <script src="js/jquery.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>
  <script src="libs/overhang/overhang.js"></script>
  <script src="js/script.js"></script>
</body>
</html>