import { Platform } from 'react-native'

export const isDom = Platform.OS === 'web'
const userAgent =
  isDom && typeof navigator !== 'undefined'
    ? (navigator as { userAgent?: string }).userAgent
    : undefined
export const isDesktop =
  userAgent && userAgent.toLowerCase().includes('electron/')
export const isWeb = isDom && !isDesktop
export const isNative = !isDom

export const isAndroid = Platform.OS === 'android'
export const isIOS = Platform.OS === 'ios'
