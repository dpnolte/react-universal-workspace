import React from 'react'
import { SafeAreaView } from 'react-native'

export const withSafeArea = (ScreenComponent: React.ComponentType) => {
  return (props: any) => (
    <SafeAreaView style={{ backgroundColor: '#222' }}>
      <ScreenComponent {...props} />
    </SafeAreaView>
  )
}
