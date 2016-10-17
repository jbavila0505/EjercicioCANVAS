var TECLA_ARRIBA    = 38,
	TECLA_ABAJO     = 40,
	TECLA_DERECHA   = 39,
	TECLA_IZQUIERDA = 37,
	CANVAS_WIDTH    = 512,
	CANVAS_HEIGHT   = 480;

var monsterGraveyard = new Array() ;


//Crando el canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

// Imagen de Fondo
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/back.jpg";

// Imagen del principe
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.gif";

// Imagen del moustro vivo
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.gif";

// Imagen del moustro muerto
var deadMonsterReady = false;
var deadMonsterImage = new Image();
deadMonsterImage.onload = function (){
	deadMonsterReady = true;
};
deadMonsterImage.src= "images/prize.gif";


// Objetos del juego
var hero = {
	speed: 256 // movimientos en pixeles por segundo
};
var monster = {
	speed: 5 //movimientos en pixeles por segundo
};

var monstersCaught = 0;


// Manejo de controles de teclado
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Limpia el juego cuando el mounstro captura al principe
var start = true;

var reset = function () {
	if(start){
		hero.x = canvas.width / 2;
		hero.y = canvas.height / 2;		
		start = false;
	}

	// Throw the monster somewhere on the screen  al azar
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	monster.speed = (monster.speed > 100) ? (monster.speed) : (monster.speed + monstersCaught);

};



// Actualizar los objetos del juego
var update = function (modifier) {
	if (TECLA_ARRIBA  in keysDown) { // Player holding up
		hero.y = (hero.y > 0) ? (hero.y - hero.speed * modifier) : canvas.height - 32;
		monster.y =  (monster.y > 0) ? (monster.y - monster.speed * modifier) : canvas.height - 32;

	}if(TECLA_ABAJO in keysDown){
		hero.y = (hero.y + hero.speed * modifier) %  canvas.height;
		monster.y = (monster.y  + monster.speed * modifier) % canvas.height;


	}if(TECLA_IZQUIERDA in keysDown){
			hero.x = (hero.x > 0) ? (hero.x - hero.speed * modifier) : canvas.width -32;
			monster.x = (monster.x > 0) ? (monster.x - monster.speed * modifier) : canvas.width - 32;
	}
	if(TECLA_DERECHA in keysDown){
			hero.x = (hero.x + hero.speed * modifier) % canvas.width;
			monster.x = (monster.x + monster.speed * modifier) % canvas.width;
	}

	// Verifica si el heroe toca al mounstro
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		monsterGraveyard.push({"x": monster.x, "y": monster.y});
		reset();
	}
};


// Dibujando todo
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if(deadMonsterReady){
		for (deadMonster in monsterGraveyard){
			ctx.drawImage(deadMonsterImage, monsterGraveyard[deadMonster].x , monsterGraveyard[deadMonster].y)
		}
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Muertos: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

reset();
var then =  Date.now();
setInterval(main, 1);

/*
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
*/