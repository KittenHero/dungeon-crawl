import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stage, Layer, Image, Group, Rect, Path } from 'react-konva'
import { Map } from './map'
import { Tile } from './tile'

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
			width=${board.width} height=${board.height}
			seen=${board.cells}
		)`
	}
}

export default DungeonCrawl
