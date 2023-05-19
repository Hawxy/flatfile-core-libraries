import { useMemo, useState } from 'react'
import { EventSubscriber } from '../utils/EventSubscriber'
import Pubnub from 'pubnub'

/**
 * @name useLaunchPubNub
 * @description Internal hook to handle all logic necessary for launching pubnub
 */

export const useLaunchPubNub = ({
  spaceId,
  accessToken
}: {
  spaceId: string
  accessToken: string
}) => {
  const [error, setError] = useState('')
  const [pubnub, setPubnub] = useState<Pubnub>()
  const handleInitPubnub = async () => {
    try {
      const response = await EventSubscriber.getClient(spaceId, accessToken)
      if (response) {
        setPubnub(response.pubnub)
      }
    } catch (e) {
      setError(`Error initializing listener: ${e}`)
    }
  }

  useMemo(() => {
    return handleInitPubnub()
  }, [spaceId])

  return {
    localPubnub: pubnub,
    error
  }
}
