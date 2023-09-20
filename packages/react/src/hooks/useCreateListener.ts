import { Browser, FlatfileEvent } from '@flatfile/listener'
import { useEffect } from 'react'
import { ISpace } from '@flatfile/embedded-utils'
/**
 * @name useCreateListener
 * @description Listener
 * @param { Pick<ISpace, 'accessToken'| 'listener'> }
 */

export const useCreateListener = ({
  accessToken,
  listener,
  apiUrl = 'https://platform.flatfile.com/api',
}: Pick<ISpace, 'listener'> & { accessToken: string; apiUrl: string }) => {
  
  // set the api key to fully authenticate into Flatfile api
  // todo: should we use CrossEnvConfig here?
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
