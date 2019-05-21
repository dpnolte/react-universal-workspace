import React, { useContext, useState } from 'react'
import { TextInput, View, StyleSheet } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { Store } from '../../contexts/StoreContext'
import { Button } from '../../elements'

export const TodoListHeader: React.FunctionComponent = () => {
  const { todoStore } = useContext(Store.instance)
  const [text, setText] = useState<string>('')
  const handleSave = () => {
    if (text.length !== 0) {
      todoStore.addTodo(text)
      setText('')
    }
  }

  return useObserver(() => {
    return (
      <View style={styles.headerContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="What needs to be done?"
          style={styles.input}
        />
        <Button
          icon="plus"
          title="ADD"
          onPress={handleSave}
          containerStyle={styles.button}
        />
      </View>
    )
  })
}
const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#ddd',
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
  },
  button: {
    minWidth: 60,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#028c4e',
  },
})
