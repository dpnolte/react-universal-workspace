import React, { useEffect, useState, ReactNode } from 'react'
import { Platform } from 'react-native'

interface IProps {
  children: ReactNode
}
export const ClientRenderedContext = React.createContext(true)

/**
 * Adds context client rendered context with boolean value for flagging if client has rendered.
 * To retrieve context value, use:
 * @example const clientHasRendered = useContext(ClientRenderedContext)
 */
export const ClientRenderedContextProvider = (props: IProps) => {
  const { children } = props
  const [clientHasRendered, setClientHasRendered] = useState(
    Platform.OS !== 'web' // Only have server-side rendering on web
  )
  useEffect(() => {
    if (!clientHasRendered) {
      setClientHasRendered(true)
    }
  }, [clientHasRendered])

  return (
    <ClientRenderedContext.Provider value={clientHasRendered}>
      {children}
    </ClientRenderedContext.Provider>
  )
}
