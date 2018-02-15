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

const rand = (min, max) => min + Math.random()*(max - min)
const rchoice = arr => arr[rand(0, arr.length) | 0]

function generate_map({ width = 39, height = 39, room_min = 3, room_max = 9 } = {}) {

	let cells = new Array(width*height).fill(0)

	const floor_percentile = rand(0.4, 0.6)

	// place room on odd to seperate spaces
	const step_odd = x => 1 + (x/2 | 0)*2
	const rand_odd = (min, max) => step_odd(rand(min, max))

	const place_rooms = cells => {
		const [top, left] = [rand_odd(0, height), rand_odd(0, width)]
		const [w, h] = [rand_odd(room_min, room_max), rand_odd(room_min, room_max)]

		if (top + h > height || left + w > width)
			return 0

		const occupied = cell => !!cell
		const top_left = width*top + left
		// check for intersection : subset is ok
		if (
			cells.slice(top_left - width, top_left - width + w).some(occupied)
			||
			cells.slice(top_left + h*width, top_left + h*width + w).some(occupied)
		)
			return 0
		for (let y = 0; y < h; y++) {
			const start = top_left + y*width
			if (occupied(cells[start - 1]) || occupied(cells[start + w]))
				return 0
		}

		let filled = 0
		for (let y = 0; y < h; y++) {
			const start = top_left + y*width
			filled += cells.slice(start, start + w)
				.reduce((acc, elem) => acc + occupied(elem), 0)
			cells.fill(
				      y == 0 ? 'floor_n'
				: y + 1 == h ? 'floor_s'
				             : 'floor_' ,
				start, start + w
			)
			cells[start] += 'w'
			cells[start + w - 1] += 'e'
		}
		return w*h - filled
	}
	
	let room_floor = width * height * floor_percentile | 0
	while (room_floor > 0) {
		room_floor -= place_rooms(cells)
	}

	const exit = rchoice(cells.map((x, i) => x == 'floor_' ? i : 0).filter(x => x))
	cells[exit] = 'exit'

	return { width, height, cells }
}

export { spriteManager, boardManager }
