import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stage, Layer, Image, Group } from 'react-konva'

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
Stage(ref='stage' width=${window.innerWidth} height=${window.innerHeight})
	Layer
		for cell, i in ${board.cells}
			Tile(
				x=(i%board.width) y=(i/board.width)|0
				sprite=${sprites.tileA} key=i
				type=cell
			)`
	}

}

const Tile = props => {
	let crop = { width: 16, height: 16 }
	switch (props.type) {
		case 'wall':
			crop = {x:108, y:48, ...crop }
			break
		case 'floor_e':
			crop = {x:24, y:16, ...crop}
			break
		case 'floor_w':
			crop = {x:8, y:16, ...crop}
			break
		case 'floor_ne':
			crop = {x:24, y:8, ...crop}
			break
		case 'floor_nw':
			crop = {x:8, y:8, ...crop}
			break
		case 'floor_n':
			crop = {x:16, y:8, ...crop}
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
					crop = {x:14, y:21, ...crop}
					break
				default:
					crop = {x:16, y:24, width:4, height:4}
			}
			break
		case 'path':
			switch (Math.random()*20 | 0) {
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
