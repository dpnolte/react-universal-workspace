import React from 'react'
import renderer from 'react-test-renderer'
import { TopMenuView } from '../TopMenuView'

describe('TopMenuView unit tests', () => {
  let mockedNavigation
  let mockedDescriptors: { Test: { getComponent: jest.Mock<any, any> } }
  let mockedProps: { navigation: any; descriptors: any; navigationConfig: {} }
  beforeEach(() => {
    mockedNavigation = {
      state: {
        params: {},
        routes: [
          {
            key: 'Test',
          },
        ],
        index: 0,
      },
      router: {
        getStateForAction: jest.fn(),
        getPathAndParamsForState: () => {
          return { path: 'Test', params: {} }
        },
      },
      dispatch: jest.fn(),
      goBack: jest.fn(),
      dismiss: jest.fn(),
      navigate: jest.fn(),
      openDrawer: jest.fn(),
      closeDrawer: jest.fn(),
      toggleDrawer: jest.fn(),
      getParam: jest.fn(),
      setParams: jest.fn(),
      addListener: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      pop: jest.fn(),
      popToTop: jest.fn(),
      isFocused: jest.fn(),
      dangerouslyGetParent: jest.fn(),
    }
    mockedDescriptors = {
      Test: {
        getComponent: jest.fn(() => () => <div>scene view content</div>),
      },
    }
    mockedProps = {
      navigation: mockedNavigation,
      descriptors: mockedDescriptors,
      navigationConfig: {},
    }
  })

  it('should match snapshot', () => {
    const rendered = renderer.create(<TopMenuView {...mockedProps} />).toJSON()

    expect(rendered).toMatchSnapshot()
  })
})
