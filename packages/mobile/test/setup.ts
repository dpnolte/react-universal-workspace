import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)

jest.mock('react-native-gesture-handler', () => {})
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { View } = require('react-native')
  return {
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    interpolate: jest.fn(),
    View,
    Extrapolate: { CLAMP: jest.fn() },
  }
})
