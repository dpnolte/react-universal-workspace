import React from 'react'
import { createAppContainer } from '@react-navigation/native'
import { Contexts } from '@mono/ui'
import { TabNavigator } from './navigation/navigators/TabNavigator'
import { persistSnapshot } from './persistSnapshot'
import { persistNavState } from './persistNavState'

// add mobx store
Contexts.Store.init(persistSnapshot.load, persistSnapshot.save)

export const AppNavigator = createAppContainer(TabNavigator)

export const App = () => (
  <AppNavigator {...persistNavState.getPersistenceFunctions()} />
)
