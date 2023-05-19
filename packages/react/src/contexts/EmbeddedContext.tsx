import { createContext } from 'react'

export interface EmbeddedContextType {
  currentSpace?: any
  setCurrentSpace: (space: any) => void
}

export const EmbeddedContext = createContext<EmbeddedContextType>({
  currentSpace: undefined,
  setCurrentSpace: () => {}
})
