import React from 'react'
import { Image } from 'react-konva'

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

export default Tile
