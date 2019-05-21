import React, { useContext } from 'react'
import { View, StyleSheet, FlatList, ListRenderItem, Text } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { ITodo } from '@mono/core'
import { ScreenContainer } from '../elements'
import { Banner } from '../elements/Banner'
import { TodoListHeader } from './TodoList/Header'
import { TodoListFooter } from './TodoList/Footer'
import { Store } from '../contexts/StoreContext'
import { TodoItem } from './TodoList/Item'
import { DiagonalLinearGradientBackground } from '../elements/LinearGradientBackground'

const renderTodoItem: ListRenderItem<ITodo> = info => {
  return <TodoItem todo={info.item} />
}

const keyExtractor = (item: ITodo) => `todo-item-${item.id}`

const stops = [
  {
    offset: '5%',
    stopColor: '#2b2b2b',
  },
  {
    offset: '95%',
    stopColor: '#333333',
  },
]

const TodoListContents: React.FunctionComponent = () => {
  const { todoStore: store } = useContext(Store.instance)
  return useObserver(() => {
    return store.todos.length > 0 ? (
      <FlatList<ITodo>
        style={styles.todoList}
        renderItem={renderTodoItem}
        data={store.filteredTodos}
        keyExtractor={keyExtractor}
      />
    ) : (
      <Text style={styles.noItemsText}>Please add todo item above</Text>
    )
  })
}

export const TodoList: React.FunctionComponent = () => {
  return (
    <ScreenContainer testID={TodosScreenTestId} style={styles.container}>
      <Banner title="Todo List" />
      <DiagonalLinearGradientBackground
        id="TodoBackground"
        stops={stops}
        style={styles.contentContainer}
      >
        <View style={styles.listContainer}>
          <TodoListHeader />
          <TodoListContents />
          <TodoListFooter style={styles.todoFooter} />
        </View>
      </DiagonalLinearGradientBackground>
    </ScreenContainer>
  )
}

export const TodosScreenTestId = 'todos-screen'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fefefe',
  },
  header: {
    backgroundColor: '#222',
    height: 100,
    padding: 20,
  },
  headerText: {
    color: '#fff',
    textAlign: 'left',
    marginLeft: 100,
    marginVertical: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 999,
  },
  listContainer: {
    maxWidth: 640,
    width: '100%',
    flexDirection: 'column',
    flex: 1,
  },
  todoList: {
    flexGrow: 0,
    flexShrink: 1,
  },
  todoFooter: {
    height: 110,
  },
  noItemsText: {
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 8,
  },
})
