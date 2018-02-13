import { createStore, combineReducers, applyMiddleware } from 'redux'
import { boardManager, spriteManager } from './reducers'
import assetLoader from './asset-loader'

const store = createStore(
	combineReducers({
		sprites: spriteManager,
		board: boardManager
	}),
	applyMiddleware(assetLoader)
)
export default store
