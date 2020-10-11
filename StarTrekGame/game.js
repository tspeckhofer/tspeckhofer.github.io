// game.js

// declare variables here:
var camera;
var asciiObjects = [];

function startGame() // initialize variables here.
{
	camera = new Camera();
	var obj = new asciiObject();
	asciiObjects[0] = obj;
}

function update(dt) // update is called once per frame.
{
	if (dt > 50)
		return;
	obj = asciiObjects[0];
	obj.translate(obj.forwardUnitVector(), 0.01 * dt);
	//obj.rot += 0.001 * dt;
	
	obj.rot -= inputAxesNormalized.x * 0.005 * dt;
	
	
	var v_cam = 0.05;

	//camera.pos.x += inputAxesNormalized.x * v_cam * dt;
	//camera.pos.y -= inputAxesNormalized.y * v_cam * dt;
}

function draw() // draws the game (is called after update).
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < asciiObjects.length; i++)
	{
		asciiObjects[i].draw(camera); // draw object from perspective of camera
	}
}

function mouseMoved() // is called after the mouse has moved.
{
	// ...
}

function leftClick() // is called after the left mouse button is clicked.
{
	// ...
}