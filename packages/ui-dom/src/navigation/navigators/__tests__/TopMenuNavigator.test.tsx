import React from 'react'
import renderer from 'react-test-renderer'
import { render, fireEvent, cleanup } from 'react-testing-library'
import { Screens } from '@mono/ui'
import { createBrowserApp } from '@react-navigation/web'
import { TopMenuNavigator } from '../TopMenuNavigator'
import { TopMenuViewTestIds } from '../../views'
import 'jest-dom/extend-expect'

jest.mock('history', () => ({
  createBrowserHistory: () => ({
    push: () => {},
    listen: () => {},
    location: {
      pathname: '/Home',
    },
  }),
}))

document.title = 'Empty Title'

describe('TopMenuNavigator test suite', () => {
  let BrowserApp: React.ComponentType
  beforeEach(() => {
    BrowserApp = (createBrowserApp(
      TopMenuNavigator
    ) as unknown) as React.ComponentType
  })
  afterEach(() => {
    cleanup()
  })
  it('should match snapshot', () => {
    const rendered = renderer.create(<BrowserApp />).toJSON()

    expect(rendered).toMatchSnapshot()
  })
  it('should go to docs screen and then go to home', () => {
    const { getByTestId, queryByTestId, queryAllByTestId } = render(
      <BrowserApp />
    )
    const homeScreenBefore = queryByTestId(Screens.HomeScreenTestId)
    expect(homeScreenBefore).toBeInTheDocument()

    const docLinks = queryAllByTestId(TopMenuViewTestIds.DocsLink)
    expect(docLinks).toHaveLength(2)
    fireEvent.click(docLinks[0])
    const docsScreen = queryByTestId(Screens.DocsScreenTestId)
    expect(docsScreen).toBeInTheDocument()
    fireEvent.click(getByTestId(TopMenuViewTestIds.HomeLink))
    const homeScreenAfter = queryByTestId(Screens.HomeScreenTestId)
    expect(homeScreenAfter).toBeInTheDocument()
  })
  it('should go to about screen and then go to home', () => {
    const { getByTestId, queryByTestId } = render(<BrowserApp />)

    const homeScreenBefore = queryByTestId(Screens.HomeScreenTestId)
    expect(homeScreenBefore).toBeInTheDocument()
    fireEvent.click(getByTestId(TopMenuViewTestIds.AboutLink))

    const aboutScreen = queryByTestId(Screens.AboutScreenTestId)
    expect(aboutScreen).toBeInTheDocument()

    fireEvent.click(getByTestId(TopMenuViewTestIds.HomeLink))
    const homeScreenAfter = queryByTestId(Screens.HomeScreenTestId)
    expect(homeScreenAfter).toBeInTheDocument()
  })
})
