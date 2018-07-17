Dungeon Crawl
=============

Game Elements
-------------

+ turn-based
+ grid-based
+ randomly generated dungeon
+ 8-directions
+ aiming?
+ baddies
+ attacking
+ items
+ level
+ idle animation

Other Features
--------------

+ key mapping
+ pause menu
+ start menu
+ sound?
+ volume control?
+ theme?
+ fast load time
+ browser compatibility?
+ mobile?

Turns
-----

+ a round is over when all characters turns finishes animation
+ order of events:
  - waiting/aiming (player only)
  - action, which can be either
	* movement (multiple movement can be animated simultaneously)
	* attacking
+ turn order is determined by a speed stat
+ player character can only be controlled during the aiming phase

Combat
------

+ a character dies when its HP hits 0
+ small amount of HP is regenerated over a few turns
+ HP can exceed MAX by using health items
+ basic attack damage is based on attack and defense stat
+ maybe special attack?
+ maybe elemental damage?

Items
-----

+ used on pick up
+ can be picked up by all characters
+ inferior equipment is converted to gold
+ dropped when character dies

Stats
-----

+ base stats increase when level increases
+ level increases when exp reaches threshold
  - ATK
  - DEF
  - MAX HP
  - SPD

Dungeon
-------

+ A dungeon has multiple floors
+ the final floor can be a boss room
+ cannot go back to previous floor

