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

const occupied = cell => !!cell && cell != 'wall'

export { boardManager, occupied }

const rand = (min, max) => min + Math.random()*(max - min)
const rchoice = arr => arr[rand(0, arr.length) | 0]

function generate_map({ width = 39, height = 39, room_min = 3, room_max = 9 } = {}) {

	let cells = new Array(width*height).fill(0)

	const floor_percentile = rand(0.4, 0.6)

	let room_floor = width * height * floor_percentile | 0
	while (room_floor > 0) {
		room_floor -= place_room(cells, width, height, room_min, room_max)
	}
	connect_rooms(cells, width, height)
	place_exit(cells)
	place_walls(cells, width, height)

	return { width, height, cells }
}

const step_odd = x => 1 + (x/2 | 0)*2
const rand_odd = (min, max) => step_odd(rand(min, max))

function place_room(cells, width, height, room_min, room_max) {
	// place room on odd to seperate spaces
	const [top, left] = [rand_odd(0, height), rand_odd(0, width)]
	const [w, h] = [rand_odd(room_min, room_max), rand_odd(room_min, room_max)]

	if (top + h > height || left + w > width)
		return 0

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
			start,
			start + w
		)
		cells[start] += 'w'
		cells[start + w - 1] += 'e'
	}

	return w*h - filled
}

function connect_rooms(cells, width, height) {
	const rooms = cells.map((x, i) => x == 'floor_nw' ? i : 0).filter(x => x)
	const walls = rooms.map(nw => {
		let cur = nw

		const walls = [cur]
		while (cells[++cur].endsWith('n'))
			walls.push(cur)
		walls.push(cur)

		const diff = cur - nw
		for (cur = nw + width; cells[cur].endsWith('_w'); cur += width)
			walls.push(cur, cur + diff)

		return walls.concat(new Array(diff + 1).fill().map((e, i) => i + cur))
	})

	walls.reduce((big, small) => {
		if (small.find(cell => big.includes(cell)))
			return big.concat(small)

		const candidates = []

		for (let path = 2; !candidates.length; path += 2) {
		for (const wall of small) {
			if (/n(?:w|e)?$/.test(cells[wall]) && big.includes(wall - path*width))
				candidates.push(
					new Array(path).fill().map(
						(e, i) => wall - i*width
					).slice(1)
				)
			else if (
				cells[wall].endsWith('w')
				&& wall%width > path
				&& big.includes(wall - path)
			)
				candidates.push(
					new Array(path).fill().map(
						(e, i) => wall - i
					).slice(1)
				)
			else if (
				cells[wall].endsWith('e')
				&& (wall%width) + path < width
				&& big.includes(wall + path)
			)
				candidates.push(
					new Array(path).fill().map(
						(e, i) => wall + i
					).slice(1)
				)
		}
		}

		let path = rchoice(candidates)
		for (const step of path) {
			const cur = cells[step]
			cells[step] = !!cur && cur != 'wall' ? cur : 'path'
		}

		return big.concat(small, path)
	})
}

function place_walls(cells, width, height) {
	for (let i = 0; i < cells.length; i++)
		if (!cells[i] && !!cells[i + width])
			cells[i] = 'wall'
}

function place_exit(cells) {
	const exit = rchoice(
		cells.map((x, i) => x == 'floor_' ? i : 0).filter(x => x)
	)
	cells[exit] = 'exit'
}
