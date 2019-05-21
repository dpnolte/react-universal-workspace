import { Screens } from '@mono/ui'
import { createNavigator, SwitchRouter } from '@react-navigation/core'
import { SinglePageView } from '../views'
import { RouteNames } from './TopMenuNavigator'

export const SinglePageNavigator = createNavigator(
  SinglePageView,
  SwitchRouter({
    [RouteNames.About]: Screens.About,
  }),
  {}
)
