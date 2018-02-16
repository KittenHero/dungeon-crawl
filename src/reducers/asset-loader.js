const assetLoader = ({ dispatch, getState }) => next => action => {
	switch (action.type) {
		case 'LOAD_SPRITES':
			const tiles = new Array(5).fill().map(() => new Image())
			tiles.forEach((img, ind) => {
				const ver = String.fromCharCode(65 + ind)
				img.src = `assets/tiles/CB-TempleDungeon/CB-Temple-${ver}.png`
				img.onload = () =>
					dispatch({ type: 'SPRITE_LOADED', payload: { [`tile${ver}`]: img }})
			})
			break
		default: return next(action)
	}
}

export default assetLoader
