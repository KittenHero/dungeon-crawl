import React from 'react'
import ReactDOM from 'react-dom'

const Foo = () => pug`p test`

ReactDOM.render(
	pug`Foo`,
	document.querySelector('main')
)
