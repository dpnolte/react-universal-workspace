// eslint-disable-next-line import/no-extraneous-dependencies
import { AppRegistry } from 'react-native'
import { Contexts } from '@mono/ui'
import { persistSnapshot } from './persistSnapshot'
import { App } from './App'

Contexts.Store.init(persistSnapshot.load, persistSnapshot.save)

// register the app
// notice how we are not calling ReactDOM.hydrate() ourselves, as this is done by RN Web
AppRegistry.registerComponent('web', () => App)

AppRegistry.runApplication('web', {
  initialProps: {},
  rootTag: document.getElementById('root'),
})

// Allow HMR to work
if (module.hot) {
  module.hot.accept()
}
