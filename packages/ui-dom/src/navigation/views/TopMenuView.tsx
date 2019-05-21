/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  SceneView,
  NavigationScreenProp,
  NavigationRoute,
  NavigationDescriptor,
} from '@react-navigation/core'
import { Link } from '@react-navigation/web'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
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

export const TopMenuView = (props: IProps) => {
  const { descriptors, navigation } = props
  const activeKey = navigation.state.routes[navigation.state.index].key
  const descriptor = descriptors[activeKey]
  return (
    <div className="container">
      <header className="header">
        <nav className="top-menu-nav">
          <ul className="primary">
            <li>
              <Link
                routeName="Home"
                navigation={navigation}
                anchorProps={{
                  'data-testid': TopMenuViewTestIds.HomeLink,
                }}
              >
                <Icon name="home" size={20} color="#bbb" />
                <span className="top-menu-link-text">Home</span>
              </Link>
            </li>
            <li>
              <Link
                routeName="Docs"
                navigation={navigation}
                anchorProps={{
                  'data-testid': TopMenuViewTestIds.DocsLink,
                }}
              >
                <Icon name="file-document-outline" size={20} color="#bbb" />
                <span className="top-menu-link-text">Documents</span>
              </Link>
              {/* <ul className="sub">
                <li>
                  <Link
                    routeName="Docs"
                    navigation={navigation}
                    anchorProps={{
                      'data-testid': TopMenuViewTestIds.DocsLink,
                    }}
                  >
                    Doc 1
                  </Link>
                </li>
                  </ul> */}
            </li>
            <li>
              <Link
                routeName="TodoList"
                navigation={navigation}
                anchorProps={{
                  'data-testid': TopMenuViewTestIds.TodoListLink,
                }}
              >
                <Icon name="format-list-checkbox" size={20} color="#bbb" />
                <span className="top-menu-link-text">Todo List</span>
              </Link>
            </li>
            <li>
              <Link
                routeName="About"
                navigation={navigation}
                anchorProps={{
                  'data-testid': TopMenuViewTestIds.AboutLink,
                }}
              >
                <Icon name="vector-arrange-above" size={20} color="#bbb" />
                <span className="top-menu-link-text">About</span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <section className="content">
        <SceneView
          navigation={descriptor.navigation}
          component={descriptor.getComponent()}
        />
      </section>
    </div>
  )
}

export const TopMenuViewTestIds = {
  HomeLink: 'top-menu-home-link',
  DocsLink: 'top-menu-docs-link',
  AboutLink: 'top-menu-about-link',
  TodoListLink: 'top-menu-todo-list-link',
}
