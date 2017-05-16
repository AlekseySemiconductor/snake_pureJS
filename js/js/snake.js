/**
 * Snake pure javascript.
 *
 * Copyright (c) 2017 Aleksey Semiconductor
 * Licensed under the GPL-3.0 license:
 * https://opensource.org/licenses/GPL-3.0
 * @author: Aleksey Semiconductor (https://alekseysemiconductor.github.io/snake_pureJS/)
 * @version: 1.2.1 - 16/05/2017
**/

window.onload = function() {

	var body = document.body,
		script = body.querySelector('.script'),
		scoreBox = document.querySelector('.js-countItem').innerHTML.trim(),
		scoreList = document.body.querySelector('.js-countList'),
		fact = body.querySelectorAll('.js-hiddenFact'),
		pauseBox = document.querySelector('.js-popup'),
		arrs = {
			l: '37',
			t: '38',
			r: '39',
			b: '40'
		},
		wasd = {
			l: '65',
			t: '87',
			r: '68',
			b: '83'
		},
		gameOptions = {
			pause: '32'
		}

	// СОЗДАЁМ МАТРИЦУ НАЧАЛО ===================================================================================== //

	function CreateTable(options) {
		this.id = options.id;
		this.speed = options.speed;
		this.row = options.row;
		this.col = options.col;
		this.maxCell = this.row * this.col; // Количество ячеек в таблице
		this.foodImage = options.foodImage;
		this.foodTimer = options.foodTimer; // С какой частотой будет генерироваться еда
		this.gameOptions = options.gameOptions; // клавишы управления игрой
		this.snakes = [];
		this.snakesLength = 0; // Количество змеек на поле
		this.foodLength = 0; // Количество еды на поле
		this.pause = false;
		this.isMaxFood = false; // достигло ли лимита количество фруктов
		var that = this;

		document.addEventListener('keydown', function(e) {

			if (e.keyCode == that.gameOptions.pause) {
				that.handlePause();
			}

		});
	}

	CreateTable.prototype.init = function() {
		
		this.table = document.createElement('div'), // Создаём таблицу
		this.table.id = this.id, // Даём таблице id из параметров
		this.table.className = 'table'; // Даём таблице класс table, чтобы стилизовать её

		body.insertBefore(this.table, script); // Вставляем таблицу перед скриптами

		var cells = '', // Это строка, в которую будем вписывать ячейки
			cell = document.querySelector('.js-cell').innerHTML.trim();
			// trim() - Чтобы убрать пробелы побокам
		
		// Запускаем цикл, в котором будем вставлять ячейки в строку
		for ( var i = 1; i <= this.maxCell; i++ ) {
			cells += cell; 
		}

		this.table.innerHTML = cells; // Вставляем строку из ячеек в таблицу
		// Задаем таблице ширину:
		this.table.style.width = this.table.children[0].offsetWidth * this.col + 'px';

	};

	CreateTable.prototype.addFood = function() {

		var that = this;

		this.foodInterval = setInterval(function() { 

			// Округляем до целого по нижнему значению случайное число от 0 до количества ячеек в таблице
			// Затем находим номер ячейки с этим рандомным числом и смотрим список её классов
			var randomNumber = Math.floor(Math.random() * that.maxCell),
				cellClassList = that.table.children[randomNumber].classList;

			// Мы не знаем какой класс будет у какой змейки или какой класс будет 
			// у какого-либо фрукта, поэтому, если в этой рандомной ячейке будет 
			// хоть какой-то класс, кроме класса самой ячейки,
			// то пропускаем эту ячейку и ищем следующую

			if (cellClassList.length == 1) { // Смотрим на количество классов
				// Если на поле больше или равно 10 единиц еды, то ничего не делаем
				if (that.foodLength == 10) {
					that.isMaxFood = true;
					clearInterval(that.foodInterval); // Останавливаем генерацию фруктов
					return;
				}
				cellClassList.add(that.foodImage);
				that.foodLength++;
			}
			

		}, this.foodTimer);
		
	};

	CreateTable.prototype.handlePause = function() {

		// Если пауза уже нажата
		if (this.pause) {
			pauseBox.classList.remove('active');
			this.addFood(); // Запускаем генерацию фруктов
			this.pause = false;
			return;
		}

		pauseBox.classList.add('active');

		clearInterval(this.foodInterval); // Останавливаем генерацию фруктов
		// Останавливаем движение всех змеек
		for (var i = 0, len = this.snakes.length; i < len; i++) {
			clearTimeout(this.snakes[i].timer);
			this.snakes[i].stop = true;
		}

		this.pause = true;

	};

	// СОЗДАЁМ МАТРИЦУ КОНЕЦ ================================================================================== //
	

	// ПРОТОТИП ЗМЕЙКИ НАЧАЛО ====================================================================================================================================================

	function CreateSnake(options) {

		this.table = options.table;
		this.color = options.color;
		// Нам нужен новый массив, а не ссылка на старый, поэтому slice()
		this.body = options.startPosition.slice();
		this.controls = options.controls;

		this.cell = document.getElementById(this.table.id).children;
		this.setCourse(); // Выбираем направление змейки
		this.stop = true;
		this.alive = true; // Потом будем проверять, если змейки нету

		this.createScoreBox(); // создает таблицу, в которую будут вписываться очки
		
		var that = this;

		document.addEventListener('keydown', function(e) {

			if (e.keyCode == that.controls.l) {
				if (!that.alive || that.course == "left" && that.stop == false) return;
				clearTimeout(that.timer);
				that.moveLeft();
			} else if (e.keyCode == that.controls.t) {
				if (!that.alive || that.course == "top" && that.stop == false) return;
				clearTimeout(that.timer);
				that.moveTop();
			} else if (e.keyCode == that.controls.r) {
				if (!that.alive || that.course == "right" && that.stop == false) return;
				clearTimeout(that.timer);
				that.moveRight();
			} else if (e.keyCode == that.controls.b) {
				if (!that.alive || that.course == "bottom" && that.stop == false) return;
				clearTimeout(that.timer);
				that.moveBottom();
			}

		});

	};

	CreateSnake.prototype.init = function() {

		for (var i = 0; i < this.body.length; i++) {

			this.cell[(this.body[i].x - 1) * this.table.col + this.body[i].y - 1]
				.classList.add(this.color);
		
		}

		this.addNewHead();

		this.table.snakesLength++;

		this.table.snakes.push(this);
	
	};

	CreateSnake.prototype.createScoreBox = function() {
		
		// добавим box с очками в общий список box'ов c другими змейками
		scoreList.innerHTML += scoreBox;

		this.count = scoreList
						.querySelectorAll('.js-scoreCount__item')
							[document.body.querySelectorAll('.js-scoreCount__item').length - 1]
						.querySelector('.js-scoreCount__count');

		// каждому box с очками добавим data-id равное его this.color,
		// чтобы его потом можно было найти и поменять значение
		this.count.setAttribute('data-id', this.color);

	};

	CreateSnake.prototype.setCourse = function() {

		// Выясняем в каком направлении движемся:
		if ( this.body[0].x == this.body[1].x ) {
			// Если x одинаковые, то значит движемся в горизонтальном направлении -
			// влево или вправо

			if (this.body[0].y < this.body[1].y) {
				return this.course = 'left';
			} else if (this.body[0].y > this.body[1].y) {
				return this.course = 'right';
			}

		} else if ( this.body[0].y == this.body[1].y ) {
			// Если у одинаковые, то значит движемся в вертикальном направлении -
			// вверх или вниз

			if (this.body[0].x < this.body[1].x) {
				return this.course = 'top';
			} else if (this.body[0].x > this.body[1].x) {
				return this.course = 'bottom';
			}

		}

	};

	CreateSnake.prototype.addNewHead = function() {

		this.newHead = (this.body[0].x - 1) * this.table.col + (this.body[0].y - 1);
		this.newHeadClasslist = this.cell[this.newHead].classList;

		// Выбираем квадратик с головой и даём ему класс:
		this.newHeadClasslist.add('head');
		this.cell[this.newHead].setAttribute('data-course', this.course); 

	}

	CreateSnake.prototype.moveLeft = function() {

		var that = this;

		if (this.course == 'top' || this.course == 'bottom') {
			this.course = 'left';
		} else if (this.course == 'right') {
			this.rotateBack();
			return;
		}
				
		// Добавляем новый квадратик в начало массива - это голова
		this.body.unshift({
			x: this.body[0].x,
			y: this.body[0].y - 1
		});

		if (this.body[0].y < 1) {
			this.body[0].y = this.table.col;
			this.setNextCell();

			if (!this.alive) return;

			this.timer = setTimeout(function() {
				that.moveLeft(); 
			}, this.table.speed);
			
			return;
		}

		this.setNextCell();
		if (!this.alive) return;

		this.timer = setTimeout(function() {
			that.moveLeft();
		}, this.table.speed);

	};

	CreateSnake.prototype.moveTop = function() {

		var that = this;

		if (this.course == 'left' || this.course == 'right') {
			this.course = 'top';
		} else if (this.course == 'bottom') {
			this.rotateBack();
			return;
		}
				
		// Добавляем новый квадратик в начало массива - это голова
		this.body.unshift({
			x: this.body[0].x - 1,
			y: this.body[0].y
		});

		if (this.body[0].x < 1) { 
			this.body[0].x = this.table.row;
			this.setNextCell();

			if (!this.alive) return;

			this.timer = setTimeout(function() {
				that.moveTop();
			}, this.table.speed);

			return;
		}

		this.setNextCell();
		if (!this.alive) return;

		this.timer = setTimeout(function() {
			that.moveTop();
		}, this.table.speed);

	};

	CreateSnake.prototype.moveRight = function() {

		var that = this;

		if (this.course == 'top' || this.course == 'bottom') {
			this.course = 'right';
		} else if (this.course == 'left') {	
			this.rotateBack();
			return;
		}

		// Добавляем новый квадратик в начало массива - это голова
		this.body.unshift({
			x: this.body[0].x,
			y: this.body[0].y + 1
		});

		if (this.body[0].y > this.table.col) {
			this.body[0].y = 1;
			this.setNextCell();

			if (!this.alive) return;

			this.timer = setTimeout(function() {
				that.moveRight();
			}, this.table.speed);

			return;
		}

		this.setNextCell();
		if (!this.alive) return;

		this.timer = setTimeout(function() {
			that.moveRight();
		}, this.table.speed);

	};

	CreateSnake.prototype.moveBottom = function() {

		var that = this;

		if (this.course == 'left' || this.course == 'right') {
			this.course = 'bottom';
		} else if (this.course == 'top') {
			this.rotateBack();
			return;
		}
				
		// Добавляем новый квадратик в начало массива - это голова
		this.body.unshift({
			x: this.body[0].x + 1,
			y: this.body[0].y
		});

		if (this.body[0].x > this.table.row) {
			this.body[0].x = 1;
			this.setNextCell();

			if (!this.alive) return;

			this.timer = setTimeout(function() {
				that.moveBottom();
			}, this.table.speed); 
			
			return;
		}

		this.setNextCell();

		if (!this.alive) return;

		this.timer = setTimeout(function() { 
			that.moveBottom();
		}, this.table.speed);

	};

	CreateSnake.prototype.setNextCell = function() {

		var that = this;

		this.stop = false;
		this.addNewHead();

		if (this.newHeadClasslist.contains(this.color)) {
			// В случае поражения, если наткнулся на свой хвост

			this.die();
			
			// Находим длину массива из всех рекордов из таблицы,
			// чтобы понять одиночная игра или нет
			var scoreLength = document.body.querySelectorAll('.js-scoreCount__item').length;

			if (scoreLength == 1) {
				document.querySelector('.table').classList.add('dn');
				document.querySelector('.js-tableRecord').classList.remove('dn');
			} else {
				if (this.table.snakesLength) return;
				document.querySelector('.table').classList.add('dn');
				document.querySelector('.js-multiPlayer').classList.remove('dn');
			}

			document.querySelector('.js-sendBox').classList.remove('dn');

			return;
		} 

		this.lastHead = (this.body[1].x - 1) * this.table.col + (this.body[1].y - 1);
		this.lastHeadClasslist = this.cell[this.lastHead].classList;

		if (this.newHeadClasslist.contains(this.table.foodImage)) { // Съедаем фрукт

			this.table.foodLength--; // уменьшаем количество еды на поле

			// Запускаем генерацию фруктов, если их меньше 10
			if (this.table.isMaxFood) {
				this.table.isMaxFood = false;
				this.table.addFood();
			}

			this.newHeadClasslist.remove(this.table.foodImage);
			this.newHeadClasslist.add(this.color);
			this.lastHeadClasslist.remove('head'); // Удаляем предыдущую голову

			// Проверяем, если счетчик ещё не существует, тогда он равен 0,
			// а если он уже есть, то пропускаем эту строку
			if (!(this.food > 0)) this.food = 0;

			if ( this.table.level === "easy" ) {
				this.food++;
			} else if ( this.table.level === "intermediate" ) {
				this.food = this.food + 2;
			} else if ( this.table.level === "difficult" ) {
				this.food = this.food + 4;
			}

			if (this.food >= 70) {
				if (fact[6].classList.contains('dn')) {
					fact[6].classList.remove('dn');
				}
			} else if (this.food >= 60) {
				if (fact[5].classList.contains('dn')) {
					fact[5].classList.remove('dn');
				}
			} else if (this.food >= 50) {
				if (fact[4].classList.contains('dn')) {
					fact[4].classList.remove('dn');
				}
			} else if (this.food >= 40) {
				if (fact[3].classList.contains('dn')) {
					fact[3].classList.remove('dn');
				}
			} else if (this.food >= 30) {
				if (fact[2].classList.contains('dn')) {
					fact[2].classList.remove('dn');
				}
			} else if (this.food >= 20) {
				if (fact[1].classList.contains('dn')) {
					fact[1].classList.remove('dn');
				}
			} else if (this.food >= 10) {
				if (fact[0].classList.contains('dn')) {
					fact[0].classList.remove('dn');
				}
			}

			document
				.querySelector('.js-scoreCount__count[data-id='+this.color+']')
				.innerHTML = this.food;

			return;
		}

		// Удаляем хвост - ищем последний элемент массива;
		// -1 так как первый элемент массива это ноль;
		// третий элемент покажет 4 квадратик, а мне нужен третий, поэтому минус 1
		this.xLast = (this.body[this.body.length - 1].x - 1) * this.table.col;
		this.yLast = this.body[this.body.length - 1].y - 1;
		this.posLast = this.xLast + this.yLast;
		
		// Убираем заливку с вырезанного(последнего) из массива квадратика
		this.cell[this.posLast].classList.remove(this.color);
		this.body.pop(); // Удаляем последний элемент из начала массива, это хвост
		
		// Заливаем новый квадратик и добавляем новому квадратику класс "Голова"
		this.newHeadClasslist.add(this.color, 'head');
		this.lastHeadClasslist.remove('head'); // Удаляем предыдущую голову

	};

	CreateSnake.prototype.rotateBack = function() {

		this.stop = true;

		this.newHeadClasslist.remove('head'); // Находим голову и удаляем её

		// Меняем элементы массива в обратном порядке, то есть поворачиваем змейку назад
		for (var i = 0; i < this.body.length; i++) {
			this.body.splice(i, 0, this.body.pop());
		}
		
		this.setCourse();
		this.addNewHead();
		
	}

	CreateSnake.prototype.die = function() {

		this.alive = false;
		clearTimeout(this.timer); // очищаем таймер

		for (var i = 0; i < this.body.length; i++) {

			this.cell[(this.body[i].x - 1) * this.table.col + this.body[i].y - 1]
				.classList.remove(this.color, 'head');

		}

		this.table.snakesLength--;

		// for (var property in this) {
		// 	if (this.hasOwnProperty(property)) delete this[property];
		// }

	};


	// ПРОТОТИП ЗМЕЙКИ КОНЕЦ ====================================================================================================================================================


	var tableOptions = {
		id: 'table', 
		row: 20,
		col: 20,
		gameOptions: gameOptions,
		foodImage: 'bg_food',
		foodTimer: 1000 // с какой скоростью будет генерироваться еда
	};

	var table = new CreateTable(tableOptions);
	table.init();
	

	// Для начала просто загружаем аудио, но не проигрываем его
	var audio = new Audio('audio/Aleksey Semiconductor - Цыганочка.ogg');
	
	document.querySelector('.js-init').addEventListener("click", function() {

		document.querySelector('.form').classList.add('dn');
		document.querySelector('.js-showBox').classList.remove('dn');

		var input = document.querySelector('.js-level:checked'),
			speed = input.value * 1, // Скорость движения всех змеек на данной карте
			level = input.id; // Уровень сложности, если начальный, то за один фрукт
							  // дается 1 очко,  если средний - 2 очка, а если тяжелый - 4 очка

		var players = document.querySelector('.js-players:checked'),
			playerCount = players.value * 1; // количество игроков

		table.speed = speed;
		table.level = level;

		var snakeOptions1 = {
			table: table, // Таблица, внутри которой будет двигаться змейка
			color: 'bg_yellow', // Класс, который будем добавлять ячейке,
								// чтобы она закрасилась в цвет змейки
			startPosition: [ // позиция змейки, первый элемент - голова
				{
					x: 1,
					y: 4
				},
				{
					x: 1,
					y: 3
				},
				{
					x: 1,
					y: 2
				},
				{
					x: 1,
					y: 1
				}
			],
			controls: arrs
		};

		var snake1 = new CreateSnake(snakeOptions1);
		snake1.init();

		if (playerCount == 2) {

			var snakeOptions2 = {
				table: table, // Таблица, внутри которой будет двигаться змейка
				color: 'bg_green', // Класс, который будем добавлять ячейке,
									// чтобы она закрасилась в цвет змейки
				startPosition: [ // позиция змейки, первый элемент - голова
					{
						x: 20,
						y: 17
					},
					{
						x: 20,
						y: 18
					},
					{
						x: 20,
						y: 19
					},
					{
						x: 20,
						y: 20
					}
				],
				controls: wasd
			};

			var snake2 = new CreateSnake(snakeOptions2);
			snake2.init();

		}

		window.setTimeout(function () {
			document.getElementById('table').focus(); // Иначе фокус не будет работать
		}, 0);

		audio.play();

		table.addFood();

	});

	document.querySelector('.js-toggleSound')
		.addEventListener("click", function() {

		if ( audio.paused && audio.currentTime > 0 && !audio.ended ) {
			this.innerHTML = "Выключить звук";
			audio.play();
		} else {
			this.innerHTML = "Включить звук";
			audio.pause();
		}

	});

	document.querySelector('.js-lostBox__send')
		.addEventListener("click", function() {

		var scoreLS = JSON.parse(localStorage.getItem('score')) || []; // берем рекорды из localStorage

		var name = document.querySelector('.js-nickName').value,
			count = document.querySelector('.js-scoreCount__count').innerHTML * 1,
			score = {
				name: name,
				count: count
			};

		scoreLS.push(score);
		
		localStorage.setItem('score', JSON.stringify(scoreLS)); // отправляем его в localStorage

		document.querySelector('.js-tableRecord').classList.add('dn');
		document.querySelector('.js-singlePlayer').classList.remove('dn');
		
	});

	var resultBtn = document.querySelectorAll('.js-results__btn');
	
	for (var i = 0; i < resultBtn.length; i++) {

		resultBtn[i].addEventListener("click", function() {

			// Шаблон строки рекордов
			var record = document.querySelector('.js-record').innerHTML.trim(),
				records = "",
				// Куда мы будем вставлять строки
				table = document.querySelector('.js-table'),
				// Берём рекорды из localStorage
				score = JSON.parse(localStorage.getItem('score')),
				len;

			// Сортируем числа в порядке убывания
			function sortFunction(a, b) {
				if (a.count >= b.count) return -1;
				if (a.count < b.count) return 1;
			}

			score.sort(sortFunction);

			// Если рекордов > 10, то показывать только первые 10,
			// иначе будет слишком большая таблица
			if (score.length >= 10) {
				len = 10;
			} else {
				len = score.length;
			}

			score = score.slice(0, len); // Возьмём только первые 10 значений из рекордов
			
			for ( var i = 0; i < len; i++ ) {
				records += record; 
			}

			table.innerHTML = records; // Отрисовываем пустые строки

			// Тепер в эти пустые строки вставляем данные из localeStorage
			for (var i = 0, box; i < len; i++) {

				box = table.querySelectorAll('.js-table__item')[i];
				
				box.querySelector('[data-id="name"]').innerHTML = score[i].name;
				box.querySelector('[data-id="count"]').innerHTML = score[i].count;
			}

			// чтобы в localeStorage не было лишних данных, записываем туда
			// только самые большие рекорды и отправляем их в localStorage
			localStorage.setItem('score', JSON.stringify(score));

			this.classList.add('dn');
			table.classList.remove('dn');

			var clearLS = document.querySelector('.js-clearLS');

			clearLS.classList.remove('dn');

			clearLS.addEventListener("click", function() {
				localStorage.clear();
				
				for (var i = 0, box; i < len; i++) {

					box = table.querySelectorAll('.js-table__item')[i];
					
					box.querySelector('[data-id="name"]').innerHTML = "";
					box.querySelector('[data-id="count"]').innerHTML = "";
				}

			});
			
		});

	}

	var reloadBtn = document.querySelectorAll('.js-reload');

	for (var i = 0, len = reloadBtn.length; i < len; i++) {

		reloadBtn[i].addEventListener("click", function() {
			location.reload();
		});

	}

};