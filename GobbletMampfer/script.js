// script.js

// Global variables:
var canvas = document.getElementById('canvas');
var context;
var aspectRatio = 5/3;
var unit = 100;
var Game = new GobbletGame();
var gamemode = "pvc"; // "pvp" = player vs player, "pvc" = player vs computer, "cvc" = computer vs computer.
var bot1; // Other opponent in cvc mode.
var bot2; // Opponent.
var mousex = 0;
var mousey = 0;
var player_color = "orange"; // color of the current non-computer player.
var field1_selected = false; // true <=> the non-computer player has selected a starting field for the next move.
var selection1_x; // x-coordinate of the first selected field.
var selection1_y; // y-coordinate of the second selected field.
var rows_columns_diags = [ [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
						   [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
						   [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]] ]; // all triples of fields that form a row, column or diagonal.

// Load images:
var orange = new Image();
var blue = new Image();
var selection = new Image();
var square = new Image();
orange.src = "images/gobblet_orange.png";
blue.src = "images/gobblet_blue.png";
selection.src = "images/selection.png";
square.src = "images/square.png";

function drawImageWithOffset(img, x, y, size) { // draws an image with size (size, size) centered in the square of side length u with left upper corner (x,y).
	context.drawImage(img, x+0.5*(u-size), y+0.5*(u-size), size, size);
}

function startGamePVC() {
	gamemode = "pvc";
	startGame();
}

function startGamePVP() {
	gamemode = "pvp";
	startGame();
}

function startGameCVC() {
	gamemode = "cvc";
	startGame();
}

function startGame() { // starts a game.
	alert("Hello!");
	document.getElementById("title").style.display = "none";
	document.getElementById("startButtonPVC").style.display = "none";
	document.getElementById("startButtonPVP").style.display = "none";
	document.getElementById("startButtonCVC").style.display = "none";
	document.getElementById("canvas").style.display = "block";

	context = canvas.getContext("2d");
	
	resizeCanvas();

	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('orientationchange', resizeCanvas, false);
	window.addEventListener('mousemove', function (e) {
		mousex = e.pageX - canvas.getBoundingClientRect().left;
		mousey = e.pageY - canvas.getBoundingClientRect().top;
		MouseMoving();
	})
	window.addEventListener('touchstart', function (e) {
		mousex = e.pageX - canvas.getBoundingClientRect().left;
		mousey = e.pageY - canvas.getBoundingClientRect().top;
		Click();
	})

	bot1 = new StandardBot(); // Other opponent in cvc mode.
	bot2 = new StandardBot(); // Opponent.

	field1_selected = false;
	player_color = "orange";
	Game = new GobbletGame();

	draw();
	
	if (gamemode == "cvc")
		for (let t=0; t<1000; t++)
		{
			if (t%2 == 0)
				setTimeout(function(){ ComputerMove(bot1); }, 1000);
			else
				setTimeout(function(){ ComputerMove(bot2); }, 1000);
		}
}

function resizeCanvas() { // resizes the canvas.
	var w = window.innerWidth;
	if (w/aspectRatio > window.innerHeight)
		w = window.innerHeight*aspectRatio;
	canvas.width = w;
	canvas.height = w/aspectRatio;
	u = w/5; // unit length
	draw();
}

function draw() { // draws the Game on the canvas.
	context.fillStyle = "rgb(32,32,32)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	for (let i=0; i<3; i++) // Draw board with Gobblets.
		for (let j=0; j<3; j++)
		{
			context.drawImage(square, (i+1)*u, j*u, u, u);
			if (Game.board[i][j].length > 0)
			{
				let gobblet = last(Game.board[i][j]);
				if (gobblet.color == "orange")
					drawImageWithOffset(orange, (i+1)*u, j*u, (0.4 + gobblet.size*0.25)*u);
				if (gobblet.color == "blue")
					drawImageWithOffset(blue, (i+1)*u, j*u, (0.4 + gobblet.size*0.25)*u);
			}
		}
	for (let i=0; i<3; i++) // Draw unused blue Gobblets.
		if (Game.unused_blue[i] > 0)
		{
			drawImageWithOffset(blue, 0, (2-i)*u, (0.4+i*0.25)*u);
			context.font = u/12 + "px Arial";
			context.fillStyle = "white";
			context.fillText(Game.unused_blue[i] + " x", 0.06*u, (2-i+0.12)*u);
		}
	for (let i=0; i<3; i++) // Draw unused orange Gobblets.
		if (Game.unused_orange[i] > 0)
		{
			drawImageWithOffset(orange, 4*u, (2-i)*u, (0.4+i*0.25)*u);
			context.font = u/12 + "px Arial";
			context.fillStyle = "white";
			context.fillText(Game.unused_orange[i] + " x", (4+0.06)*u, (2-i+0.12)*u);
		}
	if (field1_selected == true)
		drawImageWithOffset(selection, selection1_x*u, selection1_y*u, u);
}

function Gobblet(color, size) { // a Gobblet.
	this.color = color; // this.color = "orange" or "blue".
	this.size = size; // 0 = small, 1 = middle, 2 = big.
}

function GobbletGame() { // a game.
	this.current_player_color = "orange";
	this.board = new Array(3); // rows
	for (let i=0; i<3; i++)
	{
		this.board[i] = new Array(3); // columns
		for (let j=0; j<3; j++)
			this.board[i][j] = new Array();
	}
	this.unused_orange = [2, 2, 2]; // number of unused orange gobblets of size 0, 1, 2.
	this.unused_blue = [2, 2, 2]; // number of unused orange gobblets of size 0, 1, 2.
	
	this.copy = function() { // creates and returns a copy of a GobbletGame.
		var game1 = new GobbletGame();
		game1.board = JSON.parse(JSON.stringify(this.board));
		game1.unused_orange = JSON.parse(JSON.stringify(this.unused_orange));
		game1.unused_blue = JSON.parse(JSON.stringify(this.unused_blue))
		game1.current_player_color = this.current_player_color;
		return game1;
	}
	this.switchColor = function() { // switches the color of the current player.
		if (this.current_player_color == "orange")
			this.current_player_color = "blue";
		else if (this.current_player_color == "blue")
			this.current_player_color = "orange";
	}
	this.getColor = function(x, y) { // returns the color of the top object on the square (x,y), x = 0,...,4, y = 0,1,2 ("orange", "blue", "white" or "none").
		if (x >= u && x <= 4*u)
		{
			let i = Math.floor((x-u)/u);
			let j = Math.floor(y/u);
			if (this.board[i][j].length == 0)
				return "white";
			else
				return last(this.board[i][j]).color;
		}
		else
		{
			if (x < u)
			{
				if (this.unused_blue[2-Math.floor(y/u)] > 0)
					return "blue";
				else
					return "none";
			}
			if (x > 4*u)
			{
				if (this.unused_orange[2-Math.floor(y/u)] > 0)
					return "orange";
				else
					return "none";
			}
			return "none";
		}
	}
	this.winner = function() { // determines if "orange", "blue", "both" or "none" of the players has won.
		let orange_won = false;
		let blue_won = false;
		for (let k=0; k<8; k++)
		{
			let line = rows_columns_diags[k];
			if (this.board[line[0][0]][line[0][1]].length == 0 || this.board[line[1][0]][line[1][1]].length == 0 || this.board[line[2][0]][line[2][1]].length == 0)
				continue;
			if (last(this.board[line[0][0]][line[0][1]]).color == "orange" && last(this.board[line[1][0]][line[1][1]]).color == "orange" &&
				last(this.board[line[2][0]][line[2][1]]).color == "orange")
				orange_won = true;
			if (last(this.board[line[0][0]][line[0][1]]).color == "blue" && last(this.board[line[1][0]][line[1][1]]).color == "blue" &&
				last(this.board[line[2][0]][line[2][1]]).color == "blue")
				blue_won = true;
		}
		if (orange_won == true && blue_won == false)
			return "orange";
		if (blue_won == true && orange_won == false)
			return "blue";
		if (orange_won == true && blue_won == true)
			return "both";
		return "none";
	}
	this.winningPosition = function() { // determines if the current player can win the game in the next move.
		for (let k=0; k<8; k++)
		{
			line = rows_columns_diags[k];
			let numOfOwnGobblets = 0;
			let numOfBigGobbletsUsed = 0;
			let biggestForeignGobbletSize = 0;
			for (let i=0; i<3; i++)
				if (this.board[line[i][0]][line[i][1]].length > 0)
				{
					let topGobblet = last(this.board[line[i][0]][line[i][1]]);
					if (topGobblet.color == this.current_player_color)
						numOfOwnGobblets++;
					if (topGobblet.color == this.current_player_color && topGobblet.size == 2)
						numOfBigGobbletsUsed++;
					if (topGobblet.color != this.current_player_color)
						biggestForeignGobbletSize = Math.max(biggestForeignGobbletSize, topGobblet.size);
				}
			if (biggestForeignGobbletSize == 2)
				continue;
			if (numOfOwnGobblets < 2)
				continue;
			if (numOfBigGobbletsUsed == 2 && biggestForeignGobbletSize == 1)
				continue;	
			return true;
		}
		return false;
	}
	this.attemptPlace = function(size, x, y) { // places a Gobblet of the current player of size size at (x,y), if allowed.
		if (this.board[x][y].length > 0)
			if (last(this.board[x][y]).size >= size)
				return false;
		if (this.current_player_color == "orange")
		{
			if (this.unused_orange[size] == 0)
				return false;
			this.unused_orange[size]--;
			this.board[x][y].push(new Gobblet(this.current_player_color, size));
			if (gamemode == "pvp")
				player_color = "blue";
			this.switchColor();
			field1_selected = false;
			draw();
			return true;
		}
		if (this.current_player_color == "blue")
		{
			if (this.unused_blue[size] == 0)
				return false;
			this.unused_blue[size]--;
			this.board[x][y].push(new Gobblet(this.current_player_color, size));
			if (gamemode == "pvp")
				player_color = "orange";
			this.switchColor();
			field1_selected = false;
			draw();
			return true;
		}
	}
	this.attemptMove = function(x1, y1, x2, y2) { // moves the top piece from (x1, y1) to (x2, y2), if allowed.
		if (this.board[x1][y1].length == 0)
			return false;
		if (last(this.board[x1][y1]).color != this.current_player_color)
			return false;
		if (x1 == x2 && y1 == y2)
			return false;
		if (this.board[x1][y1].length == 0)
			return false;
		if (this.board[x2][y2].length > 0)
			if (last(this.board[x1][y1]).size <= last(this.board[x2][y2]).size)
				return false;
	this.board[x2][y2].push(this.board[x1][y1].pop());
	if (gamemode == "pvp")
	{
		if (this.current_player_color == "orange")
			player_color = "blue";
		if (this.current_player_color == "blue")
			player_color = "orange";
	}
	this.switchColor();
	field1_selected = false;
	draw();
	return true;
	}
	
}

function gameOver(winner) { // is called when the game is over.
	draw();
	if (winner == "orange")
		alert("Das Spiel ist aus - Orange hat gewonnen!");
	else if (winner == "blue")
		alert("Das Spiel ist aus - Blau hat gewonnen!")
	else if (winner == "both")
		alert("Das Spiel ist aus - Unentschieden!")
	startGame();
}

function last(array) { // returns last element of an array under the condition array.length > 0, and false otherwise.
	if (array.length > 0)
		return array[array.length - 1]
	else
		return false;
}

function sleep(milliseconds) { // pauses the game for milliseconds milliseconds.
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

function MouseMoving() { // is called when the mouse has been moved.
	canvas.style.cursor='auto';
	draw();
	if (Game.current_player_color != player_color)
		return;
	if (field1_selected == false)
	{
		if (Game.getColor(mousex, mousey) == player_color)
		{
			drawImageWithOffset(selection, Math.floor(mousex/u)*u, Math.floor(mousey/u)*u, u);
			canvas.style.cursor='pointer';
		}
	}
	if (field1_selected == true)
	{
		if (mousex < u || mousex > 4*u)
			return;
		let i = Math.floor(mousex/u) - 1;
		let j = Math.floor(mousey/u);
		if (selection1_x - 1 == i && selection1_y == j)
			return;
		if (Game.board[i][j].length == 0)
		{
			canvas.style.cursor='pointer';
			drawImageWithOffset(selection, (i+1)*u, j*u, u);
			return;
		}
		if (selection1_x == 0 || selection1_x == 4)
			if (last(Game.board[i][j]).size < 2 - selection1_y)
			{
				canvas.style.cursor='pointer';
				drawImageWithOffset(selection, (i+1)*u, j*u, u);
				return;
			}
		if (selection1_x > 0 && selection1_x < 4)
			if (last(Game.board[i][j]).size < last(Game.board[selection1_x - 1][selection1_y]).size)
			{
				canvas.style.cursor='pointer';
				drawImageWithOffset(selection, (i+1)*u, j*u, u);
				return;
			}
	}
}

function Click() { // is called when the left mouse button has been clicked.
	if (Game.current_player_color != player_color)
		return;
	let x = Math.floor(mousex/u); // x-coordinate of the clicked square.
	let y = Math.floor(mousey/u); // y-coordinate of the clicked square.
	if (field1_selected == false) // select first field.
	{
		if (x == 0 && player_color == "blue")
			if (Game.unused_blue[2-y] > 0)
			{
				selection1_x = x;
				selection1_y = y;
				field1_selected = true;
				return;
			}
		if (x == 4 && player_color == "orange")
			if (Game.unused_orange[2-y] > 0)
			{
				selection1_x = x;
				selection1_y = y;
				field1_selected = true;
				return;
			}
		if (x > 0 && x < 4)
			if (Game.board[x-1][y].length > 0)
				if (last(Game.board[x-1][y]).color == player_color)
				{
					selection1_x = x;
					selection1_y = y;
					field1_selected = true;
					return;
				}
	}
	else if (field1_selected == true && (x > 0 && x < 4)) // select second field.
	{
		let success = false;
		if (selection1_x > 0 && selection1_x < 4)
			success = Game.attemptMove(selection1_x-1, selection1_y, x-1, y);
		else
			success = Game.attemptPlace(2-selection1_y, x-1, y);
		if (success == true)
			field1_selected = false;
		if (selection1_x == x && selection1_y == y)
			field1_selected = false;
		draw();
		if (success == true)
		{
		let w = Game.winner();
			if (w != "none")
				gameOver(w);
			else if (gamemode == "pvc")
				setTimeout(function(){ ComputerMove(bot2); }, 400);
		}
	}
	else // reset selection.
		field1_selected = false;
	draw();
}

function ComputerMove(bot) { // the computer player "bot" makes a move.
	let move = bot.calculateMove();
	if (move.length == 4)
	{
		if (Game.attemptMove(move[0], move[1], move[2], move[3]) == false)
			alert("Error: Invalid move by bot!");
	}
	else if (move.length == 3)
	{
		if (Game.attemptPlace(move[0], move[1], move[2]) == false)
			alert("Error: Invalid Gobblet placement by bot!");
	}
	else
		alert("Error: Too few or too many parameters returned by bot!");
	let w = Game.winner();
	if (w != "none")
		gameOver(w);
}

//=============================================================================================================================================================
// Bots:
//
// A bot is a function that provides a member function "this.calculateMove()" which has to return a valid (!) move (otherwise there will be an error message).
// A move is an array of the form [size, i, j] (a Gobblet of size size is placed in the field (i,j)) or of the form [i1, j1, i2, j2] (the top Gobblet of the
// field (i1,j1) is moved to the field (i2,j2)).
//
// A bot may use the function Game.copy() to create a copy (e. g., "game1") of the current game and try out different moves in this copy using the functions
// game1.current_player_color(), game1.attemptPlace(...), game1.attemptMove(...), game1.winner() or game1.winningPosition(). The original Game must not be
// changed.
//=============================================================================================================================================================


function StandardBot() {
	this.calculateMove = function() {

		let game1 = Game.copy();

		for (let size = 2; size>=0; size--) // Search move that lets you win.
			for (let i=0; i<3; i++)
				for (let j=0; j<3; j++)
					if (game1.attemptPlace(size, i, j) == true)
					{
						if (game1.winner() == Game.current_player_color)
							return [size, i, j];
						else
							game1 = Game.copy();
					}
		for (let i1=0; i1<3; i1++)
			for (let j1=0; j1<3; j1++)
				for (let i2=0; i2<3; i2++)
					for (let j2=0; j2<3; j2++)
						if (game1.attemptMove(i1, j1, i2, j2) == true)
						{
							if (game1.winner() == Game.current_player_color)
								return [i1, j1, i2, j2];
							else
								game1 = Game.copy();
						}


		for (let n=0; n<15; n++) // Search a random move such that the other player is not in a winning position afterwards.
		{
			let size = Math.floor(Math.random()*3);
			let i = Math.floor(Math.random()*3);
			let j = Math.floor(Math.random()*3);
			if (game1.attemptPlace(size, i, j) == true)
			{
				if (game1.winningPosition() == false)
					return [size, i, j];
				else
					game1 = Game.copy();
			}
		}
		for (let n=0; n<15; n++)
		{
			let i1 = Math.floor(Math.random()*3);
			let i2 = Math.floor(Math.random()*3);
			let j1 = Math.floor(Math.random()*3);
			let j2 = Math.floor(Math.random()*3);
			if (game1.attemptMove(i1, j1, i2, j2) == true)
			{
				if (game1.winningPosition() == false)
					return [i1, j1, i2, j2];
				else
					game1 = Game.copy();
			}
		}

		for (let size = 2; size>=0; size--) // Search a move such that the other player is not in a winning position afterwards.
			for (let i=0; i<3; i++)
				for (let j=0; j<3; j++)
					if (game1.attemptPlace(size, i, j) == true)
						{
							if (game1.winningPosition() == false)
								return [size, i, j];
							else
								game1 = Game.copy();
						}
		for (let i1=0; i1<3; i1++)
			for (let j1=0; j1<3; j1++)
				for (let i2=0; i2<3; i2++)
					for (let j2=0; j2<3; j2++)
						if (game1.attemptMove(i1, j1, i2, j2) == true)
						{
							if (game1.winningPosition() == false)
								return [i1, j1, i2, j2];
							else
								game1 = Game.copy();
						}

		for (let size = 2; size>=0; size--) // Search move that doesn't let you lose instantly, before the other player's move.
			for (let i=0; i<3; i++)
				for (let j=0; j<3; j++)
					if (game1.attemptPlace(size, i, j) == true)
					{
						if (game1.winner() == "none")
							return [size, i, j];
						else
							game1 = Game.copy();
					}
		for (let i1=0; i1<3; i1++)
			for (let j1=0; j1<3; j1++)
				for (let i2=0; i2<3; i2++)
					for (let j2=0; j2<3; j2++)
						if (game1.attemptMove(i1, j1, i2, j2) == true)
						{
							if (game1.winner() == "none")
								return [i1, j1, i2, j2];
							else
								game1 = Game.copy();
						}

		for (let size = 2; size>=0; size--) // Search a valid move.
			for (let i=0; i<3; i++)
				for (let j=0; j<3; j++)
					if (game1.attemptPlace(size, i, j) == true)
						return [size, i, j];
		for (let i1=0; i1<3; i1++)
			for (let j1=0; j1<3; j1++)
				for (let i2=0; i2<3; i2++)
					for (let j2=0; j2<3; j2++)
						if (game1.attemptMove(i1, j1, i2, j2) == true)
							return [i1, j1, i2, j2];
	}
}