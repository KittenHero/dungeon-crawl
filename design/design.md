
State Machine
-------------

```plantuml
[*] -> Idle : animation sm
Idle --> Walk
Walk -> Attack
Attack --> Idle
Walk --> [*] : exit
Attack --> [*] : boss

state Idle {
	[*] -> wait : turn sm
	wait --> input
	wait --> walk
	wait --> attack
	walk --> wait
	input --> [*]
	attack --> [*]
}
```

Game Objects
------------

```plantuml
object Character {
	player character
	hostile npc
}
object Item {
	health consumable
	weapon
}
object Floor {
	dungeon floor
	boss room
}
object World {
	create objects
	sequence actions
}

World *-- Character
World *-- Item
World *-- Floor
Character *-l- Item
```

Dependency
----------

```plantuml
(game loop) as (loop)
(game objects) as (obj)

(sprites) -> (obj)
(obj) -> (world)
(world) --> (loop)
(canvas) --> (loop)
```

Initialisation
--------------

```plantuml
partition "canvas" {
: create canvas;
: resize canvas;
: register key handler;
: register window resize handler;
}
partition "world" {
: fetch sprites;
: fetch sounds;
: init event queue;
}
```

Game Loop
---------

Idle
----

```plantuml
while (queue) is (poll)
	if () then (create level)
		: init layout;
		: queue place (exit);
		: queue place (items);
		: queue place (baddies);
		: queue place (player);
		: queue turn;
	elseif () then (create boss room)
		: init layout;
		: queue place (player);
		: queue place (boss);
		: queue turn;
	elseif () then (turn)
		: queue wait;
		: increment turn counter;
		if (turn % 15 & no boss & baddies < 10) then
			: queue place (baddie);
		endif
		: queue turn;
	elseif () then (wait)
		: resolve action;
		if () then (walk)
		: set state;
		elseif () then (attack)
		: set state;
		stop
		else (input)
		: queue input;
		endif
	elseif () then (input)
		if (valid input) then
			: set state;
		else
			: push front (input);	
		endif
		stop
	else (place)
		: place object;
	endif
endwhile (empty)
stop
```
