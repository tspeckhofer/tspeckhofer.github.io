// script.js

// Global variables:
var canvas = document.getElementById('canvas');
var context;
var aspectRatio = 16/9;
var mousex = 0;
var mousey = 0;
var lastRenderTime = 0;

// Load images:
var orange = new Image();
var blue = new Image();
orange.src = "images/gobblet_orange.png";
blue.src = "images/gobblet_blue.png";

// Keyboard input:

var pressedKeys =
{
	left: false,
	right: false,
	up: false,
	down: false
};
var inputAxesNormalized = // unit vector in direction of input
{
	x: 0,
	y: 0
}

var keyMap =
{
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};
function keydown(event)
{
	var key = keyMap[event.keyCode];
	pressedKeys[key] = true;
	updateInputAxesNormalized();
}
function keyup(event)
{
	var key = keyMap[event.keyCode];
	pressedKeys[key] = false;
	updateInputAxesNormalized();
}
function updateInputAxesNormalized()
{
	inputAxesNormalized.x = 0;
	inputAxesNormalized.y = 0;
	if (pressedKeys.left)
		inputAxesNormalized.x -= 1;
	if (pressedKeys.right)
		inputAxesNormalized.x += 1;
	if (pressedKeys.up)
		inputAxesNormalized.y += 1;
	if (pressedKeys.down)
		inputAxesNormalized.y -= 1;
	var x = inputAxesNormalized.x;
	var y = inputAxesNormalized.y;
	if (x != 0 && y != 0)
	{
		var length = Math.sqrt(2)
		inputAxesNormalized.x /= length;
		inputAxesNormalized.y /= length;
	}
}

function displayHelp()
{
	alert("Das Spiel 'Gobblet Mampfer' besteht aus einem 3x3-Spielbrett und 12 Gobblets (das sind auf dem Kopf stehende Becher - in dieser virtuellen Version aus der "
	+ "Vogelperspektive...");
}

function init() // initialize everything.
{
	// Setup event listeners:
	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('orientationchange', resizeCanvas, false);
	window.addEventListener("keydown", keydown, false)
	window.addEventListener("keyup", keyup, false)
	window.addEventListener('mousemove', function (event) {
		mousex = event.pageX - canvas.getBoundingClientRect().left;
		mousey = event.pageY - canvas.getBoundingClientRect().top;
		mouseMoved();
	});
	canvas.addEventListener('click', function(event) {
		mousex = event.pageX - canvas.getBoundingClientRect().left;
		mousey = event.pageY - canvas.getBoundingClientRect().top;
		leftClick();
	});
	
	// Hide menu:
	document.getElementById("title").style.display = "none";
	document.getElementById("version").style.display = "none";
	document.getElementById("startButton").style.display = "none";
	document.getElementById("helpButton").style.display = "none";
	document.getElementById("canvas").style.display = "block";
	
	// Get context:
	context = canvas.getContext("2d");

	// additional initialization steps:
	startGame();
	
	// Start game loop:
	resizeCanvas();
	lastRenderTime = 0;
	window.requestAnimationFrame(loop);
}

function resizeCanvas() // resizes the canvas.
{
	var w = window.innerWidth;
	if (w / aspectRatio > window.innerHeight)
		w = window.innerHeight * aspectRatio;
	canvas.width = w;
	canvas.height = w / aspectRatio;
	draw();
}

function loop(timestamp) // game loop
{
  var dt = timestamp - lastRenderTime;
  update(dt);
  draw();
  lastRenderTime = timestamp;
  window.requestAnimationFrame(loop);
}