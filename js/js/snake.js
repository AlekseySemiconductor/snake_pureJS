window.onload = function() {

	var wasd = {
			l: '65',
			t: '87',
			r: '68',
			d: '83'
		},
		arrs = {
			l: '37',
			t: '38',
			r: '39',
			d: '40'
		},
		food = 0, // сколько змейка съела фруктов (начальное значение 0) 
		level, // уровень сложности, если начальный, то за один фрукт дается 1 очко, если средний - 2 очка, а если тяжелый - 4 очка
		startPosition = [
		[1, 4], // первый элемент - голова
		[1, 3],
		[1, 2],
		[1, 1]
	],
	foodImage = 'bg_food';

	// МАТРИЦА НАЧАЛО ====================================================================================================================================================

	function CreateMatrix(tableId, row, col) {
		this.tableId = tableId;
		this.row = row;
		this.col = col;
		this.maxCell = this.row * this.col; // максимальное количество ячеек
		this.cell;
	}

	CreateMatrix.prototype.createTable = function() {
		
		var that = this,
			table = document.createElement('div'),
			form = document.body.querySelector('#form');

		table.id = this.tableId,
		table.className = 'table';

		document.body.insertBefore(table, form.nextElementSibling.nextElementSibling);
		
		for ( var i = 1; i <= this.maxCell; i++ ){
			var item = document.createElement('div');
			item.className = 'table__cell';
			table.appendChild(item);
		}

		// задаем ширину таблицы
		document.getElementById(that.tableId).style.width = document.getElementById(that.tableId).children[0].offsetWidth * that.col + 'px';
		that.cell = document.getElementById(that.tableId).children;
	
	};

	CreateMatrix.prototype.addFood = function() {
		
		this.foodImage = foodImage;
		
		var that = this,
			randomCell = Math.random()*that.maxCell;

		if ( that.cell[Math.floor(randomCell)].classList == 'table__cell' ) {
			that.cell[Math.floor(randomCell)].classList.add(that.foodImage);
		} else {
			that.addFood(that.foodImage);
		}
	};

	// МАТРИЦА КОНЕЦ ====================================================================================================================================================
	

	// ПРОТОТИП ЖИВОТНОГО НАЧАЛО ====================================================================================================================================================

	function Animal() {

		this.col = matrix1.col;
		this.row = matrix1.row;
		this.maxCell = this.row * this.col;
		this.tableId = matrix1.tableId;
		this.foodImage = foodImage;

		this.cell = document.getElementById(this.tableId).children;

		this.keys = arrs;

		this.body = startPosition.slice();
		this.mainRow = this.body[0][0];
		this.mainCol = this.body[0][1];

		this.bgColor = 'bg_yellow';

		this.setInterval;
		this.course;

		this.body;
		this.xLast;
		this.yLast;
		this.posLast;
		this.xNext;
		this.yNext;
		this.posNext;
		this.xLastHead;
		this.yLastHead;
		this.posLastHead;

		var that = this;

		this.init = function(speed) {
			this.speed = speed;
			that.setStartCell();
		};

		this.setStartCell = function() {

			for (var j=0; j<that.body.length; j++) {

				var x = that.body[j][1]-1,
					y = (that.body[j][0]-1)*that.col,
					pos = x+y;

				that.cell[pos].classList.add(that.bgColor);
			
			}

			var xHead = that.body[0][1]-1,
				yHead = (that.body[0][0]-1)*that.col,
				posHead = xHead+yHead;

			that.cell[posHead].classList.add('head'); // выбираем квадратик с головой и даём ему класс
		
		};

		this.setNextCell = function() {

			that.xLast = that.body[that.body.length-1][1]-1; // -1 так как первый элемент массива это ноль; третий элемент покажет 4 квадратик, а мне нужен третий, поэтому минус 1
			that.yLast = that.body[that.body.length-1][0]-1;
			that.posLast = that.xLast + that.yLast*that.col;

			that.body.unshift([that.mainRow, that.mainCol]); // добавляем новый квадратик в начало массива - это голова, причем сделать это нужно до объявления переменной posNext

			that.xNext = that.body[0][1]-1;
			that.yNext = that.body[0][0]-1;
			that.posNext = that.xNext + that.yNext*that.col;

			that.xLastHead = that.body[1][1]-1;
			that.yLastHead = (that.body[1][0]-1)*that.col;
			that.posLastHead = that.xLastHead+that.yLastHead;

			if ( that.cell[that.posNext].classList.contains(that.foodImage) ) { // съедаем фрукт

				if ( level === "easy" ) {
					food++;
				} else if ( level === "intermediate" ) {
					food = food + 2;
				} else if ( level === "difficult" ) {
					food = food + 4;
				}

				var fact = document.body.getElementsByClassName('js-hiddenFact');

				if ( food >= 70 ) {
					fact[6].classList.remove('dn');
				} else if ( food >= 60 ) {
					fact[5].classList.remove('dn');
				} else if ( food >= 50 ) {
					fact[4].classList.remove('dn');
				} else if ( food >= 40 ) {
					fact[3].classList.remove('dn');
				} else if ( food >= 30 ) {
					fact[2].classList.remove('dn');
				} else if ( food >= 20 ) {
					fact[1].classList.remove('dn');
				} else if ( food >= 10 ) {
					fact[0].classList.remove('dn');
				}
				

				that.cell[that.posNext].classList.remove(that.foodImage); 
				that.cell[that.posNext].classList.add(that.bgColor);
				that.cell[that.posNext].classList.add('head'); // Добавляем новому квадратику класс "Голова"
				that.cell[that.posLastHead].classList.remove('head'); // удаляем предыдущую голову


				var scorebox = document.getElementsByClassName('js-scoreCount__box')[0];

				if ( scorebox.classList.contains('dn') ) {
					scorebox.classList.remove('dn');
				}

				scorebox.querySelector('.js-scoreCount__count').innerHTML = food;

				// В случае победы:
				if (that.body.length == 100) {
					alert('Поздравляем! Вы выиграли!');
				}

				matrix1.addFood();
				return;
			}
			
			that.cell[that.posLast].classList.remove(that.bgColor); // убираем заливку с вырезанного(последнего) из массива квадратика
			that.body.pop(); // удаляем последний элемент из начала массива, это хвост

			if ( that.cell[that.posNext].classList.contains(that.bgColor) ) { // В случае поражения

				that.clear();
				document.getElementById(that.tableId).classList.add('dn');
				document.querySelector('.js-showBox').classList.add('dn');
				document.querySelector('.js-scoreCount__box').classList.add('dn');
				document.getElementsByClassName('js-record')[0].innerHTML = food;
				document.getElementsByClassName('js-score')[0].value = food;
				document.getElementsByClassName('js-sendBox')[0].classList.remove('dn');

				return;
			}
			
			that.cell[that.posNext].classList.add(that.bgColor); // заливаем новый квадратик
			that.cell[that.posNext].classList.add('head'); // Добавляем новому квадратику класс "Голова"
			that.cell[that.posLastHead].classList.remove('head'); // удаляем предыдущую голову

		};

		this.reStart = function() {
			that.body = startPosition.slice();
			that.mainRow = that.body[0][0];
			that.mainCol = that.body[0][1];
		};

		this.clear = function() {

			clearInterval( that.setInterval );

			// лучше пройтись по всем, так как кроме класса цвета клеточки будет и класс головы змейки, и класс еды
			for ( var i=0; i<that.cell.length; i++ ) {
				that.cell[i].className = '';
				that.cell[i].className = 'table__cell';
			}

			this.reStart();

		};

		this.moveLeft = function() {
			if (that.course == 'right') {
				clearInterval(that.setInterval);
				that.setInterval = setInterval(that.moveRight, that.speed);
				return;
			}
			that.course = 'left';
			for (var i = 0; i < that.maxCell; i++) {
				if (that.cell[i].classList.contains(that.bgColor)) {
					that.mainCol--;
					if (that.mainCol < 1) {
						that.mainCol = that.col;
						that.setNextCell();
						return;
					}
					that.setNextCell();
					return;
				}
			}
		};

		this.moveTop = function() {
			if (that.course == 'down') {
				clearInterval(that.setInterval);
				that.setInterval = setInterval(that.moveDown, that.speed);
				return;
			}
			that.course = 'top';
			for (var i = 0; i < that.maxCell; i++) {
				if (that.cell[i].classList.contains(that.bgColor)) {
					that.mainRow--;
					if (that.mainRow < 1) {
						that.mainRow = that.row;
						that.setNextCell();
						return;
					}
					that.setNextCell();
					return;
				}
			}
		};

		this.moveRight = function() {
			if (that.course == 'left') {
				clearInterval(that.setInterval);
				that.setInterval = setInterval(that.moveLeft, that.speed);
				return;
			}
			that.course = 'right';
			for (var i = 0; i < that.maxCell; i++) {
				if (that.cell[i].classList.contains(that.bgColor)) {
					that.mainCol++;
					if (that.mainCol > that.col) {
						that.mainCol = 1;
						that.setNextCell();
						return;
					}
					that.setNextCell();
					return;
				}
			}
		};

		this.moveDown = function() {
			if (that.course == 'top') {
				clearInterval(that.setInterval);
				that.setInterval = setInterval(that.moveTop, that.speed);
				return;
			}
			that.course = 'down';
			for (var i = 0; i < that.maxCell; i++) {
				if (that.cell[i].classList.contains(that.bgColor)) {
					that.mainRow++;
					if (that.mainRow > that.row) {
						that.mainRow = 1;
						that.setNextCell();
						return;
					}
					that.setNextCell();
					return;
				}
			}
		};

		document.addEventListener('keydown', function(e) {

			clearInterval(that.setInterval);
			if ( e.keyCode == that.keys.l ){
				if (that.course == undefined) {
					return; // Если змейка стоит, игра ещё не началась, нельзя двигать влево
				}
				that.setInterval = setInterval(that.moveLeft, that.speed);
			} else if ( e.keyCode == that.keys.t ){
				that.setInterval = setInterval(that.moveTop, that.speed);
			} else if ( e.keyCode == that.keys.r ){
				that.setInterval = setInterval(that.moveRight, that.speed);
			} else if ( e.keyCode == that.keys.d ){
				that.setInterval = setInterval(that.moveDown, that.speed);
			}
		});

	};

	// ПРОТОТИП ЖИВОТНОГО КОНЕЦ ====================================================================================================================================================

	function CreateSnake(speed) {
		Animal.call(this); // отнаследуем свойства и функции из объекта Animal
		this.speed = speed;
	};

	var matrix1 = new CreateMatrix('table1', 20, 20);
	matrix1.createTable();

	var audio = new Audio('audio/Aleksey Semiconductor - Цыганочка.mp3');
	
	document.getElementsByClassName('js-init')[0].addEventListener( "click", function() {

		document.querySelector('.form').classList.add('dn');
		document.querySelector('.js-showBox').classList.remove('dn');

		if ( document.getElementsByClassName('bg_food').length > 0 ) {
			// console.log('Еда уже есть');
			return;
		}

		var speed = document.querySelector('.game__level:checked').value;
		level = document.querySelector('.game__level:checked').id;

		if (snake) {
			// console.log(snake);
		} else {
			// console.log(snake);
		}

		var snake = new CreateSnake(speed);

		snake.reStart();
		snake.init(speed);
		matrix1.addFood();

		window.setTimeout(function () {
			document.getElementById('table1').focus(); // иначе фокус не будет работать
		}, 0);

		audio.play();

	});

	var toggleSoundBtn = document.querySelector('.js-toggleSound');

	toggleSoundBtn.addEventListener( "click", function() {

		function toggleSound() {

			if ( audio.paused && audio.currentTime > 0 && !audio.ended ) {
				toggleSoundBtn.innerHTML = "Выключить звук";
				audio.play();
			} else {
				toggleSoundBtn.innerHTML = "Включить звук";
				audio.pause();
			}

		}

		toggleSound();

	});

	document.getElementsByClassName('js-lostBox__send')[0].addEventListener( "click", function() {

		var xmlhttp = new XMLHttpRequest();

		var name = document.getElementsByClassName('js-nickName')[0].value;
		var score = document.getElementsByClassName('js-score')[0].value;

		var params = 'name=' + encodeURIComponent(name) + '&score=' + encodeURIComponent(score);

		xmlhttp.open("POST", "/add.php", true);

		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		// xmlhttp.onreadystatechange = function() {

		// 	if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
		// 		if (xmlhttp.status == 200) {
		// 			// document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
		// 		}
		// 		else if (xmlhttp.status == 400) {
		// 			alert('There was an error 400');
		// 		}
		// 		else {
		// 			alert('something else other than 200 was returned');
		// 		}
		// 	}
		// };
		
		xmlhttp.send(params);

		document.getElementsByClassName('js-lostBox__send')[0].classList.add('dn');
		document.getElementsByClassName('js-nickName')[0].classList.add('dn');
		document.getElementsByClassName('js-results__btn')[0].classList.remove('dn');
		document.getElementsByClassName('js-results__reload')[0].classList.remove('dn');
		
	});

 

	document.getElementsByClassName('js-results__btn')[0].addEventListener( "click", function() {
		
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open("GET", "/get.php", true);

		// xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xmlhttp.send();

		xmlhttp.onreadystatechange = function() {

			if (xmlhttp.readyState == XMLHttpRequest.DONE ) {

				if (xmlhttp.status == 200) {

					// console.log(xmlhttp.responseText);

					// var results = '[' + xmlhttp.responseText + ']' ;


					var results = xmlhttp.responseText,
						arrResult = results.split('-'),
						score = [];

					for (var i = 0; i < arrResult.length; i++) {

						// сначала находим индекс последнего пробела, потому что после него идет цифра рекорд, 
						// а последнего, потому что имя может содержать пробелы, 
						// затем вырезаем с этого индекса всё что идёт далее, это и есть число

						var number = arrResult[i].slice(arrResult[i].lastIndexOf(' ')),
							user = arrResult[i].slice(0, arrResult[i].lastIndexOf(' '));

						number = +number;

						score.push([[user, number]]);

					}

					score.pop(); // почему-то последний элемент массива всегда пустой, его удаляем

					// function compareNumeric(a, b) {

					function sortFunction(a, b) {
						if (a[0][1] === b[0][1]) {
							return 0;
						}
						else {
							return (a[0][1] < b[0][1]) ? 1 : -1;
						}
					}

					score.sort(sortFunction);

					var tableResults = document.querySelector('.js-results__table');

					for ( var j=0; j<score.length; j++ ) {

						if ( j == 20) break;

						var text = score[j][0];
						var number = score[j][1];

						var line = document.createElement('div'); // создаем див
						line.className = 'results__line'; // добавляем ему класс .results__line
						tableResults.appendChild(line); // запихиваем этот див внутрь таблицы с рекордами

						line.innerHTML = // в каждой линии будет по три столбца:
										'<div class="results__count"></div>'+ // 1-ый столбец - номер игрока в списке
										'<div class="results__nickName"></div>'+ // 2-ой столбец - имя игрока
										'<div class="results__score"></div>'; // 3-ий столбей - его рекорд

						line.querySelector('.results__count').innerHTML = j+1;
						line.querySelector('.results__nickName').innerHTML = score[j][0][0];
						line.querySelector('.results__score').innerHTML = score[j][0][1];

					}
					
					// document.getElementsByClassName('js-results__table')[0].innerHTML = xmlhttp.responseText;
					document.getElementsByClassName('lostBox__wrap')[0].classList.add('dn');
					document.getElementsByClassName('js-results__table')[0].classList.remove('dn');
					document.getElementsByClassName('js-results__btn')[0].classList.add('dn');
					document.getElementById('form').classList.add('dn');
				
				}
				else if (xmlhttp.status == 400) {
					alert('There was an error 400');
				}
				else {
					// alert('something else other than 200 was returned');
					alert('github pages не поддерживает динамичный контент. Я сделал динамичную таблицу рекордов, но для того, чтобы её увидеть необходима поддержка .php-файлов.');
				}
			}
			
		};

	});

	document.getElementsByClassName('js-results__reload')[0].addEventListener( "click", function() {
		location.reload();
	});
	
};