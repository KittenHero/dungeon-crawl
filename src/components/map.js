import React from 'react'
import { Group, Rect, Path } from 'react-konva'
import { occupied } from '../reducers'

const Map = props => {
	const { seen, width, height } = props
	const dir_path = (cell, dir) => cell[dir] ? 'l' : 'm'
	const scaleX = width / seen.width | 0
	const scaleY = height / seen.height | 0
	const offsetX = (width - seen.width*scaleX)/2
	const offsetY = (height - seen.height*scaleY)/2

	const border = seen.cells.map((cell, pos) => {
		// cells bordering occupied spaces
		if (occupied(cell))
			return null

		cell = {
			x: scaleX*(pos%seen.width),
			y: scaleY*(pos/seen.width | 0),
		}

		if (occupied(seen.cells[pos - seen.width])) {
			cell.above = 1
			cell.valid = 1
		}
		if (occupied(seen.cells[pos + seen.width])) {
			cell.below = 1
			cell.valid = 1
		}
		if (occupied(seen.cells[pos - 1])) {
			cell.left = 1
			cell.valid = 1
		}
		if (occupied(seen.cells[pos + 1])) {
			cell.right = 1
			cell.valid = 1
		}

		return cell
	}).filter(x => x != null && x.valid).map(cell =>
		`M ${cell.x},${cell.y}
		${dir_path(cell, 'above')} ${scaleX},0
		${dir_path(cell, 'right')} 0,${scaleY}
		${dir_path(cell, 'below')} -${scaleX},0
		${dir_path(cell, 'left')} 0,-${scaleY}`
	).join(' ')
	const exit = seen.cells.indexOf('exit')

	return pug`
Group
	Rect(width=width height=height fill='#000')
	Group(x=${offsetX}, y=${offsetY})
		Path(
			stroke='#aaa'
			data=${border}
		)
		if ${exit >= 0}
			Path(
				x=${scaleX*(exit%seen.width)}
				y=${scaleY*(exit/seen.width | 0)}
				stroke='#24f'
				data=${`
					m 0,0
					l ${scaleX},0
					l 0,${scaleY}
					l -${scaleX},0 z
				`}
			)`
}

export default Map
