// script.js

var canvas = document.getElementById('canvas');
var aspectRatio = 16/9;
var context;

var img = new Image();
img.onload = function() {
	context = canvas.getContext("2d");
	resizeCanvas();
	draw();

	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('orientationchange', resizeCanvas, false);
}
img.src = "lego.png";

function draw() {
	context.drawImage(img, 0, 0, canvas.width, canvas.height);
	context.drawImage(img, 0.1*canvas.width, 0.1*canvas.height, 0.1*canvas.width, 0.1*canvas.height);
}


function resizeCanvas() {
	var w = window.innerWidth;
	if (w/aspectRatio > window.innerHeight)
		w = window.innerHeight*aspectRatio;
	canvas.width = w;
	canvas.height = w/aspectRatio;
	draw();
}