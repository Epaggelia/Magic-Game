function startUp()
{
	var canvas = document.querySelector("canvas");
	var ctx = canvas.getContext("2d");
	function render()
	{
		ctx.fillStyle = "rgb(0,0,0)";

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (i = 0; i < borders.length; i++)
		{
			ctx.fillRect(borders[i].x, borders[i].y, borders[i].w, borders[i].h);
		}

		ctx.fillStyle = "rgb(77,77,77)";
		ctx.fillRect(gameZoneX, gameZoneY, gameCanvasWidth, gameCanvasHeight);

		if (clickLocation[0] != undefined && clickLocation[1] != undefined)
		{
			if (!spells[0].active)
			{
				coolDownTimer(spells[0]);
				spellCast(clickLocation[0], clickLocation[1], spells[0]);
			}
		}

		//draw player
		playerLogic();
		drawBall(player, "rgb(0,0,0)");
		activeSpell();

		setTimeout(render, 33);
	}

	var coolDownTimeInterval;
	function coolDownTimer(spell)
	{
		var timer = 0;
		coolDownTimeInterval = window.setInterval(function ()
		{
			if (timer != spell.cooldown * 10)
			{
				spell.active = true;
				timer += 1;
			}
			else
			{
				spell.active = false;
				clearInterval(coolDownTimeInterval);
			}
		}, 100);
	}

// game canvas
	{
		var border = 128;
		var gameZoneX = border / 4;
		var gameZoneY = border / 4;
		var gameCanvasWidth = canvas.width - border / 2;
		var gameCanvasHeight = canvas.height - border * 2;
	}

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

// walls
	{
		var borders = [];

		var wall_0 = new simpleRect(0, 0, canvas.width, gameZoneY);
		var wall_1 = new simpleRect(0, 0, gameZoneX, canvas.height);
		var wall_2 = new simpleRect(canvas.width - gameZoneX, 0, gameZoneX, canvas.height);
		var wall_3 = new simpleRect(0, gameCanvasHeight + gameZoneY, canvas.width, canvas.height - gameCanvasHeight - gameZoneY);

		borders.push(wall_0);
		borders.push(wall_1);
		borders.push(wall_2);
		borders.push(wall_3);
	}

// Player creation stuff
	{
		var playerSpeed = 4;
		var player = new simpleRect(gameZoneX + gameCanvasHeight / 2, gameZoneY + gameCanvasHeight / 2, 24, 24);

		player.vx = 0;
		player.vy = 0;

		player.moveRight = false;
		player.moveLeft = false;
		player.moveUp = false;
		player.moveDown = false;
		player.interact = false;
	}

// Spell creation stuff
	{
		var spells = [];
		var spellParticle = [];
		var readableSpells = [];

		function spellCast(x, y, activeSpell)
		{
			activeSpell.active = true;
			var spell = activeSpell;

			spell.x = player.x;
			spell.y = player.y;
			spell.targetX = x;
			spell.targetY = y;

			var projectile = false;
			var burst = false;
			var multiShot = false;
			var beam = false;
			for (j = 0; j < spell.type.length; j++)
			{
				if (spell.type[j] == 0)
					projectile = true;
				if (spell.type[j] == 1)
					burst = true;
				if (spell.type[j] == 2)
					multiShot = true;
				if (spell.type[j] == 6)
					beam = true;
			}

			if (projectile || multiShot || beam)
			{
				spellDirection(spell.targetX, spell.targetY, spell);
			}

			if (multiShot)
			{
				spell.particleCount = 3;
				for (i = 0; i < spell.particleCount; i++)
				{
					spellParticle.push(spell);
				}
			}
			else
			{
				spellParticle.push(spell);
			}
			console.log(spellParticle.length);
		}
	}

	function activeSpell()
	{
		if (spellParticle[0] != undefined)
		{
			for (i = 0; i < spellParticle.length; i++)
			{
				var projectile = false;
				var burst = false;
				var multiShot = false;
				var beam = false;

				var color = "rgb(0,0,0)";

				switch (spellParticle[i].element)
				{
					case 0: //fire
						color = "rgba(249, 60, 31, 0.9)";
						break;
					case 1: //lightning
						color = "rgba(230, 254, 77, 0.9)";
						break;
					case 2: //water
						color = "rgba(4, 119, 234, 0.6)";
						break;
					case 3: //earth
						color = "rgba(150, 114, 79, 0.9)";
						break;
					case 4: //ice
						color = "rgba(188, 250, 250, 0.9)";
						break;
					case 5: //life
						color = "rgba(173, 241, 104, 0.9)";
						break;
					case 6: //death
						color = "rgba(96, 29, 164, 0.9)";
						break;
				}

				for (j = 0; j < spellParticle[i].type.length; j++)
				{
					if (spellParticle[i].type[j] == 0)
						projectile = true;
					if (spellParticle[i].type[j] == 1)
						burst = true;
					if (spellParticle[i].type[j] == 2)
						multiShot = true;
					if (spellParticle[i].type[j] == 6)
						beam = true;
				}

				if (projectile || multiShot)									//Projectile or MultiShot
				{
					if (!spellCollision(spellParticle[i]))						//Not touching a wall
						projectileSpell(spellParticle[i]);						//Move like a Projectile
					if (!burst)													//Not explosive
					{
						drawBall(spellParticle[i], color);						//Draw movements
						if (spellCollision(spellParticle[i]))					//If touching a wall
						{
							removeObject(spellParticle[i], spellParticle);		//Remove ball
						}
					}
				}

				if (beam && spellParticle[i] != undefined)						//Beam and spellParticle not already removed from the array
				{
					beamSpell(spellParticle[i], color);							//Make / draw beam
				}

				if (burst)														//Burst spell
				{
					if (projectile || multiShot)								//Also Projectile or MultiShot?
					{
						drawBall(spellParticle[i], color);						//draw the ball as it moves
						if (spellCollision(spellParticle[i]))					//Ball hit a wall
						{
							burstSpell(spellParticle[i]);						//Start explosion
							if (burstSpell(spellParticle[i]))					//Explosion complete?
							{
								removeObject(spellParticle[i], spellParticle);	//Remove ball
							}
							else												//Explosion not complete?
							{
								drawBall(spellParticle[i], color);				//Continue drawing things
							}
						}
					}
					else														//Not a Projectile or MultiShot?
					{
						burstSpell(spellParticle[i]);							//Just explode
						if (burstSpell(spellParticle[i]))						//Explosion complete?
						{
							removeObject(spellParticle[i], spellParticle);		//Remove ball
						}
						else													//Explosion not complete?
						{
							drawBall(spellParticle[i], color);					//Continue drawing things
						}
					}
				}
			}
		}
	}

	function spellCollision(spell)
	{
		var edgeHit = false;

		for (g = 0; g < borders.length; g++)
		{
			if (hitTestRectangle(spell, borders[g]))
				edgeHit = true;
		}
		return edgeHit;
	}

	function burstSpell(spell)
	{
		if (spell.w <= spell.h * spell.AOEsize)
		{
			spell.w += 4;
		}
		else
		{
			return true;
		}
	}

	function spellDirection(x, y, spell)
	{
		if (!isNaN(x) && !isNaN(y))
		{
			var dx = spell.x - x;
			var dy = spell.y - y;
			spell.distance = Math.floor(Math.sqrt((dx * dx) + (dy * dy)));
			spell.r = Math.degrees(Math.atan2(dy, dx));
		}
	}

	function projectileSpell(spell)
	{
		spell.vx = Math.cos(Math.radians(spell.r)) * spell.speed;
		spell.vy = Math.sin(Math.radians(spell.r)) * spell.speed;
		spell.x = spell.x - spell.vx;
		spell.y = spell.y - spell.vy;
	}

	function beamSpell(spell, color)
	{
		ctx.save();
		ctx.fillStyle = color;
		ctx.translate(player.x, player.y);
		ctx.rotate(Math.radians(spell.r));
		ctx.fillRect(0, -2, -gameCanvasWidth, 4);
		ctx.restore();
	}

	function drawBall(object, color)
	{
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(object.x, object.y, object.halfWidth(), 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
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
		if (player.x - player.halfWidth() < gameZoneX)
		{
			player.x = player.halfWidth() + gameZoneX;
		}
		else if (player.x + player.halfWidth() > gameZoneX + gameCanvasWidth)
		{
			player.x = gameZoneX + gameCanvasWidth - player.halfWidth();
		}

		//player movement borders -> Top and bottom
		if (player.y - player.halfHeight() < gameZoneY)
		{
			player.y = gameZoneY + player.halfHeight();
		}
		else if (player.y + player.halfHeight() > gameCanvasHeight + gameZoneY)
		{
			player.y = gameZoneY + gameCanvasHeight - player.halfHeight();
		}
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
			var skill = new SpriteObject();
			skill.element = 0;
			skill.type = [];
			skill.cooldown = 0.3;
			skill.active = false;

			skill.w = 8;
			skill.h = 8;
			skill.r = 0;

			skill.targetX = 0;
			skill.targetY = 0;

			skill.particleCount = 1;
			skill.AOEsize = 5;

			skill.speed = 7;


			var level = rarity;
			if (level <= 0 || level >= 4)
				level = 0;
			var element = 0;
			var modifier = 0;
			switch (level)
			{
				case 0:
					element = getRandom(0, 2); // 0 = fire, 1 = lightning, 2 = water
					break;
				case 1:
					element = getRandom(0, 4); // 3 = earth, 4 = cold
					break;
				case 2:
					element = getRandom(0, 5); // 5 = life
					break;
				case 3:
					element = getRandom(0, 6); // 6 = death
					break;
			}

			skill.element = element;
			modify();

			function modify()
			{
				for (i = 0; i <= level; i++)
				{
					switch (level) {
						case 0:
							modifier = getRandom(0, 2); // 0 = projectile , 1 = burst, 2 = multi shot 
							break;
						case 1:
							modifier = getRandom(0, 5); // 3 = AoE, 4 = cone
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
					if (checkSpellModifier(skill, modifier))
					{
						skill.type = skill.type.concat(modifier);
					}
					else
					{
						i -= 1;
					}
				}
			}
			spells.push(skill);
		}

		function checkSpellModifier(spell, mod)
		{
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

			MakeSpell(3);

			for (i = 0; i < spells.length; i++)
			{
				console.log(spells[i]);
				console.log("Starter Spell:\n" + convertSpell(spells[i]));
			}

			canvas.addEventListener("mousedown", mouseLocation);
			canvas.addEventListener("mouseup", mouseReset);
			render();
		}
	}

	runFunctions();
}

