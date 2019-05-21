import React from 'react'
import ReactDOM from 'react-dom'
import '@mono/ui-dom/src/style/body.css'
import { injectVectorIconFontStyle } from '@mono/ui-dom'
import { App } from './App'

injectVectorIconFontStyle()
ReactDOM.render(<App />, document.getElementById('root'))
