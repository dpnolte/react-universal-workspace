import {
  getSnapshot,
  applySnapshot,
  IStateTreeNode,
  IType,
} from 'mobx-state-tree'
import { reaction, flow } from 'mobx'

export type SnapshotLoader<TSnapshot> = (
  key: string
) => Promise<TSnapshot | undefined>
export type SnapshotSaver<TSnapshot> = (
  key: string,
  snapshot: TSnapshot
) => Promise<void>

let snapshotLoader: SnapshotLoader<unknown> | undefined
let snapshotSaver: SnapshotSaver<unknown> | undefined

const init = (
  loadSnapshot: SnapshotLoader<unknown>,
  saveSnapshot: SnapshotSaver<unknown>
) => {
  snapshotLoader = loadSnapshot
  snapshotSaver = saveSnapshot
}

const getSnapshotLoader = <TSnapshot>(): SnapshotLoader<TSnapshot> => {
  if (!snapshotLoader) {
    throw Error('Accessed snapshotLoader before rootStore initialization')
  }
  return snapshotLoader as SnapshotLoader<TSnapshot>
}
const getSnapshotSaver = <TSnapshot>(): SnapshotSaver<TSnapshot> => {
  if (!snapshotSaver) {
    throw Error('Accessed snapshotSaver before rootStore initialization')
  }
  return snapshotSaver as SnapshotSaver<TSnapshot>
}

const save = async <TSnapshot>(key: string, snapshot: TSnapshot) => {
  const saver = getSnapshotSaver<TSnapshot>()
  await saver(key, snapshot)
}

const load = async <TSnapshot>(key: string): Promise<TSnapshot | undefined> => {
  const loader = getSnapshotLoader<TSnapshot>()
  const snapshot = loader(key)
  return snapshot
}

const getPersistenceActions = <TSnapshot>(
  self: IStateTreeNode<IType<TSnapshot, TSnapshot, TSnapshot>>,
  key: string
) => {
  // eslint-disable-next-line func-names
  const readFromLocalStorage = flow(function*() {
    const snapshot = yield storePersistence.load<TSnapshot>(key)
    if (snapshot) applySnapshot(self, snapshot)
  })
  return {
    readFromLocalStorage,
    afterAttach() {
      this.readFromLocalStorage()
      reaction(
        () => getSnapshot<TSnapshot>(self),
        json => {
          storePersistence.save<TSnapshot>(key, json)
        }
      )
    },
  }
}

export const storePersistence = {
  init,
  save,
  load,
  getPersistenceActions,
}
