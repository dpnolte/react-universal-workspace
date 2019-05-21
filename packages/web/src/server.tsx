import express from 'express'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
// eslint-disable-next-line import/no-unresolved
import { AppRegistry } from 'react-native-web'
import { handleServerRequest } from '@react-navigation/web'
import {
  createVectorIconFontStyleElement,
  createBodyStyleElement,
} from '@mono/ui-dom'
import { useStaticRendering } from 'mobx-react-lite'
import { AppNavigator } from './AppNavigator'

// @see https://github.com/mobxjs/mobx-react-lite#server-side-rendering-with-usestaticrendering
useStaticRendering(true)

// eslint-disable-next-line
const assets = require(`${process.env.RAZZLE_ASSETS_MANIFEST}`)
const bodyCss = renderToStaticMarkup(createBodyStyleElement())
const vectorIconsCss = renderToStaticMarkup(createVectorIconFontStyleElement())

const server = express()
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR as string))
  .get('/*', (req, res) => {
    const { path, query } = req
    const { navigation, title } = handleServerRequest(
      AppNavigator.router,
      path,
      query
    )

    // register the app
    AppRegistry.registerComponent('web', () => AppNavigator)
    // prerender the app
    const { element, getStyleElement } = AppRegistry.getApplication('web', {
      initialProps: {
        navigation,
      },
    })
    // first the element
    const html = renderToString(element)
    // then the styles
    const css = renderToStaticMarkup(getStyleElement())

    const context: { url?: string } = {}
    if (context.url) {
      res.redirect(context.url)
    } else {
      const jsScripts =
        process.env.NODE_ENV === 'production'
          ? `<script src="${assets.client.js}" defer></script>`
          : `<script src="${assets.client.js}" defer crossorigin></script>`
      res.status(200).send(
        `<!doctype html>
    <html lang="en">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${bodyCss}
        ${vectorIconsCss}
        ${css}        
        ${jsScripts}
    </head>
    <body>
        <div id="root">${html}</div>
    </body>
</html>`
      )
    }
  })

export default server
