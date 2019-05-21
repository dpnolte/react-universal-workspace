import React, { useState } from 'react'
import { ITodo } from '@mono/core'
import { useObserver } from 'mobx-react-lite'
import {
  TextInput,
  View,
  Platform,
  CheckBox,
  TouchableOpacity,
  Switch,
  Text,
  StyleSheet,
} from 'react-native'
import { Button } from '../../elements'

interface IEditableItemProps {
  todo: ITodo
  setEditing: (val: boolean) => void
}
const EditableItem = (props: IEditableItemProps) => {
  const { todo, setEditing } = props
  const [text, setText] = useState(todo.text)
  const handleSave = () => {
    if (text.length === 0) {
      todo.remove()
    } else {
      todo.edit(text)
    }
    setEditing(false)
  }

  return (
    <View style={[styles.itemContainer, styles.itemEditing]}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        autoFocus
      />
      <Button icon="content-save" iconOnly title="save" onPress={handleSave} />
    </View>
  )
}

interface IDefaultItemProps {
  todo: ITodo
  setEditing: (val: boolean) => void
}
const DefaultItem = (props: IDefaultItemProps) => {
  const { todo, setEditing } = props
  return useObserver(() => (
    <View
      style={[
        styles.itemContainer,
        todo.completed ? styles.itemCompleted : undefined,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <Switch value={todo.completed} onValueChange={() => todo.complete()} />
      ) : (
        <CheckBox
          value={todo.completed}
          onValueChange={() => todo.complete()}
        />
      )}
      <TouchableOpacity
        style={styles.textContainer}
        onPress={() => todo.complete()}
      >
        <Text
          style={[
            styles.text,
            todo.completed ? styles.textCompleted : undefined,
          ]}
        >
          {todo.text}
        </Text>
      </TouchableOpacity>
      <Button
        title="edit"
        icon="pencil"
        iconOnly
        containerStyle={styles.editButton}
        onPress={() => setEditing(true)}
      />
      <Button
        title="Remove"
        icon="delete"
        iconOnly
        containerStyle={styles.removeButton}
        onPress={() => todo.remove()}
      />
    </View>
  ))
}

interface IProps {
  todo: ITodo
}
export const TodoItem: React.FunctionComponent<IProps> = (props: IProps) => {
  const [editing, setEditing] = useState<boolean>(false)
  const { todo } = props
  return editing === true ? (
    <EditableItem todo={todo} setEditing={setEditing} />
  ) : (
    <DefaultItem todo={todo} setEditing={setEditing} />
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 10,
  },
  itemCompleted: {
    backgroundColor: 'rgba(144, 238, 144, 0.4)',
  },
  itemEditing: {
    backgroundColor: 'rgba(136, 166, 234, 0.4)',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 15,
  },
  text: {
    fontWeight: 'bold',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  removeButton: {
    backgroundColor: 'rgb(171, 62, 76)',
  },
  editButton: {
    backgroundColor: 'rgb(177, 169, 74)',
    marginRight: 8,
  },
})
