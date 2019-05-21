/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  SceneView,
  NavigationScreenProp,
  NavigationRoute,
  NavigationDescriptor,
} from '@react-navigation/core'
import './TopMenuView.css'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface INavigationParams {}
interface IProps {
  descriptors: { [key: string]: NavigationDescriptor }
  navigation: NavigationScreenProp<
    NavigationRoute<INavigationParams>,
    INavigationParams
  >
  navigationConfig: {}
}

export const SinglePageView = (props: IProps) => {
  const { descriptors, navigation } = props
  const activeKey = navigation.state.routes[navigation.state.index].key
  const descriptor = descriptors[activeKey]
  return (
    <SceneView
      navigation={descriptor.navigation}
      component={descriptor.getComponent()}
    />
  )
}
