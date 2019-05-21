import {
  SnapshotLoader,
  SnapshotSaver,
  storePersistence,
} from './storePersistence'
import { IRootStoreSnapshotIn, initRootStore } from './rootStore'

const init = (
  snapshotLoader: SnapshotLoader<unknown>,
  snapshotSaver: SnapshotSaver<unknown>,
  initialState?: IRootStoreSnapshotIn
) => {
  storePersistence.init(snapshotLoader, snapshotSaver)
  return initRootStore(initialState)
}

export const storeBootstrapper = {
  init,
}
