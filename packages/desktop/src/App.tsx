import { TopMenuNavigator } from '@mono/ui-dom'
import { createBrowserApp } from '@react-navigation/web'
import { Contexts } from '@mono/ui'
import { persistSnapshot } from './persistSnapshot'

Contexts.Store.init(persistSnapshot.load, persistSnapshot.save)
export const App = createBrowserApp(TopMenuNavigator)
