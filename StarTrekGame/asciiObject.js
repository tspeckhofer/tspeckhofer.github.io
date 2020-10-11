// asciiObject.js

class asciiObject
{
	constructor()
	{
		this.pos = {x: 0, y: 0};
		this.rot = 0; // rotation between 0 and 2 * Math.PI
		this.sizex = 8; // x-size in characters ( = in-game metres)
		this.sizey = 3; // y-size in characters
		this.sizez = 4; // number of layers
		this.map =
		[
			[
				" ####",
				" #####",
				" ####"
			],
			[
				"|--  --",
				"|     |",
				"|--  --"
			],
			[
				"|--  --",
				"|     |",
				"|--  --"
			],
			[
				"|---------->",
				"|     |",
				"|---------->"
			]
		]
	}
	translate(vec, dist=1) // translates the object by dist * vec.
	{
		this.pos.x += dist * vec.x;
		this.pos.y += dist * vec.y;
	}
	forwardUnitVector()
	{
		return {x: Math.cos(this.rot), y: Math.sin(this.rot)};
	}
	
	draw(camera)
	{
		var fontSize = canvas.width / 50; // font size depends on zoom and canvas width.
		var metre = 0.71 * fontSize // letter size or distance in pixels (horizontal and vertical)
		for (var z = 0; z < this.sizez; z++) // for each z-layer
		{
			context.setTransform (1, 0, 0, 1, 0, 0);
			// Scale canvas relative to center:
			context.translate(canvas.width / 2, canvas.height / 2);
			context.scale(camera.zoom, camera.zoom);
			context.scale(1 + 0.02 * z, 1 + 0.02 * z);
			context.translate(-canvas.width / 2, -canvas.height / 2);
			// Translate canvas:
			context.translate(metre * (this.pos.x - camera.pos.x), metre * (-this.pos.y - camera.pos.y));
			// layer offset:
			context.translate(0, -0.3 * metre * z);
			// Rotate canvas:
			context.translate(canvas.width / 2, canvas.height / 2);
			context.rotate(-this.rot);
			context.translate(-metre * this.sizex / 2, -metre * this.sizey / 2);
			// Draw object:
			context.font = fontSize + "px Courier New";
			var brightness = Math.max(255 - 50 * (this.sizez - 1 - z), 0);
			context.fillStyle = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
			for (var y = 0; y < this.sizey; y++) // for each row
			{
				for (var x = 0; x < this.map[z][y].length; x++)
				context.fillText(this.map[z][y][x], x * metre, (y + 0.87) * metre)
			}
		}
		// Reset canvas transform:
		context.setTransform (1, 0, 0, 1, 0, 0);
	}
}