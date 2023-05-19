import React, { ReactElement, useState } from 'react'
import { ISpace } from '../types/ISpace'
import Space from '../components/Space'
import { EmbeddedContext } from '../contexts/EmbeddedContext'

/**
 * @name useSpace
 * @description Returns a space component
 * @returns { component: ReactElement }
 */

export const useSpace = (props: ISpace): { component: ReactElement } => {
  const [currentSpace, setCurrentSpace] = useState(undefined)

  return {
    component: (
      <EmbeddedContext.Provider value={{ currentSpace, setCurrentSpace }}>
        <Space {...props} />
      </EmbeddedContext.Provider>
    )
  }
}
