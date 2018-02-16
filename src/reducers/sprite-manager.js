const spriteManager = (state = {}, action) => {
	switch (action.type) {
		case 'SPRITE_LOADED':
			return {...state, ...action.payload}
		default:
			return state
	}
}

export { spriteManager }
