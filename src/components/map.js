import { occupied } from '../reducers'

const Map = props => {
	const { seen, width, height } = props
	const dir_path = (cell, dir) => cell[dir] ? 'l' : 'm'

	const border = seen.map((cell, pos) => {
		// cells bordering occupied spaces
		if (occupied(cell))
			return null

		cell = {
			x: 8*(pos%width),
			y: 8*(pos/width | 0),
		}

		if (occupied(seen[pos - width])) {
			cell.above = 1
			cell.valid = 1
		}
		if (occupied(seen[pos + width])) {
			cell.below = 1
			cell.valid = 1
		}
		if (occupied(seen[pos - 1])) {
			cell.left = 1
			cell.valid = 1
		}
		if (occupied(seen[pos + 1])) {
			cell.right = 1
			cell.valid = 1
		}

		return cell
	}).filter(x => x != null && x.valid).map(cell =>
		`M ${cell.x},${cell.y}
		${dir_path(cell, 'above')} 8,0
		${dir_path(cell, 'right')} 0,8
		${dir_path(cell, 'below')} -8,0
		${dir_path(cell, 'left')} 0,-8`
	).join(' ')
	const exit = seen.indexOf('exit')

	return pug`
Group
	Rect(width=336 height=336 fill='#000')
	Group(x=12, y=12)
		Path(
			stroke='#aaa'
			data=${border}
		)
		if ${exit >= 0}
			Path(
				x=${8*(exit%width)} y=${8*(exit/width | 0)}
				stroke='#24f'
				data='m 0,0 l 8,0 l 0,8 l -8,0 z'
			)`
}


export default Map
