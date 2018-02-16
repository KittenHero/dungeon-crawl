import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
import { connect } from 'react-redux'
import Map from './map'
import Tile from './tile'

@connect(
	state => ({ sprites: state.sprites, board: state.board }),
	dispatch => ({ generateMap : () => dispatch({ type: 'GENERATE_MAP' }) })
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
			width=336 height=336
			seen=${board}
		)`
	}
}

export default DungeonCrawl
