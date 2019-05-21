/* eslint-disable no-console */
import http from 'http'

let app = require('./server').default

const server = http.createServer(app)

let currentApp = app

server.listen(process.env.PORT || 3000, () => {
  console.log('🚀 started')
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-extraneous-dependencies
    const openBrowser = require('react-dev-utils/openBrowser')
    openBrowser(`http://localhost:${process.env.PORT || 3000}`)
  }
})

server.on('error', err => {
  console.error('server error', err)
})

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!')

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...')

    try {
      // eslint-disable-next-line global-require
      app = require('./server').default
      server.removeListener('request', currentApp)
      server.on('request', app)
      currentApp = app
    } catch (error) {
      console.error(error)
    }
  })
}
