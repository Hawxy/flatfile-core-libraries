import React, { useState, useCallback } from 'react'
import { useInitializeSpace } from './useInitializeSpace'
import { ISpace } from '../types/ISpace'
import Space from '../components/Space'

/**
 * @name useSpace
 * @description Returns a space component or an error if internal api calls fail
 * @returns { error: string | undefined, data: { component: ReactElement } }
 */

export const useSpace = (props: ISpace) => {
  const [error, setError] = useState<string | undefined>(undefined)
  const { handleInit } = useInitializeSpace(props)

  const init = useCallback(async () => {
    try {
      await handleInit()
    } catch (e: any) {
      setError(e)
    }
  }, [handleInit])

  useCallback(() => {
    init()
  }, [])

  if (error) {
    return { error }
  } else {
    return {
      data: {
        component: <Space {...props} />,
      },
    }
  }
}
