import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { NavigationContainer } from '@react-navigation/core'
import { createAppContainer } from '@react-navigation/native'
import { Screens } from '@mono/ui'
import { TabNavigator, TabBarTestIds } from '../TabNavigator'

jest.useFakeTimers()

describe('Tab Navigator test suite', () => {
  let AppContainer: NavigationContainer
  beforeEach(() => {
    AppContainer = createAppContainer(TabNavigator)
  })
  it('should go to docs tab and then go to home', () => {
    const { getByTestId, queryByTestId } = render(<AppContainer />)
    fireEvent.press(getByTestId(TabBarTestIds.Docs))
    expect(queryByTestId(Screens.DocsScreenTestId)).toBeTruthy()

    fireEvent.press(getByTestId(TabBarTestIds.Home))
    expect(queryByTestId(Screens.HomeScreenTestId)).toBeTruthy()
  })
  it('should go to about tab and then go to home', () => {
    const { getByTestId, queryByTestId } = render(<AppContainer />)
    fireEvent.press(getByTestId(TabBarTestIds.About))
    expect(queryByTestId(Screens.AboutScreenTestId)).toBeTruthy()

    fireEvent.press(getByTestId(TabBarTestIds.Home))
    expect(queryByTestId(Screens.HomeScreenTestId)).toBeTruthy()
  })
})
