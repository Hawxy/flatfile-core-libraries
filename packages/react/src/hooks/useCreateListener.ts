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
  const apiUrl =
    import.meta.env.VITE_API_URL || 'https://platform.flatfile.com/api'

  // set the api key to fully authenticate into Flatfile api
  ;(window as any).CROSSENV_FLATFILE_API_KEY = accessToken

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

      const eventPayload = event.src ? event.src : event
      const eventInstance = new FlatfileEvent(eventPayload, accessToken, apiUrl)

      return listener?.dispatchEvent(eventInstance)
    },
  }
}
