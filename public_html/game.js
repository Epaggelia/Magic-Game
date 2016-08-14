function startUp()
{
	var canvas = document.querySelector("canvas");
	var ctx = canvas.getContext("2d");

	function render()
	{
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.clearRect(gameZoneX, gameZoneY, gameCanvasWidth, gameCanvasHeight);

		//draw player
		playerLogic();
		drawBall(player, "rgb(255,0,0)");


		setTimeout(render, 33);
	}
	var border = 128;

	var gameZoneX = border / 4;
	var gameZoneY = border / 4;
	var gameCanvasWidth = canvas.width - border / 2;
	var gameCanvasHeight = canvas.height - border * 2;

	var clickLocation = [];

	// key value variables
	{
		var spaceKeyCode = 32;

		var wasdLeft = 65;
		var wasdUp = 87;
		var wasdDown = 83;
		var wasdRight = 68;

		var numBar1 = 49;
		var numBar2 = 50;
		var numBar3 = 51;
		var numBar4 = 52;
		var numBar5 = 53;
		var numBar6 = 54;
		var numBar7 = 55;
		var numBar8 = 56;
		var numBar9 = 57;
		var numBar0 = 48;
	}

	// Player creation stuff
	{
		var player;
		var playerSpeed = 4;

		var Player = function (x, y)
		{
			this.x = x;
			this.y = y;
			this.width = 24;
			this.height = 24;
			this.halfWidth = this.width / 2;
			this.halfHeight = this.height / 2;

			this.vx = 0;
			this.vy = 0;

			this.moveRight = false;
			this.moveLeft = false;
			this.moveUp = false;
			this.moveDown = false;
			this.interact = false;
		};

		player = new Player(gameZoneX + gameCanvasHeight / 2, gameZoneY + gameCanvasHeight / 2);
	}

	// Spell creation stuff
	{
		var spells = [];
		var readableSpells = [];

		var spellObject = function ()
		{
			this.element = 0;
			this.type = [];
			this.x = 0;
			this.y = 0;
		};
	}

	// player movement logic
	function playerLogic()
	{
		//stops movement when not pressing keys
		player.vx = 0;
		player.vy = 0;

		//move right, left, up, down
		if (player.moveRight)
		{
			player.vx = playerSpeed;
		}
		else if (player.moveLeft)
		{
			player.vx = -playerSpeed;
		}
		if (player.moveUp)
		{
			player.vy = -playerSpeed;
		}
		else if (player.moveDown)
		{
			player.vy = playerSpeed;
		}

		player.x += player.vx;
		player.y += player.vy;

		//player movement borders -> left and right
		if (player.x - player.halfWidth < gameZoneX)
		{
			player.x = player.halfWidth + gameZoneX;
		}
		else if (player.x + player.halfWidth > gameZoneX + gameCanvasWidth)
		{
			player.x = gameZoneX + gameCanvasWidth - player.halfWidth;
		}

		//player movement borders -> Top and bottom
		if (player.y - player.halfHeight < gameZoneY)
		{
			player.y = gameZoneY + player.halfHeight;
		}
		else if (player.y + player.halfHeight > gameCanvasHeight + gameZoneY)
		{
			player.y = gameZoneY + gameCanvasHeight - player.halfHeight;
		}
	}

	function drawBall(object, color)
	{
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(object.x, object.y, object.halfWidth, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}

//game input - mouse location and keycodes
	{
		//keyboard input - keydown
		function keyPressed(e)
		{
			var keyCode = e.keyCode;

			if (keyCode === wasdRight)
			{
				player.moveRight = true;
			}
			else if (keyCode === wasdLeft)
			{
				player.moveLeft = true;
			}
			else if (keyCode === wasdUp)
			{
				player.moveUp = true;
			}
			else if (keyCode === wasdDown)
			{
				player.moveDown = true;
			}
			if (keyCode === spaceKeyCode)
			{
				player.interact = true;
			}
		}

		//keyboard input - keyup
		function keyReleased(e)
		{
			var keyCode = e.keyCode;

			if (keyCode === wasdRight)
			{
				player.moveRight = false;
			}
			else if (keyCode === wasdLeft)
			{
				player.moveLeft = false;
			}
			else if (keyCode === wasdUp)
			{
				player.moveUp = false;
			}
			else if (keyCode === wasdDown)
			{
				player.moveDown = false;
			}
			if (keyCode === spaceKeyCode)
			{
				player.interact = false;
			}
		}

		//Mouse click location code
		{
			function mouseLocation(e)
			{
				if (event.which == 1)
				{
					if (e.pageX != undefined && e.pageY != undefined)
					{
						x = e.pageX;
						y = e.pageY;
					}

					x -= canvas.offsetLeft;
					y -= canvas.offsetTop;

					clickLocation = [Math.floor(x), Math.floor(y)];
				}
				addEventListener("mousemove", mouseMoved);
			}

			function buttonPressed(e)
			{
				if (e.buttons == null)
					return e.which != 0;
				else
					return e.buttons != 0;
			}
			function mouseMoved(e)
			{
				if (!buttonPressed(e))
				{
					removeEventListener("mousemove", mouseMoved);
				}
				else
				{
					if (e.pageX != undefined && e.pageY != undefined)
					{
						x = e.pageX;
						y = e.pageY;
					}

					x -= canvas.offsetLeft;
					y -= canvas.offsetTop;

					clickLocation = [Math.floor(x), Math.floor(y)];
				}
			}

			function mouseReset()
			{
				clickLocation[0] = undefined;
				clickLocation[1] = undefined;
			}
		}
	}

//random spell generator, spell validator and convert to readable format
	{
		function MakeSpell(rarity)
		{
			var spell = new spellObject();
			var level = rarity;
			if (level <= 0 || level >= 4)
				level = 0;
			var element = 0;
			var modifier = 0;

			switch (level)
			{
				case 0:
					element = getRandom(0, 2);  // 0 = fire, 1 = lightning, 2 = water
					break;
				case 1:
					element = getRandom(0, 4);  // 3 = earth, 4 = cold
					break;
				case 2:
					element = getRandom(0, 5); // 5 = life
					break;
				case 3:
					element = getRandom(0, 6); // 6 = death
					break;
			}

			spell.element = element;
			modify();

			function modify()
			{
				for (i = 0; i <= level; i++)
				{
					switch (level) {
						case 0:
							modifier = getRandom(0, 2);  // 0 = projectile , 1 = burst, 2 = multi shot 
							break;
						case 1:
							modifier = getRandom(0, 5);  // 3 = AoE, 4 = cone
							break;
						case 2:
							modifier = getRandom(0, 6); // 5 = targeted, 6 = beam
							break;
						case 3:
							modifier = getRandom(0, 7); // 7 = Status
							break;
						default:
							console.log("invalid spell level.");
					}
					if (checkSpellModifier(spell, modifier))
					{
						spell.type = spell.type.concat(modifier);
					}
					else
					{
						i -= 1;
					}
				}
			}

			spells.push(spell);
		}

		function checkSpellModifier(spell, mod)
		{
//			console.log("checking spell: " + spells.length);
			var valid = true;

			if (spell.type.length > 0)
			{
				for (i = 0; i < spell.type.length; i++)
				{
					if (mod == spell.type[i]) // checks for doubled mods
					{
						valid = false;
					}
					else if (mod == 0) // check for conflicts with projectile 
					{
						if (spell.type[i] == 4 || spell.type[i] == 5 || spell.type[i] == 6)
						{
							valid = false;
						}
					}
					else if (mod == 1) // check for conflicts with burst 
					{
						if (false)
						{
							valid = false;
						}
					}
					else if (mod == 2) // check for conflicts with multi shot 
					{
						if (spell.type[i] == 4)
						{
							valid = false;
						}
					}
					else if (mod == 3) // check for conflicts with AoE
					{
						if (false)
						{
							valid = false;
						}
					}
					else if (mod == 4) // check for conflicts with cone
					{
						if (spell.type[i] == 0 || spell.type[i] == 2 || spell.type[i] == 5 || spell.type[i] == 6)
						{
							valid = false;
						}
					}
					else if (mod == 5) // check for conflicts with targeted
					{
						if (spell.type[i] == 0 || spell.type[i] == 4 || spell.type[i] == 6)
						{
							valid = false;
						}
					}
					else if (mod == 6) // check for conflicts with beam
					{
						if (spell.type[i] == 0 || spell.type[i] == 4 || spell.type[i] == 5)
						{
							valid = false;
						}
					}
					else if (mod == 7) // check for conflicts with Status
					{
						if (false)
						{
							valid = false;
						}
					}
				}
			}
			return valid;
		}

		function convertSpell(spell)
		{
			readableSpells = spell;
			switch (spell.element) {
				case 0:
					readableSpells = "Fire";
					break;
				case 1:
					readableSpells = "Lightning";
					break;
				case 2:
					readableSpells = "Water";
					break;
				case 3:
					readableSpells = "Earth";
					break;
				case 4:
					readableSpells = "Ice";
					break;
				case 5:
					readableSpells = "Life";
					break;
				case 6:
					readableSpells = "Death";
					break;
				default:
					readableSpells = "Level range error";
			}

			for (j = 0; j < spell.type.length; j++)
			{
				readableSpells += "\n";
				switch (spell.type[j]) {
					case 0:
						readableSpells += ("Projectile");
						break;
					case 1:
						readableSpells += ("Burst");
						break;
					case 2:
						readableSpells += ("Multi Shot");
						break;
					case 3:
						readableSpells += ("AoE");
						break;
					case 4:
						readableSpells += ("Cone");
						break;
					case 5:
						readableSpells += ("Targeted");
						break;
					case 6:
						readableSpells += ("Beam");
						break;
					case 7:
						readableSpells += ("Status");
						break;
					default:
						readableSpells += ("Level range error");
				}
			}
			return readableSpells;
		}
	}

//Start logic and loops
	{
		function runFunctions()
		{
			window.addEventListener("keydown", keyPressed);
			window.addEventListener('keyup', keyReleased);

			MakeSpell(0);

			for (i = 0; i < spells.length; i++)
			{
//				console.log(spells[i]);
				console.log("Starter Spell:\n" + convertSpell(spells[i]));
			}

			canvas.addEventListener("mousedown", mouseLocation);
			canvas.addEventListener("mouseup", mouseReset);

			render();
		}
	}

	runFunctions();
}

