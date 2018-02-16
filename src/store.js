import { createStore, combineReducers, applyMiddleware } from 'redux'
import { boardManager, spriteManager, assetLoader } from './reducers'

const store = createStore(
	combineReducers({
		sprites: spriteManager,
		board: boardManager
	}),
	applyMiddleware(assetLoader)
)
export default store
