// script.js

var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
if (canvas.getContext) {
	var img = document.getElementById('drache');
	img.onload = function() {
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
		context.drawImage(img, 100, 100, canvas.width/10, canvas.height/10);
	}

	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('orientationchange', resizeCanvas, false);
}

function resizeCanvas() {
	// Set up temporary canvas
	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;
	var tempContext = tempCanvas.getContext('2d');

	// Copy to temporary canvas
	tempContext.drawImage(canvas, 0, 0);
  
	// Resize original canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
 
	// Copy back to resized canvas
	context.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
}