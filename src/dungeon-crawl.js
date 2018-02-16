import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stage, Layer, Image, Group, Rect, Path } from 'react-konva'

@connect(
	state => ({
		sprites: state.sprites,
		board: state.board
	}),
	dispatch => ({
		generateMap : () => dispatch({ type: 'GENERATE_MAP' }),
	})
)
class DungeonCrawl extends Component {

	componentDidMount() {
		const { generateMap, loadSprites } = this.props
		generateMap()
	}

	render() {
		const { sprites, board } = this.props
		return pug`
Stage(ref='stage' width=${960} height=${640})
	Layer
		for cell, i in ${board.cells}
			Tile(
				x=(i%board.width) y=(i/board.width)|0
				sprite=${sprites.tileA} key=i
				type=cell
			)
	Layer(x=624)
		Map(
			width=${board.width} height=${board.height}
			seen=${board.cells}
		)`
	}

}

const occupied = x => !!x && x != 'wall'
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

const Tile = props => {
	let crop = { width: 16, height: 16 }
	switch (props.type) {
		case 'wall':
			crop = {x:108, y:48, ...crop}
			break
		case 'floor_e':
			crop = {x:24, y:21, ...crop}
			break
		case 'floor_w':
			crop = {x:8, y:21, ...crop}
			break
		case 'floor_ne':
			crop = {x:24, y:8, ...crop}
			break
		case 'floor_nw':
			crop = {x:8, y:8, ...crop}
			break
		case 'floor_n':
			crop = {x:20, y:8, ...crop}
			break
		case 'floor_s':
			crop = {x:16, y:24, ...crop}
			break
		case 'floor_se':
			crop = {x:24, y:24, ...crop}
			break
		case 'floor_sw':
			crop = {x:8, y:24, ...crop}
			break
		case 'floor_':
			switch (Math.random()*20 | 0) {
				case 0:
					crop = {x:40, y:8, ...crop}
					break
				case 1:
				case 2:
					crop = {x:12, y:12, ...crop}
					break
				default:
					crop = {x:16, y:24, width:4, height:4}
			}
			break
		case 'path':
			switch (Math.random()*5 | 0) {
				case 0:
				case 1:
					crop = {x:78, y:12, ...crop}
					break
				case 2:
					crop = {x:65, y:9, ...crop}
					break
				default:
					crop = {x:78, y:22, ...crop}
			}
			break
		case 'exit':
			crop = {x:176, y:216 , ...crop}
			break
		default:
			crop = {x: 98, y:90, width: 4, height: 4}
	}
	return pug`Image(
		image=${props.sprite}
		crop=${crop}
		x=${16 * props.x} y=${16 * props.y}
		width=16 height=16
	)`
}

export default DungeonCrawl
