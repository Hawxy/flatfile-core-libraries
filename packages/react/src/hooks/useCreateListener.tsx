import { Browser, FlatfileEvent } from '@flatfile/listener'
import { ISpace } from '../types/ISpace'
import { useEffect } from 'react'
/**
 * @name useCreateListener
 * @description Listener
 * @param { Pick<ISpace, 'accessToken'| 'listener'> }
 */

export const useCreateListener = ({
  accessToken,
  listener,
}: Pick<ISpace, 'listener'> & { accessToken: string }) => {
  const apiUrl = 'https://platform.flatfile.com/api'

  useEffect(() => {
    if (listener)
      listener.mount(
        new Browser({
          apiUrl,
          accessToken,
          fetchApi: fetch,
        })
      )
  }, [listener])

  return {
    dispatchEvent: (event: any) => {
      if (!event) return
      const eventInstance = new FlatfileEvent(event)
      eventInstance.setVariables({
        apiUrl,
        accessToken,
      })
      return listener?.dispatchEvent(eventInstance)
    },
  }
}
