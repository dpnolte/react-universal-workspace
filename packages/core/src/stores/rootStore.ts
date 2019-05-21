import {
  types,
  Instance,
  SnapshotIn,
  SnapshotOut,
  destroy,
} from 'mobx-state-tree'
import { TodoStore } from './todoStore'
import * as services from '../services'

export const RootStore = types.model('RootStore').props({
  todoStore: types.optional(TodoStore, {}),
})

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IRootStore extends Instance<typeof RootStore> {}
export interface IRootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {}
export interface IRootStoreSnapshotOut extends SnapshotOut<typeof RootStore> {}
/* eslint-enable @typescript-eslint/no-empty-interface */

let rootStoreInstance: IRootStore | undefined
export const initRootStore = (initialState?: IRootStoreSnapshotIn) => {
  if (rootStoreInstance) destroy(rootStoreInstance)

  rootStoreInstance = RootStore.create(initialState, services)

  if (!process.env.PROFILING && process.env.NODE_ENV === 'development') {
    /* eslint-disable global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
    const middleWares = require('mst-middlewares')
    middleWares.connectReduxDevtools(require('remotedev'), rootStoreInstance)
    /* eslint-enable global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
  }

  return rootStoreInstance
}
