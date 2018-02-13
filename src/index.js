import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import DungeonCrawl from './dungeon-crawl'
import store from './store'

render(pug`
Provider(store=${store})
	DungeonCrawl`, document.querySelector('main')
)
