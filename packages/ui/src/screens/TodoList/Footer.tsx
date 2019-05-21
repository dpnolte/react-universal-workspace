import React, { useContext } from 'react'
import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { TodoFilter } from '@mono/core'
import { Store } from '../../contexts/StoreContext'
import { Button } from '../../elements'

const FILTER_TITLES = {
  [TodoFilter.SHOW_ALL]: 'All',
  [TodoFilter.SHOW_ACTIVE]: 'Active',
  [TodoFilter.SHOW_COMPLETED]: 'Completed',
}

interface IFilterLinkProps {
  filter: TodoFilter
  style?: StyleProp<ViewStyle>
}
const ToggleFilter = (props: IFilterLinkProps) => {
  const { todoStore: store } = useContext(Store.instance)
  const { filter, style } = props
  const title = FILTER_TITLES[filter]
  return useObserver(() => {
    const selected = filter === store.filter
    const icon = selected ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
    return (
      <Button
        icon={icon}
        title={title}
        onPress={() => store.setFilter(filter)}
        containerStyle={[
          styles.buttonItem,
          selected ? styles.toggleSelected : styles.toggleUnselected,
          style,
        ]}
      />
    )
  })
}

const TodoCount = () => {
  const { todoStore: store } = useContext(Store.instance)
  return useObserver(() => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text>Items remaining: </Text>
        <Text style={{ fontWeight: 'bold' }}>{store.activeCount}</Text>
      </View>
    )
  })
}

const CompleteAllButton = () => {
  const { todoStore: store } = useContext(Store.instance)
  return useObserver(() => {
    const disabled = store.completedCount === store.todos.length
    return store.todos.length > 0 ? (
      <Button
        icon="playlist-check"
        title="Mark all as completed"
        disabled={disabled}
        onPress={() => store.completeAll()}
        containerStyle={[styles.buttonItem, styles.completeAllButton]}
      />
    ) : null
  })
}

const ClearAllButton = () => {
  const { todoStore: store } = useContext(Store.instance)
  return useObserver(() => {
    return store.completedCount > 0 ? (
      <Button
        icon="delete-sweep"
        title="Clear completed"
        onPress={() => store.clearCompleted()}
        containerStyle={[styles.buttonItem, styles.clearAllButton]}
      />
    ) : null
  })
}

interface IProps {
  style?: StyleProp<ViewStyle>
}

export const TodoListFooter: React.FunctionComponent<IProps> = (
  props: IProps
) => {
  const { style } = props
  return (
    <View style={[styles.footerContainer, style]}>
      <TodoCount />
      <View style={styles.buttonsContainer}>
        <ToggleFilter filter={TodoFilter.SHOW_ALL} />
        <ToggleFilter filter={TodoFilter.SHOW_ACTIVE} />
        <ToggleFilter
          filter={TodoFilter.SHOW_COMPLETED}
          style={styles.lastToggleStyle}
        />
        <CompleteAllButton />
        <ClearAllButton />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#ddd',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lastToggleStyle: {
    marginRight: 8,
  },
  completeAllButton: {
    backgroundColor: 'rgb(2, 140, 78)',
    marginRight: 8,
  },
  clearAllButton: {
    backgroundColor: 'rgb(171, 62, 76)',
  },
  toggleUnselected: {
    backgroundColor: 'rgb(29, 101, 158)',
  },
  toggleSelected: {
    backgroundColor: 'rgb(33, 150, 243)',
  },
  buttonItem: {
    marginTop: 8,
  },
})
