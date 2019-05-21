import React from 'react'
import {
  IRootStore,
  storeBootstrapper,
  SnapshotLoader,
  SnapshotSaver,
} from '@mono/core'

let storeContext: React.Context<IRootStore> | undefined

const init = (
  loadSnapshot: SnapshotLoader<unknown>,
  saveSnapshot: SnapshotSaver<unknown>
) => {
  storeContext = React.createContext<IRootStore>(
    storeBootstrapper.init(loadSnapshot, saveSnapshot)
  )
}

export const Store = {
  init,
  get instance(): React.Context<IRootStore> {
    if (!storeContext) {
      throw Error('Tried to access store access context before init')
    }
    return storeContext
  },
}
