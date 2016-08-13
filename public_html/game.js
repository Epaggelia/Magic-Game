function startUp()
{
	var canvas = document.querySelector("canvas");
	var ctx = canvas.getContext("2d");

	function render()
	{
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var border = 128;
		ctx.clearRect(border / 4, border, canvas.width - border / 2, canvas.height - border * 2);
	}

	var spells = [];
	var readableSpells = [];

	var spellObject = function ()
	{
		this.element = 0;
		this.type = [];
		this.x = 0;
		this.y = 0;
	};

	function MakeSpell(rarity)
	{
		var spell = new spellObject();
		var level = rarity;
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
						modifier = getRandom(0, 5);  // 3 = wall, 4 = floor, 5 = cone
						break;
					case 2:
						modifier = getRandom(0, 7); // 6 = targeted, 7 = beam
						break;
					case 3:
						modifier = getRandom(0, 9); // 8 = armor, 9 = AoE
						break;
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
		console.log("checking spell: " + spells.length);
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
					if (spell.type[i] == 3 || spell.type[i] == 4 || spell.type[i] == 5 || spell.type[i] == 6 || spell.type[i] == 7 || spell.type[i] == 8 || spell.type[i] == 9)
					{
						valid = false;
					}
				}
				else if (mod == 1) // check for conflicts with burst 
				{
					if (spell.type[i] == 7 || spell.type[i] == 8)
					{
						valid = false;
					}
				}
				else if (mod == 2) // check for conflicts with multi shot 
				{
					if (spell.type[i] == 3 || spell.type[i] == 5 || spell.type[i] == 6 || spell.type[i] == 8 || spell.type[i] == 9)
					{
						valid = false;
					}
				}
				else if (mod == 3) // check for conflicts with wall
				{
					if (spell.type[i] == 2 || spell.type[i] == 4 || spell.type[i] == 5 || spell.type[i] == 8 || spell.type[i] == 9)
					{
						valid = false;
					}
				}
				else if (mod == 4) // check for conflicts with floor
				{
					if (spell.type[i] == 3 || spell.type[i] == 5 || spell.type[i] == 7 || spell.type[i] == 8 || spell.type[i] == 9)
					{
						valid = false;
					}
				}
				else if (mod == 5) // check for conflicts with cone
				{
					if (spell.type[i] == 0 || spell.type[i] == 3 || spell.type[i] == 4 || spell.type[i] == 6 || spell.type[i] == 7 || spell.type[i] == 8 || spell.type[i] == 9)
					{
						valid = false;
					}
				}
				else if (mod == 6) // check for conflicts with targeted
				{
					if (spell.type[i] == 0 || spell.type[i] == 1 || spell.type[i] == 2 || spell.type[i] == 5 || spell.type[i] == 7)
					{
						valid = false;
					}
				}
				else if (mod == 7) // check for conflicts with beam
				{
					if (spell.type[i] == 0 || spell.type[i] == 3 || spell.type[i] == 4 || spell.type[i] == 5 || spell.type[i] == 6 || spell.type[i] == 8 || spell.type[i] == 9)
					{
						valid = false;
					}
				}
				else if (mod == 8) // check for conflicts with armor
				{
					if (spell.type[i] == 3 || spell.type[i] == 4 || spell.type[i] == 5)
					{
						valid = false;
					}
				}
				else if (mod == 9) // check for conflicts with AoE
				{
					if (spell.type[i] == 3 || spell.type[i] == 4 || spell.type[i] == 5)
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
					readableSpells += ("Wall");
					break;
				case 4:
					readableSpells += ("Floor");
					break;
				case 5:
					readableSpells += ("Cone");
					break;
				case 6:
					readableSpells += ("Targeted");
					break;
				case 7:
					readableSpells += ("Beam");
					break;
				case 8:
					readableSpells += ("Armor");
					break;
				case 9:
					readableSpells += ("AoE");
					break;
				default:
					readableSpells += ("Level range error");
			}
		}
		return readableSpells;
	}


	function runFunctions()
	{
		MakeSpell(3);

		for (i = 0; i < spells.length; i++)
		{
			console.log(spells[i]);
			console.log(convertSpell(spells[i]));
		}
		render();
	}

	runFunctions();
}

