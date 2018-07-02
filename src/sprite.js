const SPRITE_DATA = {
	grid_size : 16,
	tiles : {
		src : 'assets/tiles/CB-TempleDungeon/CB-Temple-A.png',
		crop: {
			bg:      {x:  98, y:  90, width:  4, height:  4},
			exit:    {x: 176, y: 216, width: 16, height: 16},
			floorn:  {x:  20, y:   8, width: 16, height: 16},
			floors:  {x:  16, y:  24, width: 16, height: 16},
			floore:  {x:  24, y:  21, width: 16, height: 16},
			floorw:  {x:   8, y:  21, width: 16, height: 16},
			floorne: {x:  24, y:   8, width: 16, height: 16},
			floornw: {x:   8, y:   8, width: 16, height: 16},
			floorse: {x:  24, y:  24, width: 16, height: 16},
			floorsw: {x:   8, y:  24, width: 16, height: 16},
			get floor() {
				switch (Math.random() * 10 | 0) {
				case 0:
					return {x:  40, y:   8, width: 16, height: 16}
				case 1: case 2:
					return {x:  12, y:  12, width: 16, height: 16}
				default:
					return {x:  16, y:  24, width:  4, height: 4}
				}
			},
			get wall() {
				switch (Math.random() * 10 | 0) {
				case 0:
					return {x: 144, y: 114, width: 16, height: 16}
				case 1:
						return {x:  72, y: 106, width: 16, height: 16}
				default:
						return {x: 108, y:  50, width: 16, height: 16}
				}
			},
			get path() {
				switch (Math.random() * 5 | 0) {
				case 0: case 1:
					return {x:  78, y:  12, width: 16, height: 16}
				case 2:
					return {x:  65, y:   9, width: 16, height: 16}
				default:
					return {x:  78, y:  22, width: 16, height: 16}
				}
			},
		}
	},
	health: {
		src : 'assets/chars/chibi-monsters-files/frog.png',
		crop: [
			{x:  0, y: 0, width: 16, height: 16},
			{x: 16, y: 0, width: 16, height: 16},
			{x: 32, y: 0, width: 16, height: 16},
		]
	},
	player: {
		src : 'assets/chars/Micro-Character-Bases/Human/human_regular_bald.png',
		crop: {
			idle: {x: 4, y: 4, width: 12, height: 16},
			walk: [
				{x: 44, y: 4, width: 12, height: 16},
				{x: 24, y: 4, width: 12, height: 16},
			],
		}
	},
}
