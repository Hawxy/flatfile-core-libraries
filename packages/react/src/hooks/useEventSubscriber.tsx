import { Flatfile } from '@flatfile/api'
import { usePubNub } from 'pubnub-react'
import { useEffect } from 'react'

export const useEventSubscriber = (
  channels: Flatfile.EventTopic[],
  callback: (message?: any) => void,
  spaceId: string
) => {
  try {
    const { addListener, removeListener, subscribe } = usePubNub()
    const channel = [`space.${spaceId}`]
    useEffect(() => {
      const listener = { message: callback }
      addListener(listener)
      subscribe({ channels: channel })
      return () => {
        removeListener(listener)
      }
    }, [addListener, subscribe, removeListener, channels, callback])
  } catch (e) {
    console.warn(`Could not subscribe to pubnub channels: ${e}`)
  }
}
