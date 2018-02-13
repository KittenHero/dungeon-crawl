const spriteManager = (state = {}, action) => {
	switch (action.type) {
		case 'SPRITE_LOADED':
			return {...state, ...action.payload}
		default:
			return state
	}
}

const default_board = {
	width: 0, height: 0,
	cells: new Array(0)
}

const boardManager = (state = default_board, action) => {
	switch (action.type) {
		case 'GENERATE_MAP':
			return generate_map()
		default:
			return state
	}
}

function generate_map({ width = 39, height = 39, room_min = 3, room_max = 9 } = {}) {

	let cells = new Array(width*height).fill(0)
	const place_rooms = cells => cells
	return { width, height, cells }

}

export { spriteManager, boardManager }
