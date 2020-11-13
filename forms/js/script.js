$(document).ready(function(){
	var current_db = "db_ddl_dml"; // текущая бд
	var current_tb = ""; // текущая таблица
	var gl_values = [];
	var gl_prim_key = "";
	var gl_name_tb = "";


	$(".right-block").on("input heyup", ".input_num", function(e) {
			var text_input = $(this).val();
			if (! /^[0-9]+$/.test(text_input)) {
	    	text_input = text_input.substring(0,text_input.length-1);
	    	$(this).val(text_input);
	    }
	}); // вводятся только цифры
	$(".right-block").on('input keyup', ".input-count-rows-table", function(e) {
	    var text_input = $(this).val();
	    if (! /^[0-9]+$/.test(text_input)) {
	    	text_input = text_input.substring(0,text_input.length-1);
	    	$(this).val(text_input);
	    }
	    else {
	    	var count_rows = $(".input-count-rows-table").val();
	    	var table = "<div class=\"table-add-table table-block\">";
				table += "<table class=\"table\">";
				table += 	"<thead>";
				table += 		"<tr>";
				table += 			"<th>Имя</th><th>Тип</th><th>Длина</th><th>Атрибуты</th><th>Null</th><th>Уникальный</th><th>Автоинкремент</th>";
				table += 		"</tr>";
				table += 	"</thead><tbody>"
	    	if (count_rows >= 1) {
	    		for (var i = 1; i <= count_rows; i++) {
	    			table += "<tr>";
	    			table += "<td><input class=\"row-"+ i +" inp-name\" type=\"text\"></td>";
	    			table += "<td><select class=\"row-"+ i +"\"><option selected value=\"INT\">INT</option><option value=\"VARCHAR\">VARCHAR</option><option value=\"TEXT\">TEXT</option><option value=\"DOUBLE\">DOUBLE</option><option value=\"DATE\">DATE</option><option value=\"DATETIME\">DATETIME</option><option value=\"TIMESTAMP\">TIMESTAMP</option></select></td>";
	    			table += "<td><input class=\"row-"+ i +" input_num\" type=\"text\"></td>";
	    			table += "<td><select class=\"row-"+ i +"\"><option selected value=\"\"></option><option value=\"BINARY\">BINARY</option><option value=\"UNSIGNED\">UNSIGNED</option></select></td>";
	    			table += "<td style=\"width: 40px;\"><input class=\"row-"+ i +" null-chkb\" type=\"checkbox\"></td>";
	    			table += "<td><input class=\"row-"+ i +" uniq-chkb\" type=\"checkbox\"></td>";
	    			table += "<td style=\"width: 40px;\"><input class=\"row-"+ i +" autoincr-chkb\" type=\"checkbox\"></td>";
	    			table += "</tr>";
	    		}
	    	}
				table += "</tbody></table>";
				table += "</div>";
				add_table_btn = "<button class=\"btn-create-table-cont btn\">Создать</button>";
				add_table_btn += "<button class=\"back-table-btn btn\">Назад</button>";
	    	if (count_rows > 0 )
					$(".table-add-table").empty().append(table).append(add_table_btn);
				else 
					$(".table-add-table").empty();
	    }
	}); // вводятся только цифры
	$(".right-block").on("click", ".autoincr-chkb", function(e) {
		var row_number = $(this).attr("class");
		if ($(this).is(":checked")) {
			$(".autoincr-chkb").each(function(index, el) {
				if (!$(this).hasClass(row_number))
				  $(this).prop("checked",false);
			});
		}
	});
	$(".btn_CREATE").on("click", function(e) {
		e.preventDefault();
		var add_table = "<h2 class=\"right-block-title\">Создать таблицу</h2>";
		add_table += "<form class=\"create-table-fblock\">";
		add_table +=	"<input required type=\"text\" class=\"input-name-table\" placeholder=\"Название таблицы\">";
		add_table +=	"<input required type=\"text\" class=\"input-count-rows-table\" placeholder=\"Кол-во столбцов\">";
		add_table +=	"</form>";
		add_table += "<div class=\"table-add-table table-block\"></div>";
		$(".right-block").empty().append(add_table);
	}); // нажатие кнопки добавить таблицу
	$(".right-block").on("click", ".btn-create-table-cont", function(e){
		e.preventDefault();
		var count_rows = $(".input-count-rows-table").val();
		var check = true;
		if ($(".input-name-table").val().trim() == "") {
			check = false;
			$("body").overhang({
				  type: "error",
				  message: "Необходимо ввести имя таблицы",
			});
		}
		var inp_name = $(".inp-name");
		inp_name.each(function(index){
			if ($(this).val().trim() == "") {
				check = false;
				$("body").overhang({
					  type: "error",
					  message: "Необходимо ввести имена столбцов",
				});
			}
		});
		inp_name.each(function(index1){
			var t = $(this).val().trim();
			inp_name.each(function(index2) {
				if (index1 != index2)
					if (t == $(this).val().trim()) {
						check = false;
						$("body").overhang({
							  type: "error",
							  message: "Имена столбцов должны быть различны",
						});
					}
			});
		})
		if (check && count_rows > 0) {
			var arr_table = [];
			$(".table-add-table .table tr").each(function(index, el) {
				var values = [];
				var ind = 0;
				//alert($(this).find("td").length);
				$(this).find("td").each(function(index2, el2) {
					if (ind == 0) values.push($(this).find('input').val());
					if (ind == 1) values.push($(this).find('select').val());
					if (ind == 2) 
						if ($(this).find('input').val() == "") values.push(10);
						else values.push($(this).find('input').val());
					if (ind == 3) values.push($(this).find('select').val());
					if (ind == 4) values.push($(this).find('input').is(':checked'));
					if (ind == 5) values.push($(this).find('input').is(':checked'));
					if (ind == 6) values.push($(this).find('input').is(':checked'));
					ind++;
				});
				arr_table.push(values);
			})
			$.post("../php/create_table.php",{current_db: current_db, table_name: $(".input-name-table").val().trim(),count_rows: count_rows, table: arr_table}).done(function(result) {
				if (result.search("Ошибка") == -1) {
					$("body").overhang({
					  type: "success",
					  message: result,
					});
					$.post("../php/open_database.php",{db_name: current_db}).done(function(result) {
						$('.right-block').empty().append(result);
					}).fail(function(error) {
						console.log(error.message);
					});
				} else {
					$("body").overhang({
					  type: "error",
				  	closeConfirm: true,
					  message: result,
					});
				}
			}).fail(function(error) {
				console.log(error.message);
			});
		}
	});// (получение информации от польз) добавление таблицы


	$(".right-block").on("click", ".delete_table", function(e) {
		e.preventDefault();
		var tb_name = $(this).parent().parent().children("td:nth-child(1)").text();
		$("body").overhang({
			type: "confirm",
		  message: "Вы уверены, что хотите удалить таблицу \"" + tb_name + "\"?",
		  overlay: true,
		  yesMessage: "Да",
		  noMessage: "Нет",
		  callback: function (value) {
		    if (value) {
					$.post("../php/delete_table.php",{db_name: current_db, tb_name: tb_name}).done(function(result) {
						if (result.search("Ошибка") == -1) {
							$.post("../php/open_database.php", {db_name: current_db}).done(function(result) {
								$('.right-block').empty().append(result);
							});
						} else {
							$("body").overhang({
								  type: "error",
								  message: result,
				  				closeConfirm: true
							});
						}

					}).fail(function(error) {
						console.log(error.message);
					});
				}
		  }
		});
		//$(".right-block").empty().append(add_table);
	});
	$(".right-block").on("click", ".struct_table", function(e) {
		e.preventDefault();
		var tb_name = $(this).parent().parent().children("td:nth-child(1)").text();
		current_tb = tb_name;
		$.post("../php/structure_table.php",{db_name: current_db, tb_name: tb_name}).done(function(result) {			
			if (result.search("Ошибка") == -1) {
				$('.right-block').empty().append(result);
			} else {
				$("body").overhang({
					  type: "error",
					  message: result,
	  				closeConfirm: true
				});
			}
		}).fail(function(error) {
			console.log(error.message);
		});
	});
	$(".right-block").on("click", ".lets-go-back-btn", function(e) {
		e.preventDefault();
		$.post("../php/open_database.php",{db_name: current_db}).done(function(result) {
			$('.right-block').empty().append(result);
		}).fail(function(error) {
			console.log(error.message);
		});
	})
	$(".right-block").on("click", ".back-table-btn", function(e) {
		e.preventDefault();
		$.post("../php/open_database.php",{db_name: current_db}).done(function(result) {
			$('.right-block').empty().append(result);
		}).fail(function(error) {
			console.log(error.message);
		});
	})
	$(".right-block").on('click', ".open_table_i",function(e){
		e.preventDefault();
		var tb_name = $(this).parent().parent().children("td:nth-child(1)").text();
		current_tb = tb_name;
		$.post("../php/open_table.php",{tb_name: tb_name, db_name: current_db}).done(function(result) {
			$("body").overhang({
			  type: "success",
			  message: "Подключились к таблице \"" + tb_name + "\"",
			});
			$('.right-block').empty().append(result);
		}).fail(function(error) {
			console.log(error.message);
		});
	}); // переход в таблицу


	// изменение таблицы
	$(".right-block").on('click', ".delete_stb", function(e) {
		e.preventDefault();
		var delete_stb_name = $(this).parent().parent().children("td:nth-child(1)").text();
		$("body").overhang({
			type: "confirm",
		  message: "Вы уверены, что хотите удалить столбец с именем \"" + delete_stb_name + "\"?",
		  overlay: true,
		  yesMessage: "Да",
		  noMessage: "Нет",
		  callback: function (value) {
		    if (value) {
					$.post("../php/delete_stb.php",{db_name: current_db, tb_name: current_tb, key: delete_stb_name}).done(function(result) {
						if (result.search("Ошибка") == -1) {
							$.post("../php/structure_table.php",{db_name: current_db, tb_name: current_tb}).done(function(result) {			
								$('.right-block').empty().append(result);
							}).fail(function(error) {
								console.log(error.message);
							});
						} else {
							$("body").overhang({
								  type: "error",
								  message: result,
				  				closeConfirm: true
							});
						}
					}).fail(function(error) {
						console.log(error.message);
					});
				}
		  }
		});
	}) // удалить строку в таблице
	$(".right-block").on("click", ".add-stb-btn", function(e) {
		e.preventDefault();
		var add_table = "<h2 class=\"right-block-title\">Добавление столбца в таблицу \""+ current_tb + "\"</h2>";
		var table = "<div style=\"margin-left: 100px;\" class=\"table-add-table table-block\">";
				table += "<table class=\"table\">";
				table += 	"<thead>";
				table += 		"<tr>";
				table += 			"<th>Имя</th><th>Тип</th><th>Длина</th><th>Атрибуты</th><th>Null</th><th>Уникальный</th><th>Автоинкремент</th>";
				table += 		"</tr>";
				table += 	"</thead><tbody>"
  			table += "<tr>";
  			table += "<td><input class=\"row-"+ 1 +" inp-name\" type=\"text\"></td>";
  			table += "<td><select class=\"row-"+ 1 +"\"><option selected value=\"INT\">INT</option><option value=\"VARCHAR\">VARCHAR</option><option value=\"TEXT\">TEXT</option><option value=\"DOUBLE\">DOUBLE</option><option value=\"DATE\">DATE</option><option value=\"DATETIME\">DATETIME</option><option value=\"TIMESTAMP\">TIMESTAMP</option></select></td>";
  			table += "<td><input class=\"row-"+ 1 +" input_num\" type=\"text\"></td>";
  			table += "<td><select class=\"row-"+ 1 +"\"><option selected value=\"\"></option><option value=\"BINARY\">BINARY</option><option value=\"UNSIGNED\">UNSIGNED</option></select></td>";
  			table += "<td style=\"width: 40px;\"><input class=\"row-"+ 1 +" null-chkb\" type=\"checkbox\"></td>";
  			table += "<td><input class=\"row-"+ 1 +" uniq-chkb\" type=\"checkbox\"></td>";
  			table += "<td style=\"width: 40px;\"><input class=\"row-"+ 1 +" autoincr-chkb\" type=\"checkbox\"></td>";
  			table += "</tr>";
				table += "</tbody></table>"
				table += "</div>";
	    	add_table_btn = "<button class=\"add-stb-btn-fin btn\">Добавить</button>";
	    	add_table += table + add_table_btn;
		$(".right-block").empty().append(add_table);
	});  // нажатие кнопки "добавить столбец"
	$(".right-block").on("click", ".add-stb-btn-fin", function(e){
		e.preventDefault();
		var check = true;
		var inp_name = $(".inp-name");
		inp_name.each(function(index){
			if ($(this).val().trim() == "") {
				check = false;
				$("body").overhang({
					  type: "error",
					  message: "Необходимо ввести имя столбца",
				});
			}
		});
		if (check) {
			var arr_table = [];
			$(".table-add-table .table tr").each(function(index, el) {
				var values = [];
				var ind = 0;
				//alert($(this).find("td").length);
				$(this).find("td").each(function(index2, el2) {
					if (ind == 0) values.push($(this).find('input').val());
					if (ind == 1) values.push($(this).find('select').val());
					if (ind == 2) 
						if ($(this).find('input').val() == "") values.push(10);
						else values.push($(this).find('input').val());
					if (ind == 3) values.push($(this).find('select').val());
					if (ind == 4) values.push($(this).find('input').is(':checked'));
					if (ind == 5) values.push($(this).find('input').is(':checked'));
					if (ind == 6) values.push($(this).find('input').is(':checked'));
					ind++;
				});
				arr_table.push(values);
			})
			$.post("../php/add_stb.php",{current_db: current_db, table_name: current_tb, values: arr_table}).done(function(result) {
				if (result.search("Ошибка") == -1) {
					$.post("../php/structure_table.php",{db_name: current_db, tb_name: current_tb}).done(function(result) {			
						$('.right-block').empty().append(result);
					}).fail(function(error) {
						console.log(error.message);
					});
				} else {
					$("body").overhang({
					  type: "error",
				  	closeConfirm: true,
					  message: result,
					});
				}
			}).fail(function(error) {
				console.log(error.message);
			});
		}
	});// (получение информации от польз) добавление таблицы
	$(".right-block").on("click", ".change_stb", function(e) {
		e.preventDefault();
		var values = [];
		$(this).parent().parent().find("td").each(function(index, el) {
			values.push($(this).text());
		});
		var add_table = "<h2 class=\"right-block-title\">Изменение столбца в таблице \""+ current_tb + "\"</h2>";
		var table = "<div style=\"margin-left: 100px;\" class=\"table-add-table table-block\">";
				table += "<table class=\"table\">";
				table += 	"<thead>";
				table += 		"<tr>";
				table += 			"<th>Имя</th><th>Тип</th><th>Длина</th><th>Атрибуты</th><th>Not Null</th><th>Уникальный</th><th>Автоинкремент</th>";
				table += 		"</tr>";
				table += 	"</thead><tbody>"
  			table += "<tr>";
  			table += "<td><input class=\"row-"+ 1 +" inp-name\" type=\"text\" val=\"hhh\"></td>";
  			table += "<td><select class=\"row-"+ 1 +" type-sel\"><option selected value=\"INT\">INT</option><option value=\"VARCHAR\">VARCHAR</option><option value=\"TEXT\">TEXT</option><option value=\"DOUBLE\">DOUBLE</option><option value=\"DATE\">DATE</option><option value=\"DATETIME\">DATETIME</option><option value=\"TIMESTAMP\">TIMESTAMP</option></select></td>";
  			table += "<td><input class=\"row-"+ 1 +" input_num\" type=\"text\"></td>";
  			table += "<td><select class=\"row-"+ 1 +" atr-sel\"><option selected value=\"\"></option><option value=\"BINARY\">BINARY</option><option value=\"UNSIGNED\">UNSIGNED</option></select></td>";
  			table += "<td style=\"width: 40px;\"><input class=\"row-"+ 1 +" null-chkb\" type=\"checkbox\"></td>";
  			table += "<td><input class=\"row-"+ 1 +" uniq-chkb\" type=\"checkbox\"></td>";
  			table += "<td style=\"width: 40px;\"><input class=\"row-"+ 1 +" autoincr-chkb\" type=\"checkbox\"></td>";
  			table += "</tr>";
				table += "</tbody></table>"
				table += "</div>";
	    	add_table_btn = "<button class=\"change-stb-btn btn\">Изменить</button> ";
	    	add_table_btn += "<button class=\"change-stb-btn-back btn\">Назад</button> ";
	    	add_table += table + add_table_btn;
		$(".right-block").empty().append(add_table);
	  $(".inp-name").val(values[0]);
	  gl_name_tb = values[0];
	  if (values[2] == "NO")
	  	$(".null-chkb").attr('checked', true);
	  if (values[3] == "PRI")
	  	$(".autoincr-chkb").attr('checked', true);
	  else if (values[3] == "UNI")
	  	$(".uniq-chkb").attr('checked', true);
	  if (values[5] == "auto_increment")
	  	$(".autoincr-chkb").attr('checked', true);
	  var type = values[1].split('(')[0].toUpperCase();
	  $(".type-sel option[value=\""+type+"\"]").attr("selected", "selected");
	  if (values[1].search("unsigned") != -1)
	  	$("atr-sel option[value=\"UNSIGNED\"]").attr("selected", "selected");
	  if (values[1].search("binary") != -1)
	  	$("atr-sel option[value=\"BINARY\"]").attr("selected", "selected");
	  var length = values[1].split('(')[1].split(')')[0];
	  $(".input_num").val(length);
	});  // нажатие кнопки "добавить столбец"
	$(".right-block").on("click", ".change-stb-btn-back", function(e) {
		e.preventDefault();
		$.post("../php/structure_table.php",{db_name: current_db, tb_name: current_tb}).done(function(result) {
			if (result.search("Ошибка") == -1) {
				$('.right-block').empty().append(result);
			} else {
				$("body").overhang({
				  type: "error",
			  	closeConfirm: true,
				  message: result,
				});
			}
		}).fail(function(error) {
			console.log(error.message);
		});
	}); // передумали
	$(".right-block").on("click", ".change-stb-btn", function(e){
		e.preventDefault();
		var check = true;
		var inp_name = $(".inp-name");
		inp_name.each(function(index){
			if ($(this).val().trim() == "") {
				check = false;
				$("body").overhang({
					  type: "error",
					  message: "Необходимо ввести имя столбца",
				});
			}
		});
		if (check) {
			var arr_table = [];
			$(".table-add-table .table tr").each(function(index, el) {
				var values = [];
				var ind = 0;
				//alert($(this).find("td").length);
				$(this).find("td").each(function(index2, el2) {
					if (ind == 0) values.push($(this).find('input').val());
					if (ind == 1) values.push($(this).find('select').val());
					if (ind == 2) 
						if ($(this).find('input').val() == "") values.push(10);
						else values.push($(this).find('input').val());
					if (ind == 3) values.push($(this).find('select').val());
					if (ind == 4) values.push($(this).find('input').is(':checked'));
					if (ind == 5) values.push($(this).find('input').is(':checked'));
					if (ind == 6) values.push($(this).find('input').is(':checked'));
					ind++;
				});
				arr_table.push(values);
			});
			$.post("../php/change_stb.php",{current_db: current_db, table_name: current_tb, values: arr_table, name_tb: gl_name_tb}).done(function(result) {
				if (result.search("Ошибка") == -1) {
					$.post("../php/structure_table.php",{db_name: current_db, tb_name: current_tb}).done(function(result) {			
						$('.right-block').empty().append(result);
					}).fail(function(error) {
						console.log(error.message);
					});
					$('.right-block').append(result);
				} else {
					$("body").overhang({
					  type: "error",
				  	closeConfirm: true,
					  message: result,
					});
				}
			}).fail(function(error) {
				console.log(error.message);
			});
		}
	});// изменение столбцов



	$(".right-block").on('click', ".delete_row", function(e) {
		e.preventDefault();
		var numb_p_k = $(".table-block th").index($(".primary-key")) + 1; // номер столбца, где находится ключ
		var delete_row_key = $(this).parent().parent().children("td:nth-child("+numb_p_k+")").text();
		$("body").overhang({
			type: "confirm",
		  message: "Вы уверены, что хотите удалить строку с ключом \"" + delete_row_key + "\"?",
		  overlay: true,
		  yesMessage: "Да",
		  noMessage: "Нет",
		  callback: function (value) {
		    if (value) {
					$.post("../php/delete_row.php",{db_name: current_db, tb_name: current_tb, key: delete_row_key}).done(function(result) {
						if (result.search("Ошибка") == -1) {
							$.post("../php/open_table.php", {tb_name: current_tb, db_name: current_db}).done(function(result) {
								$('.right-block').empty().append(result);
							});
						} else {
							$("body").overhang({
								  type: "error",
								  message: result,
				  				closeConfirm: true
							});
						}
					}).fail(function(error) {
						console.log(error.message);
					});
				}
		  }
		});
	}) // удалить строку в таблице
	$(".right-block").on("click", ".add-row-btn", function(e) {
		e.preventDefault();
		$.post("../php/get_table_set.php",{tb_name: current_tb, db_name: current_db}).done(function(result) {
			if (result.search("Ошибка") == -1) {
				$('.right-block').empty().append(result);
			} else {
				$("body").overhang({
					  type: "error",
					  message: result,
	  				closeConfirm: true
				});
			}

		}).fail(function(error) {
			console.log(error.message);
		});
	});
	$(".right-block").on("click", ".fin-add-row-btn", function(e) {
		e.preventDefault();
		var values = [];
		$(".right-block").find("input").each(function(index2, el2) {
				values.push($(this).val());
		});
		$.post("../php/add_row.php",{tb_name: current_tb, db_name: current_db, values: values}).done(function(result) {
			if (result == "Строка добавлена!") {
				$("body").overhang({
				  type: "success",
				  message: result,
				});
				$.post("../php/open_table.php",{db_name: current_db, tb_name: current_tb}).done(function(result) {
					$('.right-block').empty().append(result);
				}).fail(function(error) {
					console.log(error.message);
				});
			}
			else {
				$("body").overhang({
				  type: "error",
				  closeConfirm: true,
				  message: result,
				});
			}
		}).fail(function(error) {
			console.log(error.message);
		});
	});
	$(".right-block").on('click', ".change_row", function(e) {
		var numb_p_k = $(".table-block th").index($(".primary-key")) + 1; // номер столбца, где находится ключ
		gl_prim_key = $(this).parent().parent().children("td:nth-child("+numb_p_k+")").text();
		var cells = $(this).parent().parent().children("td");
		var values = [];
		cells.each(function(index) {
		  values.push($(this).text());
		});
		gl_values = values; // в глоб переменную
		$(cells).empty().append("<input style=\"width: 150px;\" type=\"text\">");
		cells.each(function(index) {
		  $(this).find("input").val(values[index]);
		});
		cells.last().empty().append('<button class=\"agree-i btn add-btn\">Применить</button>');
	}) // изменить строку в таблице
	$(".right-block").on('click', ".agree-i", function(e) {
		e.preventDefault();
		var name_prim_k = $(".primary-key").text(); // название столбца, где перв ключ
		var cells = $(this).parent().parent().children("td");
		var values = [];
		cells.each(function(index) {
			if (index != cells.length - 1)
		  	values.push($(this).find("input").val());
		});
		$.post("../php/update_table.php",{tb_name: current_tb, db_name: current_db, values: values, prim_key: gl_prim_key, name_prim_k: name_prim_k}).done(function(result) {
			if (result == "Успех") {
				$.post("../php/open_table.php",{db_name: current_db, tb_name: current_tb}).done(function(result) {
					$('.right-block').empty().append(result);
				}).fail(function(error) {
					console.log(error.message);
				});
			}
			else {
				$("body").overhang({
				  type: "error",
			  	closeConfirm: true,
				  message: result,
				});
			}
		}).fail(function(error) {
			console.log(error.message);
		});
	}); // сделать изменение
  
  $(".btn_SELECT").on("click", function(e) {
		e.preventDefault();
    var add_table =	"<div class=\"sql-block-content\">";
    add_table += "<p class=\"sql-block-content-text\">Запишите SQL запрос</p>";
		add_table += "<textarea cols=\"49\" rows=\"9\"></textarea>";
		add_table += "<div>";
    add_table +=	"<button class=\"sql-block-content-btn btn add-btn\">Выполнить</button>";
    add_table += "<button class=\"back-table-btn btn\">Назад</button>";
		add_table +=	"</div>";
		$(".right-block").empty().append(add_table);
	});

	$(".right-block").on('click', '.sql-block-content-btn', function() {
		sqlPostQuery();
  }); // выполнение sql запроса
  
	function sqlPostQuery(){
		var textarea_text = $(".sql-block-content textarea").val();
		if (textarea_text != "") {
			$.post("../php/sql-query.php",{textarea_text: textarea_text, current_db: current_db}).done(function(result) {
				if (result.search('Ошибка! Запрос не выполнен') == -1) {
					$("body").overhang({
					  type: "success",
					  message: "Запрос выполнен!"
					});
					if (result == "Запрос выполнен!")
						location.reload();
					else $('.right-block').empty().append(result);
				}
				else {
					$("body").overhang({
					  type: "error",
				  	closeConfirm: true,
					  message: result,
					});
				}
			}).fail(function(error) {
				console.log(error.message);
			});
		}
		else {
			$("body").overhang({
			  type: "error",
			  message: "Ошибка! Пустой запрос",
			});
		}
	}
});

