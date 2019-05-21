/* eslint-disable no-param-reassign, @typescript-eslint/no-empty-interface */
import {
  types,
  destroy,
  Instance,
  SnapshotIn,
  SnapshotOut,
  getParent,
} from 'mobx-state-tree'
import { storePersistence } from './storePersistence'

const TODO_STORE_KEY = 'PERSISTED_STORE_TODO'
export enum TodoFilter {
  SHOW_ALL = 'SHOW_ALL',
  SHOW_COMPLETED = 'SHOW_COMPLETED',
  SHOW_ACTIVE = 'SHOW_ACTIVE',
}

const filterType = types.union(
  ...[
    TodoFilter.SHOW_ALL,
    TodoFilter.SHOW_COMPLETED,
    TodoFilter.SHOW_ACTIVE,
  ].map(types.literal)
)

const TodoModel = types
  .model({
    text: types.string,
    completed: false,
    id: types.identifierNumber,
  })
  .actions(self => ({
    remove() {
      const todoStore = getParent<ITodoStore>(getParent(self))
      todoStore.removeTodo(self as ITodo)
    },
    edit(text: string) {
      self.text = text
    },
    complete() {
      self.completed = !self.completed
    },
  }))

export interface ITodo extends Instance<typeof TodoModel> {}
export interface ITodoSnapshotIn extends SnapshotIn<typeof TodoModel> {}
export interface ITodoSnapshotOut extends SnapshotOut<typeof TodoModel> {}

const TODO_FILTERS = {
  [TodoFilter.SHOW_ALL]: () => true,
  [TodoFilter.SHOW_ACTIVE]: (todo: ITodo) => !todo.completed,
  [TodoFilter.SHOW_COMPLETED]: (todo: ITodo) => todo.completed,
}

export const TodoStore = types
  .model({
    todos: types.array(TodoModel),
    filter: types.optional(filterType, TodoFilter.SHOW_ALL),
  })
  .views(self => ({
    get completedCount() {
      return self.todos.reduce(
        (count, todo) => (todo.completed ? count + 1 : count),
        0
      )
    },
    get activeCount() {
      return self.todos.length - this.completedCount
    },
    get filteredTodos() {
      return self.todos.filter(TODO_FILTERS[self.filter as TodoFilter])
    },
  }))
  .actions(self => ({
    ...storePersistence.getPersistenceActions(self, TODO_STORE_KEY),
    addTodo(text: string) {
      const id =
        self.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
      self.todos.unshift({
        id,
        text,
      })
    },
    removeTodo(todo: ITodo) {
      destroy(todo)
    },
    completeAll() {
      const areAllMarked = self.todos.every(todo => todo.completed)
      self.todos.forEach(todo => {
        todo.completed = !areAllMarked
      })
    },
    clearCompleted() {
      self.todos.replace(self.todos.filter(todo => todo.completed === false))
    },
    setFilter(filter: TodoFilter) {
      self.filter = filter
    },
  }))

export interface ITodoStore extends Instance<typeof TodoStore> {}
export interface ITodoStoreSnapshotIn extends SnapshotIn<typeof TodoStore> {}
export interface ITodoStoreSnapshotOut extends SnapshotOut<typeof TodoStore> {}
