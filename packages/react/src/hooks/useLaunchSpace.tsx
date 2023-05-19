import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ISpace } from '../types/ISpace'
import { initializeSpace } from '../utils/initializeSpace'
import { EmbeddedContext } from '../contexts/EmbeddedContext'

/**
 * @name useLaunchSpace
 * @description Internal hook to handle all logic necessary for launching a space
 *
 */

export const useLaunchSpace = (props: ISpace) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const { currentSpace, setCurrentSpace } = useContext(EmbeddedContext)

  const initSpace = useCallback(async () => {
    try {
      const response = await initializeSpace(props)

      if (response.data) {
        setCurrentSpace(response.data)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setError(`Error initializing space: ${e}`)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    initSpace()
  }, [])

  const spaceId = useMemo(() => {
    return currentSpace?.id
  }, [currentSpace])

  const spaceUrl = useMemo(() => {
    return currentSpace?.guestLink
  }, [currentSpace])

  const accessToken = useMemo(() => {
    return currentSpace?.accessToken
  }, [currentSpace])

  return {
    loading,
    spaceId,
    accessToken,
    spaceUrl,
    error
  }
}
