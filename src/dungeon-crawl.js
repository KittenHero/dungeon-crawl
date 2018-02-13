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
		loadSprites : () => dispatch({ type: 'LOAD_SPRITES' })
	})
)
class DungeonCrawl extends Component {

	componentDidMount() {
		const { generateMap, loadSprites } = this.props
		loadSprites()
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
	let crop = { width: 16, height: 16 };
	switch (props.type) {
		case 0:
			crop = {x: 66, y:54, ...crop}
			break
		case 1:
			crop = {x:40, y:8, ...crop}
			break
	}
	return pug`Image(
		image=${props.sprite}
		crop=${crop}
		x=${16 * props.x} y=${16 * props.y}
		width=16 height=16
	)`
}

export default DungeonCrawl
